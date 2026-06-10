import { Link } from "@tanstack/react-router";
import { ArrowRight, Clock3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { CollectionVisual } from "@/constants";
import { formatCollectionCount, formatCollectionDate } from "@/lib/collectionMetrics";
import { selectNasaImageCardUrl } from "@/lib/nasaImageAssets";
import type { CollectionSummary } from "@/types/collections";

type CollectionCardProps = {
  collection: CollectionSummary;
  visual: CollectionVisual;
};

export function CollectionCard({ collection, visual }: CollectionCardProps) {
  const [heroImage, secondaryImage, tertiaryImage] = visual.previewImages;

  return (
    <Card
      data-cy="collection-card"
      role="article"
      className="group overflow-hidden rounded-lg border-white/10 bg-space-panel shadow-sm shadow-black/20 transition-[border-color,transform,box-shadow] duration-200 hover:-translate-y-1 hover:border-space-cyan/35 hover:shadow-xl hover:shadow-black/30"
    >
      <div className="relative grid aspect-[16/8] grid-cols-[2fr_1fr] overflow-hidden border-b border-white/10 bg-space-void">
        <div className={`absolute inset-0 bg-gradient-to-br ${visual.accentClassName}`} />
        <img
          src={selectNasaImageCardUrl(heroImage)}
          alt=""
          loading="lazy"
          className="relative h-full w-full object-cover opacity-90 transition-transform duration-300 group-hover:scale-105"
        />
        <div className="relative grid grid-rows-2 border-l border-white/10">
          <img src={selectNasaImageCardUrl(secondaryImage)} alt="" loading="lazy" className="h-full w-full object-cover" />
          <img src={selectNasaImageCardUrl(tertiaryImage)} alt="" loading="lazy" className="h-full w-full object-cover border-t border-white/10" />
        </div>
        <span className="absolute left-3 top-3 rounded-full bg-space-void/75 px-2.5 py-1 text-xs font-semibold text-white shadow-sm shadow-black/30 backdrop-blur">
          {formatCollectionCount(collection.imageCount, "image", "images")}
        </span>
      </div>
      <div className="space-y-4 p-4">
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-base font-semibold text-white">{collection.name}</h2>
            <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-muted-foreground">
              {collection.description || "A curated set of NASA imagery ready for exploration."}
            </p>
          </div>
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 rounded-full text-muted-foreground hover:bg-white/5 hover:text-white"
          >
            <Link
              to="/collections/$collectionId"
              params={{ collectionId: collection.id }}
              aria-label={`Open ${collection.name}`}
            >
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock3 className="h-3.5 w-3.5" />
          <span>Updated {formatCollectionDate(collection.updatedAt)}</span>
        </div>
      </div>
    </Card>
  );
}
