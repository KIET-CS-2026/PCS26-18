// src/hooks/useAuthQuery.js
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../contexts/AuthContext";

export const useAuthQuery = () => {
  const { checkAuth } = useAuth();

  return useQuery({
    queryKey: ["auth"],
    queryFn: checkAuth,
    retry: false,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};
