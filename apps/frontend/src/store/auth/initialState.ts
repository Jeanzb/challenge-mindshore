import { authTokenStorage } from "@/api";
import type { AuthenticatedUser } from "@/types/auth";

export type AuthStoreState = {
  user: AuthenticatedUser | null;
  accessToken: string | null;
  refreshToken: string | null;
};

export const initialAuthState: AuthStoreState = {
  user: authTokenStorage.getUser(),
  accessToken: authTokenStorage.getAccessToken(),
  refreshToken: authTokenStorage.getRefreshToken()
};
