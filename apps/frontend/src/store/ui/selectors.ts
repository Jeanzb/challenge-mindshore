import type { UiStore } from "@/store/ui/useUiStore";

const currentLanguage = (state: UiStore) => state.currentLanguage;

const setLanguageAction = (state: UiStore) => state.setLanguage;

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

const multiSelectImageIds = (state: UiStore) => state.multiSelectImageIds;

const multiSelectActive = (state: UiStore) => state.multiSelectImageIds.length > 0;

const isImageMultiSelected =
  (nasaImageId: string) =>
  (state: UiStore): boolean =>
    state.multiSelectImageIds.includes(nasaImageId);

const toggleMultiSelectImageAction = (state: UiStore) => state.toggleMultiSelectImage;

const clearMultiSelectImagesAction = (state: UiStore) => state.clearMultiSelectImages;

const selectImageAction = (state: UiStore) => state.selectImage;

const clearSelectedImageAction = (state: UiStore) => state.clearSelectedImage;

const openInspectorAction = (state: UiStore) => state.openInspector;

const closeInspectorAction = (state: UiStore) => state.closeInspector;

const mobileFiltersOpen = (state: UiStore) => state.mobileFiltersOpen;

const openMobileFiltersAction = (state: UiStore) => state.openMobileFilters;

const closeMobileFiltersAction = (state: UiStore) => state.closeMobileFilters;

const setTimelinePanelStateAction = (state: UiStore) => state.setTimelinePanelState;

const setSearchViewModeAction = (state: UiStore) => state.setSearchViewMode;

const setSemanticSearchEnabledAction = (state: UiStore) => state.setSemanticSearchEnabled;

const addCompareImageAction = (state: UiStore) => state.addCompareImage;

const removeCompareImageAction = (state: UiStore) => state.removeCompareImage;

export const uiSelectors = {
  currentLanguage,
  setLanguageAction,
  selectedImage,
  selectedImageId,
  inspectorOpen,
  mobileFiltersOpen,
  timelinePanelState,
  searchViewMode,
  semanticSearchEnabled,
  compareImageIds,
  canCompareImages,
  isImageSelected,
  isImageInComparison,
  selectImageAction,
  clearSelectedImageAction,
  openInspectorAction,
  closeInspectorAction,
  openMobileFiltersAction,
  closeMobileFiltersAction,
  setTimelinePanelStateAction,
  setSearchViewModeAction,
  setSemanticSearchEnabledAction,
  addCompareImageAction,
  removeCompareImageAction,
  multiSelectImageIds,
  multiSelectActive,
  isImageMultiSelected,
  toggleMultiSelectImageAction,
  clearMultiSelectImagesAction
};
