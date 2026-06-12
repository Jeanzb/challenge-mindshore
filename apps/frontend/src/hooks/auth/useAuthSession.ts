import { useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthService } from "@/services/auth";
import { authSelectors, useAuthStore } from "@/store";
import type {
  ForgotPasswordRequest,
  LoginUserRequest,
  RefreshTokenRequest,
  RegisterUserRequest,
  ResetPasswordRequest
} from "@/types/auth";

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

  const forgotPasswordMutation = useMutation({
    mutationFn: (request: ForgotPasswordRequest) => AuthService.forgotPassword(request)
  });

  const resetPasswordMutation = useMutation({
    mutationFn: (request: ResetPasswordRequest) => AuthService.resetPassword(request)
  });

  const logout = useCallback((): void => {
    clearSession();
    queryClient.clear();
  }, [clearSession, queryClient]);

  const resetAuthError = useCallback((): void => {
    registerMutation.reset();
    loginMutation.reset();
    refreshMutation.reset();
  }, [loginMutation, refreshMutation, registerMutation]);

  return {
    user,
    isAuthenticated,
    register: registerMutation.mutateAsync,
    login: loginMutation.mutateAsync,
    refresh: refreshMutation.mutateAsync,
    forgotPassword: forgotPasswordMutation.mutateAsync,
    resetPassword: resetPasswordMutation.mutateAsync,
    logout,
    isRegistering: registerMutation.isPending,
    isLoggingIn: loginMutation.isPending,
    isRefreshing: refreshMutation.isPending,
    isRequestingReset: forgotPasswordMutation.isPending,
    isResettingPassword: resetPasswordMutation.isPending,
    authError: registerMutation.error ?? loginMutation.error ?? refreshMutation.error,
    resetAuthError
  };
};
