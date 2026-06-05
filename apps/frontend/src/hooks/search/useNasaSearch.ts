import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { queryKeys } from "@/constants";
import { preloadImageUrls } from "@/lib/imagePreload";
import { selectNasaImageCardUrl, selectNasaImagePreviewUrl } from "@/lib/nasaImageAssets";
import { SearchService } from "@/services/search";
import type { NasaImage, NasaSearchFilters, NasaSearchResult } from "@/types/search";

type UseNasaSearchOptions = {
  initialFilters?: Partial<NasaSearchFilters>;
  initialSemanticSearch?: boolean;
  enabled?: boolean;
};

const defaultSearchFilters: NasaSearchFilters = {
  query: "mars rover",
  page: 1,
  pageSize: 24
};

export const useNasaSearch = (options: UseNasaSearchOptions = {}) => {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<NasaSearchFilters>({
    ...defaultSearchFilters,
    ...options.initialFilters
  });
  const [isSemanticSearch, setIsSemanticSearch] = useState(options.initialSemanticSearch ?? false);

  const searchQuery = useQuery({
    queryKey: queryKeys.search.results(filters, isSemanticSearch),
    queryFn: () =>
      isSemanticSearch ? SearchService.semanticSearchImages(filters) : SearchService.searchImages(filters),
    enabled: (options.enabled ?? true) && filters.query.trim().length > 0,
    placeholderData: keepPreviousData
  });

  useEffect(() => {
    if (searchQuery.data === undefined) {
      return;
    }

    preloadImageUrls(searchQuery.data.images.slice(0, 8).map(selectNasaImageCardUrl));
  }, [searchQuery.data]);

  const updateFilters = useCallback((nextFilters: Partial<NasaSearchFilters>): void => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      ...nextFilters,
      page: nextFilters.page ?? 1
    }));
  }, []);

  const setPage = useCallback((page: number): void => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      page
    }));
  }, []);

  const setSemanticSearch = useCallback((nextValue: boolean): void => {
    setIsSemanticSearch((currentValue) => (currentValue === nextValue ? currentValue : nextValue));
    setFilters((currentFilters) => (currentFilters.page === 1 ? currentFilters : { ...currentFilters, page: 1 }));
  }, []);

  const prefetchNextPage = useCallback(async (): Promise<void> => {
    const nextFilters: NasaSearchFilters = {
      ...filters,
      page: (searchQuery.data?.page ?? filters.page ?? 1) + 1
    };

    await queryClient.prefetchQuery({
      queryKey: queryKeys.search.results(nextFilters, isSemanticSearch),
      queryFn: () =>
        isSemanticSearch
          ? SearchService.semanticSearchImages(nextFilters)
          : SearchService.searchImages(nextFilters)
    });
  }, [filters, isSemanticSearch, queryClient, searchQuery.data?.page]);

  const prefetchImages = useCallback((images: readonly NasaImage[]): void => {
    preloadImageUrls(images.map(selectNasaImagePreviewUrl));
  }, []);

  const seedSearchResult = useCallback(
    (result: NasaSearchResult): void => {
      queryClient.setQueryData(queryKeys.search.results(filters, isSemanticSearch), result);
    },
    [filters, isSemanticSearch, queryClient]
  );

  return {
    filters,
    images: searchQuery.data?.images ?? [],
    result: searchQuery.data,
    isSemanticSearch,
    isLoading: searchQuery.isLoading,
    isFetching: searchQuery.isFetching,
    error: searchQuery.error,
    updateFilters,
    setPage,
    setSemanticSearch,
    refetch: searchQuery.refetch,
    prefetchNextPage,
    prefetchImages,
    seedSearchResult
  };
};
