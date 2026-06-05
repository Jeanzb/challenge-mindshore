import { AppShell, FeaturePlaceholder } from "@/components/app";

export function SearchPage() {
  return (
    <AppShell>
      <FeaturePlaceholder
        eyebrow="Explore"
        title="NASA image search"
        description="The dashboard will render normalized NASA image results with filters, skeleton loading, smart prefetching, and an image inspector."
      />
    </AppShell>
  );
}
