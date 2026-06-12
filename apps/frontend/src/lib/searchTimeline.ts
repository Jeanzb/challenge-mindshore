import type { NasaImage, NasaSearchFilters } from "@/types/search";
import { m } from "@/paraglide/messages";

const getTimelineDate = (image: NasaImage): string | null => image.timeline?.date ?? image.displayDate ?? null;

const getTimelineYear = (image: NasaImage): number | null => {
  if (image.timeline != null) {
    return image.timeline.year;
  }

  const date = getTimelineDate(image);
  const year = date === null ? Number.NaN : Number.parseInt(date.slice(0, 4), 10);

  return Number.isNaN(year) ? null : year;
};

export const sortImagesByTimelineDate = (images: readonly NasaImage[]): NasaImage[] =>
  [...images].sort((firstImage, secondImage) => {
    const firstDate = getTimelineDate(firstImage);
    const secondDate = getTimelineDate(secondImage);

    if (firstDate === secondDate) {
      return firstImage.title.localeCompare(secondImage.title);
    }

    if (firstDate === null) {
      return 1;
    }

    if (secondDate === null) {
      return -1;
    }

    return firstDate.localeCompare(secondDate);
  });

export const getTimelineYearMarkers = (images: readonly NasaImage[], maxMarkers: number): string[] => {
  const uniqueYears = [
    ...new Set(images.map(getTimelineYear).filter((year): year is number => year !== null))
  ].sort((a, b) => a - b);

  if (uniqueYears.length <= maxMarkers) {
    return uniqueYears.map(String);
  }

  const sampledYears = new Set<number>();
  const lastIndex = uniqueYears.length - 1;

  for (let markerIndex = 0; markerIndex < maxMarkers; markerIndex += 1) {
    sampledYears.add(uniqueYears[Math.round((markerIndex * lastIndex) / (maxMarkers - 1))]);
  }

  return [...sampledYears].map(String);
};

export const formatTimelineRange = (filters: NasaSearchFilters, images: readonly NasaImage[]): string => {
  if (filters.dateFrom !== null && filters.dateFrom !== undefined) {
    return `${filters.dateFrom} -> ${filters.dateTo ?? m.timeline_range_present()}`;
  }

  if (filters.dateTo !== null && filters.dateTo !== undefined) {
    return `${m.timeline_range_earliest()} -> ${filters.dateTo}`;
  }

  const visibleDates = images
    .map(getTimelineDate)
    .filter((date): date is string => date !== null)
    .sort();

  if (visibleDates.length === 0) {
    return m.timeline_range_all();
  }

  return `${visibleDates[0]} -> ${visibleDates[visibleDates.length - 1]}`;
};
