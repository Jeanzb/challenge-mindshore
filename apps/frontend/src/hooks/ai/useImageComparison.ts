import { useCallback, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/constants";
import { AiService } from "@/services/ai";
import type { CompareImagesRequest, ComparisonResult } from "@/types/ai";

export const useImageComparison = () => {
  const queryClient = useQueryClient();
  const [imageIds, setImageIds] = useState<readonly string[]>([]);

  const compareImagesMutation = useMutation({
    mutationFn: (request: CompareImagesRequest) => AiService.compareImages(request),
    onSuccess: (result) => {
      queryClient.setQueryData(queryKeys.ai.comparison(result.imageIds), result);
    }
  });

  const compareSelectedImages = useCallback(
    (title?: string | null, language: CompareImagesRequest["language"] = "en"): Promise<ComparisonResult> =>
      compareImagesMutation.mutateAsync({
        imageIds,
        title,
        language
      }),
    [compareImagesMutation, imageIds]
  );

  return {
    imageIds,
    setImageIds,
    comparison: compareImagesMutation.data,
    compareImages: compareImagesMutation.mutateAsync,
    compareSelectedImages,
    isComparing: compareImagesMutation.isPending,
    error: compareImagesMutation.error
  };
};
