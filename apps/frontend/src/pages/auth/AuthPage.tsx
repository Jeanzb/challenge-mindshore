import { AuthCard } from "@/components/auth";

export function AuthPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-space-void text-foreground">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(56,198,220,0.11),transparent_28%),linear-gradient(180deg,rgba(5,10,18,0.78),rgba(3,5,10,0.96))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_14%,rgba(255,255,255,0.24)_0_1px,transparent_1px),radial-gradient(circle_at_72%_20%,rgba(255,255,255,0.18)_0_1px,transparent_1px),radial-gradient(circle_at_86%_76%,rgba(255,255,255,0.2)_0_1px,transparent_1px)] bg-[length:220px_220px,300px_300px,380px_380px]" />
      <div className="relative z-10 flex min-h-screen items-center justify-center px-5 py-10">
        <AuthCard />
      </div>
    </main>
  );
}
