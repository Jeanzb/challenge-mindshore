const duplicateImageMessages = [
  "Image already exists in this collection.",
  "already exists in this collection"
];

export const formatCollectionName = (collectionName: string): string => `“${collectionName}”`;

export const getSingleImageSaveSuccessMessage = (collectionName: string): string =>
  `Saved to ${formatCollectionName(collectionName)}.`;

export const getSingleImageDuplicateMessage = (collectionName: string): string =>
  `This image is already in ${formatCollectionName(collectionName)}.`;

export const getImageSaveFailureMessage = (): string => "Could not save the image. Please try again.";

export const getBatchSaveFeedbackMessage = (
  savedCount: number,
  duplicateCount: number,
  failedCount: number,
  collectionName: string
): { type: "success" | "error"; message: string; shouldClearSelection: boolean } => {
  if (failedCount > 0) {
    return {
      type: "error",
      message: getImageSaveFailureMessage(),
      shouldClearSelection: false
    };
  }

  if (savedCount === 0 && duplicateCount > 0) {
    return {
      type: "error",
      message: duplicateCount === 1
        ? getSingleImageDuplicateMessage(collectionName)
        : `These images are already in ${formatCollectionName(collectionName)}.`,
      shouldClearSelection: false
    };
  }

  if (savedCount > 0 && duplicateCount > 0) {
    return {
      type: "success",
      message: `${savedCount} ${savedCount === 1 ? "image" : "images"} saved. ${duplicateCount} ${duplicateCount === 1 ? "was" : "were"} already in the collection.`,
      shouldClearSelection: true
    };
  }

  return {
    type: "success",
    message: savedCount === 1
      ? getSingleImageSaveSuccessMessage(collectionName)
      : `${savedCount} images saved to ${formatCollectionName(collectionName)}.`,
    shouldClearSelection: true
  };
};

export const isDuplicateCollectionImageError = (error: unknown): boolean => {
  const message = error instanceof Error ? error.message : "";

  if (duplicateImageMessages.some((duplicateMessage) => message.includes(duplicateMessage))) {
    return true;
  }

  return containsDuplicateMessage((error as { details?: unknown } | null)?.details);
};

const containsDuplicateMessage = (value: unknown): boolean => {
  if (typeof value === "string") {
    return duplicateImageMessages.some((duplicateMessage) => value.includes(duplicateMessage));
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      if (containsDuplicateMessage(item)) {
        return true;
      }
    }

    return false;
  }

  if (value !== null && typeof value === "object") {
    for (const item of Object.values(value)) {
      if (containsDuplicateMessage(item)) {
        return true;
      }
    }
  }

  return false;
};
