import { Link } from "@tanstack/react-router";
import { Clock3, MoreHorizontal, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import type { CollectionVisual } from "@/constants";
import { formatCollectionCount, formatCollectionDate } from "@/lib/collectionMetrics";
import { CollectionPreviewCollage } from "@/components/collections/CollectionPreviewCollage";
import type { CollectionSummary } from "@/types/collections";
import { m } from "@/paraglide/messages";

type CollectionCardProps = {
  collection: CollectionSummary;
  visual: CollectionVisual;
  onDeleteCollection: (collection: CollectionSummary) => void;
};

export function CollectionCard({ collection, visual, onDeleteCollection }: CollectionCardProps) {
  const handleDeleteClick = (): void => {
    onDeleteCollection(collection);
  };

  return (
    <Card
      data-cy="collection-card"
      role="article"
      className="group relative overflow-hidden rounded-lg border-white/10 bg-space-panel shadow-sm shadow-black/20 transition-[border-color,transform,box-shadow] duration-200 hover:-translate-y-1 hover:border-space-cyan/35 hover:shadow-xl hover:shadow-black/30"
    >
      <Link
        to="/collections/$collectionId"
        params={{ collectionId: collection.id }}
        className="absolute inset-0 z-10 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-space-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-space-void"
        aria-label={m.collections_card_open({ name: collection.name })}
      />
      <div className="relative">
        <CollectionPreviewCollage
          accentClassName={visual.accentClassName}
          previewImageUrls={collection.previewImageUrls}
        />
        <span className="absolute left-3 top-3 rounded-full bg-space-void/75 px-2.5 py-1 text-xs font-semibold text-white shadow-sm shadow-black/30 backdrop-blur">
          {formatCollectionCount(collection.imageCount, m.common_image(), m.common_images())}
        </span>
      </div>
      <div className="space-y-4 p-4">
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-base font-semibold text-white">{collection.name}</h2>
            <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-muted-foreground">
              {collection.description || m.collections_card_default_description()}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="relative z-20 h-8 w-8 shrink-0 rounded-full text-muted-foreground hover:bg-white/5 hover:text-white"
                aria-label={m.collections_card_actions({ name: collection.name })}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="min-w-44 border-white/10 bg-space-panel text-foreground shadow-xl shadow-black/30"
            >
              <DropdownMenuItem
                onClick={handleDeleteClick}
                className="cursor-pointer text-space-orange focus:bg-space-orange/10 focus:text-space-orange"
              >
                <Trash2 className="h-4 w-4" />
                {m.collections_delete_action()}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock3 className="h-3.5 w-3.5" />
          <span>{m.common_updated({ date: formatCollectionDate(collection.updatedAt) })}</span>
        </div>
      </div>
    </Card>
  );
}
