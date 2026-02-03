import mongoose, { Schema } from "mongoose";

const chatMessageSchema = new Schema(
    {
        roomId: {
            type: String,
            required: true,
            index: true,
        },
        senderName: {
            type: String,
            required: true,
        },
        senderId: {
            type: String, // PeerJS ID
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Compound index for efficient pagination queries
chatMessageSchema.index({ roomId: 1, createdAt: -1 });

export const ChatMessage = mongoose.model("ChatMessage", chatMessageSchema);
