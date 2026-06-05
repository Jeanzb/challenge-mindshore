import { AppShell, FeaturePlaceholder } from "@/components/app";

export function ComparatorPage() {
  return (
    <AppShell>
      <FeaturePlaceholder
        eyebrow="Compare"
        title="AI image comparison"
        description="The comparison page will place selected images side by side and request cached AI comparative analysis from the backend."
      />
    </AppShell>
  );
}
