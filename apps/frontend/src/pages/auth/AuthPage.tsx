import { FeaturePlaceholder } from "@/components/app";

export function AuthPage() {
  return (
    <main className="min-h-screen bg-space-void text-foreground">
      <FeaturePlaceholder
        eyebrow="Auth"
        title="Cosmara access"
        description="Login and account creation will use React Hook Form, Zod validation, and the approved dark space mockup."
      />
    </main>
  );
}
