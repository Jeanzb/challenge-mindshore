import { sampleSearchImages } from "@/constants/searchSampleData";
import type { NasaImage } from "@/types/search";

export type CollectionVisual = {
  accentClassName: string;
  previewImages: readonly [NasaImage, NasaImage, NasaImage];
};

export const collectionVisuals: readonly CollectionVisual[] = [
  {
    accentClassName: "from-space-cyan/20 via-space-cyan/5 to-transparent",
    previewImages: [sampleSearchImages[0], sampleSearchImages[1], sampleSearchImages[4]]
  },
  {
    accentClassName: "from-space-orange/25 via-space-orange/5 to-transparent",
    previewImages: [sampleSearchImages[2], sampleSearchImages[5], sampleSearchImages[6]]
  },
  {
    accentClassName: "from-[#8fd3ff]/20 via-[#8fd3ff]/5 to-transparent",
    previewImages: [sampleSearchImages[3], sampleSearchImages[6], sampleSearchImages[1]]
  },
  {
    accentClassName: "from-[#f7c36a]/20 via-[#f7c36a]/5 to-transparent",
    previewImages: [sampleSearchImages[1], sampleSearchImages[4], sampleSearchImages[0]]
  }
];
