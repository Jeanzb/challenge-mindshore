import type { ImageTag } from "@/types/tags";

export type CollectionImage = {
  id: string;
  spaceImageId: string;
  nasaImageId: string;
  title: string;
  description?: string | null;
  imageUrl: string;
  thumbnailUrl?: string | null;
  userNote?: string | null;
  sortOrder: number;
  dateCreated?: string | null;
  tags: readonly ImageTag[];
};

export type CollectionSummary = {
  id: string;
  name: string;
  description?: string | null;
  imageCount: number;
  createdAt: string;
  updatedAt: string;
};

export type Collection = {
  id: string;
  name: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
  images: readonly CollectionImage[];
};

export type CreateCollectionRequest = {
  name: string;
  description?: string | null;
};

export type UpdateCollectionRequest = {
  name: string;
  description?: string | null;
};

export type AddImageToCollectionRequest = {
  nasaImageId: string;
  title: string;
  description?: string | null;
  imageUrl: string;
  thumbnailUrl?: string | null;
  sourceUrl?: string | null;
  mediaType: string;
  center?: string | null;
  mission?: string | null;
  rover?: string | null;
  camera?: string | null;
  dateCreated?: string | null;
  keywords?: string | null;
  userNote?: string | null;
};

export type UpdateCollectionImageNoteRequest = {
  userNote?: string | null;
};
