import { FolderPlus } from "lucide-react";
import { Card } from "@/components/ui/card";

export function CollectionsEmptyState() {
  return (
    <Card className="flex min-h-72 flex-col items-center justify-center rounded-lg border border-dashed border-white/15 bg-space-void/25 p-8 text-center shadow-none">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-muted-foreground">
        <FolderPlus className="h-6 w-6" />
      </span>
      <h2 className="mt-5 text-lg font-semibold text-white">No collections yet</h2>
      <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
        Create a collection from selected NASA imagery or start from the Explore page.
      </p>
    </Card>
  );
}
