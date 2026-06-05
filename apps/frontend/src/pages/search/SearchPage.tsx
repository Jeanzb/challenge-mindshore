import { AppShell } from "@/components/app";
import { SearchDashboard } from "@/components/search";

type SearchPageProps = {
  initialQuery?: string;
};

export function SearchPage({ initialQuery }: SearchPageProps) {
  return (
    <AppShell contentClassName="overflow-hidden">
      <SearchDashboard initialQuery={initialQuery} />
    </AppShell>
  );
}
