import mongoose, { Schema } from "mongoose";

const meetingSchema = new Schema(
  {
    roomId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["web2", "solana"],
      default: "web2",
    },
    status: {
      type: String,
      enum: ["scheduled", "ongoing", "completed", "cancelled"],
      default: "scheduled",
    },
    isPublic: {
      type: Boolean,
      default: true, // Allow others to discover and join
    },
    isLocked: {
      type: Boolean,
      default: false,
    },
    maxParticipants: {
      type: Number,
      default: 50,
    },
    scheduledStartTime: {
      type: Date,
      required: true,
    },
    scheduledEndTime: {
      type: Date,
      required: true,
    },
    actualStartTime: {
      type: Date,
    },
    actualEndTime: {
      type: Date,
    },
    participants: [{
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      joinedAt: {
        type: Date,
        default: Date.now,
      },
      leftAt: {
        type: Date,
      },
      role: {
        type: String,
        enum: ["host", "participant"],
        default: "participant",
      }
    }],
    tags: [{
      type: String,
      trim: true,
    }],
    metadata: {
      huddle01RoomId: String,
      originalHuddle01Response: Object,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
meetingSchema.index({ creator: 1, createdAt: -1 });
meetingSchema.index({ status: 1, scheduledStartTime: 1 });
meetingSchema.index({ isPublic: 1, status: 1, scheduledStartTime: 1 });
meetingSchema.index({ "participants.user": 1 });

// Virtual for duration
meetingSchema.virtual("duration").get(function() {
  if (this.actualStartTime && this.actualEndTime) {
    return this.actualEndTime - this.actualStartTime;
  }
  return this.scheduledEndTime - this.scheduledStartTime;
});

// Method to check if user can join
meetingSchema.methods.canUserJoin = function(userId) {
  if (!this.isPublic && this.creator.toString() !== userId.toString()) {
    const isParticipant = this.participants.some(p => 
      p.user.toString() === userId.toString()
    );
    return isParticipant;
  }
  return true;
};

// Method to add participant
meetingSchema.methods.addParticipant = function(userId, role = "participant") {
  const existingParticipant = this.participants.find(p => 
    p.user.toString() === userId.toString()
  );
  
  if (!existingParticipant) {
    this.participants.push({
      user: userId,
      role: role,
      joinedAt: new Date(),
    });
  }
  return this;
};

// Method to update meeting status
meetingSchema.methods.updateStatus = function(newStatus) {
  this.status = newStatus;
  
  if (newStatus === "ongoing" && !this.actualStartTime) {
    this.actualStartTime = new Date();
  } else if (newStatus === "completed" && !this.actualEndTime) {
    this.actualEndTime = new Date();
  }
  
  return this;
};

export const Meeting = mongoose.model("Meeting", meetingSchema);