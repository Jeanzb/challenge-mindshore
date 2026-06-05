import { createFileRoute } from "@tanstack/react-router";
import { SearchPage } from "@/pages/search";

export const Route = createFileRoute("/search/")({
  component: SearchPage
});
