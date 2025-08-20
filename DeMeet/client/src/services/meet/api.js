import { MeetApi } from "@/lib/axios";
import api from "@/lib/axios";

export const meetApi = {
  // Legacy Huddle01 API for backward compatibility
  createRoom: (roomLocked = false, title = "Test Meeting") =>
    MeetApi.post("/rooms/create-room", {
      roomLocked: roomLocked,
      metadata: {
        title: title,
      },
    }),

  // New enhanced meeting API endpoints
  createMeeting: (meetingData) => api.post("/meetings/create", meetingData),
  
  getCreatedMeetings: (params = {}) => 
    api.get("/meetings/created", { params }),
  
  getPublicMeetings: (params = {}) => 
    api.get("/meetings/public", { params }),
  
  getJoinedMeetings: (params = {}) => 
    api.get("/meetings/joined", { params }),
  
  getMeetingByRoomId: (roomId) => 
    api.get(`/meetings/${roomId}`),
  
  joinMeeting: (roomId) => 
    api.post(`/meetings/${roomId}/join`),
  
  leaveMeeting: (roomId) => 
    api.post(`/meetings/${roomId}/leave`),
  
  updateMeeting: (roomId, updateData) => 
    api.put(`/meetings/${roomId}`, updateData),
  
  deleteMeeting: (roomId) => 
    api.delete(`/meetings/${roomId}`),
  
  getMeetingStats: () => 
    api.get("/meetings/stats"),

  // Legacy room creation for backward compatibility
  createLegacyRoom: (roomLocked = false, title = "Quick Meeting") =>
    api.post("/meetings/rooms/create-room", {
      roomLocked: roomLocked,
      metadata: {
        title: title,
      },
    }),
};
