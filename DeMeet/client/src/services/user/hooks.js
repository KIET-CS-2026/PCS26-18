import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authAPI } from "@/services/user/api";
import useAuthStore from "@/store/authStore";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function useAuthService() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setAuth, clearAuth } = useAuthStore();

  const useLogin = () => {
    return useMutation({
      mutationFn: authAPI.login,
      onSuccess: (response) => {
        const { user, accessToken, refreshToken } = response.data.data;
        setAuth(user, accessToken, refreshToken);
        toast.success("Logged in successfully");
        navigate("/dashboard");
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Invalid credentials");
      },
    });
  };

  const useRegister = () => {
    return useMutation({
      mutationFn: authAPI.register,
      onSuccess: () => {
        toast.success("Account created successfully. Please login.");
        navigate("/login");
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Registration failed");
      },
    });
  };

  const useLogout = () => {
    return useMutation({
      mutationFn: authAPI.logout,
      onSuccess: () => {
        clearAuth();
        queryClient.clear();
        navigate("/");
        toast.success("Logged out successfully");
      },
      onError: () => {
        // Clear auth even if logout fails
        clearAuth();
        queryClient.clear();
        navigate("/");
      },
    });
  };

  const useCurrentUser = () => {
    return useQuery({
      queryKey: ["currentUser"],
      queryFn: () => {
        authAPI
          .getCurrentUser()
          .then((response) => {
            const { user } = response.data.data;
            setAuth(user, null);
          })
          .catch((error) => {
            toast.error(
              error.response?.data?.message || "Failed to fetch user data"
            );
          });
      },
      retry: false,
      staleTime: 1000 * 60 * 5,
    });
  };

  return {
    useLogin,
    useRegister,
    useLogout,
    useCurrentUser,
  };
}
