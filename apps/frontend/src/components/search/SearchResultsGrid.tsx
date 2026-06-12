import { SlidersHorizontal, Sparkles } from "lucide-react";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useUiStore, uiSelectors } from "@/store";
import { getCurrentAppLanguage } from "@/lib/i18n";
import { m } from "@/paraglide/messages";
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
  onResetSearch: () => void;
};

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
  onLoadMore,
  onResetSearch
}: SearchResultsGridProps) {
  const scrollRootRef = useRef<HTMLDivElement | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const semanticSearchEnabled = useUiStore(uiSelectors.semanticSearchEnabled);
  const setSemanticSearchEnabled = useUiStore(uiSelectors.setSemanticSearchEnabledAction);
  const openMobileFilters = useUiStore(uiSelectors.openMobileFiltersAction);
  const showSkeletons = isLoading || (isFetching && images.length === 0);
  const hasNoResults = !showSkeletons && images.length === 0 && !isUsingFallback;
  const formatResultsCount = new Intl.NumberFormat(getCurrentAppLanguage() === "es" ? "es-CO" : "en-US");

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
    <section className="relative min-h-0 overflow-hidden border-white/10 lg:border-r" aria-label={m.search_results_aria()}>
      <div className="flex h-full min-h-0 flex-col">
        <div className="flex min-h-16 shrink-0 flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-space-cyan">
              {isLoading
                ? m.search_searching()
                : m.search_results_count({ count: formatResultsCount.format(totalHits) })}
            </p>
            <p className="text-xs text-muted-foreground">
              {isUsingFallback
                ? m.search_fallback_notice()
                : isFetching
                  ? m.search_refreshing()
                  : m.search_ready()}
            </p>
            {error !== null && (
              <p className="mt-1 max-w-xl text-xs text-space-orange">
                {m.search_unavailable()}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={cn(
                "h-9 w-9 rounded-full border border-white/10 bg-space-panel text-muted-foreground hover:bg-white/5 hover:text-white sm:hidden",
                semanticSearchEnabled && "border-space-cyan/40 text-space-cyan"
              )}
              aria-label={m.search_semantic()}
              aria-pressed={semanticSearchEnabled}
              onClick={toggleSemanticSearch}
            >
              <Sparkles className="h-4 w-4" />
            </Button>
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
              {m.search_semantic()}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full border border-white/10 bg-space-panel text-muted-foreground hover:bg-white/5 hover:text-white lg:hidden"
              aria-label={m.search_open_filters()}
              onClick={openMobileFilters}
            >
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div ref={scrollRootRef} className="cosmara-scrollbar min-h-0 flex-1 overflow-y-auto px-4 py-4">
          <div
            className={cn(
              hasNoResults
                ? "flex min-h-full items-center justify-center"
                : "grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 min-[1500px]:grid-cols-4"
            )}
          >
            {showSkeletons
              ? skeletonKeys.map(renderSkeleton)
              : hasNoResults
                ? <SearchEmptyState onReset={onResetSearch} />
                : images.map(renderSearchImage)}
          </div>
          {!hasNoResults && !isLoading && !isUsingFallback && (
            <div ref={loadMoreRef} className="flex h-16 items-center justify-center text-xs text-muted-foreground">
              {isFetchingNextPage ? m.search_loading_more() : hasNextPage ? m.search_scroll_more() : m.search_end_results()}
            </div>
          )}
        </div>
      </div>
      <SearchBatchBar images={images} />
    </section>
  );
}

type SearchEmptyStateProps = {
  onReset: () => void;
};

function SearchEmptyState({ onReset }: SearchEmptyStateProps) {
  return (
    <div className="max-w-sm rounded-lg border border-white/10 bg-space-panel px-6 py-8 text-center shadow-sm shadow-black/20">
      <p className="text-sm font-semibold text-white">{m.search_empty_title()}</p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {m.search_empty_description()}
      </p>
      <Button
        type="button"
        size="sm"
        className="mt-5 h-9 rounded-full bg-space-orange px-5 text-space-void hover:bg-space-orange/90"
        onClick={onReset}
      >
        {m.search_reset()}
      </Button>
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
