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
  const semanticSearchEnabled = useUiStore(uiSelectors.semanticSearchEnabled);
  const search = useNasaSearch({
    initialFilters: {
      query: "mars",
      dateFrom: "2015-01-01",
      dateTo: "2024-12-31",
      pageSize: 24
    },
    initialSemanticSearch: semanticSearchEnabled
  });
  const hasRemoteImages = search.images.length > 0;
  const hasSearchResult = search.result !== undefined;
  const displayImages = hasRemoteImages || search.isLoading || hasSearchResult ? search.images : sampleSearchImages;
  const firstImage = sampleSearchImages[0];
  const fallbackImage = displayImages[0] ?? firstImage;
  const totalHits = search.result?.totalHits ?? (search.isLoading ? 0 : sampleSearchTotalHits);
  const isUsingFallback = !hasSearchResult && !search.isLoading;

  useEffect(() => {
    search.setSemanticSearch(semanticSearchEnabled);
  }, [search.setSemanticSearch, semanticSearchEnabled]);

  useEffect(() => {
    if (displayImages.length === 0) {
      return;
    }

    const selectedImageStillVisible =
      selectedImage !== null && displayImages.some((image) => image.nasaImageId === selectedImage.nasaImageId);

    if (!selectedImageStillVisible) {
      selectImage(displayImages[0]);
    }
  }, [displayImages, selectImage, selectedImage]);

  useEffect(() => {
    if (!hasRemoteImages) {
      return;
    }

    void search.prefetchNextPage();
  }, [hasRemoteImages, search.prefetchNextPage]);

  const prefetchPreviewImage = useCallback(
    (image: NasaImage) => {
      search.prefetchImages([image]);
    },
    [search]
  );

  return (
    <section className="grid h-[calc(100vh-3.5rem)] grid-cols-1 grid-rows-[minmax(0,1fr)] overflow-hidden lg:grid-cols-[260px_minmax(0,1fr)_380px] lg:grid-rows-[minmax(0,1fr)_auto]">
      <SearchFiltersPanel />
      <SearchResultsGrid
        images={displayImages}
        totalHits={totalHits}
        isLoading={search.isLoading}
        isFetching={search.isFetching}
        isUsingFallback={isUsingFallback}
        error={search.error}
        onImagePreviewIntent={prefetchPreviewImage}
      />
      <SearchInspector fallbackImage={fallbackImage} />
      <SearchTimeline images={displayImages} />
    </section>
  );
}
