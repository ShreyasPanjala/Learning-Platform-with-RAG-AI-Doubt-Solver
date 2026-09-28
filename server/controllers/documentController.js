const fs = require("fs");
const path = require("path");
const Document = require("../models/Document");

const RAG_SERVICE_URL = process.env.RAG_SERVICE_URL || "http://localhost:8000";
const INTERNAL_API_SECRET = process.env.INTERNAL_API_SECRET || "default_internal_secret";

// Helper function to trigger FastAPI background/sync document processing
const triggerFastAPIProcessing = async (document, filePath) => {
    try {
        const fileBuffer = fs.readFileSync(filePath);
        const blob = new Blob([fileBuffer], { type: "application/pdf" });

        const formData = new FormData();
        formData.append("file", blob, document.originalName);
        formData.append("document_id", document._id.toString());
        formData.append("user_id", document.userId.toString());
        formData.append("filename", document.originalName);

        const response = await fetch(`${RAG_SERVICE_URL}/documents/process`, {
            method: "POST",
            headers: {
                "x-internal-secret": INTERNAL_API_SECRET,
            },
            body: formData,
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({ detail: "RAG service error" }));
            throw new Error(errData.detail || `HTTP ${response.status}`);
        }

        const data = await response.json();
        
        await Document.findByIdAndUpdate(document._id, {
            status: "processed",
            chunksCount: data.chunksProcessed || 0,
            statusMessage: "Document successfully processed and indexed.",
        });
    } catch (error) {
        console.error(`FastAPI Document Processing Error for ${document._id}:`, error.message);
        await Document.findByIdAndUpdate(document._id, {
            status: "failed",
            statusMessage: `Processing failed: ${error.message}`,
        });
    }
};

const uploadDocument = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No PDF file uploaded." });
        }

        // 1. Create document record in MongoDB
        const document = await Document.create({
            userId: req.user._id,
            filename: req.file.filename,
            originalName: req.file.originalname,
            filePath: req.file.path,
            fileSize: req.file.size,
            mimeType: req.file.mimetype,
            status: "processing",
            statusMessage: "PDF uploaded. Processing text and vector embeddings...",
        });

        // 2. Trigger processing on Python FastAPI RAG service asynchronously
        triggerFastAPIProcessing(document, req.file.path);

        res.status(201).json({
            message: "Document uploaded successfully and queued for processing.",
            document,
        });
    } catch (error) {
        next(error);
    }
};

const getDocuments = async (req, res, next) => {
    try {
        const documents = await Document.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.json({ documents });
    } catch (error) {
        next(error);
    }
};

const getDocumentById = async (req, res, next) => {
    try {
        const document = await Document.findById(req.params.id);

        if (!document) {
            return res.status(404).json({ message: "Document not found." });
        }

        // Ownership verification
        if (document.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to access this document." });
        }

        res.json({ document });
    } catch (error) {
        next(error);
    }
};

const deleteDocument = async (req, res, next) => {
    try {
        const document = await Document.findById(req.params.id);

        if (!document) {
            return res.status(404).json({ message: "Document not found." });
        }

        // Ownership verification
        if (document.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to delete this document." });
        }

        // 1. Delete physical file from uploads folder
        if (fs.existsSync(document.filePath)) {
            fs.unlinkSync(document.filePath);
        }

        // 2. Notify FastAPI to delete vector embeddings from Pinecone
        try {
            await fetch(
                `${RAG_SERVICE_URL}/documents/${document._id}?user_id=${req.user._id}`,
                {
                    method: "DELETE",
                    headers: {
                        "x-internal-secret": INTERNAL_API_SECRET,
                    },
                }
            );
        } catch (err) {
            console.warn(`Failed to notify FastAPI of vector deletion for ${document._id}:`, err.message);
        }

        // 3. Remove document record from MongoDB
        await Document.findByIdAndDelete(document._id);

        res.json({ message: "Document deleted successfully.", documentId: req.params.id });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    uploadDocument,
    getDocuments,
    getDocumentById,
    deleteDocument,
};
