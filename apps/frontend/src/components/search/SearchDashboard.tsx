import { useCallback, useEffect } from "react";
import { useNasaSearch } from "@/hooks";
import { sampleSearchImages, sampleSearchTotalHits } from "@/constants";
import { useUiStore, uiSelectors } from "@/store";
import type { NasaImage } from "@/types/search";
import { SearchFiltersPanel } from "@/components/search/SearchFiltersPanel";
import { SearchInspector } from "@/components/search/SearchInspector";
import { SearchResultsGrid } from "@/components/search/SearchResultsGrid";
import { SearchTimeline } from "@/components/search/SearchTimeline";

export function SearchDashboard() {
  const selectedImage = useUiStore(uiSelectors.selectedImage);
  const selectImage = useUiStore(uiSelectors.selectImageAction);
  const clearSelectedImage = useUiStore(uiSelectors.clearSelectedImageAction);
  const semanticSearchEnabled = useUiStore(uiSelectors.semanticSearchEnabled);
  const {
    error,
    filters,
    images,
    isFetching,
    isLoading,
    prefetchImages,
    prefetchNextPage,
    result,
    setSemanticSearch,
    updateFilters
  } = useNasaSearch({
    initialFilters: {
      query: "mars",
      dateFrom: "2015-01-01",
      dateTo: "2024-12-31",
      pageSize: 24
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

  useEffect(() => {
    setSemanticSearch(semanticSearchEnabled);
  }, [setSemanticSearch, semanticSearchEnabled]);

  useEffect(() => {
    if (displayImages.length === 0) {
      if (hasSearchResult && selectedImage !== null) {
        clearSelectedImage();
      }

      return;
    }

    const selectedImageStillVisible =
      selectedImage !== null && displayImages.some((image) => image.nasaImageId === selectedImage.nasaImageId);

    if (!selectedImageStillVisible) {
      selectImage(displayImages[0]);
    }
  }, [clearSelectedImage, displayImages, hasSearchResult, selectImage, selectedImage]);

  useEffect(() => {
    if (!hasRemoteImages) {
      return;
    }

    void prefetchNextPage();
  }, [hasRemoteImages, prefetchNextPage]);

  const prefetchPreviewImage = useCallback(
    (image: NasaImage) => {
      prefetchImages([image]);
    },
    [prefetchImages]
  );

  return (
    <section className="grid h-[calc(100vh-3.5rem)] grid-cols-1 grid-rows-[minmax(0,1fr)] overflow-hidden lg:grid-cols-[260px_minmax(0,1fr)_380px] lg:grid-rows-[minmax(0,1fr)_auto]">
      <SearchFiltersPanel filters={filters} isFetching={isFetching} onApplyFilters={updateFilters} />
      <SearchResultsGrid
        images={displayImages}
        totalHits={totalHits}
        isLoading={isLoading}
        isFetching={isFetching}
        isUsingFallback={isUsingFallback}
        error={error}
        onImagePreviewIntent={prefetchPreviewImage}
      />
      <SearchInspector fallbackImage={fallbackImage} />
      <SearchTimeline images={displayImages} />
    </section>
  );
}
