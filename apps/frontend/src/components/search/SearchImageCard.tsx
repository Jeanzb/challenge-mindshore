import { Bookmark, Check, GitCompareArrows } from "lucide-react";
import type { MouseEvent } from "react";
import { Button } from "@/components/ui/button";
import { useUiStore, uiSelectors } from "@/store";
import type { NasaImage } from "@/types/search";
import { cn } from "@/lib/utils";

type SearchImageCardProps = {
  image: NasaImage;
  onPreviewIntent: (image: NasaImage) => void;
};

export function SearchImageCard({ image, onPreviewIntent }: SearchImageCardProps) {
  const selectedImageId = useUiStore(uiSelectors.selectedImageId);
  const selectImage = useUiStore(uiSelectors.selectImageAction);
  const addCompareImage = useUiStore(uiSelectors.addCompareImageAction);
  const isSelected = selectedImageId === image.nasaImageId;

  const handleSelect = () => {
    selectImage(image);
  };

  const handleCompare = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    addCompareImage(image.nasaImageId);
  };

  const handleBookmark = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
  };

  const handlePreviewIntent = () => {
    onPreviewIntent(image);
  };

  return (
    <article
      className={cn(
        "group overflow-hidden rounded-lg border bg-space-panel text-left shadow-sm shadow-black/20 transition duration-200 hover:-translate-y-0.5 hover:border-space-cyan/40 hover:bg-space-panelStrong",
        isSelected ? "border-space-orange shadow-space-orange/10" : "border-white/10"
      )}
      data-cy="image-card"
    >
      <button
        type="button"
        className="block w-full text-left"
        onClick={handleSelect}
        onFocus={handlePreviewIntent}
        onMouseEnter={handlePreviewIntent}
        aria-pressed={isSelected}
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-space-void">
          <img
            src={image.urls.card}
            alt={image.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
          />
          {isSelected && (
            <span className="absolute right-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-space-orange text-space-void shadow-lg shadow-black/30">
              <Check className="h-4 w-4" />
            </span>
          )}
        </div>
      </button>
      <div className="space-y-2 p-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="line-clamp-1 text-sm font-semibold text-white">{image.title}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{image.displayDate ?? "Unknown date"}</p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 rounded-md text-muted-foreground hover:bg-white/5 hover:text-space-orange"
            aria-label={`Save ${image.title}`}
            onClick={handleBookmark}
          >
            <Bookmark className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex max-w-[70%] items-center rounded-md border border-space-cyan/20 bg-space-cyan/10 px-2 py-1 text-[11px] font-medium text-space-cyan">
            <span className="truncate">{image.mission ?? image.center ?? "NASA"}</span>
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 rounded-md px-2 text-[11px] text-muted-foreground hover:bg-white/5 hover:text-space-cyan"
            onClick={handleCompare}
            data-cy="compare-btn"
          >
            <GitCompareArrows className="h-3.5 w-3.5" />
            Compare
          </Button>
        </div>
      </div>
    </article>
  );
}
