import axios from "axios";
import { Meeting } from "../models/meeting.model.js";
import { User } from "../models/user.model.js";
import { config } from "../config/index.js";
import { v4 as uuidv4 } from "uuid";

class MeetingService {
  constructor() {
    this.huddle01Api = axios.create({
      baseURL: "https://api.huddle01.com/api/v2/sdk",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.HUDDLE01_API_KEY || config.huddle01?.apiKey,
      },
    });
  }

  // Create a new meeting room
  async createMeeting(userId, meetingData) {
    try {
      const {
        title,
        description = "",
        type = "web2",
        isPublic = true,
        isLocked = false,
        maxParticipants = 50,
        scheduledStartTime,
        scheduledEndTime,
        tags = [],
      } = meetingData;

      // Generate a unique room ID
      const roomId = uuidv4();

      // Create room via Huddle01 API
      let huddle01Response;
      try {
        huddle01Response = await this.huddle01Api.post("/rooms/create-room", {
          roomLocked: isLocked,
          metadata: {
            title: title,
            description: description,
          },
        });
      } catch (huddle01Error) {
        console.warn("Huddle01 API error:", huddle01Error.message);
        // Continue without Huddle01 integration if API fails
        huddle01Response = { data: { data: { roomId: roomId } } };
      }

      // Create meeting in our database
      const meeting = new Meeting({
        roomId: huddle01Response.data.data.roomId || roomId,
        title,
        description,
        creator: userId,
        type,
        isPublic,
        isLocked,
        maxParticipants,
        scheduledStartTime: scheduledStartTime || new Date(),
        scheduledEndTime: scheduledEndTime || new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours default
        tags,
        metadata: {
          huddle01RoomId: huddle01Response.data.data.roomId,
          originalHuddle01Response: huddle01Response.data,
        },
      });

      // Add creator as host participant
      meeting.addParticipant(userId, "host");

      await meeting.save();
      await meeting.populate("creator", "name email avatar");

      return meeting;
    } catch (error) {
      throw new Error(`Failed to create meeting: ${error.message}`);
    }
  }

  // Get meetings created by a user
  async getCreatedMeetings(userId, page = 1, limit = 10, status = null) {
    try {
      const query = { creator: userId };
      if (status) {
        query.status = status;
      }

      const meetings = await Meeting.find(query)
        .populate("creator", "name email avatar")
        .populate("participants.user", "name email avatar")
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

      const total = await Meeting.countDocuments(query);

      return {
        meetings,
        pagination: {
          page,
          pages: Math.ceil(total / limit),
          total,
        },
      };
    } catch (error) {
      throw new Error(`Failed to get created meetings: ${error.message}`);
    }
  }

  // Get public meetings that users can join
  async getPublicMeetings(userId, page = 1, limit = 10, filters = {}) {
    try {
      const query = {
        isPublic: true,
        status: { $in: ["scheduled", "ongoing"] },
      };

      // Filter by tags if provided
      if (filters.tags && filters.tags.length > 0) {
        query.tags = { $in: filters.tags };
      }

      // Filter by type if provided
      if (filters.type) {
        query.type = filters.type;
      }

      // Filter by time range
      if (filters.startTime && filters.endTime) {
        query.scheduledStartTime = {
          $gte: new Date(filters.startTime),
          $lte: new Date(filters.endTime),
        };
      }

      const meetings = await Meeting.find(query)
        .populate("creator", "name email avatar")
        .populate("participants.user", "name email avatar")
        .sort({ scheduledStartTime: 1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

      const total = await Meeting.countDocuments(query);

      return {
        meetings,
        pagination: {
          page,
          pages: Math.ceil(total / limit),
          total,
        },
      };
    } catch (error) {
      throw new Error(`Failed to get public meetings: ${error.message}`);
    }
  }

  // Get meetings where user is a participant
  async getJoinedMeetings(userId, page = 1, limit = 10, status = null) {
    try {
      const query = {
        "participants.user": userId,
      };

      if (status) {
        query.status = status;
      }

      const meetings = await Meeting.find(query)
        .populate("creator", "name email avatar")
        .populate("participants.user", "name email avatar")
        .sort({ scheduledStartTime: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

      const total = await Meeting.countDocuments(query);

      return {
        meetings,
        pagination: {
          page,
          pages: Math.ceil(total / limit),
          total,
        },
      };
    } catch (error) {
      throw new Error(`Failed to get joined meetings: ${error.message}`);
    }
  }

  // Get meeting by room ID
  async getMeetingByRoomId(roomId) {
    try {
      const meeting = await Meeting.findOne({ roomId })
        .populate("creator", "name email avatar")
        .populate("participants.user", "name email avatar");

      if (!meeting) {
        throw new Error("Meeting not found");
      }

      return meeting;
    } catch (error) {
      throw new Error(`Failed to get meeting: ${error.message}`);
    }
  }

  // Join a meeting
  async joinMeeting(roomId, userId) {
    try {
      const meeting = await Meeting.findOne({ roomId });
      
      if (!meeting) {
        throw new Error("Meeting not found");
      }

      if (!meeting.canUserJoin(userId)) {
        throw new Error("You don't have permission to join this meeting");
      }

      // Check if meeting is at capacity
      const activeParticipants = meeting.participants.filter(p => !p.leftAt);
      if (activeParticipants.length >= meeting.maxParticipants) {
        throw new Error("Meeting is at maximum capacity");
      }

      // Add user as participant if not already added
      meeting.addParticipant(userId);

      // Update meeting status to ongoing if it's the first participant joining
      if (meeting.status === "scheduled") {
        meeting.updateStatus("ongoing");
      }

      await meeting.save();
      await meeting.populate("creator", "name email avatar");
      await meeting.populate("participants.user", "name email avatar");

      return meeting;
    } catch (error) {
      throw new Error(`Failed to join meeting: ${error.message}`);
    }
  }

  // Leave a meeting
  async leaveMeeting(roomId, userId) {
    try {
      const meeting = await Meeting.findOne({ roomId });
      
      if (!meeting) {
        throw new Error("Meeting not found");
      }

      const participant = meeting.participants.find(p => 
        p.user.toString() === userId.toString() && !p.leftAt
      );

      if (participant) {
        participant.leftAt = new Date();
      }

      // Check if all participants have left
      const activeParticipants = meeting.participants.filter(p => !p.leftAt);
      if (activeParticipants.length === 0 && meeting.status === "ongoing") {
        meeting.updateStatus("completed");
      }

      await meeting.save();
      return meeting;
    } catch (error) {
      throw new Error(`Failed to leave meeting: ${error.message}`);
    }
  }

  // Update meeting
  async updateMeeting(roomId, userId, updateData) {
    try {
      const meeting = await Meeting.findOne({ roomId });
      
      if (!meeting) {
        throw new Error("Meeting not found");
      }

      // Only creator can update the meeting
      if (meeting.creator.toString() !== userId.toString()) {
        throw new Error("Only the creator can update this meeting");
      }

      const allowedUpdates = [
        "title",
        "description",
        "isPublic",
        "isLocked",
        "maxParticipants",
        "scheduledStartTime",
        "scheduledEndTime",
        "tags",
        "status",
      ];

      Object.keys(updateData).forEach(key => {
        if (allowedUpdates.includes(key)) {
          meeting[key] = updateData[key];
        }
      });

      await meeting.save();
      await meeting.populate("creator", "name email avatar");
      await meeting.populate("participants.user", "name email avatar");

      return meeting;
    } catch (error) {
      throw new Error(`Failed to update meeting: ${error.message}`);
    }
  }

  // Delete meeting
  async deleteMeeting(roomId, userId) {
    try {
      const meeting = await Meeting.findOne({ roomId });
      
      if (!meeting) {
        throw new Error("Meeting not found");
      }

      // Only creator can delete the meeting
      if (meeting.creator.toString() !== userId.toString()) {
        throw new Error("Only the creator can delete this meeting");
      }

      await Meeting.findByIdAndDelete(meeting._id);
      return { message: "Meeting deleted successfully" };
    } catch (error) {
      throw new Error(`Failed to delete meeting: ${error.message}`);
    }
  }

  // Get meeting statistics for dashboard
  async getMeetingStats(userId) {
    try {
      const now = new Date();
      
      // First, update any meetings that should be completed
      await this.updateExpiredMeetings();
      
      const [created, joined, upcoming, ongoing] = await Promise.all([
        Meeting.countDocuments({ creator: userId }),
        Meeting.countDocuments({ "participants.user": userId }),
        Meeting.countDocuments({
          $or: [
            { creator: userId },
            { "participants.user": userId }
          ],
          status: "scheduled",
          scheduledStartTime: { $gte: now }
        }),
        Meeting.countDocuments({
          $or: [
            { creator: userId },
            { "participants.user": userId }
          ],
          status: "ongoing",
          scheduledStartTime: { $lte: now },
          scheduledEndTime: { $gte: now }
        }),
      ]);

      return {
        totalCreated: created,
        totalJoined: joined,
        upcomingMeetings: upcoming,
        ongoingMeetings: ongoing,
      };
    } catch (error) {
      throw new Error(`Failed to get meeting stats: ${error.message}`);
    }
  }

  // Update meetings that have passed their end time to completed status
  async updateExpiredMeetings() {
    try {
      const now = new Date();
      
      // Update ongoing meetings that have passed their scheduled end time
      await Meeting.updateMany(
        {
          status: "ongoing",
          scheduledEndTime: { $lt: now }
        },
        {
          $set: {
            status: "completed",
            actualEndTime: now
          }
        }
      );

      // Update scheduled meetings that have passed their scheduled end time without being started
      await Meeting.updateMany(
        {
          status: "scheduled",
          scheduledEndTime: { $lt: now }
        },
        {
          $set: {
            status: "completed"
          }
        }
      );

      return true;
    } catch (error) {
      console.error("Error updating expired meetings:", error);
      return false;
    }
  }
}

export default new MeetingService();