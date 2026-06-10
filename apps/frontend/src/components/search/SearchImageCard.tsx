import { Check } from "lucide-react";
import type { MouseEvent } from "react";
import { SaveToCollectionMenu } from "@/components/search/SaveToCollectionMenu";
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
  const multiSelectActive = useUiStore(uiSelectors.multiSelectActive);
  const isMultiSelected = useUiStore(uiSelectors.isImageMultiSelected(image.nasaImageId));
  const toggleMultiSelectImage = useUiStore(uiSelectors.toggleMultiSelectImageAction);
  const isSelected = selectedImageId === image.nasaImageId;

  const handleSelect = () => {
    selectImage(image);
  };

  const handleToggleMultiSelect = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    toggleMultiSelectImage(image.nasaImageId);
  };

  const handlePreviewIntent = () => {
    onPreviewIntent(image);
  };

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-lg border bg-space-panel text-left shadow-sm shadow-black/20 transition duration-200 hover:-translate-y-0.5 hover:border-space-cyan/40 hover:bg-space-panelStrong",
        isSelected
          ? "border-space-orange ring-1 ring-space-orange/30 shadow-lg shadow-black/30"
          : "border-white/10",
        isMultiSelected && "border-space-orange/70"
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
        </div>
      </button>
      <button
        type="button"
        className={cn(
          "absolute right-3 top-3 z-10 inline-flex h-7 w-7 items-center justify-center rounded-full border shadow-lg shadow-black/30 transition-all duration-150 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-space-cyan/80",
          isMultiSelected
            ? "border-space-orange bg-space-orange text-space-void opacity-100"
            : multiSelectActive
              ? "border-white/40 bg-space-void/60 text-white/80 opacity-100 backdrop-blur hover:border-space-orange hover:text-space-orange"
              : "border-white/40 bg-space-void/60 text-white/80 opacity-0 backdrop-blur hover:border-space-orange hover:text-space-orange group-hover:opacity-100"
        )}
        aria-label={isMultiSelected ? `Deselect ${image.title}` : `Select ${image.title} for batch actions`}
        aria-pressed={isMultiSelected}
        data-cy="multi-select-toggle"
        onClick={handleToggleMultiSelect}
      >
        <Check className="h-4 w-4" />
      </button>
      <div className="space-y-2 p-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="line-clamp-1 text-sm font-semibold text-white">{image.title}</h3>
            <p className="mt-1 font-mono text-[11px] tracking-wide text-muted-foreground">{image.displayDate ?? "Unknown date"}</p>
          </div>
          <SaveToCollectionMenu image={image} />
        </div>
        <div className="flex items-center">
          <span className="inline-flex max-w-full items-center rounded-md border border-space-cyan/20 bg-space-cyan/10 px-2 py-1 text-[11px] font-medium text-space-cyan">
            <span className="truncate">{image.mission ?? image.center ?? "NASA"}</span>
          </span>
        </div>
      </div>
    </article>
  );
}
