import type { NasaImage, NasaSearchFilters } from "@/types/search";

const getTimelineDate = (image: NasaImage): string | null => image.timeline?.date ?? image.displayDate ?? null;

export const formatTimelineRange = (filters: NasaSearchFilters, images: readonly NasaImage[]): string => {
  if (filters.dateFrom !== null && filters.dateFrom !== undefined) {
    return `${filters.dateFrom} -> ${filters.dateTo ?? "present"}`;
  }

  if (filters.dateTo !== null && filters.dateTo !== undefined) {
    return `earliest -> ${filters.dateTo}`;
  }

  const visibleDates = images
    .map(getTimelineDate)
    .filter((date): date is string => date !== null)
    .sort();

  if (visibleDates.length === 0) {
    return "All available dates";
  }

  return `${visibleDates[0]} -> ${visibleDates[visibleDates.length - 1]}`;
};
