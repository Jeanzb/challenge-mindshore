import { apiClient } from "@/api";
import type {
  CompareImagesRequest,
  ComparisonResult,
  EnrichImageRequest,
  EnrichmentResult
} from "@/types/ai";

export class AiService {
  public static enrichImage(request: EnrichImageRequest): Promise<EnrichmentResult> {
    return apiClient.post<EnrichmentResult, EnrichImageRequest>("/api/ai/enrich", request);
  }

  public static compareImages(request: CompareImagesRequest): Promise<ComparisonResult> {
    return apiClient.post<ComparisonResult, CompareImagesRequest>("/api/ai/compare", request);
  }
}
