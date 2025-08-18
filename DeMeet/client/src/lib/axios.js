import axios from "axios";
import { api as baseURL } from "@/constants";
import useAuthStore from "@/store/authStore";
import { toast } from "sonner";

const api = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 10000,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const publicRoutes = [
  "/users/login",
  "/users/register",
  "/health",
  "/users/refreshAccess",
  "/users/logout",
  "/users/auth/google",
  "/users/auth/google/callback",
  "/users/auth/google/verify",
  "/users/auth/google/success",
];

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const isPublicRoute = publicRoutes.some((route) =>
      config.url?.includes(route)
    );

    if (!isPublicRoute) {
      const { accessToken } = useAuthStore.getState();
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle network errors
    if (!error.response) {
      toast.error("Please check your internet connection");
      return Promise.reject(error);
    }

    const { status, data } = error.response;

    // Handle 401 errors with token refresh
    if (status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await api.post("/users/refreshAccess");
        const { accessToken, refreshToken } = response.data.data;
        useAuthStore.getState().setAuth(null, accessToken, refreshToken);
        processQueue(null, accessToken);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        try {
          await api.post("/users/logout");
        } catch (logoutError) {
          console.error(logoutError);
        }
        useAuthStore.getState().clearAuth();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle other HTTP errors
    const errorMessage = data?.message || "An error occurred";

    if (status >= 500) {
      toast.error("Something went wrong on our end");
    } else if (status === 403) {
      toast.error("You don't have permission to perform this action");
    } else {
      toast.error(errorMessage);
    }

    return Promise.reject(error);
  }
);

export default api;
