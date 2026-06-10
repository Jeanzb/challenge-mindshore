import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { initialUiState, type UiStoreState } from "@/store/ui/initialState";
import type { NasaImage } from "@/types/search";
import type { AppLanguage, SearchViewMode, TimelinePanelState } from "@/types/ui";

type PersistedUiState = Pick<
  UiStoreState,
  "currentLanguage" | "timelinePanelState" | "searchViewMode" | "semanticSearchEnabled"
>;

export type UiStoreAction = {
  setLanguage: (language: AppLanguage) => void;
  selectImage: (image: NasaImage) => void;
  clearSelectedImage: () => void;
  openInspector: () => void;
  closeInspector: () => void;
  toggleInspector: () => void;
  openMobileFilters: () => void;
  closeMobileFilters: () => void;
  setTimelinePanelState: (panelState: TimelinePanelState) => void;
  toggleTimelinePanel: () => void;
  setSearchViewMode: (viewMode: SearchViewMode) => void;
  setSemanticSearchEnabled: (enabled: boolean) => void;
  addCompareImage: (nasaImageId: string) => void;
  removeCompareImage: (nasaImageId: string) => void;
  clearCompareImages: () => void;
  resetUiState: () => void;
};

export type UiStore = UiStoreState & UiStoreAction;

export const useUiStore = create<UiStore>()(
  persist(
    (set, get) => ({
      ...initialUiState,
      setLanguage: (currentLanguage) => {
        set({ currentLanguage });
      },
      selectImage: (selectedImage) => {
        set({ selectedImage, inspectorOpen: true });
      },
      clearSelectedImage: () => {
        set({ selectedImage: null });
      },
      openInspector: () => {
        set({ inspectorOpen: true });
      },
      closeInspector: () => {
        set({ inspectorOpen: false });
      },
      toggleInspector: () => {
        set({ inspectorOpen: !get().inspectorOpen });
      },
      openMobileFilters: () => {
        set({ mobileFiltersOpen: true });
      },
      closeMobileFilters: () => {
        set({ mobileFiltersOpen: false });
      },
      setTimelinePanelState: (timelinePanelState) => {
        set({ timelinePanelState });
      },
      toggleTimelinePanel: () => {
        set({
          timelinePanelState: get().timelinePanelState === "hidden" ? "compact" : "hidden"
        });
      },
      setSearchViewMode: (searchViewMode) => {
        set({ searchViewMode });
      },
      setSemanticSearchEnabled: (semanticSearchEnabled) => {
        set({ semanticSearchEnabled });
      },
      addCompareImage: (nasaImageId) => {
        if (get().compareImageIds.includes(nasaImageId)) {
          return;
        }

        set({ compareImageIds: [...get().compareImageIds, nasaImageId] });
      },
      removeCompareImage: (nasaImageId) => {
        set({
          compareImageIds: get().compareImageIds.filter((imageId) => imageId !== nasaImageId)
        });
      },
      clearCompareImages: () => {
        set({ compareImageIds: [] });
      },
      resetUiState: () => {
        set(initialUiState);
      }
    }),
    {
      name: "cosmara-ui",
      storage: createJSONStorage(() => localStorage),
      partialize: (state): PersistedUiState => ({
        currentLanguage: state.currentLanguage,
        timelinePanelState: state.timelinePanelState,
        searchViewMode: state.searchViewMode,
        semanticSearchEnabled: state.semanticSearchEnabled
      })
    }
  )
);
