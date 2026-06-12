import { useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useRef } from "react";
import { useNasaSearch } from "@/hooks";
import { defaultNasaSearchPageSize, defaultNasaSearchQuery, sampleSearchImages, sampleSearchTotalHits } from "@/constants";
import { useUiStore, uiSelectors } from "@/store";
import { cn } from "@/lib/utils";
import { formatTimelineRange } from "@/lib/searchTimeline";
import type { NasaImage } from "@/types/search";
import { SearchFiltersPanel } from "@/components/search/SearchFiltersPanel";
import { SearchInspector } from "@/components/search/SearchInspector";
import { SearchResultsGrid } from "@/components/search/SearchResultsGrid";
import { SearchTimeline } from "@/components/search/SearchTimeline";

type SearchDashboardProps = {
  initialQuery?: string;
};

export function SearchDashboard({ initialQuery }: SearchDashboardProps) {
  const navigate = useNavigate();
  const initialRouteQuery = initialQuery?.trim() ?? defaultNasaSearchQuery;
  const lastAppliedRouteQueryRef = useRef(initialRouteQuery);
  const selectedImage = useUiStore(uiSelectors.selectedImage);
  const inspectorOpen = useUiStore(uiSelectors.inspectorOpen);
  const clearSelectedImage = useUiStore(uiSelectors.clearSelectedImageAction);
  const semanticSearchEnabled = useUiStore(uiSelectors.semanticSearchEnabled);
  const {
    error,
    fetchNextPage,
    filters,
    hasNextPage,
    images,
    isFetching,
    isFetchingNextPage,
    isLoading,
    prefetchImages,
    result,
    setSemanticSearch,
    updateFilters
  } = useNasaSearch({
    initialFilters: {
      query: initialQuery?.trim() ?? defaultNasaSearchQuery,
      pageSize: defaultNasaSearchPageSize
    },
    initialSemanticSearch: semanticSearchEnabled
  });
  const hasRemoteImages = images.length > 0;
  const hasSearchResult = result !== undefined;
  const displayImages = hasRemoteImages || isLoading || hasSearchResult ? images : sampleSearchImages;
  const firstImage = sampleSearchImages[0];
  const isUsingFallback = !hasSearchResult && !isLoading;
  const fallbackImage = displayImages[0] ?? (isUsingFallback ? firstImage : undefined);
  const totalHits = result?.totalHits ?? (isLoading ? 0 : sampleSearchTotalHits);
  const showInspectorColumn = inspectorOpen && fallbackImage !== undefined;
  const timelineDateRange = formatTimelineRange(filters, displayImages);

  useEffect(() => {
    setSemanticSearch(semanticSearchEnabled);
  }, [setSemanticSearch, semanticSearchEnabled]);

  useEffect(() => {
    const nextQuery = initialQuery?.trim() ?? defaultNasaSearchQuery;

    if (lastAppliedRouteQueryRef.current === nextQuery) {
      return;
    }

    lastAppliedRouteQueryRef.current = nextQuery;
    updateFilters({
      query: nextQuery,
      datePreset: "any",
      dateFrom: null,
      dateTo: null,
      rover: null,
      camera: null,
      mission: null
    });
  }, [initialQuery, updateFilters]);

  useEffect(() => {
    if (displayImages.length === 0) {
      if (hasSearchResult && selectedImage !== null) {
        clearSelectedImage();
      }

      return;
    }

    const selectedImageStillVisible =
      selectedImage !== null && displayImages.some((image) => image.nasaImageId === selectedImage.nasaImageId);

    if (selectedImage !== null && !selectedImageStillVisible) {
      clearSelectedImage();
    }
  }, [clearSelectedImage, displayImages, hasSearchResult, selectedImage]);

  const prefetchPreviewImage = useCallback(
    (image: NasaImage) => {
      prefetchImages([image]);
    },
    [prefetchImages]
  );

  const loadNextPage = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const handleResetSearch = useCallback(() => {
    updateFilters({
      query: defaultNasaSearchQuery,
      datePreset: "any",
      dateFrom: null,
      dateTo: null,
      rover: null,
      camera: null,
      mission: null
    });

    if (initialQuery !== undefined) {
      void navigate({ to: "/search", search: {} });
    }
  }, [initialQuery, navigate, updateFilters]);

  return (
    <section
      className={cn(
        "grid h-[calc(100vh-3.5rem)] grid-cols-1 grid-rows-[minmax(0,1fr)] overflow-hidden transition-[grid-template-columns] duration-300 ease-out lg:grid-rows-[minmax(0,1fr)_auto]",
        showInspectorColumn
          ? "lg:grid-cols-[260px_minmax(0,1fr)_380px]"
          : "lg:grid-cols-[260px_minmax(0,1fr)_0px]"
      )}
    >
      <SearchFiltersPanel filters={filters} isFetching={isFetching} onApplyFilters={updateFilters} />
      <SearchResultsGrid
        images={displayImages}
        totalHits={totalHits}
        isLoading={isLoading}
        isFetching={isFetching}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage}
        isUsingFallback={isUsingFallback}
        error={error}
        onImagePreviewIntent={prefetchPreviewImage}
        onLoadMore={loadNextPage}
        onResetSearch={handleResetSearch}
      />
      <SearchInspector fallbackImage={fallbackImage} />
      <SearchTimeline images={displayImages} dateRangeLabel={timelineDateRange} />
    </section>
  );
}
