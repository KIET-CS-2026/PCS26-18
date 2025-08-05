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

const handleSocketConnection = (socket) => {
  logger.info(`User connected: ${socket.id}`);

  socket.on("join-room", (roomId, userId) => {
    logger.info(`User ${userId} joined room ${roomId}`);
    socket.join(roomId);
    socket.broadcast.to(roomId).emit("user-connected", userId);
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
};

io.on("connection", handleSocketConnection);

server.listen(config.socketPort, () => {
  logger.info(`Socket server is running on port ${config.socketPort}`);
});
