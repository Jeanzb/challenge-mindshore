import { apiClient } from "@/api";
import type {
  AuthSession,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  LoginUserRequest,
  RefreshTokenRequest,
  RegisterUserRequest,
  ResetPasswordRequest
} from "@/types/auth";

export class AuthService {
  public static register(request: RegisterUserRequest): Promise<AuthSession> {
    return apiClient.post<AuthSession, RegisterUserRequest>("/api/auth/register", request, {
      authenticated: false
    });
  }

  public static login(request: LoginUserRequest): Promise<AuthSession> {
    return apiClient.post<AuthSession, LoginUserRequest>("/api/auth/login", request, {
      authenticated: false
    });
  }

  public static refresh(request: RefreshTokenRequest): Promise<AuthSession> {
    return apiClient.post<AuthSession, RefreshTokenRequest>("/api/auth/refresh", request, {
      authenticated: false
    });
  }

  public static forgotPassword(request: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
    return apiClient.post<ForgotPasswordResponse, ForgotPasswordRequest>("/api/auth/forgot-password", request, {
      authenticated: false
    });
  }

  public static resetPassword(request: ResetPasswordRequest): Promise<void> {
    return apiClient.post<void, ResetPasswordRequest>("/api/auth/reset-password", request, {
      authenticated: false,
      responseType: "void"
    });
  }
}
