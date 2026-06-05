import { AppShell } from "@/components/app";
import { SearchDashboard } from "@/components/search";

export function SearchPage() {
  return (
    <AppShell contentClassName="overflow-hidden">
      <SearchDashboard />
    </AppShell>
  );
}
