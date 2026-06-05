import {
  Database,
  Download,
  ExternalLink,
  GitCompareArrows,
  ImagePlus,
  PanelRightOpen,
  Share2,
  Sparkles,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUiStore, uiSelectors } from "@/store";
import type { NasaImage } from "@/types/search";

type SearchInspectorProps = {
  fallbackImage?: NasaImage;
};

const renderKeyword = (keyword: string) => (
  <span
    key={keyword}
    className="inline-flex rounded-md border border-white/10 bg-space-panel px-2 py-1 text-[11px] font-medium text-muted-foreground"
  >
    {keyword}
  </span>
);

export function SearchInspector({ fallbackImage }: SearchInspectorProps) {
  const selectedImage = useUiStore(uiSelectors.selectedImage) ?? fallbackImage;
  const inspectorOpen = useUiStore(uiSelectors.inspectorOpen);
  const closeInspector = useUiStore(uiSelectors.closeInspectorAction);
  const openInspector = useUiStore(uiSelectors.openInspectorAction);
  const addCompareImage = useUiStore(uiSelectors.addCompareImageAction);

  if (selectedImage === undefined) {
    return (
      <aside className="hidden min-h-0 border-l border-white/10 bg-space-shell/70 lg:block" aria-label="Selected image">
        <div className="flex h-full items-center justify-center px-6 text-center">
          <div>
            <p className="text-xs font-semibold uppercase text-muted-foreground">Selected Image</p>
            <h2 className="mt-2 text-base font-semibold text-white">No image selected</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Adjust the filters or choose a saved search to load NASA imagery.
            </p>
          </div>
        </div>
      </aside>
    );
  }

  const handleCompare = () => {
    addCompareImage(selectedImage.nasaImageId);
  };

  if (!inspectorOpen) {
    return (
      <aside className="hidden border-l border-white/10 bg-space-shell/70 lg:flex lg:items-start lg:justify-center lg:p-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-md text-muted-foreground hover:bg-white/5 hover:text-white"
          aria-label="Open selected image panel"
          onClick={openInspector}
        >
          <PanelRightOpen className="h-5 w-5" />
        </Button>
      </aside>
    );
  }

  return (
    <aside className="hidden min-h-0 border-l border-white/10 bg-space-shell/70 lg:block" aria-label="Selected image">
      <div className="flex h-full min-h-0 flex-col">
        <div className="flex items-start justify-between gap-4 px-4 py-4">
          <div className="min-w-0">
            <p className="mb-3 text-xs font-semibold uppercase text-muted-foreground">Selected Image</p>
            <h2 className="line-clamp-2 text-base font-semibold text-white">{selectedImage.title}</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {selectedImage.displayDate ?? "Unknown date"} -{" "}
              <span className="font-medium text-space-cyan">{selectedImage.camera ?? selectedImage.mission ?? "NASA"}</span>
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 rounded-md text-muted-foreground hover:bg-white/5 hover:text-white"
            aria-label="Close selected image panel"
            onClick={closeInspector}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
          <div className="overflow-hidden rounded-lg border border-white/10 bg-space-panel">
            <img src={selectedImage.urls.preview} alt={selectedImage.title} className="aspect-[4/3] w-full object-cover" />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Button type="button" variant="secondary" size="sm" className="rounded-md bg-white/10 hover:bg-white/15">
              <Download className="h-4 w-4" />
              Download
            </Button>
            <Button type="button" variant="secondary" size="sm" className="rounded-md bg-white/10 hover:bg-white/15">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button type="button" variant="secondary" size="sm" className="rounded-md bg-white/10 hover:bg-white/15" onClick={handleCompare}>
              <GitCompareArrows className="h-4 w-4" />
              Compare
            </Button>
            <Button type="button" size="sm" className="rounded-md bg-space-orange text-space-void hover:bg-space-orange/90">
              <ImagePlus className="h-4 w-4" />
              Add
            </Button>
          </div>
          <Tabs defaultValue="ai" className="mt-4">
            <TabsList className="grid h-10 w-full grid-cols-3 rounded-md border border-white/10 bg-space-panel p-1">
              <TabsTrigger
                value="ai"
                className="gap-1 rounded text-[11px] data-[state=active]:bg-space-cyan data-[state=active]:text-space-void"
              >
                <Sparkles className="h-3.5 w-3.5" />
                AI
              </TabsTrigger>
              <TabsTrigger
                value="metadata"
                className="gap-1 rounded text-[11px] data-[state=active]:bg-space-cyan data-[state=active]:text-space-void"
              >
                <Database className="h-3.5 w-3.5" />
                Metadata
              </TabsTrigger>
              <TabsTrigger
                value="source"
                className="gap-1 rounded text-[11px] data-[state=active]:bg-space-cyan data-[state=active]:text-space-void"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Source
              </TabsTrigger>
            </TabsList>
            <TabsContent value="ai" className="space-y-4">
              <p className="text-sm leading-6 text-muted-foreground">{selectedImage.description}</p>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Tags</p>
                <div className="flex flex-wrap gap-2">{selectedImage.keywords.slice(0, 6).map(renderKeyword)}</div>
              </div>
            </TabsContent>
            <TabsContent value="metadata" className="space-y-3 text-sm text-muted-foreground">
              <MetadataRow label="Center" value={selectedImage.center ?? "NASA"} />
              <MetadataRow label="Mission" value={selectedImage.mission ?? "Unspecified"} />
              <MetadataRow label="Camera" value={selectedImage.camera ?? "Unspecified"} />
              <MetadataRow label="Media Type" value={selectedImage.mediaType} />
            </TabsContent>
            <TabsContent value="source" className="space-y-3">
              <p className="text-sm leading-6 text-muted-foreground">
                Open the original asset page to review full NASA attribution and media files.
              </p>
              {selectedImage.sourceUrl && (
                <Button asChild variant="secondary" size="sm" className="rounded-md bg-white/10 hover:bg-white/15">
                  <a href={selectedImage.sourceUrl} target="_blank" rel="noreferrer">
                    <ExternalLink className="h-4 w-4" />
                    View NASA Source
                  </a>
                </Button>
              )}
            </TabsContent>
          </Tabs>
          <Separator className="my-4 bg-white/10" />
          <div>
            <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Add to Collection</p>
            <select className="h-10 w-full rounded-md border-white/10 bg-space-panel text-sm text-muted-foreground focus:border-space-cyan focus:ring-space-cyan">
              <option>Select collection...</option>
            </select>
          </div>
        </div>
      </div>
    </aside>
  );
}

type MetadataRowProps = {
  label: string;
  value: string;
};

function MetadataRow({ label, value }: MetadataRowProps) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-white/10 bg-space-panel px-3 py-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="truncate text-right font-medium text-white">{value}</span>
    </div>
  );
}
