const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/authRoutes");
const documentRoutes = require("./routes/documentRoutes");
const chatRoutes = require("./routes/chatRoutes");

const app = express();

// Security rate limiters
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // 20 login/register attempts per window
    message: { message: "Too many authentication attempts. Please try again later." },
});

const chatLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 30, // 30 question prompts per minute
    message: { message: "Rate limit exceeded for AI Doubt Solver. Please slow down." },
});

app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/chat", chatLimiter, chatRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "AI Learning Assistant Backend is running",
        status: "ok",
        endpoints: {
            auth: "/api/auth",
            documents: "/api/documents",
            chat: "/api/chat",
        },
    });
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
    console.error("Unhandled Error:", err);
    const statusCode = err.statusCode || res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        message: err.message || "Internal Server Error",
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
});

module.exports = app;