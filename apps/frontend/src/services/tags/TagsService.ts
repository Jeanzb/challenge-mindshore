import { apiClient } from "@/api";
import type { AddTagToImageRequest, ImageTag, TagSuggestions } from "@/types/tags";

export class TagsService {
  public static addTag(collectionImageId: string, request: AddTagToImageRequest): Promise<ImageTag> {
    return apiClient.post<ImageTag, AddTagToImageRequest>(
      `/api/tags/images/${collectionImageId}`,
      request
    );
  }

  public static removeTag(collectionImageId: string, tagId: string): Promise<void> {
    return apiClient.delete(`/api/tags/images/${collectionImageId}/${tagId}`);
  }

  public static suggestTags(collectionImageId: string): Promise<TagSuggestions> {
    return apiClient.post<TagSuggestions>(`/api/tags/images/${collectionImageId}/suggest`);
  }
}
