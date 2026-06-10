import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { CollectionImage } from "@/types/collections";

type CollectionImageTileProps = {
  image: CollectionImage;
  isRemoving: boolean;
  onRemove: (imageId: string) => void;
};

export function CollectionImageTile({ image, isRemoving, onRemove }: CollectionImageTileProps) {
  const handleRemove = () => {
    onRemove(image.id);
  };

  return (
    <Card className="group overflow-hidden rounded-lg border-white/10 bg-space-panel shadow-sm shadow-black/20 transition-[border-color,box-shadow] duration-200 hover:border-space-cyan/35 hover:shadow-lg hover:shadow-black/30">
      <div className="relative aspect-video overflow-hidden bg-space-void">
        <img
          src={image.thumbnailUrl ?? image.imageUrl}
          alt={image.title}
          loading="lazy"
          className="h-full w-full object-cover opacity-90 transition-transform duration-300 group-hover:scale-105 group-hover:opacity-100"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 h-8 w-8 rounded-md bg-space-void/70 text-muted-foreground opacity-0 backdrop-blur transition-opacity hover:bg-space-void/90 hover:text-space-orange focus-visible:opacity-100 group-hover:opacity-100"
          aria-label={`Remove ${image.title} from collection`}
          disabled={isRemoving}
          onClick={handleRemove}
        >
          {isRemoving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
        </Button>
      </div>
      <div className="space-y-1 p-3">
        <h3 className="truncate text-sm font-semibold text-white">{image.title}</h3>
        <p className="font-mono text-[11px] tracking-wide text-muted-foreground">{image.dateCreated?.slice(0, 10) ?? "Unknown date"}</p>
        {image.userNote ? <p className="line-clamp-2 text-xs leading-5 text-muted-foreground">{image.userNote}</p> : null}
      </div>
    </Card>
  );
}
