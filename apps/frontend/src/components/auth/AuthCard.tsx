import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, Eye, EyeOff, Loader2, Lock, Mail, Orbit, User } from "lucide-react";
import { useLayoutEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthSession } from "@/hooks/auth";
import { extractApiErrorMessages } from "@/lib/apiErrorMessages";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { m } from "@/paraglide/messages";

const createLoginSchema = () =>
  z.object({
    email: z.string().email(m.auth_validation_email()),
    password: z.string().min(8, m.auth_validation_password_min())
  });

const createRegisterSchema = () =>
  z.object({
    displayName: z.string().min(2, m.auth_validation_display_name()),
    email: z.string().email(m.auth_validation_email()),
    password: z
      .string()
      .min(8, m.auth_validation_password_min())
      .regex(/[A-Z]/, m.auth_validation_password_uppercase())
      .regex(/[a-z]/, m.auth_validation_password_lowercase())
      .regex(/[0-9]/, m.auth_validation_password_number())
  });

type LoginFormValues = z.infer<ReturnType<typeof createLoginSchema>>;
type RegisterFormValues = z.infer<ReturnType<typeof createRegisterSchema>>;
type AuthMode = "signin" | "register";

const getAuthErrorMessage = (message: string): string =>
  message === "Email is already registered." ? m.auth_duplicate_email() : message;

