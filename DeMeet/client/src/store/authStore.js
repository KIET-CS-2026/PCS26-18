import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  setAuth: (user, accessToken) =>
    set({
      user,
      accessToken,
    }),
  setUser: (user) => set({ user }),
  setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
  clearAuth: () =>
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
    }),
}));

export default useAuthStore;
