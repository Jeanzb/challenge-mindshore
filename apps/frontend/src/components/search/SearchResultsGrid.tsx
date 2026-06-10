import { Grid2X2, List, SlidersHorizontal } from "lucide-react";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useUiStore, uiSelectors } from "@/store";
import type { NasaImage } from "@/types/search";
import { SearchBatchBar } from "@/components/search/SearchBatchBar";
import { SearchImageCard } from "@/components/search/SearchImageCard";

type SearchResultsGridProps = {
  images: readonly NasaImage[];
  totalHits: number;
  isLoading: boolean;
  isFetching: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  isUsingFallback: boolean;
  error: Error | null;
  onImagePreviewIntent: (image: NasaImage) => void;
  onLoadMore: () => void;
};

const formatResultsCount = new Intl.NumberFormat("en-US");

const skeletonKeys = ["sk-1", "sk-2", "sk-3", "sk-4", "sk-5", "sk-6", "sk-7", "sk-8"];

const renderSkeleton = (key: string) => <SearchImageSkeleton key={key} />;

export function SearchResultsGrid({
  images,
  totalHits,
  isLoading,
  isFetching,
  isFetchingNextPage,
  hasNextPage,
  isUsingFallback,
  error,
  onImagePreviewIntent,
  onLoadMore
}: SearchResultsGridProps) {
  const scrollRootRef = useRef<HTMLDivElement | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const searchViewMode = useUiStore(uiSelectors.searchViewMode);
  const setSearchViewMode = useUiStore(uiSelectors.setSearchViewModeAction);
  const semanticSearchEnabled = useUiStore(uiSelectors.semanticSearchEnabled);
  const setSemanticSearchEnabled = useUiStore(uiSelectors.setSemanticSearchEnabledAction);
  const openMobileFilters = useUiStore(uiSelectors.openMobileFiltersAction);
  const hasNoResults = !isLoading && images.length === 0 && !isUsingFallback;

  const showGrid = () => {
    setSearchViewMode("grid");
  };

  const showList = () => {
    setSearchViewMode("list");
  };

  const toggleSemanticSearch = () => {
    setSemanticSearchEnabled(!semanticSearchEnabled);
  };

  const renderSearchImage = (image: NasaImage) => (
    <SearchImageCard key={image.nasaImageId} image={image} onPreviewIntent={onImagePreviewIntent} />
  );

  useEffect(() => {
    const scrollRoot = scrollRootRef.current;
    const loadMoreMarker = loadMoreRef.current;

    if (scrollRoot === null || loadMoreMarker === null || !hasNextPage || isFetchingNextPage || isLoading) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          onLoadMore();
        }
      },
      {
        root: scrollRoot,
        rootMargin: "480px 0px"
      }
    );

    observer.observe(loadMoreMarker);

    return () => {
      observer.disconnect();
    };
  }, [hasNextPage, isFetchingNextPage, isLoading, onLoadMore]);

  return (
    <section className="relative min-h-0 overflow-hidden border-white/10 lg:border-r" aria-label="NASA search results">
      <div className="flex h-full min-h-0 flex-col">
        <div className="flex min-h-16 shrink-0 flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-space-cyan">
              {isLoading ? "Searching NASA..." : `${formatResultsCount.format(totalHits)} results`}
            </p>
            <p className="text-xs text-muted-foreground">
              {isUsingFallback
                ? "Showing cached layout fallback while the API is unavailable"
                : isFetching
                  ? "Refreshing normalized NASA imagery"
                  : "Normalized NASA imagery ready for rendering"}
            </p>
            {error !== null && (
              <p className="mt-1 max-w-xl text-xs text-space-orange">
                NASA API request failed, so the dashboard keeps a local fallback active.
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={cn(
                "hidden h-9 rounded-full border border-white/10 bg-space-panel px-3 text-xs text-muted-foreground hover:bg-white/5 hover:text-white sm:inline-flex",
                semanticSearchEnabled && "border-space-cyan/40 text-space-cyan"
              )}
              aria-pressed={semanticSearchEnabled}
              onClick={toggleSemanticSearch}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Semantic Search
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full border border-white/10 bg-space-panel text-muted-foreground hover:bg-white/5 hover:text-white lg:hidden"
              aria-label="Open filters"
              onClick={openMobileFilters}
            >
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
            <div className="flex h-9 items-center rounded-full border border-white/10 bg-space-panel p-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={cn(
                  "h-7 w-7 rounded-full text-muted-foreground hover:bg-white/5 hover:text-white",
                  searchViewMode === "grid" && "bg-space-orange text-space-void hover:bg-space-orange hover:text-space-void"
                )}
                aria-label="Grid view"
                aria-pressed={searchViewMode === "grid"}
                onClick={showGrid}
              >
                <Grid2X2 className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={cn(
                  "h-7 w-7 rounded-full text-muted-foreground hover:bg-white/5 hover:text-white",
                  searchViewMode === "list" && "bg-space-orange text-space-void hover:bg-space-orange hover:text-space-void"
                )}
                aria-label="List view"
                aria-pressed={searchViewMode === "list"}
                onClick={showList}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <div ref={scrollRootRef} className="cosmara-scrollbar min-h-0 flex-1 overflow-y-auto px-4 py-4">
          <div
            className={cn(
              "grid gap-4",
              hasNoResults && "h-full place-items-center",
              searchViewMode === "grid"
                ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3 min-[1500px]:grid-cols-4"
                : "grid-cols-1 lg:grid-cols-2"
            )}
          >
            {isLoading ? skeletonKeys.map(renderSkeleton) : hasNoResults ? <SearchEmptyState /> : images.map(renderSearchImage)}
          </div>
          {!hasNoResults && !isLoading && !isUsingFallback && (
            <div ref={loadMoreRef} className="flex h-16 items-center justify-center text-xs text-muted-foreground">
              {isFetchingNextPage ? "Loading more NASA imagery..." : hasNextPage ? "Scroll for more imagery" : "End of results"}
            </div>
          )}
        </div>
      </div>
      <SearchBatchBar images={images} />
    </section>
  );
}

function SearchEmptyState() {
  return (
    <div className="max-w-sm rounded-lg border border-white/10 bg-space-panel px-6 py-8 text-center shadow-sm shadow-black/20">
      <p className="text-sm font-semibold text-white">No NASA images found</p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Try a broader mission, camera, date range, or search query.
      </p>
    </div>
  );
}

function SearchImageSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-white/10 bg-space-panel shadow-sm shadow-black/20">
      <div className="aspect-[4/3] animate-pulse bg-white/10" />
      <div className="space-y-3 p-3">
        <div className="h-4 w-3/4 rounded bg-white/10" />
        <div className="h-3 w-1/3 rounded bg-white/10" />
        <div className="flex items-center justify-between">
          <div className="h-6 w-20 rounded bg-space-cyan/10" />
          <div className="h-7 w-24 rounded bg-white/10" />
        </div>
      </div>
    </div>
  );
}
