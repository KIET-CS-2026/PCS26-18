import express from "express";
import http from "http";
import { Server } from "socket.io";
import { config } from "./config/index.js";
import logger from "./utils/logger.js";

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

  socket.on("join-room", (roomId, userId) => {
    logger.info(`User ${userId} joined room ${roomId}`);
    socket.join(roomId);
    socket.broadcast.to(roomId).emit("user-connected", userId);

    // Send existing poll if any
    if (polls[roomId]) {
      socket.emit("poll-created", polls[roomId]);
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
};

io.on("connection", handleSocketConnection);

server.listen(config.socketPort, () => {
  logger.info(`Socket server is running on port ${config.socketPort}`);
});
