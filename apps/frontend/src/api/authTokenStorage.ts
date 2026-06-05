import type { AuthenticatedUser, AuthSession } from "@/types/auth";

const accessTokenKey = "access_token";
const refreshTokenKey = "refresh_token";
const authenticatedUserKey = "authenticated_user";

const getStorage = (): Storage | null => {
  if (typeof globalThis.localStorage === "undefined") {
    return null;
  }

  return globalThis.localStorage;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export const authTokenStorage = {
  getAccessToken: (): string | null => getStorage()?.getItem(accessTokenKey) ?? null,
  getRefreshToken: (): string | null => getStorage()?.getItem(refreshTokenKey) ?? null,
  getUser: (): AuthenticatedUser | null => {
    const userPayload = getStorage()?.getItem(authenticatedUserKey);

    if (userPayload === undefined || userPayload === null) {
      return null;
    }

    try {
      return JSON.parse(userPayload) as AuthenticatedUser;
    } catch {
      getStorage()?.removeItem(authenticatedUserKey);
      return null;
    }
  },
  setTokens: (tokens: AuthTokens): void => {
    const storage = getStorage();

    if (storage === null) {
      return;
    }

    storage.setItem(accessTokenKey, tokens.accessToken);
    storage.setItem(refreshTokenKey, tokens.refreshToken);
  },
  setSession: (session: AuthSession): void => {
    const storage = getStorage();

    if (storage === null) {
      return;
    }

    storage.setItem(accessTokenKey, session.accessToken);
    storage.setItem(refreshTokenKey, session.refreshToken);
    storage.setItem(authenticatedUserKey, JSON.stringify(session.user));
  },
  clear: (): void => {
    const storage = getStorage();

    storage?.removeItem(accessTokenKey);
    storage?.removeItem(refreshTokenKey);
    storage?.removeItem(authenticatedUserKey);
  }
};
