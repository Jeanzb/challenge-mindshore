import { useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/constants";
import { TagsService } from "@/services/tags";
import type { AddTagToImageRequest, TagSuggestions } from "@/types/tags";

type UseImageTagsOptions = {
  collectionImageId?: string;
};

export const useImageTags = (options: UseImageTagsOptions) => {
  const queryClient = useQueryClient();
  const collectionImageId = options.collectionImageId ?? "";

  const addTagMutation = useMutation({
    mutationFn: (request: AddTagToImageRequest) => TagsService.addTag(collectionImageId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.collections.root });
    }
  });

  const removeTagMutation = useMutation({
    mutationFn: (tagId: string) => TagsService.removeTag(collectionImageId, tagId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.collections.root });
    }
  });

  const suggestTagsMutation = useMutation({
    mutationFn: () => TagsService.suggestTags(collectionImageId),
    onSuccess: (suggestions) => {
      queryClient.setQueryData(queryKeys.tags.suggestions(collectionImageId), suggestions);
    }
  });

  const getCachedSuggestions = useCallback(
    (): TagSuggestions | undefined =>
      queryClient.getQueryData<TagSuggestions>(queryKeys.tags.suggestions(collectionImageId)),
    [collectionImageId, queryClient]
  );

  return {
    addTag: addTagMutation.mutateAsync,
    removeTag: removeTagMutation.mutateAsync,
    suggestTags: suggestTagsMutation.mutateAsync,
    getCachedSuggestions,
    addedTag: addTagMutation.data,
    suggestions: suggestTagsMutation.data,
    isAddingTag: addTagMutation.isPending,
    isRemovingTag: removeTagMutation.isPending,
    isSuggestingTags: suggestTagsMutation.isPending,
    error: addTagMutation.error ?? removeTagMutation.error ?? suggestTagsMutation.error
  };
};
