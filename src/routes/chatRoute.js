const express = require("express");
const chatRouter = express.Router(); 
const Chat = require("../models/chat");
const { authorization } = require("../controllers/authorization"); 
chatRouter.get("/chat/:targetUserId", authorization, async (req, res) => {
  const userId = req.user._id;
  const { targetUserId } = req.params;

  try {
    let chat = await Chat.findOne({
      participants: { $all: [userId, targetUserId] }
    }).populate({
      path: "messages.senderId",
      select: "firstName lastName",
    });

    // If no chat exists, create it
    if (!chat) {
      chat = new Chat({
        participants: [userId, targetUserId],
        messages: [],
      });
      await chat.save();
    } else {
      // Limit to last 50 messages
      if (chat.messages.length > 50) {
        const totalMessages = chat.messages.length;
        chat.messages = chat.messages.slice(totalMessages - 50);
        await chat.save(); // Persist the trimmed messages
      }
    }

    res.json(chat);
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: err.message,
    });
  }
});


module.exports = chatRouter;