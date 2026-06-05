import { apiClient, type ApiQueryParams } from "@/api";
import type { NasaSearchFilters, NasaSearchResult } from "@/types/search";

export class SearchService {
  public static searchImages(filters: NasaSearchFilters): Promise<NasaSearchResult> {
    return apiClient.get<NasaSearchResult>("/api/search", {
      query: this.toQueryParams(filters),
      authenticated: false
    });
  }

  public static semanticSearchImages(filters: NasaSearchFilters): Promise<NasaSearchResult> {
    return apiClient.get<NasaSearchResult>("/api/search/semantic", {
      query: this.toQueryParams(filters),
      authenticated: false
    });
  }

  private static toQueryParams(filters: NasaSearchFilters): ApiQueryParams {
    return {
      q: filters.query,
      dateFrom: filters.dateFrom,
      dateTo: filters.dateTo,
      rover: filters.rover,
      camera: filters.camera,
      mission: filters.mission,
      page: filters.page,
      pageSize: filters.pageSize
    };
  }
}
