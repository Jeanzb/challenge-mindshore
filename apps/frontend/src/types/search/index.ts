export type NasaImageTimeline = {
  year: number;
  month: number;
  day: number;
  date: string;
};

export type NasaImageUrls = {
  thumbnail: string;
  card: string;
  preview: string;
  full: string;
  source?: string | null;
};

export type NasaImage = {
  nasaImageId: string;
  title: string;
  description?: string | null;
  center?: string | null;
  mission?: string | null;
  rover?: string | null;
  camera?: string | null;
  mediaType: string;
  thumbnailUrl: string;
  imageUrl: string;
  sourceUrl?: string | null;
  dateCreated?: string | null;
  displayDate?: string | null;
  aspectRatio: string;
  urls: NasaImageUrls;
  timeline?: NasaImageTimeline | null;
  keywords: readonly string[];
};

export type NasaSearchFilters = {
  query: string;
  dateFrom?: string | null;
  dateTo?: string | null;
  rover?: string | null;
  camera?: string | null;
  mission?: string | null;
  page?: number;
  pageSize?: number;
};

export type NasaSearchResult = {
  images: readonly NasaImage[];
  totalHits: number;
  page: number;
  pageSize: number;
};
