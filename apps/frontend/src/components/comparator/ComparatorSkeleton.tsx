import { Skeleton } from "@/components/ui/skeleton";

export function ComparatorSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-80 rounded-lg bg-white/10" />
        <Skeleton className="h-80 rounded-lg bg-white/10" />
      </div>
      <Skeleton className="h-48 rounded-lg bg-white/10" />
    </div>
  );
}
