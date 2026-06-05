import { useCallback, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authTokenStorage } from "@/api";
import { AuthService } from "@/services/auth";
import type {
  AuthenticatedUser,
  AuthSession,
  LoginUserRequest,
  RefreshTokenRequest,
  RegisterUserRequest
} from "@/types/auth";

export const useAuthSession = () => {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<AuthenticatedUser | null>(() => authTokenStorage.getUser());

  const storeSession = useCallback((session: AuthSession): void => {
    authTokenStorage.setSession(session);
    setUser(session.user);
  }, []);

  const registerMutation = useMutation({
    mutationFn: (request: RegisterUserRequest) => AuthService.register(request),
    onSuccess: storeSession
  });

  const loginMutation = useMutation({
    mutationFn: (request: LoginUserRequest) => AuthService.login(request),
    onSuccess: storeSession
  });

  const refreshMutation = useMutation({
    mutationFn: (request: RefreshTokenRequest) => AuthService.refresh(request),
    onSuccess: storeSession
  });

  const logout = useCallback((): void => {
    authTokenStorage.clear();
    setUser(null);
    queryClient.clear();
  }, [queryClient]);

  return {
    user,
    isAuthenticated: user !== null && authTokenStorage.getAccessToken() !== null,
    register: registerMutation.mutateAsync,
    login: loginMutation.mutateAsync,
    refresh: refreshMutation.mutateAsync,
    logout,
    isRegistering: registerMutation.isPending,
    isLoggingIn: loginMutation.isPending,
    isRefreshing: refreshMutation.isPending,
    authError: registerMutation.error ?? loginMutation.error ?? refreshMutation.error
  };
};
