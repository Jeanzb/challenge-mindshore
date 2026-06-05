import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/constants";
import { ExportService } from "@/services/export";

export const useCollectionExport = () => {
  const queryClient = useQueryClient();

  const exportCollectionMutation = useMutation({
    mutationFn: (collectionId: string) => ExportService.exportCollectionPdf(collectionId),
    onSuccess: (file, collectionId) => {
      queryClient.setQueryData(queryKeys.export.collectionPdf(collectionId), file);
    }
  });

  return {
    exportCollectionPdf: exportCollectionMutation.mutateAsync,
    file: exportCollectionMutation.data,
    isExporting: exportCollectionMutation.isPending,
    error: exportCollectionMutation.error
  };
};
