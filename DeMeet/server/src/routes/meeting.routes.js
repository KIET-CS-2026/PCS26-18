import { Router } from "express";
import {
  scheduleMeeting,
  getMyMeetings,
  getMeetingById,
  updateParticipantStatus,
  cancelMeeting,
  getAllUsers,
} from "../controllers/meeting.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const meetingRouter = Router();

// Protected routes - require authentication
meetingRouter.use(verifyJWT);

// Schedule a new meeting
meetingRouter.route("/schedule").post(scheduleMeeting);

// Get all meetings for current user
meetingRouter.route("/my-meetings").get(getMyMeetings);

// Get a specific meeting
meetingRouter.route("/:meetingId").get(getMeetingById);

// Update participant status (accept/decline)
meetingRouter.route("/:meetingId/status").patch(updateParticipantStatus);

// Cancel a meeting
meetingRouter.route("/:meetingId/cancel").patch(cancelMeeting);

// Get all users for participant selection
meetingRouter.route("/users/list").get(getAllUsers);

export default meetingRouter;
