import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";
import { useQueryClient } from "@tanstack/react-query";
import api from "../lib/axios";

const AuthContext = createContext({
  user: null,
  login: async () => {},
  logout: async () => {},
  checkAuth: async () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const queryClient = useQueryClient();

  const login = async (credentials) => {
    const response = await api.post("/users/login", credentials);
    setUser(response.data.data.user);
    return response.data.data;
  };

  const logout = async () => {
    await api.post("/users/logout");
    setUser(null);
    queryClient.clear(); // Clear all React Query caches
  };

  const checkAuth = async () => {
    try {
      const response = await api.get("/users/me"); // You'll need to create this endpoint
      setUser(response.data.data.user);
      return response.data;
    } catch (error) {
      setUser(null);
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
