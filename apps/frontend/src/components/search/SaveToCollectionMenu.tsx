import { Link } from "@tanstack/react-router";
import { Bookmark, Check, Loader2 } from "lucide-react";
import { useState, type MouseEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useAuthSession } from "@/hooks/auth";
import { useAddImageToCollection, useCollectionsList } from "@/hooks/collections";
import {
  getImageSaveFailureMessage,
  getSingleImageDuplicateMessage,
  getSingleImageSaveSuccessMessage,
  isDuplicateCollectionImageError
} from "@/lib/collectionSaveFeedback";
import { cn } from "@/lib/utils";
import { m } from "@/paraglide/messages";
import type { CollectionSummary } from "@/types/collections";
import type { NasaImage } from "@/types/search";

type SaveToCollectionMenuProps = {
  image: NasaImage;
};

const stopPropagation = (event: MouseEvent) => {
  event.stopPropagation();
};

export function SaveToCollectionMenu({ image }: SaveToCollectionMenuProps) {
  const { isAuthenticated } = useAuthSession();
  const { collections } = useCollectionsList({ enabled: isAuthenticated });
  const { addImageToCollection, isAddingImageToCollection } = useAddImageToCollection();
  const [savedCollectionIds, setSavedCollectionIds] = useState<string[]>([]);
  const isSaved = savedCollectionIds.length > 0;

  const handleSave = async (collectionId: string) => {
    if (savedCollectionIds.includes(collectionId)) {
      return;
    }

    const collectionName = collections.find((collection) => collection.id === collectionId)?.name ?? "collection";

    try {
      await addImageToCollection({ collectionId, image });
      setSavedCollectionIds((current) => [...current, collectionId]);
      toast.success(getSingleImageSaveSuccessMessage(collectionName));
    } catch (error) {
      if (isDuplicateCollectionImageError(error)) {
        setSavedCollectionIds((current) => [...current, collectionId]);
        toast.error(getSingleImageDuplicateMessage(collectionName));
        return;
      }

      toast.error(getImageSaveFailureMessage());
    }
  };

  const renderCollectionItem = (collection: CollectionSummary) => (
    <CollectionMenuItem
      key={collection.id}
      collection={collection}
      isSaved={savedCollectionIds.includes(collection.id)}
      onSave={handleSave}
    />
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild onClick={stopPropagation}>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn(
            "h-8 w-8 shrink-0 rounded-md text-muted-foreground hover:bg-white/5 hover:text-space-orange",
            isSaved && "text-space-orange"
          )}
          aria-label={m.search_save_image_to_collection({ title: image.title })}
          data-cy="bookmark-btn"
        >
          {isAddingImageToCollection ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Bookmark className={cn("h-4 w-4", isSaved && "fill-current")} />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        onClick={stopPropagation}
        className="w-56 rounded-md border-white/10 bg-space-panel text-white shadow-2xl shadow-black/50"
      >
        <DropdownMenuLabel className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {m.search_save_to_collection()}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/10" />
        {!isAuthenticated ? (
          <DropdownMenuItem asChild className="cursor-pointer text-xs text-space-cyan focus:bg-space-cyan/15 focus:text-white">
            <Link to="/auth">{m.search_sign_in_to_save_images()}</Link>
          </DropdownMenuItem>
        ) : collections.length === 0 ? (
          <DropdownMenuItem asChild className="cursor-pointer text-xs text-space-cyan focus:bg-space-cyan/15 focus:text-white">
            <Link to="/collections">{m.search_create_collection_first()}</Link>
          </DropdownMenuItem>
        ) : (
          collections.map(renderCollectionItem)
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

type CollectionMenuItemProps = {
  collection: CollectionSummary;
  isSaved: boolean;
  onSave: (collectionId: string) => void;
};

function CollectionMenuItem({ collection, isSaved, onSave }: CollectionMenuItemProps) {
  const handleSelect = (event: Event) => {
    event.preventDefault();
    onSave(collection.id);
  };

  return (
    <DropdownMenuItem
      onSelect={handleSelect}
      className="flex cursor-pointer items-center justify-between gap-2 text-xs text-white focus:bg-space-cyan/15"
    >
      <span className="truncate">{collection.name}</span>
      {isSaved ? <Check className="h-3.5 w-3.5 shrink-0 text-space-orange" /> : null}
    </DropdownMenuItem>
  );
}
