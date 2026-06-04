const rawBaseUrl = import.meta.env.VITE_API_BASE_URL as string | undefined
const rawUseMocks = import.meta.env.VITE_USE_MOCKS as string | undefined

export const env = {
  apiBaseUrl: rawBaseUrl && rawBaseUrl.length > 0 ? rawBaseUrl : "http://localhost:5000",
  useMocks: rawUseMocks !== "false",
}

export const ACCESS_TOKEN_KEY = "access_token"
export const REFRESH_TOKEN_KEY = "refresh_token"
