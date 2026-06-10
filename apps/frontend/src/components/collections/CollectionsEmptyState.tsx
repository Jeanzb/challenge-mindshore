import { FolderPlus } from "lucide-react";
import { Card } from "@/components/ui/card";

export function CollectionsEmptyState() {
  return (
    <Card className="cosmara-fade-in flex min-h-72 flex-col items-center justify-center rounded-xl border border-dashed border-white/15 bg-space-void/25 p-8 text-center shadow-none">
      <span className="cosmara-float flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-muted-foreground">
        <FolderPlus className="h-7 w-7" />
      </span>
      <h2 className="mt-5 text-lg font-semibold text-white">No collections yet</h2>
      <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
        Create a collection from selected NASA imagery or start from the Explore page.
      </p>
      <div className="cosmara-shimmer mt-5 h-0.5 w-16 rounded-full bg-white/10" />
    </Card>
  );
}
