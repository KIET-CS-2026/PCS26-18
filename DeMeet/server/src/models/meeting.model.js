import mongoose, { Schema } from "mongoose";

const meetingSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    scheduledBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    participants: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        email: {
          type: String,
          required: true,
        },
        status: {
          type: String,
          enum: ["pending", "accepted", "declined"],
          default: "pending",
        },
      },
    ],
    roomId: {
      type: String,
      required: true,
      unique: true,
    },
    scheduledTime: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number, // in minutes
      default: 60,
    },
    googleCalendarEventId: {
      type: String,
      required: false,
    },
    isGoogleCalendarEvent: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["scheduled", "ongoing", "completed", "cancelled"],
      default: "scheduled",
    },
  },
  {
    timestamps: true,
  }
);

export const Meeting = mongoose.model("Meeting", meetingSchema);
