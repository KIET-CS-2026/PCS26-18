import express from "express";
import http from "http";
import { Server } from "socket.io";
import { config } from "./config/index.js";
import logger from "./utils/logger.js";
import { ChatMessage } from "./models/chatMessage.model.js";
import connectDB from "./db/index.js";

// Connect to MongoDB for chat messages
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: config.cors.origin,
    methods: ["GET", "POST"],
  },
});

// Polls
// Store polls in memory for simplicity: { roomId: { question, options: [{ text, votes }], totalVotes } }
// In a production app, use Redis or a database.
const polls = {};

const handleSocketConnection = (socket) => {
  logger.info(`User connected: ${socket.id}`);

  socket.on("join-room", async (roomId, userId) => {
    logger.info(`User ${userId} joined room ${roomId}`);
    socket.join(roomId);
    socket.broadcast.to(roomId).emit("user-connected", userId);

    // Send existing poll if any
    if (polls[roomId]) {
      socket.emit("poll-created", polls[roomId]);
    }

    // Send recent chat history
    try {
      const messages = await ChatMessage.find({ roomId })
        .sort({ createdAt: -1 })
        .limit(20)
        .lean();
      socket.emit("chat-history", messages.reverse());
    } catch (error) {
      logger.error(`Error fetching chat history: ${error.message}`);
    }
  });

  socket.on("user-toggle-audio", (userId, roomId) => {
    socket.broadcast.to(roomId).emit("user-toggle-audio", userId);
  });

  socket.on("user-toggle-video", (userId, roomId) => {
    socket.broadcast.to(roomId).emit("user-toggle-video", userId);
  });

  socket.on("user-leave", (userId, roomId) => {
    logger.info(`User ${userId} left room ${roomId}`);
    socket.leave(roomId);
    socket.broadcast.to(roomId).emit("user-leave", userId);
  });

  socket.on("disconnect", () => {
    logger.info(`User disconnected: ${socket.id}`);
  });

  socket.on("create-poll", ({ roomId, question, options, userId }) => {
    logger.info(`Poll created in room ${roomId}: ${question} by ${userId}`);
    const poll = {
      question,
      options: options.map((opt) => ({ text: opt, votes: 0 })),
      totalVotes: 0,
      createdBy: userId,
      ended: false,
    };
    polls[roomId] = poll;
    io.to(roomId).emit("poll-created", poll);
  });

  socket.on("submit-vote", ({ roomId, optionIndex }) => {
    const poll = polls[roomId];
    if (poll && !poll.ended && poll.options[optionIndex]) {
      poll.options[optionIndex].votes += 1;
      poll.totalVotes += 1;
      io.to(roomId).emit("poll-updated", poll);
    }
  });

  socket.on("end-poll", ({ roomId, userId }) => {
    const poll = polls[roomId];
    if (poll && poll.createdBy === userId) {
      poll.ended = true;
      io.to(roomId).emit("poll-updated", poll);
    }
  });

  // Chat messages
  socket.on("send-message", async ({ roomId, senderId, senderName, message }) => {
    if (!roomId || !senderId || !message) {
      logger.warn("Invalid chat message received");
      return;
    }

    try {
      // Save message to MongoDB
      const chatMessage = await ChatMessage.create({
        roomId,
        senderId,
        senderName: senderName || "Anonymous",
        message,
      });

      logger.info(`Chat message saved in room ${roomId} by ${senderName}`);

      // Broadcast to all users in the room (including sender)
      io.to(roomId).emit("receive-message", {
        _id: chatMessage._id,
        roomId: chatMessage.roomId,
        senderId: chatMessage.senderId,
        senderName: chatMessage.senderName,
        message: chatMessage.message,
        createdAt: chatMessage.createdAt,
      });
    } catch (error) {
      logger.error(`Error saving chat message: ${error.message}`);
    }
  });
};

io.on("connection", handleSocketConnection);

server.listen(config.socketPort, () => {
  logger.info(`Socket server is running on port ${config.socketPort}`);
});
