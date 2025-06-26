const socketIO = require("socket.io");
const crypto = require("crypto");
const Chat = require("../models/chat");
const connectionModel = require("../models/connectionModel");

const allowedOrigins = [
  "http://3.109.253.167",
  "http://localhost:5173",
  "https://devsync.co.in",
];

// Utility: Generate unique hashed room ID for a private chat
const getSecretRoomId = ({ curr_userId, targetUserId }) => {
  const sortedIds = [curr_userId, targetUserId].sort().join("_");
  return crypto.createHash("sha256").update(sortedIds).digest("hex");
};

// Track which socket is in which chat room
const activeRoomMap = new Map(); // socket.id -> Set<roomId>

const initializeSocket = async (server) => {
  const io = socketIO(server, {
    cors: {
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS for Socket.IO"));
        }
      },
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    // console.log("🟢 Socket connected:", socket.id);

    // Join a private chat
    socket.on("joinChat", ({ userName, curr_userId, targetUserId }) => {
      const roomId = getSecretRoomId({ curr_userId, targetUserId });
      socket.join(roomId);

      // Track active rooms for this socket
      const userRooms = activeRoomMap.get(socket.id) || new Set();
      userRooms.add(roomId);
      activeRoomMap.set(socket.id, userRooms);

      // console.log(`${userName} joined room: ${roomId}`);
    });

    // Send a message
    socket.on("sendMessage", async ({ userName, curr_userId, targetUserId, text }) => {
      const roomId = getSecretRoomId({ curr_userId, targetUserId });

      try {
        // Check if connection is accepted
        const data = await connectionModel.find({
          $or: [
            { fromUserId: curr_userId, toUserId: targetUserId },
            { toUserId: curr_userId, fromUserId: targetUserId },
          ],
          status: "accepted",
        });

        if (data.length === 0) {
          // console.log("Connection not accepted — message not sent.");
          socket.emit("connectionDenied", {
            reason: "Connection request not accepted. You cannot send messages.",
            targetUserId,
          });
          return;
        }

        // Store message in DB
        let chat = await Chat.findOne({
          participants: { $all: [curr_userId, targetUserId] },
        });

        if (!chat) {
          chat = new Chat({
            participants: [curr_userId, targetUserId],
            messages: [],
          });
        }

        chat.messages.push({ senderId: curr_userId, text });
        await chat.save();

        // Emit to users in the room
        io.to(roomId).emit("messageReceived", {
          fromUser: userName,
          fromUserId: curr_userId,
          myId: targetUserId,
          text,
        });

        // Notify target user if they are online but not in the room
        for (let [id, s] of io.sockets.sockets) {
          const joinedRooms = activeRoomMap.get(id) || new Set();
          const targetSocket = io.sockets.sockets.get(id);
          const targetSocketUserId = targetSocket.handshake.auth?.userId;

          if (targetSocketUserId === targetUserId && !joinedRooms.has(roomId)) {
            targetSocket.emit("notifyMessage", {
              fromUser: userName,
              fromUserId: curr_userId,
              preview: text.slice(0, 30),
            });
          }
        }

      } catch (err) {
        console.error("❌ Error sending message:", err.message);
      }
    });

    // Disconnect cleanup
    socket.on("disconnect", () => {
      activeRoomMap.delete(socket.id);
      // console.log("🔴 Socket disconnected:", socket.id);
    });
  });

  return io;
};

module.exports = initializeSocket;
