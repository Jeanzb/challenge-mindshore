import { apiClient } from "@/api";

export class ExportService {
  public static exportCollectionPdf(collectionId: string): Promise<Blob> {
    return apiClient.postBlob(`/api/exports/collections/${collectionId}/pdf`);
  }
}
