import { ChevronDown, EyeOff, Maximize2, Minimize2, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useUiStore, uiSelectors } from "@/store";
import type { NasaImage } from "@/types/search";

type SearchTimelineProps = {
  images: readonly NasaImage[];
};

const timelineYears = ["1990", "2000", "2005", "2011", "2012", "2017", "2022", "2024"];

const renderYear = (year: string) => (
  <span key={year} className="text-[11px] text-muted-foreground">
    {year}
  </span>
);

export function SearchTimeline({ images }: SearchTimelineProps) {
  const timelinePanelState = useUiStore(uiSelectors.timelinePanelState);
  const setTimelinePanelState = useUiStore(uiSelectors.setTimelinePanelStateAction);
  const selectedImageId = useUiStore(uiSelectors.selectedImageId);
  const selectImage = useUiStore(uiSelectors.selectImageAction);

  const hideTimeline = () => {
    setTimelinePanelState("hidden");
  };

  const showCompactTimeline = () => {
    setTimelinePanelState("compact");
  };

  const showExpandedTimeline = () => {
    setTimelinePanelState("expanded");
  };

  if (timelinePanelState === "hidden") {
    return (
      <div className="hidden border-t border-white/10 bg-space-shell/95 px-4 py-2 lg:col-span-3 lg:block">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 rounded-md text-muted-foreground hover:bg-white/5 hover:text-white"
          onClick={showCompactTimeline}
        >
          <Timer className="h-4 w-4 text-space-orange" />
          Show timeline
        </Button>
      </div>
    );
  }

  const expandOrCompact = timelinePanelState === "expanded" ? showCompactTimeline : showExpandedTimeline;
  const expanded = timelinePanelState === "expanded";

  return (
    <section
      className={cn(
        "hidden min-h-0 border-t border-white/10 bg-space-shell/95 lg:col-span-3 lg:block",
        expanded ? "h-56" : "h-28"
      )}
      aria-label="Timeline"
    >
      <div className="flex h-full min-h-0 flex-col px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <Timer className="h-4 w-4 shrink-0 text-space-orange" />
            <span className="text-xs font-semibold uppercase text-white">Timeline</span>
            <span className="truncate text-xs text-muted-foreground">2015-01-01 -&gt; 2024-12-31</span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-md text-muted-foreground hover:bg-white/5 hover:text-white"
              aria-label={expanded ? "Compact timeline" : "Expand timeline"}
              onClick={expandOrCompact}
            >
              {expanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-md text-muted-foreground hover:bg-white/5 hover:text-white"
              aria-label="Hide timeline"
              onClick={hideTimeline}
            >
              <EyeOff className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="mt-3 flex justify-between border-b border-white/10 pb-1">{timelineYears.map(renderYear)}</div>
        <div
          className={cn(
            "mt-2 min-h-0 overflow-x-auto rounded-lg border border-space-orange/50 bg-space-panel/50 p-2",
            expanded ? "flex-1" : "h-12"
          )}
        >
          <div className={cn("flex min-w-max items-center gap-2", expanded ? "h-full" : "h-8")}>
            {images.map((image) => (
              <TimelineImageButton
                key={image.nasaImageId}
                image={image}
                selected={selectedImageId === image.nasaImageId}
                onSelect={selectImage}
                expanded={expanded}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

type TimelineImageButtonProps = {
  image: NasaImage;
  selected: boolean;
  expanded: boolean;
  onSelect: (image: NasaImage) => void;
};

function TimelineImageButton({ image, selected, expanded, onSelect }: TimelineImageButtonProps) {
  const handleSelect = () => {
    onSelect(image);
  };

  return (
    <button
      type="button"
      className={cn(
        "group relative shrink-0 overflow-hidden rounded-md border bg-space-void transition-colors hover:border-space-cyan",
        expanded ? "h-full w-28" : "h-8 w-8",
        selected ? "border-space-orange" : "border-white/10"
      )}
      aria-label={`Select ${image.title}`}
      aria-pressed={selected}
      onClick={handleSelect}
    >
      <img src={image.thumbnailUrl} alt="" loading="lazy" className="h-full w-full object-cover opacity-90 group-hover:opacity-100" />
      {expanded && (
        <span className="absolute inset-x-0 bottom-0 bg-space-void/80 px-2 py-1 text-left text-[10px] font-medium text-white">
          <span className="line-clamp-1">{image.displayDate}</span>
        </span>
      )}
      {selected && <ChevronDown className="absolute right-1 top-1 h-3.5 w-3.5 text-space-orange" />}
    </button>
  );
}
