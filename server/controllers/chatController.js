const Chat = require("../models/Chat");
const Document = require("../models/Document");

const RAG_SERVICE_URL = process.env.RAG_SERVICE_URL || "http://localhost:8000";
const INTERNAL_API_SECRET = process.env.INTERNAL_API_SECRET || "default_internal_secret";

const askQuestion = async (req, res, next) => {
    try {
        const { question, chatId, documentIds } = req.body;

        if (!question || !question.trim()) {
            return res.status(400).json({ message: "Question is required." });
        }

        // 1. Validate document ownership if documentIds provided
        let targetDocIds = [];
        if (documentIds && Array.isArray(documentIds) && documentIds.length > 0) {
            const userDocs = await Document.find({
                _id: { $in: documentIds },
                userId: req.user._id,
            });
            targetDocIds = userDocs.map((doc) => doc._id.toString());
        }

        // 2. Fetch or create Chat session in MongoDB
        let chat;
        if (chatId) {
            chat = await Chat.findById(chatId);
            if (!chat) {
                return res.status(404).json({ message: "Chat session not found." });
            }
            if (chat.userId.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: "Not authorized to access this chat session." });
            }
        } else {
            const titleSnippet = question.trim().substring(0, 30) + (question.length > 30 ? "..." : "");
            chat = await Chat.create({
                userId: req.user._id,
                title: titleSnippet || "New Doubt Session",
                documentIds: targetDocIds,
                messages: [],
            });
        }

        // Prepare chat history (previous messages) for multi-turn NLP context
        const history = chat.messages.slice(-6).map((m) => ({
            sender: m.sender,
            content: m.content,
        }));

        // 3. Append user question message
        chat.messages.push({
            sender: "user",
            content: question.trim(),
            timestamp: new Date(),
        });

        // 4. Query Python FastAPI RAG Service
        let aiAnswer = "I'm sorry, I could not generate an answer at this time.";
        let sources = [];

        try {
            const ragResponse = await fetch(`${RAG_SERVICE_URL}/chat/query`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-internal-secret": INTERNAL_API_SECRET,
                },
                body: JSON.stringify({
                    question: question.trim(),
                    userId: req.user._id.toString(),
                    documentIds: targetDocIds,
                    history: history,
                    topK: 5,
                }),
            });

            if (ragResponse.ok) {
                const ragData = await ragResponse.json();
                aiAnswer = ragData.answer || aiAnswer;
                sources = ragData.sources || [];
            } else {
                const errJson = await ragResponse.json().catch(() => ({}));
                console.error("FastAPI RAG Query failed:", errJson);
            }
        } catch (err) {
            console.error("Failed to connect to Python RAG service:", err.message);
            aiAnswer = "Unable to connect to the RAG AI service. Please ensure the Python backend is running.";
        }

        // 5. Append assistant response message with sources
        chat.messages.push({
            sender: "assistant",
            content: aiAnswer,
            sources: sources,
            timestamp: new Date(),
        });

        await chat.save();

        res.json({
            chatId: chat._id,
            title: chat.title,
            answer: aiAnswer,
            sources: sources,
            messages: chat.messages,
        });
    } catch (error) {
        next(error);
    }
};

const getUserChats = async (req, res, next) => {
    try {
        const chats = await Chat.find({ userId: req.user._id })
            .select("title documentIds createdAt updatedAt")
            .sort({ updatedAt: -1 });
        res.json({ chats });
    } catch (error) {
        next(error);
    }
};

const getChatById = async (req, res, next) => {
    try {
        const chat = await Chat.findById(req.params.id).populate("documentIds", "originalName status");

        if (!chat) {
            return res.status(404).json({ message: "Chat session not found." });
        }

        if (chat.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to view this chat." });
        }

        res.json({ chat });
    } catch (error) {
        next(error);
    }
};

const deleteChat = async (req, res, next) => {
    try {
        const chat = await Chat.findById(req.params.id);

        if (!chat) {
            return res.status(404).json({ message: "Chat session not found." });
        }

        if (chat.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to delete this chat." });
        }

        await Chat.findByIdAndDelete(req.params.id);
        res.json({ message: "Chat session deleted.", chatId: req.params.id });
    } catch (error) {
        next(error);
    }
};

const streamQuestion = async (req, res, next) => {
    try {
        const { question, chatId, documentIds } = req.body;

        if (!question || !question.trim()) {
            return res.status(400).json({ message: "Question is required." });
        }

        let targetDocIds = [];
        if (documentIds && Array.isArray(documentIds) && documentIds.length > 0) {
            const userDocs = await Document.find({
                _id: { $in: documentIds },
                userId: req.user._id,
            });
            targetDocIds = userDocs.map((doc) => doc._id.toString());
        }

        let chat;
        if (chatId) {
            chat = await Chat.findById(chatId);
            if (!chat || chat.userId.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: "Not authorized or chat not found." });
            }
        } else {
            const titleSnippet = question.trim().substring(0, 30) + (question.length > 30 ? "..." : "");
            chat = await Chat.create({
                userId: req.user._id,
                title: titleSnippet || "New Doubt Session",
                documentIds: targetDocIds,
                messages: [],
            });
        }

        const history = chat.messages.slice(-6).map((m) => ({
            sender: m.sender,
            content: m.content,
        }));

        chat.messages.push({
            sender: "user",
            content: question.trim(),
            timestamp: new Date(),
        });
        await chat.save();

        // Set SSE Headers
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");

        // Send initial session metadata to client
        res.write(`data: ${JSON.stringify({ type: "init", chatId: chat._id, title: chat.title })}\n\n`);

        const ragResponse = await fetch(`${RAG_SERVICE_URL}/chat/stream`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-internal-secret": INTERNAL_API_SECRET,
            },
            body: JSON.stringify({
                question: question.trim(),
                userId: req.user._id.toString(),
                documentIds: targetDocIds,
                history: history,
                topK: 5,
            }),
        });

        if (!ragResponse.ok || !ragResponse.body) {
            res.write(`data: ${JSON.stringify({ type: "token", token: "Unable to stream answer from AI backend." })}\n\n`);
            res.write("data: [DONE]\n\n");
            return res.end();
        }

        const reader = ragResponse.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let accumulatedAnswer = "";
        let finalSources = [];

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunkStr = decoder.decode(value, { stream: true });
            res.write(chunkStr);

            // Parse chunks for background MongoDB persistence
            const lines = chunkStr.split("\n");
            for (const line of lines) {
                if (line.startsWith("data: ") && !line.includes("[DONE]")) {
                    try {
                        const parsed = JSON.parse(line.replace("data: ", ""));
                        if (parsed.type === "token") accumulatedAnswer += parsed.token;
                        if (parsed.type === "meta") finalSources = parsed.sources || [];
                    } catch (e) {
                        // Ignore partial JSON lines
                    }
                }
            }
        }

        // Save final answer & sources to Chat model in MongoDB
        if (accumulatedAnswer) {
            await Chat.findByIdAndUpdate(chat._id, {
                $push: {
                    messages: {
                        sender: "assistant",
                        content: accumulatedAnswer.trim(),
                        sources: finalSources,
                        timestamp: new Date(),
                    },
                },
            });
        }

        res.end();
    } catch (error) {
        if (!res.headersSent) {
            next(error);
        } else {
            res.end();
        }
    }
};

module.exports = {
    askQuestion,
    streamQuestion,
    getUserChats,
    getChatById,
    deleteChat,
};
