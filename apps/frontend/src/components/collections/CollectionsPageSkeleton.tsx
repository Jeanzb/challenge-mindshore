import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const skeletonCards = ["collection-skeleton-1", "collection-skeleton-2", "collection-skeleton-3", "collection-skeleton-4"];

const renderSkeletonCard = (key: string) => (
  <Card key={key} className="overflow-hidden rounded-lg border-white/10 bg-space-panel shadow-sm shadow-black/20">
    <Skeleton className="aspect-[16/8] rounded-none bg-white/10" />
    <div className="space-y-4 p-4">
      <Skeleton className="h-5 w-2/3 bg-white/10" />
      <Skeleton className="h-4 w-full bg-white/10" />
      <Skeleton className="h-4 w-1/2 bg-white/10" />
    </div>
  </Card>
);

export function CollectionsPageSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {skeletonCards.map(renderSkeletonCard)}
    </div>
  );
}
