import { AppShell, FeaturePlaceholder } from "@/components/app";

export function ExportPage() {
  return (
    <AppShell>
      <FeaturePlaceholder
        eyebrow="Export"
        title="Collection export"
        description="Export workflows will generate PDF outputs from collections and surface export history returned by the backend."
      />
    </AppShell>
  );
}
