import { Loader2, Plus, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuthSession } from "@/hooks/auth";
import { toast } from "sonner";
import { useAddImageToCollection, useCollectionsList } from "@/hooks/collections";
import { getBatchSaveFeedbackMessage, isDuplicateCollectionImageError } from "@/lib/collectionSaveFeedback";
import { useUiStore, uiSelectors } from "@/store";
import { m } from "@/paraglide/messages";
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
  const [isSaving, setIsSaving] = useState(false);

  if (selectedIds.length === 0) {
    return null;
  }

  const selectedImages = images.filter((image) => selectedIds.includes(image.nasaImageId));

  const handleClear = () => {
    clearMultiSelect();
  };

  const handleCollectionChange = (collectionId: string) => {
    setTargetCollectionId(collectionId);
  };

  const handleAddAll = async () => {
    if (!isAuthenticated) {
      toast.error(m.search_sign_in_to_save_images());
      return;
    }

    if (targetCollectionId === "none") {
      toast.error(m.search_choose_collection());
      return;
    }

    setIsSaving(true);

    const targetCollection = collections.find((collection) => collection.id === targetCollectionId);
    const collectionName = targetCollection?.name ?? "collection";
    const results = await Promise.allSettled(
      selectedImages.map((image) => addImageToCollection({ collectionId: targetCollectionId, image }))
    );
    const savedCount = results.filter((result) => result.status === "fulfilled").length;
    let duplicateCount = 0;
    let failedCount = 0;

    for (const result of results) {
      if (result.status === "fulfilled") {
        continue;
      }

      if (isDuplicateCollectionImageError(result.reason)) {
        duplicateCount += 1;
        continue;
      }

      failedCount += 1;
    }

    setIsSaving(false);

    const feedback = getBatchSaveFeedbackMessage(savedCount, duplicateCount, failedCount, collectionName);

    if (feedback.type === "success") {
      toast.success(feedback.message);
    } else {
      toast.error(feedback.message);
    }

    if (feedback.shouldClearSelection) {
      clearMultiSelect();
    }
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
            {selectedIds.length === 1 ? m.search_image_selected() : m.search_images_selected()}
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
                {isAuthenticated ? m.search_select_collection() : m.search_sign_in_to_save()}
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
            {isSaving ? m.search_saving() : m.search_add_all()}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0 rounded-md text-muted-foreground hover:bg-white/5 hover:text-white"
            aria-label={m.search_clear_selection()}
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
