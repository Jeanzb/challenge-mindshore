import type { AddImageToCollectionRequest } from "@/types/collections";
import type { NasaImage } from "@/types/search";

export const mapNasaImageToCollectionRequest = (
  image: NasaImage,
  userNote?: string | null
): AddImageToCollectionRequest => ({
  nasaImageId: image.nasaImageId,
  title: image.title,
  description: image.description ?? null,
  imageUrl: image.urls.preview || image.imageUrl,
  thumbnailUrl: image.thumbnailUrl || image.urls.thumbnail,
  sourceUrl: image.sourceUrl ?? image.urls.source ?? null,
  mediaType: image.mediaType,
  center: image.center ?? null,
  mission: image.mission ?? null,
  rover: image.rover ?? null,
  camera: image.camera ?? null,
  dateCreated: image.dateCreated ?? null,
  keywords: image.keywords.length > 0 ? image.keywords.join(", ") : null,
  userNote: userNote ?? null
});
