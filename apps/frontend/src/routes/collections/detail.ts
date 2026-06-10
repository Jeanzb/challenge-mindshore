import { createFileRoute } from "@tanstack/react-router";
import { CollectionDetailPage } from "@/pages/collections";

export const Route = createFileRoute("/collections/$collectionId")({
  component: CollectionDetailPage
});
