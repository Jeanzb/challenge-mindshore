export type EnrichImageRequest = {
  nasaImageId: string;
  title: string;
  description?: string | null;
  imageUrl?: string | null;
  thumbnailUrl?: string | null;
  sourceUrl?: string | null;
  dateCreated?: string | null;
};

export type EnrichmentResult = {
  spaceImageId: string;
  nasaImageId: string;
  description: string;
  funFacts: readonly string[];
  historicalContext: string;
  fromCache: boolean;
};

export type CompareImagesRequest = {
  imageIds: readonly string[];
  title?: string | null;
  language: "en" | "es";
};

export type ComparisonResult = {
  id: string;
  title?: string | null;
  analysis: string;
  imageIds: readonly string[];
  createdAt: string;
};

export type ComparisonSections = {
  title: string;
  summary: string;
  similarities: readonly string[];
  differences: readonly string[];
  historicalContext: string;
  scientificValue: string;
  conclusion: string;
};
