const accessTokenKey = "access_token";
const refreshTokenKey = "refresh_token";

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
  setTokens: (tokens: AuthTokens): void => {
    const storage = getStorage();

    if (storage === null) {
      return;
    }

    storage.setItem(accessTokenKey, tokens.accessToken);
    storage.setItem(refreshTokenKey, tokens.refreshToken);
  },
  clear: (): void => {
    getStorage()?.removeItem(accessTokenKey);
    getStorage()?.removeItem(refreshTokenKey);
  }
};
