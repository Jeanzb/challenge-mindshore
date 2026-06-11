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

describe("collectionSaveFeedback utilities", () => {
  it("formats single image save messages with collection quotes", () => {
    expect(getSingleImageSaveSuccessMessage("Mi mujerrr")).to.equal("Saved to “Mi mujerrr”.");
    expect(getSingleImageDuplicateMessage("Mi mujerrr")).to.equal("This image is already in “Mi mujerrr”.");
    expect(getImageSaveFailureMessage()).to.equal("Could not save the image. Please try again.");
  });

  it("detects duplicate collection image validation errors", () => {
    expect(isDuplicateCollectionImageError(duplicateError)).to.equal(true);
    expect(isDuplicateCollectionImageError(new Error("Network failed"))).to.equal(false);
  });

  it("formats partial batch duplicate feedback", () => {
    expect(getBatchSaveFeedbackMessage(2, 1, 0, "Mi mujerrr")).to.deep.equal({
      type: "success",
      message: "2 images saved. 1 was already in the collection.",
      shouldClearSelection: true
    });
  });

  it("formats all-duplicates batch feedback", () => {
    expect(getBatchSaveFeedbackMessage(0, 3, 0, "Mi mujerrr")).to.deep.equal({
      type: "error",
      message: "These images are already in “Mi mujerrr”.",
      shouldClearSelection: false
    });
  });

  it("formats real failure batch feedback without exposing image titles", () => {
    expect(getBatchSaveFeedbackMessage(0, 0, 2, "Mi mujerrr")).to.deep.equal({
      type: "error",
      message: "Could not save the image. Please try again.",
      shouldClearSelection: false
    });
  });
});
