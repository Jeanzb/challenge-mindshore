import type { NasaImage } from "@/types/search";
import type { AppLanguage, SearchViewMode, TimelinePanelState } from "@/types/ui";

export type UiStoreState = {
  currentLanguage: AppLanguage;
  selectedImage: NasaImage | null;
  inspectorOpen: boolean;
  timelinePanelState: TimelinePanelState;
  searchViewMode: SearchViewMode;
  semanticSearchEnabled: boolean;
  compareImageIds: string[];
};

export const initialUiState: UiStoreState = {
  currentLanguage: "en",
  selectedImage: null,
  inspectorOpen: true,
  timelinePanelState: "compact",
  searchViewMode: "grid",
  semanticSearchEnabled: false,
  compareImageIds: []
};
