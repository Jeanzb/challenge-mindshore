import { Clock3, FolderOpen, Image, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { collectionVisuals } from "@/constants";
import { useAuthSession } from "@/hooks/auth";
import { useCollectionsList } from "@/hooks/collections";
import {
  formatCollectionCount,
  getLatestCollectionUpdate,
  getTotalCollectionImages
} from "@/lib/collectionMetrics";
import { CollectionCard } from "@/components/collections/CollectionCard";
import { CollectionMetricCard } from "@/components/collections/CollectionMetricCard";
import { CollectionsAuthPrompt } from "@/components/collections/CollectionsAuthPrompt";
import { CollectionsEmptyState } from "@/components/collections/CollectionsEmptyState";
import { CollectionsPageSkeleton } from "@/components/collections/CollectionsPageSkeleton";
import type { CollectionSummary } from "@/types/collections";

export function CollectionsOverview() {
  const { isAuthenticated } = useAuthSession();
  const { collections, error, isFetching, isLoading } = useCollectionsList({ enabled: isAuthenticated });
  const totalImages = getTotalCollectionImages(collections);
  const latestUpdate = getLatestCollectionUpdate(collections) ?? "No activity";
  const collectionCountLabel = formatCollectionCount(collections.length, "collection", "collections");
  const imageCountLabel = formatCollectionCount(totalImages, "curated image", "curated images");

  const renderCollectionCard = (collection: CollectionSummary, index: number) => (
    <CollectionCard
      key={collection.id}
      collection={collection}
      visual={collectionVisuals[index % collectionVisuals.length]}
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
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal text-white sm:text-3xl">My Collections</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {collectionCountLabel} - {imageCountLabel}
          </p>
        </div>
        <Button
          type="button"
          data-cy="create-collection-btn"
          disabled
          className="h-10 rounded-full bg-space-orange px-5 text-space-void hover:bg-space-orange/90 disabled:opacity-60"
        >
          <Plus className="h-4 w-4" />
          New collection
        </Button>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        <CollectionMetricCard icon={FolderOpen} value={String(collections.length)} label="Collections" />
        <CollectionMetricCard icon={Image} value={String(totalImages)} label="Total images" />
        <CollectionMetricCard icon={Clock3} value={latestUpdate} label="Last updated" />
      </div>

      <div className="mt-8">
        {isLoading ? <CollectionsPageSkeleton /> : null}
        {!isLoading && error !== null ? (
          <div className="rounded-lg border border-space-orange/25 bg-space-orange/10 px-5 py-4 text-sm text-space-orange">
            Collections could not be loaded. Please try again after signing in again.
          </div>
        ) : null}
        {!isLoading && error === null && collections.length === 0 ? <CollectionsEmptyState /> : null}
        {!isLoading && error === null && collections.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{collections.map(renderCollectionCard)}</div>
        ) : null}
      </div>

      {isFetching && !isLoading ? (
        <p className="mt-4 text-center text-xs text-muted-foreground">Refreshing collection telemetry...</p>
      ) : null}
    </section>
  );
}
