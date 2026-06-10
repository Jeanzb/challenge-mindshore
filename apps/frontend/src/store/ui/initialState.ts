import type { NasaImage } from "@/types/search";
import type { AppLanguage, SearchViewMode, TimelinePanelState } from "@/types/ui";

export type UiStoreState = {
  currentLanguage: AppLanguage;
  selectedImage: NasaImage | null;
  inspectorOpen: boolean;
  mobileFiltersOpen: boolean;
  timelinePanelState: TimelinePanelState;
  searchViewMode: SearchViewMode;
  semanticSearchEnabled: boolean;
  compareImageIds: string[];
  multiSelectImageIds: string[];
};

export const initialUiState: UiStoreState = {
  currentLanguage: "en",
  selectedImage: null,
  inspectorOpen: true,
  mobileFiltersOpen: false,
  timelinePanelState: "compact",
  searchViewMode: "grid",
  semanticSearchEnabled: false,
  compareImageIds: [],
  multiSelectImageIds: []
};
