import { Meeting } from "../models/meeting.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";

export class MeetingService {
  static async scheduleMeeting(meetingData) {
    try {
      const meeting = await Meeting.create(meetingData);
      return await this.getMeetingById(meeting._id);
    } catch (error) {
      throw new ApiError(400, "Failed to schedule meeting");
    }
  }

  static async getMeetingById(meetingId) {
    return await Meeting.findById(meetingId)
      .populate("scheduledBy", "name email avatar")
      .populate("participants.userId", "name email avatar isGoogleUser");
  }

  static async getUserMeetings(userId) {
    return await Meeting.find({
      $or: [{ scheduledBy: userId }, { "participants.userId": userId }],
    })
      .populate("scheduledBy", "name email avatar")
      .populate("participants.userId", "name email avatar isGoogleUser")
      .sort({ scheduledTime: 1 });
  }

  static async updateParticipantStatus(meetingId, userId, status) {
    const meeting = await Meeting.findByIdAndUpdate(
      meetingId,
      { $set: { "participants.$[elem].status": status } },
      { arrayFilters: [{ "elem.userId": userId }], new: true }
    );

    if (!meeting) {
      throw new ApiError(404, "Meeting not found");
    }

    return await this.getMeetingById(meetingId);
  }

  static async cancelMeeting(meetingId, userId) {
    const meeting = await Meeting.findById(meetingId);

    if (!meeting) {
      throw new ApiError(404, "Meeting not found");
    }

    if (meeting.scheduledBy.toString() !== userId.toString()) {
      throw new ApiError(403, "Only the organizer can cancel the meeting");
    }

    meeting.status = "cancelled";
    await meeting.save();

    return meeting;
  }

  static async getAvailableUsers(excludeUserId) {
    return await User.find({ _id: { $ne: excludeUserId } }).select(
      "name email avatar isGoogleUser googleId"
    );
  }

  static async getMeetingByRoomId(roomId) {
    return await Meeting.findOne({ roomId })
      .populate("scheduledBy", "name email avatar")
      .populate("participants.userId", "name email avatar isGoogleUser");
  }
}
