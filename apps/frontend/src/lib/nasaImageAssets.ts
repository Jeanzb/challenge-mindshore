import type { NasaImage } from "@/types/search";

export const selectNasaImageCardUrl = (image: NasaImage): string =>
  image.urls.card || image.thumbnailUrl || image.imageUrl;

export const selectNasaImagePreviewUrl = (image: NasaImage): string =>
  image.urls.preview || image.imageUrl || image.urls.full;
