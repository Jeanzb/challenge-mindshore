import type { UiStore } from "@/store/ui/useUiStore";

const currentLanguage = (state: UiStore) => state.currentLanguage;

const selectedImage = (state: UiStore) => state.selectedImage;

const selectedImageId = (state: UiStore) => state.selectedImage?.nasaImageId ?? null;

const inspectorOpen = (state: UiStore) => state.inspectorOpen;

const timelinePanelState = (state: UiStore) => state.timelinePanelState;

const searchViewMode = (state: UiStore) => state.searchViewMode;

const semanticSearchEnabled = (state: UiStore) => state.semanticSearchEnabled;

const compareImageIds = (state: UiStore) => state.compareImageIds;

const canCompareImages = (state: UiStore) => state.compareImageIds.length >= 2;

const isImageSelected =
  (nasaImageId: string) =>
  (state: UiStore): boolean =>
    state.selectedImage?.nasaImageId === nasaImageId;

const isImageInComparison =
  (nasaImageId: string) =>
  (state: UiStore): boolean =>
    state.compareImageIds.includes(nasaImageId);

export const uiSelectors = {
  currentLanguage,
  selectedImage,
  selectedImageId,
  inspectorOpen,
  timelinePanelState,
  searchViewMode,
  semanticSearchEnabled,
  compareImageIds,
  canCompareImages,
  isImageSelected,
  isImageInComparison
};
