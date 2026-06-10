import type { AuthStore } from "@/store/auth/useAuthStore";

const user = (state: AuthStore) => state.user;

const isAuthenticated = (state: AuthStore) => state.user !== null && state.accessToken !== null;

const setSessionAction = (state: AuthStore) => state.setSession;

const clearSessionAction = (state: AuthStore) => state.clearSession;

export const authSelectors = {
  user,
  isAuthenticated,
  setSessionAction,
  clearSessionAction
};
