import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { formatCollectionCount } from "@/lib/collectionMetrics";
import { m } from "@/paraglide/messages";
import { toast } from "sonner";

export type DeleteCollectionTarget = {
  id: string;
  name: string;
  imageCount: number;
};

type DeleteCollectionDialogProps = {
  collection: DeleteCollectionTarget | null;
  isDeleting: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleteCollection: (collectionId: string) => Promise<unknown>;
};

export function DeleteCollectionDialog({
  collection,
  isDeleting,
  onOpenChange,
  onDeleteCollection
}: DeleteCollectionDialogProps) {
  const open = collection !== null;

  const handleConfirmDelete = async (): Promise<void> => {
    if (collection === null) {
      return;
    }

    try {
      await onDeleteCollection(collection.id);
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : m.collections_delete_error());
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-white/10 bg-space-panel text-foreground shadow-2xl shadow-black/40 sm:max-w-md">
        <DialogHeader>
          <span className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-space-orange/10 text-space-orange">
            <AlertTriangle className="h-5 w-5" />
          </span>
          <DialogTitle className="text-white">{m.collections_delete_title()}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {m.collections_delete_description()}
          </DialogDescription>
        </DialogHeader>

        {collection !== null ? (
          <div className="rounded-lg border border-white/10 bg-space-void/40 p-4">
            <p className="truncate text-sm font-semibold text-white">{collection.name}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {formatCollectionCount(collection.imageCount, m.common_image(), m.common_images())}
            </p>
          </div>
        ) : null}

        <DialogFooter>
          <Button
            type="button"
            variant="ghost"
            disabled={isDeleting}
            onClick={() => onOpenChange(false)}
            className="rounded-full text-muted-foreground hover:bg-white/5 hover:text-white"
          >
            {m.collections_cancel()}
          </Button>
          <Button
            type="button"
            disabled={isDeleting}
            onClick={handleConfirmDelete}
            className="rounded-full bg-space-orange text-space-void hover:bg-space-orange/90 disabled:opacity-60"
          >
            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            {m.collections_delete_action()}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
