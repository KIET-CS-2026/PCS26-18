import api from "@/lib/axios";

export const meetingAPI = {
  scheduleMeeting: (data) => api.post("/meetings/schedule", data),
  getMyMeetings: (page = 1, limit = 5) =>
    api.get(`/meetings/my-meetings?page=${page}&limit=${limit}`),
  getMeetingById: (meetingId) => api.get(`/meetings/${meetingId}`),
  updateParticipantStatus: (meetingId, status) =>
    api.patch(`/meetings/${meetingId}/status`, { status }),
  cancelMeeting: (meetingId) => api.patch(`/meetings/${meetingId}/cancel`),
  getAllUsers: async () => {
    const response = await api.get("/meetings/users/list");
    return response.data;
  },
};
