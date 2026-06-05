import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { defaultNasaSearchPageSize, defaultNasaSearchQuery, queryKeys } from "@/constants";
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
  query: defaultNasaSearchQuery,
  pageSize: defaultNasaSearchPageSize
};

export const useNasaSearch = (options: UseNasaSearchOptions = {}) => {
  const [filters, setFilters] = useState<NasaSearchFilters>({
    ...defaultSearchFilters,
    ...options.initialFilters
  });
  const [isSemanticSearch, setIsSemanticSearch] = useState(options.initialSemanticSearch ?? false);
  const baseFilters = useMemo<NasaSearchFilters>(
    () => ({
      ...filters,
      page: undefined
    }),
    [filters]
  );

  const searchQuery = useInfiniteQuery({
    queryKey: queryKeys.search.results(baseFilters, isSemanticSearch),
    queryFn: ({ pageParam }) => {
      const pageFilters: NasaSearchFilters = {
        ...baseFilters,
        page: pageParam
      };

      return isSemanticSearch ? SearchService.semanticSearchImages(pageFilters) : SearchService.searchImages(pageFilters);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages): number | undefined => {
      const loadedImagesCount = pages.reduce((count, page) => count + page.images.length, 0);
      const pageSize = lastPage.pageSize || baseFilters.pageSize || defaultNasaSearchPageSize;

      if (lastPage.images.length < pageSize || loadedImagesCount >= lastPage.totalHits) {
        return undefined;
      }

      return lastPage.page + 1;
    },
    enabled: (options.enabled ?? true) && filters.query.trim().length > 0,
    placeholderData: keepPreviousData
  });
  const pages = searchQuery.data?.pages;
  const images = useMemo<readonly NasaImage[]>(() => pages?.flatMap((page) => page.images) ?? [], [pages]);
  const result = useMemo<NasaSearchResult | undefined>(() => {
    const firstPage = pages?.[0];
    const lastPage = pages?.[pages.length - 1];

    if (firstPage === undefined || lastPage === undefined) {
      return undefined;
    }

    return {
      images,
      totalHits: firstPage.totalHits,
      page: lastPage.page,
      pageSize: firstPage.pageSize
    };
  }, [images, pages]);

  useEffect(() => {
    if (images.length === 0) {
      return;
    }

    preloadImageUrls(images.slice(0, 8).map(selectNasaImageCardUrl));
  }, [images]);

  const updateFilters = useCallback((nextFilters: Partial<NasaSearchFilters>): void => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      ...nextFilters,
      page: undefined
    }));
  }, []);

  const setSemanticSearch = useCallback((nextValue: boolean): void => {
    setIsSemanticSearch((currentValue) => (currentValue === nextValue ? currentValue : nextValue));
    setFilters((currentFilters) => (currentFilters.page === 1 ? currentFilters : { ...currentFilters, page: 1 }));
  }, []);

  const prefetchImages = useCallback((images: readonly NasaImage[]): void => {
    preloadImageUrls(images.map(selectNasaImagePreviewUrl));
  }, []);

  return {
    filters,
    images,
    result,
    isSemanticSearch,
    isLoading: searchQuery.isLoading,
    isFetching: searchQuery.isFetching,
    isFetchingNextPage: searchQuery.isFetchingNextPage,
    hasNextPage: searchQuery.hasNextPage,
    error: searchQuery.error,
    updateFilters,
    setSemanticSearch,
    refetch: searchQuery.refetch,
    fetchNextPage: searchQuery.fetchNextPage,
    prefetchImages
  };
};
