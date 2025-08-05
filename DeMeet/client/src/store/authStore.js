import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  setAuth: (user, accessToken) =>
    set({
      user,
      accessToken,
    }),
  clearAuth: () =>
    set({
      user: null,
      accessToken: null,
    }),
}));

export default useAuthStore;
