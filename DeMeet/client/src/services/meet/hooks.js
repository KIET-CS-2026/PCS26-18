import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { meetApi } from "./api";

export function useMeetService() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Legacy room creation hooks for backward compatibility
  function useCreateRoom() {
    return useMutation({
      mutationFn: meetApi.createLegacyRoom,
      onSuccess: (response) => {
        toast.success(response.data.message);
        const { roomId } = response.data.data;
        navigate(`/room/${roomId}`);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Failed to create room");
      },
    });
  }

  function useCreateSolanaRoom() {
    return useMutation({
      mutationFn: () => meetApi.createLegacyRoom(false, "Solana Gated Meeting"),
      onSuccess: (response) => {
        toast.success(response.data.message);
        const { roomId } = response.data.data;
        navigate(`/solana-room/${roomId}`);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Failed to create room");
      },
    });
  }

  // Enhanced meeting management hooks
  function useCreateMeeting() {
    return useMutation({
      mutationFn: meetApi.createMeeting,
      onSuccess: (response) => {
        toast.success(response.data.message);
        // Invalidate and refetch all meeting-related queries immediately
        queryClient.invalidateQueries({ queryKey: ["meetings"] });
        queryClient.invalidateQueries({ queryKey: ["meetingStats"] });
        
        // Force immediate refetch of all meeting queries
        queryClient.refetchQueries({ queryKey: ["meetings"], type: "all" });
        queryClient.refetchQueries({ queryKey: ["meetingStats"] });
        
        // Reset any cached data to ensure fresh fetch
        queryClient.resetQueries({ queryKey: ["meetings"] });
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Failed to create meeting");
      },
    });
  }

  function useGetCreatedMeetings(params = {}) {
    return useQuery({
      queryKey: ["meetings", "created", params],
      queryFn: () => meetApi.getCreatedMeetings(params),
      staleTime: 30 * 1000, // 30 seconds
      refetchOnMount: true,
      refetchOnWindowFocus: true,
    });
  }

  function useGetPublicMeetings(params = {}) {
    return useQuery({
      queryKey: ["meetings", "public", params],
      queryFn: () => meetApi.getPublicMeetings(params),
      staleTime: 30 * 1000, // 30 seconds
      refetchOnMount: true,
      refetchOnWindowFocus: true,
    });
  }

  function useGetJoinedMeetings(params = {}) {
    return useQuery({
      queryKey: ["meetings", "joined", params],
      queryFn: () => meetApi.getJoinedMeetings(params),
      staleTime: 30 * 1000, // 30 seconds
      refetchOnMount: true,
      refetchOnWindowFocus: true,
    });
  }

  function useGetMeetingByRoomId(roomId) {
    return useQuery({
      queryKey: ["meeting", roomId],
      queryFn: () => meetApi.getMeetingByRoomId(roomId),
      enabled: !!roomId,
    });
  }

  function useJoinMeeting() {
    return useMutation({
      mutationFn: meetApi.joinMeeting,
      onSuccess: (response) => {
        toast.success(response.data.message);
        // Invalidate and refetch all meeting-related queries
        queryClient.invalidateQueries({ queryKey: ["meetings"] });
        queryClient.invalidateQueries({ queryKey: ["meetingStats"] });
        // Refetch specific queries immediately
        queryClient.refetchQueries({ queryKey: ["meetings", "joined"] });
        queryClient.refetchQueries({ queryKey: ["meetings", "public"] });
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Failed to join meeting");
      },
    });
  }

  function useLeaveMeeting() {
    return useMutation({
      mutationFn: meetApi.leaveMeeting,
      onSuccess: (response) => {
        toast.success(response.data.message);
        queryClient.invalidateQueries({ queryKey: ["meetings"] });
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Failed to leave meeting");
      },
    });
  }

  function useUpdateMeeting() {
    return useMutation({
      mutationFn: ({ roomId, updateData }) => 
        meetApi.updateMeeting(roomId, updateData),
      onSuccess: (response) => {
        toast.success(response.data.message);
        queryClient.invalidateQueries({ queryKey: ["meetings"] });
        queryClient.invalidateQueries({ queryKey: ["meeting"] });
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Failed to update meeting");
      },
    });
  }

  function useDeleteMeeting() {
    return useMutation({
      mutationFn: meetApi.deleteMeeting,
      onSuccess: (response) => {
        toast.success(response.data.message);
        queryClient.invalidateQueries({ queryKey: ["meetings"] });
        queryClient.invalidateQueries({ queryKey: ["meetingStats"] });
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Failed to delete meeting");
      },
    });
  }

  function useGetMeetingStats() {
    return useQuery({
      queryKey: ["meetingStats"],
      queryFn: meetApi.getMeetingStats,
      staleTime: 30 * 1000, // 30 seconds
      refetchOnMount: true,
      refetchOnWindowFocus: true,
    });
  }

  return {
    // Legacy hooks
    useCreateRoom,
    useCreateSolanaRoom,
    
    // Enhanced hooks
    useCreateMeeting,
    useGetCreatedMeetings,
    useGetPublicMeetings,
    useGetJoinedMeetings,
    useGetMeetingByRoomId,
    useJoinMeeting,
    useLeaveMeeting,
    useUpdateMeeting,
    useDeleteMeeting,
    useGetMeetingStats,
  };
}
