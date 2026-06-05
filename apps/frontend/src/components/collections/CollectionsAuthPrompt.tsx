import { Link } from "@tanstack/react-router";
import { LogIn, Orbit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function CollectionsAuthPrompt() {
  return (
    <Card className="mx-auto flex max-w-lg flex-col items-center rounded-lg border-white/10 bg-space-panel p-8 text-center shadow-xl shadow-black/25">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-space-orange/10 text-space-orange">
        <Orbit className="h-6 w-6" />
      </span>
      <h2 className="mt-5 text-xl font-semibold text-white">Sign in to view your collections</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Personal archives are scoped to your account so saved NASA imagery stays organized and private.
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
