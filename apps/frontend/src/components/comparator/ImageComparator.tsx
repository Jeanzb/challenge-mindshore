import { Link } from "@tanstack/react-router";
import { AlertCircle, GitCompareArrows, Images, Loader2, Sparkles, WandSparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useImageComparison } from "@/hooks/ai";
import { useAuthSession } from "@/hooks/auth";
import { useCollectionDetail, useCollectionsList } from "@/hooks/collections";
import { ComparatorAuthPrompt } from "@/components/comparator/ComparatorAuthPrompt";
import { ComparatorImageCard } from "@/components/comparator/ComparatorImageCard";
import { ComparatorSkeleton } from "@/components/comparator/ComparatorSkeleton";
import type { CollectionImage, CollectionSummary } from "@/types/collections";

const maximumComparedImages = 4;

const buildComparisonTitle = (images: readonly CollectionImage[]): string =>
  images
    .slice(0, 2)
    .map((image) => image.title)
    .join(" vs ")
    .slice(0, 160);

const getDefaultCollectionId = (collections: readonly CollectionSummary[]): string =>
  collections.find((collection) => collection.imageCount > 0)?.id ?? collections[0]?.id ?? "";

const getImageLabel = (index: number): string => `Image ${String.fromCharCode(65 + index)}`;

const areStringArraysEqual = (first: readonly string[], second: readonly string[]): boolean =>
  first.length === second.length && first.every((value, index) => value === second[index]);

