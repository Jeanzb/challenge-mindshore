import { Bookmark, CalendarDays, Info, SlidersHorizontal } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

const savedSearches = ["Mars Curiosity - 2024", "James Webb Nebulae", "Lunar Surface Studies", "Earth at Night"];

const renderSavedSearch = (savedSearch: string) => (
  <li key={savedSearch}>
    <button
      type="button"
      className="flex w-full items-center gap-2 rounded-md px-1 py-1.5 text-left text-xs text-muted-foreground transition-colors hover:bg-white/5 hover:text-white"
    >
      <Bookmark className="h-3.5 w-3.5 shrink-0" />
      <span className="truncate">{savedSearch}</span>
    </button>
  </li>
);

export function SearchFiltersPanel() {
  return (
    <aside className="hidden min-h-0 border-r border-white/10 bg-space-shell/70 lg:block" aria-label="Search filters">
      <div className="flex h-full min-h-0 flex-col">
        <div className="flex items-center justify-between border-b border-white/10 px-3 py-4">
          <p className="text-xs font-semibold uppercase text-white">Filters</p>
          <button type="button" className="text-xs font-medium text-space-cyan hover:text-white">
            Clear all
          </button>
        </div>
        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-3 py-4">
          <FilterGroup label="Date Range" hasInfo>
            <select className="h-10 w-full rounded-md border-white/10 bg-space-panel text-sm text-white focus:border-space-cyan focus:ring-space-cyan">
              <option>Custom Range</option>
              <option>Last 30 days</option>
              <option>Last year</option>
            </select>
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
              <DateInput value="2015-01-01" />
              <span className="text-muted-foreground">-&gt;</span>
              <DateInput value="2024-12-31" />
            </div>
          </FilterGroup>
          <FilterGroup label="Mission" hasInfo>
            <FilterSelect value="All Missions" />
          </FilterGroup>
          <FilterGroup label="Rover / Spacecraft" hasInfo>
            <FilterSelect value="All Rovers / Spacecraft" />
          </FilterGroup>
          <FilterGroup label="Camera" hasInfo>
            <FilterSelect value="All Cameras" />
          </FilterGroup>
          <FilterGroup label="Media Type" hasInfo>
            <FilterSelect value="Images" />
          </FilterGroup>
          <div className="border-t border-white/10 pt-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase text-white">Saved Searches</p>
              <button type="button" className="text-xs font-medium text-space-cyan hover:text-white">
                Manage
              </button>
            </div>
            <ul className="space-y-1">{savedSearches.map(renderSavedSearch)}</ul>
          </div>
        </div>
        <div className="border-t border-white/10 p-3">
          <Button type="button" className="h-10 w-full rounded-md bg-space-cyan text-space-void hover:bg-space-cyan/90">
            <SlidersHorizontal className="h-4 w-4" />
            Apply Filters
          </Button>
        </div>
      </div>
    </aside>
  );
}

type FilterGroupProps = {
  label: string;
  hasInfo?: boolean;
  children: ReactNode;
};

function FilterGroup({ label, hasInfo = false, children }: FilterGroupProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold uppercase text-white">{label}</span>
        {hasInfo && <Info className="h-3.5 w-3.5 text-muted-foreground" />}
      </div>
      {children}
    </div>
  );
}

type FilterSelectProps = {
  value: string;
};

function FilterSelect({ value }: FilterSelectProps) {
  return (
    <select className="h-10 w-full rounded-md border-white/10 bg-space-panel text-sm text-white focus:border-space-cyan focus:ring-space-cyan">
      <option>{value}</option>
    </select>
  );
}

type DateInputProps = {
  value: string;
};

function DateInput({ value }: DateInputProps) {
  return (
    <label className="relative block">
      <span className="sr-only">Date</span>
      <input
        type="text"
        value={value}
        readOnly
        className="h-10 w-full rounded-md border-white/10 bg-space-panel pr-8 text-xs font-medium text-white focus:border-space-cyan focus:ring-space-cyan"
      />
      <CalendarDays className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    </label>
  );
}
