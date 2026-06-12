import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Clock3, GitCompareArrows, ImageOff, Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthSession } from "@/hooks/auth";
import { useCollectionDetail, useCollectionsList } from "@/hooks/collections";
import { formatCollectionCount, formatCollectionDate } from "@/lib/collectionMetrics";
import { CollectionsAuthPrompt } from "@/components/collections/CollectionsAuthPrompt";
import { DeleteCollectionDialog, type DeleteCollectionTarget } from "@/components/collections/DeleteCollectionDialog";
import { CollectionImageTile } from "@/components/collections/detail/CollectionImageTile";
import type { CollectionImage } from "@/types/collections";
import { toast } from "sonner";
import { m } from "@/paraglide/messages";

type CollectionDetailProps = {
  collectionId: string;
};

export function CollectionDetail({ collectionId }: CollectionDetailProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthSession();
  const { collection, images, isLoading, error, removeImage, isRemovingImage } = useCollectionDetail({
    collectionId,
    enabled: isAuthenticated
  });
  const { deleteCollection, isDeleting } = useCollectionsList({ enabled: false });
  const [removingImageId, setRemovingImageId] = useState<string | null>(null);
  const [collectionToDelete, setCollectionToDelete] = useState<DeleteCollectionTarget | null>(null);

  const handleRemoveImage = async (imageId: string) => {
    setRemovingImageId(imageId);

    try {
      await removeImage(imageId);
      toast.success(m.collections_detail_image_removed());
    } catch (removeError) {
      toast.error(removeError instanceof Error ? removeError.message : m.collections_detail_image_remove_error());
    } finally {
      setRemovingImageId(null);
    }
  };

  const openDeleteCollectionDialog = (): void => {
    if (collection === undefined) {
      return;
    }

    setCollectionToDelete({
      id: collection.id,
      name: collection.name,
      imageCount: images.length
    });
  };

  const handleDeleteDialogChange = (open: boolean): void => {
    if (!open) {
      setCollectionToDelete(null);
    }
  };

  const handleDeleteCollection = async (targetCollectionId: string): Promise<void> => {
    await deleteCollection(targetCollectionId);
    toast.success(m.collections_delete_success());
    await navigate({ to: "/collections" });
  };

  const renderImageTile = (image: CollectionImage) => (
    <CollectionImageTile
      key={image.id}
      image={image}
      isRemoving={isRemovingImage && removingImageId === image.id}
      onRemove={handleRemoveImage}
    />
  );

  if (!isAuthenticated) {
    return (
      <section className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-5 py-12">
        <CollectionsAuthPrompt />
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 lg:py-10">
      <Button
        asChild
        variant="ghost"
        size="sm"
        className="-ml-2 mb-4 h-8 rounded-md text-muted-foreground hover:bg-white/5 hover:text-white"
      >
        <Link to="/collections">
          <ArrowLeft className="h-4 w-4" />
          {m.collections_detail_all()}
        </Link>
      </Button>

      {isLoading ? <CollectionDetailSkeleton /> : null}

      {!isLoading && error !== null ? (
        <div className="rounded-lg border border-space-orange/25 bg-space-orange/10 px-5 py-4 text-sm text-space-orange">
          {m.collections_detail_load_error()}
        </div>
      ) : null}

      {!isLoading && collection !== undefined ? (
        <div className="space-y-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="min-w-0">
              <h1 className="truncate text-2xl font-semibold tracking-normal text-white sm:text-3xl">{collection.name}</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                {collection.description || m.collections_card_default_description()}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                <span>{formatCollectionCount(images.length, m.common_image(), m.common_images())}</span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 className="h-3.5 w-3.5" />
                  {m.common_updated({ date: formatCollectionDate(collection.updatedAt) })}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                asChild
                variant="secondary"
                className="h-10 shrink-0 rounded-full bg-white/10 px-5 hover:bg-white/15"
              >
                <Link to="/comparator">
                  <GitCompareArrows className="h-4 w-4" />
                  {m.collections_detail_compare()}
                </Link>
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={openDeleteCollectionDialog}
                className="h-10 shrink-0 rounded-full bg-space-orange/10 px-5 text-space-orange hover:bg-space-orange/15"
              >
                <Trash2 className="h-4 w-4" />
                {m.collections_detail_delete()}
              </Button>
            </div>
          </div>

          {images.length === 0 ? (
            <CollectionDetailEmptyState />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{images.map(renderImageTile)}</div>
          )}
        </div>
      ) : null}

      {isRemovingImage ? (
        <p className="mt-4 inline-flex items-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          {m.collections_detail_updating()}
        </p>
      ) : null}
      <DeleteCollectionDialog
        collection={collectionToDelete}
        isDeleting={isDeleting}
        onOpenChange={handleDeleteDialogChange}
        onDeleteCollection={handleDeleteCollection}
      />
    </section>
  );
}

function CollectionDetailSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Skeleton className="h-8 w-64 rounded-md bg-white/5" />
        <Skeleton className="h-4 w-96 max-w-full rounded-md bg-white/5" />
        <Skeleton className="h-3 w-48 rounded-md bg-white/5" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="aspect-[4/3] rounded-lg bg-white/5" />
        <Skeleton className="aspect-[4/3] rounded-lg bg-white/5" />
        <Skeleton className="aspect-[4/3] rounded-lg bg-white/5" />
      </div>
    </div>
  );
}

function CollectionDetailEmptyState() {
  return (
    <Card className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-dashed border-white/15 bg-space-void/25 p-8 text-center shadow-none">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-muted-foreground">
        <ImageOff className="h-7 w-7" />
      </span>
      <h2 className="mt-5 text-lg font-semibold text-white">{m.collections_empty_title()}</h2>
      <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
        {m.collections_empty_description()}
      </p>
      <Button asChild className="mt-6 h-10 rounded-full bg-space-orange px-5 text-space-void hover:bg-space-orange/90">
        <Link to="/search">{m.collections_empty_cta()}</Link>
      </Button>
    </Card>
  );
}
