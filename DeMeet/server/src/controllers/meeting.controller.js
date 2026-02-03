import { Meeting } from "../models/meeting.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import { v4 as uuidv4 } from "uuid";

// Schedule a new meeting
export const scheduleMeeting = asyncHandler(async (req, res) => {
  const { title, description, participantEmails, scheduledTime, duration } = req.body;
  const userId = req.user._id;

  if (!title || !participantEmails || !scheduledTime) {
    throw new apiError(400, "Title, participant emails, and scheduled time are required");
  }

  if (!Array.isArray(participantEmails) || participantEmails.length === 0) {
    throw new apiError(400, "At least one participant email is required");
  }

  // Generate room ID
  const roomId = uuidv4();

  // Fetch participant details from user list
  const participants = [];
  for (const email of participantEmails) {
    const user = await User.findOne({ email: email.toLowerCase() });
    participants.push({
      userId: user?._id || null,
      email: email.toLowerCase(),
      status: "pending",
    });
  }

  // Create meeting
  const meeting = new Meeting({
    title,
    description,
    scheduledBy: userId,
    participants,
    roomId,
    scheduledTime: new Date(scheduledTime),
    duration: duration || 60,
  });

  await meeting.save();

  // If there are Google users, schedule on their Google Calendar
  const googleUsers = [];
  for (const participant of participants) {
    if (participant.userId) {
      const user = await User.findById(participant.userId);
      if (user?.isGoogleUser && user?.googleId) {
        googleUsers.push(user);
      }
    }
  }

  // TODO: Integrate with Google Calendar API to create events for Google users
  if (googleUsers.length > 0) {
    meeting.isGoogleCalendarEvent = true;
    await meeting.save();
  }

  return res
    .status(201)
    .json(new apiResponse(201, meeting, "Meeting scheduled successfully"));
});

// Get all meetings for the current user (as organizer or participant)
export const getMyMeetings = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const totalMeetings = await Meeting.countDocuments({
    $or: [
      { scheduledBy: userId },
      { "participants.userId": userId },
    ],
  });

  const meetings = await Meeting.find({
    $or: [
      { scheduledBy: userId },
      { "participants.userId": userId },
    ],
  })
    .populate("scheduledBy", "name email avatar")
    .populate("participants.userId", "name email avatar isGoogleUser")
    .sort({ scheduledTime: 1 })
    .skip(skip)
    .limit(limit);

  return res
    .status(200)
    .json(new apiResponse(200, {
      meetings,
      pagination: {
        page,
        limit,
        totalMeetings,
        totalPages: Math.ceil(totalMeetings / limit),
      },
    }, "Meetings retrieved successfully"));
});

// Get a specific meeting
export const getMeetingById = asyncHandler(async (req, res) => {
  const { meetingId } = req.params;

  const meeting = await Meeting.findById(meetingId)
    .populate("scheduledBy", "name email avatar")
    .populate("participants.userId", "name email avatar isGoogleUser");

  if (!meeting) {
    throw new apiError(404, "Meeting not found");
  }

  return res
    .status(200)
    .json(new apiResponse(200, meeting, "Meeting retrieved successfully"));
});

// Update meeting participant status
export const updateParticipantStatus = asyncHandler(async (req, res) => {
  const { meetingId } = req.params;
  const { status } = req.body;
  const userId = req.user._id;

  if (!["accepted", "declined"].includes(status)) {
    throw new apiError(400, "Invalid status. Must be 'accepted' or 'declined'");
  }

  const meeting = await Meeting.findByIdAndUpdate(
    meetingId,
    {
      $set: {
        "participants.$[elem].status": status,
      },
    },
    {
      arrayFilters: [{ "elem.userId": userId }],
      new: true,
    }
  )
    .populate("scheduledBy", "name email avatar")
    .populate("participants.userId", "name email avatar isGoogleUser");

  if (!meeting) {
    throw new apiError(404, "Meeting not found");
  }

  return res
    .status(200)
    .json(new apiResponse(200, meeting, "Participant status updated successfully"));
});

// Cancel a meeting
export const cancelMeeting = asyncHandler(async (req, res) => {
  const { meetingId } = req.params;
  const userId = req.user._id;

  const meeting = await Meeting.findById(meetingId);

  if (!meeting) {
    throw new apiError(404, "Meeting not found");
  }

  if (meeting.scheduledBy.toString() !== userId.toString()) {
    throw new apiError(403, "Only the organizer can cancel the meeting");
  }

  meeting.status = "cancelled";
  await meeting.save();

  return res
    .status(200)
    .json(new apiResponse(200, meeting, "Meeting cancelled successfully"));
});

// Get all users for participant selection
export const getAllUsers = asyncHandler(async (req, res) => {
  const currentUserId = req.user._id;

  const users = await User.find({ _id: { $ne: currentUserId } }).select(
    "name email avatar isGoogleUser googleId"
  );

  return res
    .status(200)
    .json(new apiResponse(200, users, "Users retrieved successfully"));
});
