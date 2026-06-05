import { AppShell, FeaturePlaceholder } from "@/components/app";

export function TimelinePage() {
  return (
    <AppShell>
      <FeaturePlaceholder
        eyebrow="Timeline"
        title="Navigable image timeline"
        description="Timeline navigation will use normalized backend dates and client-side prefetching to move quickly through loaded results."
      />
    </AppShell>
  );
}
