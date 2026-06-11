import { describe, expect, it } from "vitest";
import { ApiError } from "@/api/apiError";
import {
  getBatchSaveFeedbackMessage,
  getImageSaveFailureMessage,
  getSingleImageDuplicateMessage,
  getSingleImageSaveSuccessMessage,
  isDuplicateCollectionImageError
} from "@/lib/collectionSaveFeedback";

const duplicateError = new ApiError(400, "Validation failed.", {
  errors: {
    NasaImageId: ["Image already exists in this collection."]
  }
});

describe("collectionSaveFeedback", () => {
  it("formats single image save messages with collection quotes", () => {
    expect(getSingleImageSaveSuccessMessage("Mi mujerrr")).toBe("Saved to “Mi mujerrr”.");
    expect(getSingleImageDuplicateMessage("Mi mujerrr")).toBe("This image is already in “Mi mujerrr”.");
    expect(getImageSaveFailureMessage()).toBe("Could not save the image. Please try again.");
  });

  it("detects duplicate collection image validation errors", () => {
    expect(isDuplicateCollectionImageError(duplicateError)).toBe(true);
    expect(isDuplicateCollectionImageError(new Error("Network failed"))).toBe(false);
  });

  it("formats partial batch duplicate feedback", () => {
    expect(getBatchSaveFeedbackMessage(2, 1, 0, "Mi mujerrr")).toEqual({
      type: "success",
      message: "2 images saved. 1 was already in the collection.",
      shouldClearSelection: true
    });
  });

  it("formats all-duplicates batch feedback", () => {
    expect(getBatchSaveFeedbackMessage(0, 3, 0, "Mi mujerrr")).toEqual({
      type: "error",
      message: "These images are already in “Mi mujerrr”.",
      shouldClearSelection: false
    });
  });

  it("formats real failure batch feedback without exposing image titles", () => {
    expect(getBatchSaveFeedbackMessage(0, 0, 2, "Mi mujerrr")).toEqual({
      type: "error",
      message: "Could not save the image. Please try again.",
      shouldClearSelection: false
    });
  });
});
