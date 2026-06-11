import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

const nasaGeneralSearchPageLimit = 100;

const createSearchRunId = (): string => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const hasFilterValue = (value?: string | null): boolean => (value ?? "").trim().length > 0;

const isGeneralImageSearch = (filters: NasaSearchFilters): boolean =>
  !hasFilterValue(filters.query)
  && !hasFilterValue(filters.dateFrom)
  && !hasFilterValue(filters.dateTo)
  && !hasFilterValue(filters.rover)
  && !hasFilterValue(filters.camera)
  && !hasFilterValue(filters.mission);

export const useNasaSearch = (options: UseNasaSearchOptions = {}) => {
  const [filters, setFilters] = useState<NasaSearchFilters>({
    ...defaultSearchFilters,
    ...options.initialFilters
  });
  const [isSemanticSearch, setIsSemanticSearch] = useState(options.initialSemanticSearch ?? false);
  const [generalSearchRunId, setGeneralSearchRunId] = useState(createSearchRunId);
  const filtersRef = useRef(filters);
  const baseFilters = useMemo<NasaSearchFilters>(
    () => ({
      ...filters,
      page: undefined
    }),
    [filters]
  );
  const effectiveSemanticSearch = isSemanticSearch && hasFilterValue(baseFilters.query);
  const shouldRandomizeGeneralSearch = !effectiveSemanticSearch && isGeneralImageSearch(baseFilters);

  const searchQuery = useInfiniteQuery({
    queryKey: queryKeys.search.results(
      baseFilters,
      effectiveSemanticSearch,
      shouldRandomizeGeneralSearch ? generalSearchRunId : undefined
    ),
    queryFn: async ({ pageParam }) => {
      const pageFilters: NasaSearchFilters = {
        ...baseFilters,
        page: pageParam
      };

      if (shouldRandomizeGeneralSearch && pageParam === 1) {
        const firstPage = await SearchService.searchImages(pageFilters);
        const pageSize = firstPage.pageSize || baseFilters.pageSize || defaultNasaSearchPageSize;
        const maxPages = Math.max(1, Math.ceil(firstPage.totalHits / pageSize));
        const randomPage = Math.floor(Math.random() * Math.min(maxPages, nasaGeneralSearchPageLimit)) + 1;

        if (randomPage === 1) {
          return firstPage;
        }

        return SearchService.searchImages({
          ...baseFilters,
          page: randomPage
        });
      }

      return effectiveSemanticSearch ? SearchService.semanticSearchImages(pageFilters) : SearchService.searchImages(pageFilters);
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
    enabled: options.enabled ?? true,
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
    filtersRef.current = filters;
  }, [filters]);

  useEffect(() => {
    if (images.length === 0) {
      return;
    }

    preloadImageUrls(images.slice(0, 8).map(selectNasaImageCardUrl));
  }, [images]);

  const updateFilters = useCallback((nextFilters: Partial<NasaSearchFilters>): void => {
    const updatedFilters = {
      ...filtersRef.current,
      ...nextFilters,
      page: undefined
    };

    setFilters(updatedFilters);

    if (isGeneralImageSearch(updatedFilters)) {
      setGeneralSearchRunId(createSearchRunId());
    }
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
