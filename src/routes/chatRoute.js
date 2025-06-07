const express = require("express");
const chatRouter = express.Router(); // Initialize a router instance for profile-related routes
const Chat = require("../models/chat");
const { authorization } = require("../controllers/authorization"); // Middleware to protect routes

chatRouter.get("/:targetUserId",authorization,async(req,res)=>{
    const userId = req.user._id;
    const {targetUserId} =req.params;
    try{
        let chat = await Chat.findOne({
            participants:{$all :[userId,targetUserId]}
        }).populate({
            path:"messages.senderId",
            select:"firstName lastName",
        });
        if(!chat){
            chat = new Chat({
                participants:[userId,targetUserId],
                messages:[],
            });
            await chat.save();
        }
        res.json(chat)
    }catch(err){
          return res.status(401).json({
            success: false,
            message: err.message,
        });
    }
})

module.exports = chatRouter;