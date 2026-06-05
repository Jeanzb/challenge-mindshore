import { useEffect } from "react";
import { sampleSearchImages } from "@/constants";
import { useUiStore, uiSelectors } from "@/store";
import { SearchFiltersPanel } from "@/components/search/SearchFiltersPanel";
import { SearchInspector } from "@/components/search/SearchInspector";
import { SearchResultsGrid } from "@/components/search/SearchResultsGrid";
import { SearchTimeline } from "@/components/search/SearchTimeline";

export function SearchDashboard() {
  const selectedImage = useUiStore(uiSelectors.selectedImage);
  const selectImage = useUiStore(uiSelectors.selectImageAction);
  const firstImage = sampleSearchImages[0];

  useEffect(() => {
    if (selectedImage === null) {
      selectImage(firstImage);
    }
  }, [firstImage, selectImage, selectedImage]);

  return (
    <section className="grid h-[calc(100vh-3.5rem)] grid-cols-1 grid-rows-[minmax(0,1fr)] overflow-hidden lg:grid-cols-[260px_minmax(0,1fr)_380px] lg:grid-rows-[minmax(0,1fr)_auto]">
      <SearchFiltersPanel />
      <SearchResultsGrid images={sampleSearchImages} />
      <SearchInspector fallbackImage={firstImage} />
      <SearchTimeline images={sampleSearchImages} />
    </section>
  );
}
