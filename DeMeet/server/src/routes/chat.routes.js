import { Router } from "express";
import { getChatHistory } from "../controllers/chat.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const chatRouter = Router();

// Protected routes - require authentication
chatRouter.use(verifyJWT);

// Get paginated chat history for a room
chatRouter.route("/:roomId").get(getChatHistory);

export default chatRouter;
