import type { CollectionSummary } from "@/types/collections";

const collectionDateFormatter = new Intl.DateTimeFormat("en-CA", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit"
});

const collectionCountFormatter = new Intl.NumberFormat("en-US");

export const formatCollectionDate = (date: string): string => collectionDateFormatter.format(new Date(date));

export const formatCollectionCount = (count: number, singularLabel: string, pluralLabel: string): string =>
  `${collectionCountFormatter.format(count)} ${count === 1 ? singularLabel : pluralLabel}`;

export const getTotalCollectionImages = (collections: readonly CollectionSummary[]): number =>
  collections.reduce((total, collection) => total + collection.imageCount, 0);

export const getLatestCollectionUpdate = (collections: readonly CollectionSummary[]): string | null => {
  const latestTimestamp = collections.reduce((latest, collection) => {
    const updatedTimestamp = new Date(collection.updatedAt).getTime();

    return Number.isFinite(updatedTimestamp) && updatedTimestamp > latest ? updatedTimestamp : latest;
  }, 0);

  return latestTimestamp > 0 ? collectionDateFormatter.format(new Date(latestTimestamp)) : null;
};
