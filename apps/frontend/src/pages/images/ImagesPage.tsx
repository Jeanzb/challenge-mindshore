import { AppShell, FeaturePlaceholder } from "@/components/app";

export function ImagesPage() {
  return (
    <AppShell>
      <FeaturePlaceholder
        eyebrow="Images"
        title="Image detail workspace"
        description="Image detail will compose metadata, AI enrichment, tag workflows, and collection actions around the selected NASA image."
      />
    </AppShell>
  );
}
