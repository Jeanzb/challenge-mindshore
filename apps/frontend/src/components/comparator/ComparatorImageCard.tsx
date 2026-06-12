import { CalendarDays, Check, CirclePlus, Tags } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatCollectionDate } from "@/lib/collectionMetrics";
import { cn } from "@/lib/utils";
import { m } from "@/paraglide/messages";
import type { CollectionImage } from "@/types/collections";

type ComparatorImageCardProps = {
  image: CollectionImage;
  label: string;
  isSelected?: boolean;
  onToggle?: (imageId: string) => void;
};

export function ComparatorImageCard({ image, isSelected = true, label, onToggle }: ComparatorImageCardProps) {
  const imageDate = image.dateCreated === null || image.dateCreated === undefined
    ? m.compare_unknown_date()
    : formatCollectionDate(image.dateCreated);
  const visibleTags = image.tags.slice(0, 3);

  const handleToggle = () => {
    onToggle?.(image.id);
  };

  return (
    <Card
      className={cn(
        "overflow-hidden rounded-lg border-white/10 bg-space-panel text-white shadow-xl shadow-black/25",
        isSelected ? "ring-1 ring-space-orange/70" : "hover:border-space-cyan/40"
      )}
    >
      <div className="relative aspect-[16/11] overflow-hidden bg-space-void">
        <img src={image.imageUrl} alt={image.title} className="h-full w-full object-cover" />
        <span className="absolute left-3 top-3 rounded-md border border-white/10 bg-space-void/80 px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-space-cyan backdrop-blur">
          {label}
        </span>
        {onToggle !== undefined ? (
          <Button
            type="button"
            size="icon"
            aria-label={
              isSelected ? m.compare_remove_image({ title: image.title }) : m.compare_select_image({ title: image.title })
            }
            onClick={handleToggle}
            className={cn(
              "absolute right-3 top-3 h-8 w-8 rounded-full",
              isSelected
                ? "bg-space-orange text-space-void hover:bg-space-orange/90"
                : "bg-space-void/80 text-white hover:bg-space-cyan hover:text-space-void"
            )}
          >
            {isSelected ? <Check className="h-4 w-4" /> : <CirclePlus className="h-4 w-4" />}
          </Button>
        ) : null}
      </div>
      <div className="space-y-3 p-4">
        <div>
          <h3 className="line-clamp-2 text-base font-semibold leading-6">{image.title}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {image.description ?? m.compare_default_image_description()}
          </p>
        </div>
        <div className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
          <span className="inline-flex items-center gap-2 font-mono tracking-wide">
            <CalendarDays className="h-3.5 w-3.5 text-space-cyan" />
            {imageDate}
          </span>
          <span className="inline-flex items-center gap-2">
            <Tags className="h-3.5 w-3.5 text-space-cyan" />
            {visibleTags.length > 0 ? m.compare_tags_count({ count: visibleTags.length }) : "NASA"}
          </span>
        </div>
        {visibleTags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {visibleTags.map((tag) => (
              <span
                key={tag.id}
                className="rounded-full border border-space-cyan/20 bg-space-cyan/10 px-2 py-1 text-[11px] text-space-cyan"
              >
                {tag.name}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </Card>
  );
}
