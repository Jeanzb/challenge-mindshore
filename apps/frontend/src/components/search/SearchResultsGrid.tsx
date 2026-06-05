import { Grid2X2, List, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sampleSearchTotalHits } from "@/constants";
import { cn } from "@/lib/utils";
import { useUiStore, uiSelectors } from "@/store";
import type { NasaImage } from "@/types/search";
import { SearchImageCard } from "@/components/search/SearchImageCard";

type SearchResultsGridProps = {
  images: readonly NasaImage[];
};

const formatResultsCount = new Intl.NumberFormat("en-US");

const renderSearchImage = (image: NasaImage) => <SearchImageCard key={image.nasaImageId} image={image} />;

export function SearchResultsGrid({ images }: SearchResultsGridProps) {
  const searchViewMode = useUiStore(uiSelectors.searchViewMode);
  const setSearchViewMode = useUiStore(uiSelectors.setSearchViewModeAction);
  const semanticSearchEnabled = useUiStore(uiSelectors.semanticSearchEnabled);
  const setSemanticSearchEnabled = useUiStore(uiSelectors.setSemanticSearchEnabledAction);

  const showGrid = () => {
    setSearchViewMode("grid");
  };

  const showList = () => {
    setSearchViewMode("list");
  };

  const toggleSemanticSearch = () => {
    setSemanticSearchEnabled(!semanticSearchEnabled);
  };

  return (
    <section className="min-h-0 overflow-hidden border-white/10 lg:border-r" aria-label="NASA search results">
      <div className="flex h-full min-h-0 flex-col">
        <div className="flex min-h-16 flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-space-cyan">
              {formatResultsCount.format(sampleSearchTotalHits)} results
            </p>
            <p className="text-xs text-muted-foreground">Normalized NASA imagery ready for rendering</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={cn(
                "hidden h-9 rounded-full border border-white/10 bg-space-panel px-3 text-xs text-muted-foreground hover:bg-white/5 hover:text-white sm:inline-flex",
                semanticSearchEnabled && "border-space-cyan/40 text-space-cyan"
              )}
              aria-pressed={semanticSearchEnabled}
              onClick={toggleSemanticSearch}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Semantic Search
            </Button>
            <div className="flex h-9 items-center rounded-full border border-white/10 bg-space-panel p-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={cn(
                  "h-7 w-7 rounded-full text-muted-foreground hover:bg-white/5 hover:text-white",
                  searchViewMode === "grid" && "bg-space-orange text-space-void hover:bg-space-orange hover:text-space-void"
                )}
                aria-label="Grid view"
                aria-pressed={searchViewMode === "grid"}
                onClick={showGrid}
              >
                <Grid2X2 className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={cn(
                  "h-7 w-7 rounded-full text-muted-foreground hover:bg-white/5 hover:text-white",
                  searchViewMode === "list" && "bg-space-orange text-space-void hover:bg-space-orange hover:text-space-void"
                )}
                aria-label="List view"
                aria-pressed={searchViewMode === "list"}
                onClick={showList}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
          <div
            className={cn(
              "grid gap-4",
              searchViewMode === "grid"
                ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
                : "grid-cols-1 lg:grid-cols-2"
            )}
          >
            {images.map(renderSearchImage)}
          </div>
        </div>
      </div>
    </section>
  );
}
