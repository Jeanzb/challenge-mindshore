import { apiClient } from "@/api";
import type {
  AddImageToCollectionRequest,
  Collection,
  CollectionImage,
  CollectionSummary,
  CreateCollectionRequest,
  UpdateCollectionImageNoteRequest,
  UpdateCollectionRequest
} from "@/types/collections";

export class CollectionsService {
  public static getCollections(): Promise<readonly CollectionSummary[]> {
    return apiClient.get<readonly CollectionSummary[]>("/api/collections");
  }

  public static getCollection(collectionId: string): Promise<Collection> {
    return apiClient.get<Collection>(`/api/collections/${collectionId}`);
  }

  public static createCollection(request: CreateCollectionRequest): Promise<CollectionSummary> {
    return apiClient.post<CollectionSummary, CreateCollectionRequest>("/api/collections", request);
  }

  public static updateCollection(
    collectionId: string,
    request: UpdateCollectionRequest
  ): Promise<CollectionSummary> {
    return apiClient.put<CollectionSummary, UpdateCollectionRequest>(
      `/api/collections/${collectionId}`,
      request
    );
  }

  public static deleteCollection(collectionId: string): Promise<void> {
    return apiClient.delete(`/api/collections/${collectionId}`);
  }

  public static addImage(
    collectionId: string,
    request: AddImageToCollectionRequest
  ): Promise<CollectionImage> {
    return apiClient.post<CollectionImage, AddImageToCollectionRequest>(
      `/api/collections/${collectionId}/images`,
      request
    );
  }

  public static removeImage(collectionId: string, imageId: string): Promise<void> {
    return apiClient.delete(`/api/collections/${collectionId}/images/${imageId}`);
  }

  public static updateImageNote(
    collectionId: string,
    imageId: string,
    request: UpdateCollectionImageNoteRequest
  ): Promise<CollectionImage> {
    return apiClient.put<CollectionImage, UpdateCollectionImageNoteRequest>(
      `/api/collections/${collectionId}/images/${imageId}/note`,
      request
    );
  }
}
