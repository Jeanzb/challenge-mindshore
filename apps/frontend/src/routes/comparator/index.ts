import { createFileRoute } from "@tanstack/react-router";
import { ComparatorPage } from "@/pages/comparator";

export const Route = createFileRoute("/comparator/")({
  component: ComparatorPage
});
