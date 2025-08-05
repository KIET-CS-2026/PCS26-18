import api from "@/lib/axios";

export const authAPI = {
  login: (credentials) => api.post("/users/login", credentials),
  register: (userData) => api.post("/users/register", userData),
  logout: () => api.post("/users/logout"),
  getCurrentUser: () => api.get("/users/me"),
  refreshToken: () => api.post("/users/refreshAccess"),
};

export const healthAPI = {
  check: () => api.get("/health"),
};
