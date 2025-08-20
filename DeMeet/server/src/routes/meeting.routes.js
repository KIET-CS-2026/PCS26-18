import { Router } from "express";
import {
  createMeeting,
  getCreatedMeetings,
  getPublicMeetings,
  getJoinedMeetings,
  getMeetingByRoomId,
  joinMeeting,
  leaveMeeting,
  updateMeeting,
  deleteMeeting,
  getMeetingStats,
  createRoom, // Legacy endpoint
} from "../controllers/meeting.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validation.middleware.js";
import {
  createMeetingValidator,
  updateMeetingValidator,
  roomIdValidator,
} from "../validators/meeting.validator.js";

const router = Router();

// Apply authentication middleware to all routes
router.use(verifyJWT);

// Meeting management routes
router.post("/create", validate(createMeetingValidator), createMeeting);
router.get("/created", getCreatedMeetings);
router.get("/public", getPublicMeetings);
router.get("/joined", getJoinedMeetings);
router.get("/stats", getMeetingStats);

// Individual meeting routes
router.get("/:roomId", validate(roomIdValidator), getMeetingByRoomId);
router.put("/:roomId", validate(roomIdValidator), validate(updateMeetingValidator), updateMeeting);
router.delete("/:roomId", validate(roomIdValidator), deleteMeeting);

// Meeting interaction routes
router.post("/:roomId/join", validate(roomIdValidator), joinMeeting);
router.post("/:roomId/leave", validate(roomIdValidator), leaveMeeting);

// Legacy routes for backward compatibility (no validation for quick creation)
router.post("/rooms/create-room", createRoom);

export default router;