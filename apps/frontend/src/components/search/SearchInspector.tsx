import { Database, Download, ExternalLink, GitCompareArrows, ImagePlus, Share2, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthSession } from "@/hooks/auth";
import { useAddImageToCollection, useCollectionsList } from "@/hooks/collections";
import { useUiStore, uiSelectors } from "@/store";
import type { CollectionSummary } from "@/types/collections";
import type { NasaImage } from "@/types/search";

type SearchInspectorProps = {
  fallbackImage?: NasaImage;
};

const renderKeyword = (keyword: string) => (
  <span
    key={keyword}
    className="inline-flex items-center gap-1 rounded-full border border-space-cyan/20 bg-space-cyan/10 px-2.5 py-1 text-[11px] font-medium text-space-cyan"
  >
    <span className="h-1 w-1 rounded-full bg-space-orange" />
    {keyword}
  </span>
);

const renderCollectionOption = (collection: CollectionSummary) => (
  <SelectItem
    key={collection.id}
    value={collection.id}
    className="cursor-pointer text-xs text-white focus:bg-space-cyan/15"
  >
    {collection.name}
  </SelectItem>
);

export function SearchInspector({ fallbackImage }: SearchInspectorProps) {
  const selectedImage = useUiStore(uiSelectors.selectedImage) ?? fallbackImage;
  const inspectorOpen = useUiStore(uiSelectors.inspectorOpen);
  const closeInspector = useUiStore(uiSelectors.closeInspectorAction);
  const addCompareImage = useUiStore(uiSelectors.addCompareImageAction);
  const { isAuthenticated } = useAuthSession();
  const { collections } = useCollectionsList({ enabled: isAuthenticated });
  const { addImageToCollection, isAddingImageToCollection } = useAddImageToCollection();
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>("none");
  const [addStatusMessage, setAddStatusMessage] = useState<string | null>(null);
  const addToCollectionDisabled = isAddingImageToCollection || selectedImage === undefined;

  useEffect(() => {
    setAddStatusMessage(null);
  }, [selectedImage?.nasaImageId]);

  if (selectedImage === undefined) {
    return (
      <aside
        className="hidden min-h-0 overflow-hidden border-l border-white/10 bg-space-shell/70 lg:block"
        aria-label="Selected image"
      >
        <div className="flex h-full items-center justify-center px-6 text-center">
          <div>
            <p className="text-xs font-semibold uppercase text-muted-foreground">Selected Image</p>
            <h2 className="mt-2 text-base font-semibold text-white">No image selected</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Adjust the filters or choose a suggested search to load NASA imagery.
            </p>
          </div>
        </div>
      </aside>
    );
  }

  const handleCompare = () => {
    addCompareImage(selectedImage.nasaImageId);
  };

  const handleCollectionChange = (collectionId: string) => {
    setSelectedCollectionId(collectionId);
    setAddStatusMessage(null);
  };

  const handleAddToCollection = async () => {
    if (!isAuthenticated) {
      setAddStatusMessage("Sign in before saving images.");
      return;
    }

    if (selectedCollectionId === "none") {
      setAddStatusMessage("Select a collection first.");
      return;
    }

    const selectedCollection = collections.find((collection) => collection.id === selectedCollectionId);

    try {
      await addImageToCollection({
        collectionId: selectedCollectionId,
        image: selectedImage
      });
      setAddStatusMessage(`Saved to ${selectedCollection?.name ?? "collection"}.`);
    } catch (error) {
      setAddStatusMessage(error instanceof Error ? error.message : "Image could not be saved.");
    }
  };

  if (!inspectorOpen) {
    return (
      <div
        className="hidden min-h-0 overflow-hidden border-l border-white/10 bg-space-shell/70 opacity-0 transition-opacity duration-200 lg:block"
        aria-hidden="true"
      />
    );
  }

  return (
    <aside
      className="hidden min-h-0 overflow-hidden border-l border-white/10 bg-space-shell/80 opacity-100 shadow-[-16px_0_40px_rgba(0,0,0,0.18)] transition-opacity duration-300 lg:block"
      aria-label="Selected image"
    >
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
        <ScrollArea className="min-h-0 flex-1">
          <div className="px-4 pb-4 pr-5">
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
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="rounded-md bg-white/10 hover:bg-white/15"
                onClick={handleCompare}
                data-cy="compare-btn"
              >
                <GitCompareArrows className="h-4 w-4" />
                Compare
              </Button>
              <Button
                type="button"
                size="sm"
                className="rounded-md bg-space-orange text-space-void hover:bg-space-orange/90"
                data-cy="add-to-collection-btn"
                disabled={addToCollectionDisabled}
                onClick={handleAddToCollection}
              >
                <ImagePlus className="h-4 w-4" />
                {isAddingImageToCollection ? "Adding" : "Add"}
              </Button>
            </div>
            <Tabs defaultValue="ai" className="mt-4">
              <TabsList className="grid h-10 w-full grid-cols-3 rounded-md border border-white/10 bg-space-panel p-1">
                <TabsTrigger
                  value="ai"
                  className="gap-1 rounded text-[11px] data-[state=active]:bg-space-cyan data-[state=active]:text-space-void"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  AI Context
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
                <div className="rounded-lg border border-white/10 bg-space-panel/70 p-3">
                  <p className="mb-2 text-xs font-semibold uppercase text-space-orange">Context Summary</p>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {selectedImage.description ??
                      "AI enrichment will generate a concise context summary for this image once requested."}
                  </p>
                </div>
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
              <Select
                value={selectedCollectionId}
                onValueChange={handleCollectionChange}
                disabled={!isAuthenticated || collections.length === 0}
              >
                <SelectTrigger className="cosmara-control h-10 px-3 text-left text-muted-foreground shadow-inner shadow-black/20 [&>svg]:text-muted-foreground [&>svg]:opacity-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  className="z-[80] rounded-md border-white/10 bg-space-panel text-white shadow-2xl shadow-black/50"
                >
                  <SelectItem value="none" className="cursor-pointer text-xs text-muted-foreground focus:bg-space-cyan/15">
                    {isAuthenticated ? "Select collection..." : "Sign in to save"}
                  </SelectItem>
                  {collections.map(renderCollectionOption)}
                </SelectContent>
              </Select>
              {addStatusMessage !== null ? (
                <p className="mt-2 text-xs text-space-orange">{addStatusMessage}</p>
              ) : null}
            </div>
          </div>
        </ScrollArea>
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
