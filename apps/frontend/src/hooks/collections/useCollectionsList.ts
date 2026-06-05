import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/constants";
import { CollectionsService } from "@/services/collections";
import type { CollectionSummary, CreateCollectionRequest } from "@/types/collections";

export const useCollectionsList = () => {
  const queryClient = useQueryClient();

  const collectionsQuery = useQuery({
    queryKey: queryKeys.collections.list(),
    queryFn: CollectionsService.getCollections
  });

  const createCollectionMutation = useMutation({
    mutationFn: (request: CreateCollectionRequest) => CollectionsService.createCollection(request),
    onSuccess: (collection) => {
      queryClient.setQueryData<readonly CollectionSummary[]>(queryKeys.collections.list(), (current) =>
        current === undefined ? [collection] : [collection, ...current]
      );
    }
  });

  const deleteCollectionMutation = useMutation({
    mutationFn: (collectionId: string) => CollectionsService.deleteCollection(collectionId),
    onSuccess: (_, collectionId) => {
      queryClient.setQueryData<readonly CollectionSummary[]>(queryKeys.collections.list(), (current) =>
        current?.filter((collection) => collection.id !== collectionId) ?? []
      );
      queryClient.removeQueries({ queryKey: queryKeys.collections.detail(collectionId) });
    }
  });

  return {
    collections: collectionsQuery.data ?? [],
    isLoading: collectionsQuery.isLoading,
    isFetching: collectionsQuery.isFetching,
    error: collectionsQuery.error,
    createCollection: createCollectionMutation.mutateAsync,
    deleteCollection: deleteCollectionMutation.mutateAsync,
    isCreating: createCollectionMutation.isPending,
    isDeleting: deleteCollectionMutation.isPending,
    refetch: collectionsQuery.refetch
  };
};
