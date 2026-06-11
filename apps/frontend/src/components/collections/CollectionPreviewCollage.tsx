import { ImageOff } from "lucide-react";

type CollectionPreviewCollageProps = {
  accentClassName: string;
  previewImageUrls: readonly string[];
};

type CollectionPreviewSlotProps = {
  imageUrl?: string;
  className?: string;
};

export function CollectionPreviewCollage({ accentClassName, previewImageUrls }: CollectionPreviewCollageProps) {
  return (
    <div className="relative grid aspect-[16/8] grid-cols-[2fr_1fr] overflow-hidden border-b border-white/10 bg-space-void">
      <div className={`absolute inset-0 bg-gradient-to-br ${accentClassName}`} />
      <CollectionPreviewSlot imageUrl={previewImageUrls[0]} className="group-hover:scale-105" />
      <div className="relative grid grid-rows-2 border-l border-white/10">
        <CollectionPreviewSlot imageUrl={previewImageUrls[1]} />
        <CollectionPreviewSlot imageUrl={previewImageUrls[2]} className="border-t border-white/10" />
      </div>
    </div>
  );
}

function CollectionPreviewSlot({ imageUrl, className }: CollectionPreviewSlotProps) {
  if (imageUrl === undefined || imageUrl.trim().length === 0) {
    return (
      <div
        data-cy="collection-preview-empty-slot"
        className={`relative flex h-full w-full items-center justify-center bg-space-panel/45 ${className ?? ""}`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_25%,rgba(54,201,221,0.16),transparent_42%),linear-gradient(135deg,rgba(255,255,255,0.04),transparent)]" />
        <ImageOff className="relative h-5 w-5 text-muted-foreground/60" />
      </div>
    );
  }

  return (
    <img
      data-cy="collection-preview-image"
      src={imageUrl}
      alt=""
      loading="lazy"
      className={`relative h-full w-full object-cover opacity-90 transition-transform duration-300 ${className ?? ""}`}
    />
  );
}
