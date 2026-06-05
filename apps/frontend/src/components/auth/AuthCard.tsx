import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Eye, Lock, Mail, Orbit, User } from "lucide-react";
import { useState } from "react";
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

const loginSchema = z.object({
  email: z.string().email("Enter a valid email."),
  password: z.string().min(8, "Password must be at least 8 characters.")
});

const registerSchema = z.object({
  displayName: z.string().min(2, "Display name is required."),
  email: z.string().email("Enter a valid email."),
  password: z.string().min(8, "Password must be at least 8 characters.")
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;
type AuthMode = "signin" | "register";

export function AuthCard() {
  const [authMode, setAuthMode] = useState<AuthMode>("signin");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const { login, register, isLoggingIn, isRegistering, authError } = useAuthSession();

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "demo@nasaexplorer.com",
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

  const handleLoginSubmit = (values: LoginFormValues): void => {
    void login(values);
  };

  const handleRegisterSubmit = (values: RegisterFormValues): void => {
    void register(values);
  };

  const toggleLoginPassword = (): void => {
    setShowLoginPassword((currentValue) => !currentValue);
  };

  const toggleRegisterPassword = (): void => {
    setShowRegisterPassword((currentValue) => !currentValue);
  };

  const handleAuthModeChange = (value: string): void => {
    setAuthMode(value === "register" ? "register" : "signin");
  };

  const showRegisterTab = (): void => {
    setAuthMode("register");
  };

  return (
    <div className="w-full max-w-[420px] rounded-2xl border border-white/10 bg-[#111827]/92 px-8 py-8 shadow-2xl shadow-black/45 backdrop-blur-xl">
      <div className="mb-6 flex items-center justify-center gap-4">
        <span className="flex h-10 w-10 items-center justify-center text-space-orange">
          <Orbit className="h-7 w-7" />
        </span>
        <div>
          <h1 className="text-2xl font-semibold leading-none text-white">Cosmara</h1>
          <p className="mt-1 text-[10px] font-medium uppercase tracking-normal text-muted-foreground">
            AI Space Archive
          </p>
        </div>
      </div>
      <p className="mb-6 text-center text-sm text-muted-foreground">
        Welcome back, explorer. Sign in to your cosmic archive.
      </p>
      <Tabs value={authMode} onValueChange={handleAuthModeChange} className="w-full">
        <TabsList className="grid h-10 w-full grid-cols-2 rounded-full bg-[#263044] p-1">
          <TabsTrigger
            value="signin"
            className="rounded-full text-xs data-[state=active]:bg-space-orange data-[state=active]:text-space-void"
          >
            Sign In
          </TabsTrigger>
          <TabsTrigger
            value="register"
            className="rounded-full text-xs data-[state=active]:bg-space-orange data-[state=active]:text-space-void"
          >
            Create Account
          </TabsTrigger>
        </TabsList>
        <TabsContent value="signin" className="mt-6">
          <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(handleLoginSubmit)} className="space-y-5">
              <FormField
                control={loginForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-white">Email</FormLabel>
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
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-xs text-white">Password</FormLabel>
                      <button type="button" className="text-xs font-medium text-space-cyan">
                        Forgot password?
                      </button>
                    </div>
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
                        aria-label="Toggle password visibility"
                      >
                        <Eye className="h-4 w-4" />
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
                className="h-11 w-full rounded-xl bg-space-orange text-sm font-semibold text-space-void hover:bg-space-orange/90"
              >
                <ArrowRight className="h-4 w-4" />
                Sign In
              </Button>
            </form>
          </Form>
        </TabsContent>
        <TabsContent value="register" className="mt-6">
          <Form {...registerForm}>
            <form onSubmit={registerForm.handleSubmit(handleRegisterSubmit)} className="space-y-5">
              <FormField
                control={registerForm.control}
                name="displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-white">Name</FormLabel>
                    <div className="relative">
                      <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <FormControl>
                        <Input
                          type="text"
                          autoComplete="name"
                          placeholder="Aman Verma"
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
                    <FormLabel className="text-xs text-white">Email</FormLabel>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <FormControl>
                        <Input
                          type="email"
                          autoComplete="email"
                          placeholder="explorer@cosmara.io"
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
                    <FormLabel className="text-xs text-white">Password</FormLabel>
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
                        aria-label="Toggle password visibility"
                      >
                        <Eye className="h-4 w-4" />
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
                className="h-11 w-full rounded-xl bg-space-orange text-sm font-semibold text-space-void hover:bg-space-orange/90"
              >
                <ArrowRight className="h-4 w-4" />
                Create Account
              </Button>
            </form>
          </Form>
        </TabsContent>
      </Tabs>
      {authError ? <p className="mt-4 text-center text-xs text-destructive">{authError.message}</p> : null}
      <div className="my-6 flex items-center gap-3">
        <Separator className="bg-white/10" />
        <span className="text-xs text-muted-foreground">OR</span>
        <Separator className="bg-white/10" />
      </div>
      <p className="text-center text-sm text-muted-foreground">
        New to Cosmara?{" "}
        <button type="button" onClick={showRegisterTab} className="font-semibold text-space-orange">
          Create an account
        </button>
      </p>
      <p className="mt-7 text-center text-[11px] leading-5 text-muted-foreground">
        By continuing, you agree to our <span className="text-space-cyan">Terms of Service</span> and{" "}
        <span className="text-space-cyan">Privacy Policy</span>.
      </p>
    </div>
  );
}
