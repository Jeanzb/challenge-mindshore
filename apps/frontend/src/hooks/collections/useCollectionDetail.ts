import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/constants";
import { CollectionsService } from "@/services/collections";
import type {
  AddImageToCollectionRequest,
  Collection,
  CollectionSummary,
  UpdateCollectionImageNoteRequest,
  UpdateCollectionRequest
} from "@/types/collections";

type UseCollectionDetailOptions = {
  collectionId?: string;
  enabled?: boolean;
};

type UpdateImageNoteVariables = {
  imageId: string;
  request: UpdateCollectionImageNoteRequest;
};

export const useCollectionDetail = (options: UseCollectionDetailOptions) => {
  const queryClient = useQueryClient();
  const collectionId = options.collectionId ?? "";
  const collectionDetailKey = queryKeys.collections.detail(collectionId);

  const collectionQuery = useQuery({
    queryKey: collectionDetailKey,
    queryFn: () => CollectionsService.getCollection(collectionId),
    enabled: (options.enabled ?? true) && collectionId.length > 0
  });

  const updateCollectionMutation = useMutation({
    mutationFn: (request: UpdateCollectionRequest) =>
      CollectionsService.updateCollection(collectionId, request),
    onSuccess: (summary) => {
      queryClient.setQueryData<Collection>(collectionDetailKey, (current) =>
        current === undefined
          ? current
          : {
              ...current,
              name: summary.name,
              description: summary.description,
              updatedAt: summary.updatedAt
            }
      );
      queryClient.setQueryData<readonly CollectionSummary[]>(queryKeys.collections.list(), (current) =>
        current?.map((collection) => (collection.id === summary.id ? summary : collection)) ?? [summary]
      );
    }
  });

  const addImageMutation = useMutation({
    mutationFn: (request: AddImageToCollectionRequest) => CollectionsService.addImage(collectionId, request),
    onSuccess: (image) => {
      queryClient.setQueryData<Collection>(collectionDetailKey, (current) =>
        current === undefined
          ? current
          : {
              ...current,
              images: [...current.images, image]
            }
      );
      queryClient.invalidateQueries({ queryKey: queryKeys.collections.list() });
    }
  });

  const removeImageMutation = useMutation({
    mutationFn: (imageId: string) => CollectionsService.removeImage(collectionId, imageId),
    onSuccess: (_, imageId) => {
      queryClient.setQueryData<Collection>(collectionDetailKey, (current) =>
        current === undefined
          ? current
          : {
              ...current,
              images: current.images.filter((image) => image.id !== imageId)
            }
      );
      queryClient.invalidateQueries({ queryKey: queryKeys.collections.list() });
    }
  });

  const updateImageNoteMutation = useMutation({
    mutationFn: (variables: UpdateImageNoteVariables) =>
      CollectionsService.updateImageNote(collectionId, variables.imageId, variables.request),
    onSuccess: (updatedImage) => {
      queryClient.setQueryData<Collection>(collectionDetailKey, (current) =>
        current === undefined
          ? current
          : {
              ...current,
              images: current.images.map((image) =>
                image.id === updatedImage.id ? updatedImage : image
              )
            }
      );
    }
  });

  const seedCollection = (collection: Collection): void => {
    queryClient.setQueryData(collectionDetailKey, collection);
  };

  return {
    collection: collectionQuery.data,
    images: collectionQuery.data?.images ?? [],
    isLoading: collectionQuery.isLoading,
    isFetching: collectionQuery.isFetching,
    error: collectionQuery.error,
    updateCollection: updateCollectionMutation.mutateAsync,
    addImage: addImageMutation.mutateAsync,
    removeImage: removeImageMutation.mutateAsync,
    updateImageNote: updateImageNoteMutation.mutateAsync,
    seedCollection,
    isUpdating: updateCollectionMutation.isPending,
    isAddingImage: addImageMutation.isPending,
    isRemovingImage: removeImageMutation.isPending,
    isUpdatingImageNote: updateImageNoteMutation.isPending,
    refetch: collectionQuery.refetch
  };
};
