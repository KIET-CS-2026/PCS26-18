// src/hooks/useAuthQuery.js
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../contexts/AuthContext";
import useAuthStore from "../store/authStore";

export const useAuthQuery = () => {
  const { checkAuth } = useAuth();
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ["auth"],
    queryFn: checkAuth,
    retry: (failureCount, error) => {
      // Don't retry on 401 errors
      if (error?.response?.status === 401) return false;
      return failureCount < 3;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: isAuthenticated, // Only run the query if user is authenticated
  });
};
