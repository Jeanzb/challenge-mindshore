import { createFileRoute } from "@tanstack/react-router";
import { ExportPage } from "@/pages/export";

export const Route = createFileRoute("/export/")({
  component: ExportPage
});
