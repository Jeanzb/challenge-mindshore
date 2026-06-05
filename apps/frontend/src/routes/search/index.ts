import { createFileRoute } from "@tanstack/react-router";
import { createElement } from "react";
import { SearchPage } from "@/pages/search";

type SearchRouteSearch = {
  q?: string;
};

const validateSearch = (search: Record<string, unknown>): SearchRouteSearch => ({
  q: typeof search.q === "string" && search.q.trim().length > 0 ? search.q : undefined
});

export const Route = createFileRoute("/search/")({
  validateSearch,
  component: SearchRoute
});

function SearchRoute() {
  const search = Route.useSearch();

  return createElement(SearchPage, { initialQuery: search.q });
}
