import { useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthService } from "@/services/auth";
import { authSelectors, useAuthStore } from "@/store";
import type { LoginUserRequest, RefreshTokenRequest, RegisterUserRequest } from "@/types/auth";

export const useAuthSession = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore(authSelectors.user);
  const isAuthenticated = useAuthStore(authSelectors.isAuthenticated);
  const setSession = useAuthStore(authSelectors.setSessionAction);
  const clearSession = useAuthStore(authSelectors.clearSessionAction);

  const registerMutation = useMutation({
    mutationFn: (request: RegisterUserRequest) => AuthService.register(request),
    onSuccess: setSession
  });

  const loginMutation = useMutation({
    mutationFn: (request: LoginUserRequest) => AuthService.login(request),
    onSuccess: setSession
  });

  const refreshMutation = useMutation({
    mutationFn: (request: RefreshTokenRequest) => AuthService.refresh(request),
    onSuccess: setSession
  });

  const logout = useCallback((): void => {
    clearSession();
    queryClient.clear();
  }, [clearSession, queryClient]);

  return {
    user,
    isAuthenticated,
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
