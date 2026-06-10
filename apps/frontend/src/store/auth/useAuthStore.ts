import { create } from "zustand";
import { authTokenStorage } from "@/api";
import { initialAuthState, type AuthStoreState } from "@/store/auth/initialState";
import type { AuthSession } from "@/types/auth";

export type AuthStoreAction = {
  setSession: (session: AuthSession) => void;
  clearSession: () => void;
};

export type AuthStore = AuthStoreState & AuthStoreAction;

export const useAuthStore = create<AuthStore>()((set) => ({
  ...initialAuthState,
  setSession: (session) => {
    authTokenStorage.setSession(session);
    set({
      user: session.user,
      accessToken: session.accessToken,
      refreshToken: session.refreshToken
    });
  },
  clearSession: () => {
    authTokenStorage.clear();
    set({ user: null, accessToken: null, refreshToken: null });
  }
}));
