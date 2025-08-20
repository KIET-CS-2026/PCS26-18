import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { meetApi } from "./api";

export function useMeetService() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  function useCreateRoom() {
    return useMutation({
      mutationFn: meetApi.createRoom,
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

  // New: create and navigate to Solana-gated room
  function useCreateSolanaRoom() {
    return useMutation({
      mutationFn: meetApi.createRoom,
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

  return { useCreateRoom, useCreateSolanaRoom };
}
