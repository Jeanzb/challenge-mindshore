import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/constants";
import { mapNasaImageToCollectionRequest } from "@/lib/collectionImageMapper";
import { CollectionsService } from "@/services/collections";
import type { NasaImage } from "@/types/search";

type AddImageToCollectionVariables = {
  collectionId: string;
  image: NasaImage;
  userNote?: string | null;
};

export const useAddImageToCollection = () => {
  const queryClient = useQueryClient();

  const addImageMutation = useMutation({
    mutationFn: (variables: AddImageToCollectionVariables) =>
      CollectionsService.addImage(
        variables.collectionId,
        mapNasaImageToCollectionRequest(variables.image, variables.userNote)
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.collections.list() });
      queryClient.invalidateQueries({ queryKey: queryKeys.collections.detail(variables.collectionId) });
    }
  });

  return {
    addImageToCollection: addImageMutation.mutateAsync,
    isAddingImageToCollection: addImageMutation.isPending,
    addImageToCollectionError: addImageMutation.error
  };
};
