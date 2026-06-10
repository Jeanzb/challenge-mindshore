import { Loader2, Plus, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuthSession } from "@/hooks/auth";
import { useAddImageToCollection, useCollectionsList } from "@/hooks/collections";
import { useUiStore, uiSelectors } from "@/store";
import type { NasaImage } from "@/types/search";

type SearchBatchBarProps = {
  images: readonly NasaImage[];
};

export function SearchBatchBar({ images }: SearchBatchBarProps) {
  const selectedIds = useUiStore(uiSelectors.multiSelectImageIds);
  const clearMultiSelect = useUiStore(uiSelectors.clearMultiSelectImagesAction);
  const { isAuthenticated } = useAuthSession();
  const { collections } = useCollectionsList({ enabled: isAuthenticated });
  const { addImageToCollection } = useAddImageToCollection();
  const [targetCollectionId, setTargetCollectionId] = useState<string>("none");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  if (selectedIds.length === 0) {
    return null;
  }

  const selectedImages = images.filter((image) => selectedIds.includes(image.nasaImageId));

  const handleClear = () => {
    clearMultiSelect();
    setStatusMessage(null);
  };

  const handleCollectionChange = (collectionId: string) => {
    setTargetCollectionId(collectionId);
    setStatusMessage(null);
  };

  const handleAddAll = async () => {
    if (!isAuthenticated) {
      setStatusMessage("Sign in to save images.");
      return;
    }

    if (targetCollectionId === "none") {
      setStatusMessage("Choose a collection first.");
      return;
    }

    setIsSaving(true);
    setStatusMessage(null);

    const targetCollection = collections.find((collection) => collection.id === targetCollectionId);
    const results = await Promise.allSettled(
      selectedImages.map((image) => addImageToCollection({ collectionId: targetCollectionId, image }))
    );
    const savedCount = results.filter((result) => result.status === "fulfilled").length;
    const failedCount = results.length - savedCount;

    setIsSaving(false);

    if (failedCount === 0) {
      setStatusMessage(`Saved ${savedCount} to ${targetCollection?.name ?? "collection"}.`);
      clearMultiSelect();
      return;
    }

    setStatusMessage(`Saved ${savedCount}, ${failedCount} could not be added.`);
  };

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center px-4 pb-4">
      <div
        className="pointer-events-auto flex w-full max-w-2xl flex-col gap-3 rounded-xl border border-space-orange/30 bg-space-panelStrong/95 p-3 shadow-2xl shadow-black/40 backdrop-blur-xl cosmara-fade-in sm:flex-row sm:items-center sm:justify-between"
        data-cy="batch-action-bar"
      >
        <div className="flex items-center gap-3">
          <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-space-orange px-2 text-sm font-semibold text-space-void">
            {selectedIds.length}
          </span>
          <p className="text-sm font-medium text-white">
            {selectedIds.length === 1 ? "image selected" : "images selected"}
          </p>
        </div>
        <div className="flex flex-1 items-center justify-end gap-2">
          <Select
            value={targetCollectionId}
            onValueChange={handleCollectionChange}
            disabled={!isAuthenticated || collections.length === 0 || isSaving}
          >
            <SelectTrigger className="cosmara-control h-9 max-w-[180px] flex-1 px-3 text-left text-sm text-muted-foreground shadow-inner shadow-black/20 [&>svg]:text-muted-foreground [&>svg]:opacity-100">
              <SelectValue />
            </SelectTrigger>
            <SelectContent
              position="popper"
              className="z-[90] rounded-md border-white/10 bg-space-panel text-white shadow-2xl shadow-black/50"
            >
              <SelectItem value="none" className="cursor-pointer text-xs text-muted-foreground focus:bg-space-cyan/15">
                {isAuthenticated ? "Select collection..." : "Sign in to save"}
              </SelectItem>
              {collections.map((collection) => (
                <SelectItem
                  key={collection.id}
                  value={collection.id}
                  className="cursor-pointer text-xs text-white focus:bg-space-cyan/15"
                >
                  {collection.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            type="button"
            size="sm"
            className="h-9 shrink-0 rounded-md bg-space-orange px-4 text-space-void hover:bg-space-orange/90 disabled:opacity-60"
            disabled={isSaving}
            onClick={handleAddAll}
            data-cy="batch-add-btn"
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            {isSaving ? "Saving" : "Add all"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0 rounded-md text-muted-foreground hover:bg-white/5 hover:text-white"
            aria-label="Clear selection"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        {statusMessage !== null ? (
          <p className="w-full text-xs text-space-cyan sm:order-last sm:w-full sm:text-right">{statusMessage}</p>
        ) : null}
      </div>
    </div>
  );
}
