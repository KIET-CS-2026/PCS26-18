// src/hooks/useAuthQuery.js
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../contexts/AuthContext";

export const useAuthQuery = () => {
  const { user, checkAuth } = useAuth();

  return useQuery({
    queryKey: ["auth"],
    queryFn: checkAuth,
    enabled: user === undefined, // Only run if user is not present
    retry: false,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};
