import { createFileRoute } from "@tanstack/react-router";
import { ImagesPage } from "@/pages/images";

export const Route = createFileRoute("/images/")({
  component: ImagesPage
});
