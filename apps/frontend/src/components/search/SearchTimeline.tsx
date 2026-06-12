import { useMemo, type CSSProperties } from "react";
import { EyeOff, Maximize2, Minimize2, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getTimelineYearMarkers, sortImagesByTimelineDate } from "@/lib/searchTimeline";
import { timelineDensityHeights, timelineMaxYearMarkers } from "@/constants";
import { useUiStore, uiSelectors } from "@/store";
import { m } from "@/paraglide/messages";
import type { NasaImage } from "@/types/search";
import type { TimelineDensity } from "@/types/ui";

type SearchTimelineProps = {
  images: readonly NasaImage[];
  dateRangeLabel: string;
};

type TimelineHeightVars = CSSProperties & {
  "--timeline-height": string;
  "--timeline-height-lg": string;
};

const renderYear = (year: string) => (
  <span key={year} className="font-mono text-[10px] leading-none tracking-wider text-muted-foreground">
    {year}
  </span>
);

export function SearchTimeline({ images, dateRangeLabel }: SearchTimelineProps) {
  const timelinePanelState = useUiStore(uiSelectors.timelinePanelState);
  const setTimelinePanelState = useUiStore(uiSelectors.setTimelinePanelStateAction);
  const selectedImageId = useUiStore(uiSelectors.selectedImageId);
  const selectImage = useUiStore(uiSelectors.selectImageAction);
  const timelineImages = useMemo(() => sortImagesByTimelineDate(images), [images]);

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
      <div className="border-t border-white/10 bg-space-shell/95 px-3 py-2 sm:px-4 lg:col-span-3">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 rounded-md text-muted-foreground hover:bg-white/5 hover:text-white"
          onClick={showCompactTimeline}
        >
          <Timer className="h-4 w-4 text-space-orange" />
          {m.timeline_show()}
        </Button>
      </div>
    );
  }

  const expanded = timelinePanelState === "expanded";
  const expandOrCompact = expanded ? showCompactTimeline : showExpandedTimeline;
  const baseDensity: TimelineDensity = expanded ? "comfortable" : "compact";
  const desktopDensity: TimelineDensity = expanded ? "expanded" : "compact";
  const timelineHeightStyle: TimelineHeightVars = {
    "--timeline-height": timelineDensityHeights[baseDensity],
    "--timeline-height-lg": timelineDensityHeights[desktopDensity]
  };
  const yearMarkers = getTimelineYearMarkers(timelineImages, timelineMaxYearMarkers);
  const renderTimelineImage = (image: NasaImage) => (
    <TimelineImageButton
      key={image.nasaImageId}
      image={image}
      selected={selectedImageId === image.nasaImageId}
      onSelect={selectImage}
      expanded={expanded}
    />
  );

  return (
    <section
      className="min-h-0 border-t border-white/10 bg-space-shell/95 transition-[height] duration-300 ease-out lg:col-span-3 h-[var(--timeline-height)] lg:h-[var(--timeline-height-lg)]"
      style={timelineHeightStyle}
      aria-label={m.timeline_label()}
    >
      <div className="flex h-full min-h-0 flex-col px-3 py-2.5 sm:px-4">
        <div className="flex shrink-0 items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <Timer className="h-4 w-4 shrink-0 text-space-orange" />
            <span className="text-xs font-semibold uppercase text-white">{m.timeline_label()}</span>
            <span className="hidden truncate font-mono text-[11px] text-muted-foreground sm:inline">{dateRangeLabel}</span>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-md text-muted-foreground hover:bg-white/5 hover:text-white focus-visible:ring-space-cyan"
              aria-label={expanded ? m.timeline_compact() : m.timeline_expand()}
              onClick={expandOrCompact}
            >
              {expanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-md text-muted-foreground hover:bg-white/5 hover:text-white focus-visible:ring-space-cyan"
              aria-label={m.timeline_hide()}
              onClick={hideTimeline}
            >
              <EyeOff className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {yearMarkers.length > 0 && (
          <div className="mt-1.5 flex shrink-0 justify-between border-b border-white/10 pb-1">
            {yearMarkers.map(renderYear)}
          </div>
        )}
        <div className="cosmara-scrollbar mt-2 min-h-0 flex-1 overflow-x-auto overflow-y-hidden rounded-lg border border-white/10 bg-space-panel/50 p-1.5">
          {timelineImages.length === 0 ? (
            <div className="flex h-full min-w-full items-center justify-center px-4">
              <p className="text-xs text-muted-foreground">{m.timeline_empty()}</p>
            </div>
          ) : (
            <div className="flex h-full min-w-max items-stretch gap-2">{timelineImages.map(renderTimelineImage)}</div>
          )}
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
        "group relative aspect-video h-full w-auto shrink-0 overflow-hidden rounded-lg border bg-space-void transition",
        "hover:border-space-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-space-cyan/80",
        selected
          ? "border-space-orange shadow-[0_0_16px_-2px_rgba(249,160,63,0.55)]"
          : "border-white/10"
      )}
      title={image.displayDate === null || image.displayDate === undefined ? image.title : `${image.title} - ${image.displayDate}`}
      aria-label={m.timeline_select_image({ title: image.title })}
      aria-pressed={selected}
      onClick={handleSelect}
    >
      <img src={image.thumbnailUrl} alt="" loading="lazy" className="h-full w-full object-cover opacity-90 transition-opacity group-hover:opacity-100" />
      {expanded && (
        <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-space-void/95 via-space-void/70 to-transparent px-2 pb-1 pt-4 text-left">
          <span className="block truncate font-mono text-[10px] font-medium leading-tight text-white">{image.displayDate}</span>
          <span className="hidden truncate text-[10px] leading-tight text-muted-foreground lg:block">{image.title}</span>
        </span>
      )}
    </button>
  );
}
