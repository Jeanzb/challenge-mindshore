import { useParams } from "@tanstack/react-router";
import { AppShell } from "@/components/app";
import { CollectionDetail } from "@/components/collections";

export function CollectionDetailPage() {
  const { collectionId } = useParams({ from: "/collections/$collectionId" });

  return (
    <AppShell>
      <CollectionDetail collectionId={collectionId} />
    </AppShell>
  );
}
