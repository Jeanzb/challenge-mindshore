export type AuthenticatedUser = {
  id: string;
  email: string;
  displayName: string;
};

export type AuthSession = {
  accessToken: string;
  refreshToken: string;
  user: AuthenticatedUser;
};

export type RegisterUserRequest = {
  email: string;
  password: string;
  displayName: string;
};

export type LoginUserRequest = {
  email: string;
  password: string;
};

export type RefreshTokenRequest = {
  refreshToken: string;
};

export type ForgotPasswordRequest = {
  email: string;
};

export type ForgotPasswordResponse = {
  resetToken: string;
  expiresAt: string;
};

export type ResetPasswordRequest = {
  token: string;
  newPassword: string;
};
