import { useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/constants";
import { AiService } from "@/services/ai";
import type { EnrichImageRequest, EnrichmentResult } from "@/types/ai";

export const useAiEnrichment = () => {
  const queryClient = useQueryClient();

  const enrichImageMutation = useMutation({
    mutationFn: (request: EnrichImageRequest) => AiService.enrichImage(request),
    onSuccess: (result) => {
      queryClient.setQueryData(queryKeys.ai.enrichment(result.nasaImageId), result);
    }
  });

  const getCachedEnrichment = useCallback(
    (nasaImageId: string): EnrichmentResult | undefined =>
      queryClient.getQueryData<EnrichmentResult>(queryKeys.ai.enrichment(nasaImageId)),
    [queryClient]
  );

  return {
    enrichImage: enrichImageMutation.mutateAsync,
    getCachedEnrichment,
    enrichment: enrichImageMutation.data,
    isEnriching: enrichImageMutation.isPending,
    error: enrichImageMutation.error
  };
};
