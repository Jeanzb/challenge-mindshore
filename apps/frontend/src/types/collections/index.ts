import type { ImageEnrichment, ImageTag } from "@/types/images"

export interface CollectionImage {
  id: string
  nasaImageId: string
  title: string
  description: string
  imageUrl: string
  thumbnailUrl: string
  dateCreated: string
  note: string
  tags: ImageTag[]
  enrichment: ImageEnrichment | null
  addedAt: string
}

export interface Collection {
  id: string
  name: string
  description: string
  imageCount: number
  coverImageUrl: string | null
  createdAt: string
  updatedAt: string
}

export interface CollectionDetail extends Collection {
  images: CollectionImage[]
}

export interface CreateCollectionRequest {
  name: string
  description: string
}

export interface UpdateCollectionRequest {
  name: string
  description: string
}

export interface AddImageToCollectionRequest {
  nasaImageId: string
  title: string
  description: string
  imageUrl: string
  thumbnailUrl: string
  dateCreated: string
}
