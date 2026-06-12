import { apiClient } from "@/api";
import type {
  AuthSession,
  LoginUserRequest,
  RefreshTokenRequest,
  RegisterUserRequest
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
}
