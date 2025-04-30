import { createContext, useContext } from "react";
import PropTypes from "prop-types";
import { useQueryClient } from "@tanstack/react-query";
import api from "../lib/axios";
import useAuthStore from "../store/authStore";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const { user, setAuth, clearAuth } = useAuthStore();

  const login = async (credentials) => {
    const response = await api.post("/users/login", credentials);
    const { user, accessToken, refreshToken } = response.data.data;
    setAuth(user, accessToken, refreshToken);
    return response.data;
  };

  const logout = async () => {
    try {
      await api.post("/users/logout");
    } finally {
      clearAuth();
      queryClient.clear();
      window.location.reload();
    }
  };

  const checkAuth = async () => {
    try {
      const response = await api.get("/users/me");
      const { user } = response.data.data;
      setAuth(user, null, null); // We don't need to set tokens here as they're in cookies
      return response.data;
    } catch (error) {
      clearAuth();
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