export function ImageComparator() {
  const { isAuthenticated } = useAuthSession();
  const { collections, isLoading: collectionsLoading } = useCollectionsList({ enabled: isAuthenticated });
  const defaultCollectionId = useMemo(() => getDefaultCollectionId(collections), [collections]);
  const [activeCollectionId, setActiveCollectionId] = useState<string>("");
  const [selectedImageIds, setSelectedImageIds] = useState<string[]>([]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const { collection, images, isLoading: collectionLoading } = useCollectionDetail({
    collectionId: activeCollectionId,
    enabled: isAuthenticated && activeCollectionId.length > 0
  });
  const { compareImages, comparison, error, isComparing } = useImageComparison();

  useEffect(() => {
    if (activeCollectionId.length === 0 && defaultCollectionId.length > 0) {
      setActiveCollectionId(defaultCollectionId);
    }
  }, [activeCollectionId, defaultCollectionId]);

  useEffect(() => {
    setSelectedImageIds([]);
    setStatusMessage(null);
  }, [activeCollectionId]);

  useEffect(() => {
    setSelectedImageIds((current) => {
      const availableIds = new Set(images.map((image) => image.id));
      const validSelection = current.filter((imageId) => availableIds.has(imageId)).slice(0, maximumComparedImages);
      const minimumSelection = Math.min(2, images.length);

      if (validSelection.length >= minimumSelection) {
        return areStringArraysEqual(current, validSelection) ? current : validSelection;
      }

      const nextSelection = [...validSelection];
      for (const image of images) {
        if (nextSelection.length >= minimumSelection) {
          break;
        }

        if (!nextSelection.includes(image.id)) {
          nextSelection.push(image.id);
        }
      }

      return areStringArraysEqual(current, nextSelection) ? current : nextSelection;
    });
  }, [images]);

  const selectedImages = useMemo(
    () => selectedImageIds
      .map((imageId) => images.find((image) => image.id === imageId))
      .filter((image): image is CollectionImage => image !== undefined),
    [images, selectedImageIds]
  );
  const canCompare = selectedImages.length >= 2 && !isComparing;
  const comparisonTitle = buildComparisonTitle(selectedImages);

  const handleCollectionChange = (collectionId: string) => {
    setActiveCollectionId(collectionId);
  };

  const toggleImageSelection = (imageId: string) => {
    setStatusMessage(null);
    setSelectedImageIds((current) => {
      if (current.includes(imageId)) {
        return current.filter((selectedImageId) => selectedImageId !== imageId);
      }

      return current.length >= maximumComparedImages ? current : [...current, imageId];
    });
  };

  const handleCompare = async () => {
    if (selectedImages.length < 2) {
      setStatusMessage("Select at least two saved images.");
      return;
    }

    setStatusMessage(null);
    await compareImages({
      imageIds: selectedImageIds,
      title: comparisonTitle
    });
  };

  if (!isAuthenticated) {
    return (
      <section className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-5 py-12">
        <ComparatorAuthPrompt />
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 lg:py-10">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal text-white sm:text-3xl">Compare Images</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Select two or more saved images and generate an AI comparative analysis across missions, visual details, and context.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Select value={activeCollectionId} onValueChange={handleCollectionChange} disabled={collections.length === 0}>
            <SelectTrigger className="cosmara-control h-10 min-w-64 px-3 text-left text-white shadow-inner shadow-black/20 [&>svg]:text-muted-foreground [&>svg]:opacity-100">
              <SelectValue placeholder="Select collection" />
            </SelectTrigger>
            <SelectContent
              position="popper"
              className="z-[80] rounded-md border-white/10 bg-space-panel text-white shadow-2xl shadow-black/50"
            >
              {collections.map((item) => (
                <SelectItem key={item.id} value={item.id} className="cursor-pointer text-xs focus:bg-space-cyan/15">
                  {item.name} - {item.imageCount} images
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            type="button"
            disabled={!canCompare}
            onClick={handleCompare}
            className="h-10 rounded-full bg-space-orange px-5 text-space-void hover:bg-space-orange/90 disabled:opacity-50"
          >
            {isComparing ? <Loader2 className="h-4 w-4 animate-spin" /> : <WandSparkles className="h-4 w-4" />}
            {isComparing ? "Analyzing" : "Run comparison"}
          </Button>
        </div>
      </div>

      <div className="mt-8">
        {collectionsLoading || collectionLoading ? <ComparatorSkeleton /> : null}
        {!collectionsLoading && collections.length === 0 ? <EmptyCollectionsState /> : null}
        {!collectionLoading && collection !== undefined && images.length < 2 ? <NotEnoughImagesState /> : null}
        {!collectionLoading && images.length >= 2 ? (
          <div className="space-y-6">
            <div className="grid gap-4 lg:grid-cols-2">
              {selectedImages.map((image, index) => (
                <ComparatorImageCard key={image.id} image={image} label={getImageLabel(index)} />
              ))}
              {selectedImages.length < 2 ? <AddImageSlot /> : null}
            </div>

            <Card className="rounded-lg border-white/10 bg-space-panel p-4 shadow-xl shadow-black/25">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase text-space-cyan">Saved Image Pool</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {collection?.name ?? "Collection"} - {selectedImages.length} selected
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">Up to {maximumComparedImages} images</p>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {images.map((image) => (
                  <ComparatorImageCard
                    key={image.id}
                    image={image}
                    label={selectedImageIds.includes(image.id) ? "Selected" : "Available"}
                    isSelected={selectedImageIds.includes(image.id)}
                    onToggle={toggleImageSelection}
                  />
                ))}
              </div>
            </Card>

            <ComparisonPanel
              analysis={comparison?.analysis}
              errorMessage={error instanceof Error ? error.message : statusMessage}
              isComparing={isComparing}
              title={comparison?.title ?? comparisonTitle}
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}

function EmptyCollectionsState() {
  return (
    <Card className="flex min-h-72 flex-col items-center justify-center rounded-lg border border-dashed border-white/15 bg-space-void/25 p-8 text-center shadow-none">
      <Images className="h-10 w-10 text-space-cyan" />
      <h2 className="mt-5 text-lg font-semibold text-white">No saved collections yet</h2>
      <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
        Save NASA imagery into a collection before asking AI to compare it.
      </p>
      <Button asChild className="mt-6 h-10 rounded-full bg-space-orange px-5 text-space-void hover:bg-space-orange/90">
        <Link to="/search">Explore NASA imagery</Link>
      </Button>
    </Card>
  );
}

function NotEnoughImagesState() {
  return (
    <Card className="flex min-h-72 flex-col items-center justify-center rounded-lg border border-dashed border-white/15 bg-space-void/25 p-8 text-center shadow-none">
      <GitCompareArrows className="h-10 w-10 text-space-cyan" />
      <h2 className="mt-5 text-lg font-semibold text-white">Add at least two images</h2>
      <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
        This collection needs two saved images before a comparative analysis can run.
      </p>
      <Button asChild variant="secondary" className="mt-6 h-10 rounded-full bg-white/10 px-5 hover:bg-white/15">
        <Link to="/search">Find more images</Link>
      </Button>
    </Card>
  );
}

function AddImageSlot() {
  return (
    <Card className="flex min-h-80 flex-col items-center justify-center rounded-lg border border-dashed border-white/15 bg-space-void/25 p-8 text-center shadow-none">
      <Sparkles className="h-8 w-8 text-space-cyan" />
      <p className="mt-4 text-sm font-medium text-white">Select another saved image</p>
    </Card>
  );
}

type ComparisonPanelProps = {
  analysis?: string;
  errorMessage?: string | null;
  isComparing: boolean;
  title: string;
};

function ComparisonPanel({ analysis, errorMessage, isComparing, title }: ComparisonPanelProps) {
  return (
    <Card className="rounded-lg border-white/10 bg-space-panel p-5 shadow-xl shadow-black/25">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-space-orange/15 text-space-orange">
          <Sparkles className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-lg font-semibold text-white">AI Comparative Analysis</h2>
          <p className="mt-1 text-sm text-muted-foreground">{title.length > 0 ? title : "Selected NASA images"}</p>
        </div>
      </div>
      <Separator className="my-5 bg-white/10" />
      {isComparing ? (
        <div className="flex items-center gap-3 rounded-lg border border-space-cyan/20 bg-space-cyan/10 px-4 py-3 text-sm text-space-cyan">
          <Loader2 className="h-4 w-4 animate-spin" />
          Generating comparative context...
        </div>
      ) : null}
      {!isComparing && errorMessage !== null && errorMessage !== undefined ? (
        <div className="flex items-start gap-3 rounded-lg border border-space-orange/25 bg-space-orange/10 px-4 py-3 text-sm text-space-orange">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {errorMessage}
        </div>
      ) : null}
      {!isComparing && analysis !== undefined ? (
        <p className="whitespace-pre-line text-sm leading-7 text-muted-foreground">{analysis}</p>
      ) : null}
      {!isComparing && analysis === undefined && (errorMessage === null || errorMessage === undefined) ? (
        <p className="text-sm leading-7 text-muted-foreground">
          The generated analysis will appear here after comparing two or more saved images.
        </p>
      ) : null}
    </Card>
  );
}
