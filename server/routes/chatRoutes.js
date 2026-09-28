const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
    askQuestion,
    streamQuestion,
    getUserChats,
    getChatById,
    deleteChat,
} = require("../controllers/chatController");

const router = express.Router();

router.use(protect);

router.post("/", askQuestion);
router.post("/stream", streamQuestion);
router.get("/", getUserChats);
router.get("/:id", getChatById);
router.delete("/:id", deleteChat);

module.exports = router;
