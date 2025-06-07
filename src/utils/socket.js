const socketIO = require("socket.io");
const crypto = require("crypto");
const Chat = require("../models/chat");
const connectionModel = require("../models/connectionModel");

const getSecretRoomId = ({ curr_userId, targetUserId }) => {
  const sortedIds = [curr_userId, targetUserId].sort().join("_");
  const hash = crypto.createHash("sha256").update(sortedIds).digest("hex");
  return hash;
};
const initializeSocket = async (server) => {
  const io = socketIO(server, {
    cors: {
      origin:"http://3.109.253.167",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    // Join chat
    socket.on("joinChat", ({ userName, curr_userId, targetUserId }) => {
      const roomId = getSecretRoomId({ curr_userId, targetUserId });
      console.log(userName, "Joined room :", roomId);
      socket.join(roomId);
    });

    // send Message ie msg comes from client to server
    socket.on(
      "sendMessage",
      async ({ userName, curr_userId, targetUserId, text }) => {
        const roomId = getSecretRoomId({ curr_userId, targetUserId });
        try {
          const data = await connectionModel.find({
            $or: [
              { toUserId: curr_userId, fromUserId: targetUserId },
              { fromUserId: curr_userId, toUserId: targetUserId },
            ],
            status: "accepted",
          });

          if (data.length === 0) {
             console.log("Connection not accepted — message not sent.");
             socket.emit("connectionDenied", {
                reason: "Connection request not accepted. You cannot send messages.",
                targetUserId,
            });
            return;
          }
          let chat = await Chat.findOne({
            participants: { $all: [curr_userId, targetUserId] },
          });
          if (!chat) {
            chat = new Chat({
              participants: [curr_userId, targetUserId],
              messages: [],
            });
          }

          chat.messages.push({
            senderId: curr_userId,
            text,
          });
          await chat.save();
        } catch (err) {
          console.log(err);
        }

        // send this msg to client again !!
        io.to(roomId).emit("messageReceived", {
          fromUser: userName,
          fromUserId: curr_userId,
          myId: targetUserId,
          text: text,
        });
      }
    ),
      socket.on("disconnect", () => {
        console.log("⚡️ Socket disconnected:", socket.id);
      });
  });
};

module.exports = initializeSocket;
