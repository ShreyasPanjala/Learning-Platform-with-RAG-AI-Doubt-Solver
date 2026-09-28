const mongoose = require("mongoose");

const sourceSchema = new mongoose.Schema({
    documentId: { type: String, required: true },
    filename: { type: String, required: true },
    page: { type: Number, required: true },
    score: { type: Number },
});

const messageSchema = new mongoose.Schema({
    sender: {
        type: String,
        enum: ["user", "assistant"],
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    sources: [sourceSchema],
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

const chatSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        title: {
            type: String,
            default: "New Doubts Session",
        },
        documentIds: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Document",
            },
        ],
        messages: [messageSchema],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Chat", chatSchema);
