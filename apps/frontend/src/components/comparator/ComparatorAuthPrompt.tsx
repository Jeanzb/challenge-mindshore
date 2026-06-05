import { Link } from "@tanstack/react-router";
import { GitCompareArrows, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function ComparatorAuthPrompt() {
  return (
    <Card className="mx-auto flex max-w-lg flex-col items-center rounded-lg border-white/10 bg-space-panel p-8 text-center shadow-xl shadow-black/25">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-space-cyan/10 text-space-cyan">
        <GitCompareArrows className="h-6 w-6" />
      </span>
      <h2 className="mt-5 text-xl font-semibold text-white">Sign in to compare saved images</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        AI comparison uses images saved to your personal collections so results can be traced and reused.
      </p>
      <Button asChild className="mt-6 h-10 rounded-full bg-space-orange px-5 text-space-void hover:bg-space-orange/90">
        <Link to="/auth">
          <LogIn className="h-4 w-4" />
          Sign In
        </Link>
      </Button>
    </Card>
  );
}
