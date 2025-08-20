import MeetingService from "../services/meeting.service.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";

// Create a new meeting - Enhanced meeting management
export const createMeeting = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const meetingData = req.body;

    const meeting = await MeetingService.createMeeting(userId, meetingData);

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: "Meeting created successfully",
      data: {
        roomId: meeting.roomId,
        meeting,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get meetings created by the user
export const getCreatedMeetings = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 10, status } = req.query;

    const result = await MeetingService.getCreatedMeetings(
      userId,
      parseInt(page),
      parseInt(limit),
      status
    );

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Created meetings retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Get public meetings that users can discover and join
export const getPublicMeetings = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 10, tags, type, startTime, endTime } = req.query;

    const filters = {};
    if (tags) filters.tags = tags.split(",");
    if (type) filters.type = type;
    if (startTime) filters.startTime = startTime;
    if (endTime) filters.endTime = endTime;

    const result = await MeetingService.getPublicMeetings(
      userId,
      parseInt(page),
      parseInt(limit),
      filters
    );

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Public meetings retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Get meetings where user is a participant
export const getJoinedMeetings = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 10, status } = req.query;

    const result = await MeetingService.getJoinedMeetings(
      userId,
      parseInt(page),
      parseInt(limit),
      status
    );

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Joined meetings retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Get meeting by room ID
export const getMeetingByRoomId = async (req, res, next) => {
  try {
    const { roomId } = req.params;

    const meeting = await MeetingService.getMeetingByRoomId(roomId);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Meeting retrieved successfully",
      data: {
        meeting,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Join a meeting
export const joinMeeting = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const userId = req.user._id;

    const meeting = await MeetingService.joinMeeting(roomId, userId);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Successfully joined the meeting",
      data: {
        meeting,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Leave a meeting
export const leaveMeeting = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const userId = req.user._id;

    const meeting = await MeetingService.leaveMeeting(roomId, userId);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Successfully left the meeting",
      data: {
        meeting,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update meeting
export const updateMeeting = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const userId = req.user._id;
    const updateData = req.body;

    const meeting = await MeetingService.updateMeeting(roomId, userId, updateData);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Meeting updated successfully",
      data: {
        meeting,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Delete meeting
export const deleteMeeting = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const userId = req.user._id;

    const result = await MeetingService.deleteMeeting(roomId, userId);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

// Get meeting statistics
export const getMeetingStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const stats = await MeetingService.getMeetingStats(userId);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Meeting statistics retrieved successfully",
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

// Legacy endpoint for backward compatibility
export const createRoom = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { roomLocked = false, metadata = {} } = req.body;

    const meetingData = {
      title: metadata.title || "Quick Meeting",
      description: metadata.description || "",
      isLocked: roomLocked,
      type: "web2",
      scheduledStartTime: new Date(Date.now() + 5000), // 5 seconds in the future
      scheduledEndTime: new Date(Date.now() + 2 * 60 * 60 * 1000 + 5000), // 2 hours + 5 seconds
    };

    const meeting = await MeetingService.createMeeting(userId, meetingData);

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: "Room created successfully",
      data: {
        roomId: meeting.roomId,
        meeting,
      },
    });
  } catch (error) {
    next(error);
  }
};