export function AuthCard() {
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState<AuthMode>("signin");
  const [panelHeight, setPanelHeight] = useState<number | null>(null);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const signInPanelRef = useRef<HTMLDivElement>(null);
  const registerPanelRef = useRef<HTMLDivElement>(null);
  const { login, register, isLoggingIn, isRegistering, resetAuthError } = useAuthSession();
  const loginSchema = createLoginSchema();
  const registerSchema = createRegisterSchema();

  const showAuthErrorToast = (error: unknown): void => {
    const messages = extractApiErrorMessages(error);

    if (messages.length === 0) {
      return;
    }

    toast.error(messages.map(getAuthErrorMessage).join(" "));
  };

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: m.auth_demo_email(),
      password: "Demo1234!"
    }
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      displayName: "",
      email: "",
      password: ""
    }
  });

  const handleLoginSubmit = async (values: LoginFormValues): Promise<void> => {
    try {
      await login(values);
      toast.success(m.auth_login_success());
      await navigate({ to: "/search" });
    } catch (error) {
      showAuthErrorToast(error);
      return;
    }
  };

  const handleRegisterSubmit = async (values: RegisterFormValues): Promise<void> => {
    try {
      await register(values);
      toast.success(m.auth_register_success());
      await navigate({ to: "/search" });
    } catch (error) {
      showAuthErrorToast(error);
      return;
    }
  };

  const toggleLoginPassword = (): void => {
    setShowLoginPassword((currentValue) => !currentValue);
  };

  const toggleRegisterPassword = (): void => {
    setShowRegisterPassword((currentValue) => !currentValue);
  };

  const handleAuthModeChange = (value: string): void => {
    resetAuthError();
    setAuthMode(value === "register" ? "register" : "signin");
  };

  const showRegisterTab = (): void => {
    resetAuthError();
    setAuthMode("register");
  };

  const showSignInTab = (): void => {
    resetAuthError();
    setAuthMode("signin");
  };

  useLayoutEffect(() => {
    const activePanel = authMode === "signin" ? signInPanelRef.current : registerPanelRef.current;

    if (!activePanel) {
      return undefined;
    }

    const updatePanelHeight = (): void => {
      const activePanelStyles = window.getComputedStyle(activePanel);
      const verticalMargin =
        Number.parseFloat(activePanelStyles.marginTop) + Number.parseFloat(activePanelStyles.marginBottom);

      setPanelHeight(activePanel.scrollHeight + verticalMargin);
    };

    updatePanelHeight();

    const resizeObserver = new ResizeObserver(updatePanelHeight);
    resizeObserver.observe(activePanel);

    return () => {
      resizeObserver.disconnect();
    };
  }, [authMode]);

  return (
    <div className="w-full max-w-[420px] overflow-hidden rounded-2xl border border-white/10 bg-[#111827]/92 px-8 py-8 shadow-2xl shadow-black/45 backdrop-blur-xl transition-[box-shadow,transform] duration-300 ease-out">
      <div className="mb-6 flex items-center justify-center gap-4">
        <span className="flex h-10 w-10 items-center justify-center text-space-orange">
          <Orbit className="h-7 w-7" />
        </span>
        <div>
          <h1 className="text-2xl font-semibold leading-none text-white">{m.app_brand()}</h1>
          <p className="mt-1 text-[10px] font-medium uppercase tracking-normal text-muted-foreground">
            {m.app_tagline()}
          </p>
        </div>
      </div>
      <p className="mb-6 text-center text-sm text-muted-foreground">
        {m.auth_welcome()}
      </p>
      <Tabs value={authMode} onValueChange={handleAuthModeChange} className="w-full">
        <TabsList className="relative grid h-11 w-full grid-cols-2 overflow-hidden rounded-full border border-white/10 bg-space-void/35 p-1 shadow-inner shadow-black/35">
          <span
            aria-hidden="true"
            className={cn(
              "absolute bottom-1 left-1 top-1 w-[calc(50%-0.25rem)] rounded-full bg-gradient-to-r from-space-orange to-[#ffc06f] shadow-[0_0_22px_rgba(249,160,63,0.24)] transition-transform duration-300 ease-out",
              authMode === "register" && "translate-x-full"
            )}
          />
          <TabsTrigger
            value="signin"
            className="relative z-10 h-9 rounded-full bg-transparent text-xs text-muted-foreground shadow-none transition-colors duration-200 hover:text-white data-[state=active]:bg-transparent data-[state=active]:text-space-void data-[state=active]:shadow-none"
          >
            {m.auth_sign_in()}
          </TabsTrigger>
          <TabsTrigger
            value="register"
            className="relative z-10 h-9 rounded-full bg-transparent text-xs text-muted-foreground shadow-none transition-colors duration-200 hover:text-white data-[state=active]:bg-transparent data-[state=active]:text-space-void data-[state=active]:shadow-none"
          >
            {m.auth_create_account()}
          </TabsTrigger>
        </TabsList>
        <div
          className="relative overflow-hidden transition-[height] duration-500 ease-out will-change-[height]"
          style={{ height: panelHeight === null ? undefined : `${panelHeight}px` }}
        >
          <TabsContent
            ref={signInPanelRef}
            forceMount
            value="signin"
            className={cn(
              "mt-6 transition-[opacity,transform] duration-300 ease-out [&[hidden]]:block",
              authMode === "signin"
                ? "relative opacity-100 translate-y-0"
                : "pointer-events-none absolute inset-x-0 top-0 -translate-y-2 opacity-0"
            )}
          >
            <Form {...loginForm}>
              <form noValidate onSubmit={loginForm.handleSubmit(handleLoginSubmit)} className="space-y-5">
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-white">{m.auth_email()}</FormLabel>
                      <div className="relative">
                        <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <FormControl>
                          <Input
                            type="email"
                            autoComplete="email"
                            className="h-10 rounded-xl border-white/15 bg-space-void/30 pl-10 text-sm text-white placeholder:text-muted-foreground focus-visible:ring-space-cyan/60"
                            {...field}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-white">{m.auth_password()}</FormLabel>
                      <div className="relative">
                        <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <FormControl>
                          <Input
                            type={showLoginPassword ? "text" : "password"}
                            autoComplete="current-password"
                            className="h-10 rounded-xl border-white/15 bg-space-void/30 pl-10 pr-10 text-sm text-white placeholder:text-muted-foreground focus-visible:ring-space-cyan/60"
                            {...field}
                          />
                        </FormControl>
                        <button
                          type="button"
                          onClick={toggleLoginPassword}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-white"
                          aria-label={showLoginPassword ? m.auth_hide_password() : m.auth_show_password()}
                        >
                          {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  data-cy="save-btn"
                  disabled={isLoggingIn}
                  aria-busy={isLoggingIn}
                  className="h-11 w-full rounded-xl bg-space-orange text-sm font-semibold text-space-void transition-[background-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:bg-space-orange/90 hover:shadow-lg hover:shadow-space-orange/15"
                >
                  {isLoggingIn ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                  {isLoggingIn ? m.auth_signing_in() : m.auth_sign_in()}
                </Button>
              </form>
            </Form>
          </TabsContent>
          <TabsContent
            ref={registerPanelRef}
            forceMount
            value="register"
            className={cn(
              "mt-6 transition-[opacity,transform] duration-300 ease-out [&[hidden]]:block",
              authMode === "register"
                ? "relative opacity-100 translate-y-0"
                : "pointer-events-none absolute inset-x-0 top-0 translate-y-2 opacity-0"
            )}
          >
            <Form {...registerForm}>
              <form noValidate onSubmit={registerForm.handleSubmit(handleRegisterSubmit)} className="space-y-5">
                <FormField
                  control={registerForm.control}
                  name="displayName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-white">{m.auth_name()}</FormLabel>
                      <div className="relative">
                        <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <FormControl>
                          <Input
                            type="text"
                            autoComplete="name"
                            placeholder={m.auth_display_name_placeholder()}
                            className="h-10 rounded-xl border-white/15 bg-space-void/30 pl-10 text-sm text-white placeholder:text-muted-foreground focus-visible:ring-space-cyan/60"
                            {...field}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-white">{m.auth_email()}</FormLabel>
                      <div className="relative">
                        <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <FormControl>
                          <Input
                            type="email"
                            autoComplete="email"
                            placeholder={m.auth_register_email_placeholder()}
                            className="h-10 rounded-xl border-white/15 bg-space-void/30 pl-10 text-sm text-white placeholder:text-muted-foreground focus-visible:ring-space-cyan/60"
                            {...field}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-white">{m.auth_password()}</FormLabel>
                      <div className="relative">
                        <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <FormControl>
                          <Input
                            type={showRegisterPassword ? "text" : "password"}
                            autoComplete="new-password"
                            className="h-10 rounded-xl border-white/15 bg-space-void/30 pl-10 pr-10 text-sm text-white placeholder:text-muted-foreground focus-visible:ring-space-cyan/60"
                            {...field}
                          />
                        </FormControl>
                        <button
                          type="button"
                          onClick={toggleRegisterPassword}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-white"
                          aria-label={showRegisterPassword ? m.auth_hide_password() : m.auth_show_password()}
                        >
                          {showRegisterPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  data-cy="save-btn"
                  disabled={isRegistering}
                  aria-busy={isRegistering}
                  className="h-11 w-full rounded-xl bg-space-orange text-sm font-semibold text-space-void transition-[background-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:bg-space-orange/90 hover:shadow-lg hover:shadow-space-orange/15"
                >
                  {isRegistering ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                  {isRegistering ? m.auth_creating_account() : m.auth_create_account()}
                </Button>
              </form>
            </Form>
          </TabsContent>
        </div>
      </Tabs>
      <div className="my-6 flex w-full min-w-0 items-center gap-3 overflow-hidden">
        <Separator className="min-w-0 flex-1 bg-white/10" />
        <span className="text-xs text-muted-foreground">OR</span>
        <Separator className="min-w-0 flex-1 bg-white/10" />
      </div>
      {authMode === "signin" ? (
        <p className="text-center text-sm text-muted-foreground">
          {m.auth_new_to_cosmara()}{" "}
          <button type="button" onClick={showRegisterTab} className="font-semibold text-space-orange">
            {m.auth_create_account()}
          </button>
        </p>
      ) : (
        <p className="text-center text-sm text-muted-foreground">
          {m.auth_already_have_account()}{" "}
          <button type="button" onClick={showSignInTab} className="font-semibold text-space-orange">
            {m.auth_sign_in()}
          </button>
        </p>
      )}
    </div>
  );
}
