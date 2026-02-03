import { asyncHandler } from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";
import { ChatMessage } from "../models/chatMessage.model.js";

/**
 * Get paginated chat history for a room
 * Uses cursor-based pagination for efficient loading of older messages
 */
const getChatHistory = asyncHandler(async (req, res) => {
    const { roomId } = req.params;
    const { cursor, limit = 20 } = req.query;

    if (!roomId) {
        throw new apiError(HTTP_STATUS.BAD_REQUEST, "Room ID is required");
    }

    const parsedLimit = Math.min(parseInt(limit, 10) || 20, 50); // Max 50 messages per request

    // Build query - if cursor provided, get messages older than cursor
    const query = { roomId };
    if (cursor) {
        query._id = { $lt: cursor };
    }

    // Fetch messages sorted by newest first (for prepending to list)
    const messages = await ChatMessage.find(query)
        .sort({ createdAt: -1 })
        .limit(parsedLimit + 1) // Fetch one extra to check if there are more
        .lean();

    // Check if there are more messages
    const hasMore = messages.length > parsedLimit;
    if (hasMore) {
        messages.pop(); // Remove the extra message
    }

    // Reverse to get chronological order (oldest first within the batch)
    const orderedMessages = messages.reverse();

    return res.status(HTTP_STATUS.OK).json(
        new apiResponse(
            HTTP_STATUS.OK,
            {
                messages: orderedMessages,
                hasMore,
                nextCursor: orderedMessages.length > 0 ? orderedMessages[0]._id : null,
            },
            "Chat history fetched successfully"
        )
    );
});

export { getChatHistory };
