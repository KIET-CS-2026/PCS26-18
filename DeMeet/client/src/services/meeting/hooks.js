import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { meetingAPI } from "@/services/meeting/api";
import { toast } from "sonner";

export function useMeetingService() {
  const queryClient = useQueryClient();

  const useScheduleMeeting = () => {
    return useMutation({
      mutationFn: meetingAPI.scheduleMeeting,
      onSuccess: (response) => {
        toast.success("Meeting scheduled successfully");
        queryClient.invalidateQueries({ queryKey: ["myMeetings"] });
      },
      onError: (error) => {
        toast.error(
          error.response?.data?.message || "Failed to schedule meeting"
        );
      },
    });
  };

  const useGetMyMeetings = (page = 1, limit = 5) => {
    return useQuery({
      queryKey: ["myMeetings", page, limit],
      queryFn: () => meetingAPI.getMyMeetings(page, limit),
      select: (response) => response.data.data,
    });
  };

  const useGetMeetingById = (meetingId) => {
    return useQuery({
      queryKey: ["meeting", meetingId],
      queryFn: () => meetingAPI.getMeetingById(meetingId),
      select: (response) => response.data.data,
      enabled: !!meetingId,
    });
  };

  const useUpdateParticipantStatus = () => {
    return useMutation({
      mutationFn: ({ meetingId, status }) =>
        meetingAPI.updateParticipantStatus(meetingId, status),
      onSuccess: (response) => {
        toast.success("Status updated successfully");
        queryClient.invalidateQueries({ queryKey: ["myMeetings"] });
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Failed to update status");
      },
    });
  };

  const useCancelMeeting = () => {
    return useMutation({
      mutationFn: meetingAPI.cancelMeeting,
      onSuccess: () => {
        toast.success("Meeting cancelled successfully");
        queryClient.invalidateQueries({ queryKey: ["myMeetings"] });
      },
      onError: (error) => {
        toast.error(
          error.response?.data?.message || "Failed to cancel meeting"
        );
      },
    });
  };

  const useGetAllUsers = () => {
    return useQuery({
      queryKey: ["allUsers"],
      queryFn: () => meetingAPI.getAllUsers(),
      select: (response) => response.data,
    });
  };

  return {
    useScheduleMeeting,
    useGetMyMeetings,
    useGetMeetingById,
    useUpdateParticipantStatus,
    useCancelMeeting,
    useGetAllUsers,
  };
}
