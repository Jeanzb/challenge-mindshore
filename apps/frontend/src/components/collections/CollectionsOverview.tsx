import { FolderOpen, Image, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { collectionVisuals } from "@/constants";
import { useAuthSession } from "@/hooks/auth";
import { useCollectionsList } from "@/hooks/collections";
import { formatCollectionCount, getTotalCollectionImages } from "@/lib/collectionMetrics";
import { CollectionCard } from "@/components/collections/CollectionCard";
import { CollectionMetricCard } from "@/components/collections/CollectionMetricCard";
import { CollectionsAuthPrompt } from "@/components/collections/CollectionsAuthPrompt";
import { CollectionsEmptyState } from "@/components/collections/CollectionsEmptyState";
import { CollectionsPageSkeleton } from "@/components/collections/CollectionsPageSkeleton";
import { CreateCollectionDialog } from "@/components/collections/CreateCollectionDialog";
import { DeleteCollectionDialog } from "@/components/collections/DeleteCollectionDialog";
import type { CollectionSummary } from "@/types/collections";
import { toast } from "sonner";
import { m } from "@/paraglide/messages";

export function CollectionsOverview() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [collectionToDelete, setCollectionToDelete] = useState<CollectionSummary | null>(null);
  const { isAuthenticated } = useAuthSession();
  const {
    collections,
    createCollection,
    deleteCollection,
    error,
    isCreating,
    isDeleting,
    isFetching,
    isLoading
  } = useCollectionsList({
    enabled: isAuthenticated
  });
  const totalImages = getTotalCollectionImages(collections);
  const collectionCountLabel = formatCollectionCount(collections.length, m.common_collection(), m.common_collections());
  const imageCountLabel = formatCollectionCount(totalImages, m.common_curated_image(), m.common_curated_images());

  const renderCollectionCard = (collection: CollectionSummary, index: number) => (
    <CollectionCard
      key={collection.id}
      collection={collection}
      visual={collectionVisuals[index % collectionVisuals.length]}
      onDeleteCollection={setCollectionToDelete}
    />
  );

  const openCreateDialog = (): void => {
    setCreateDialogOpen(true);
  };

  const handleDeleteDialogChange = (open: boolean): void => {
    if (!open) {
      setCollectionToDelete(null);
    }
  };

  const handleDeleteCollection = async (collectionId: string): Promise<void> => {
    await deleteCollection(collectionId);
    toast.success(m.collections_delete_success());
  };

  if (!isAuthenticated) {
    return (
      <section className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-5 py-12">
        <CollectionsAuthPrompt />
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 lg:py-10">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal text-white sm:text-3xl">{m.collections_title()}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {collectionCountLabel} - {imageCountLabel}
          </p>
        </div>
        <Button
          type="button"
          data-cy="create-collection-btn"
          onClick={openCreateDialog}
          className="h-10 rounded-full bg-space-orange px-5 text-space-void hover:bg-space-orange/90 disabled:opacity-60"
        >
          <Plus className="h-4 w-4" />
          {m.collections_new()}
        </Button>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <CollectionMetricCard icon={FolderOpen} value={String(collections.length)} label={m.collections_metric_collections()} />
        <CollectionMetricCard icon={Image} value={String(totalImages)} label={m.collections_metric_total_images()} />
      </div>

      <div className="mt-8">
        {isLoading ? <CollectionsPageSkeleton /> : null}
        {!isLoading && error !== null ? (
          <div className="rounded-lg border border-space-orange/25 bg-space-orange/10 px-5 py-4 text-sm text-space-orange">
            {m.collections_load_error()}
          </div>
        ) : null}
        {!isLoading && error === null && collections.length === 0 ? <CollectionsEmptyState /> : null}
        {!isLoading && error === null && collections.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{collections.map(renderCollectionCard)}</div>
        ) : null}
      </div>

      {isFetching && !isLoading ? (
        <p className="mt-4 text-center text-xs text-muted-foreground">{m.collections_refreshing()}</p>
      ) : null}

      <CreateCollectionDialog
        open={createDialogOpen}
        isCreating={isCreating}
        onOpenChange={setCreateDialogOpen}
        onCreateCollection={createCollection}
      />
      <DeleteCollectionDialog
        collection={collectionToDelete}
        isDeleting={isDeleting}
        onOpenChange={handleDeleteDialogChange}
        onDeleteCollection={handleDeleteCollection}
      />
    </section>
  );
}
