import { Bookmark, CalendarDays, Info, SlidersHorizontal } from "lucide-react";
import { useEffect, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { NasaSearchFilters } from "@/types/search";

type SearchFiltersPanelProps = {
  filters: NasaSearchFilters;
  isFetching: boolean;
  onApplyFilters: (filters: Partial<NasaSearchFilters>) => void;
};

type SearchFilterDraft = {
  query: string;
  datePreset: string;
  dateFrom: string;
  dateTo: string;
  mission: string;
  rover: string;
  camera: string;
  mediaType: string;
};

type SavedSearch = {
  label: string;
  filters: Partial<NasaSearchFilters>;
};

type FilterOption = {
  label: string;
  value: string;
};

const defaultDraft: SearchFilterDraft = {
  query: "mars",
  datePreset: "custom",
  dateFrom: "2015-01-01",
  dateTo: "2024-12-31",
  mission: "",
  rover: "",
  camera: "",
  mediaType: "image"
};

const savedSearches: readonly SavedSearch[] = [
  {
    label: "Mars Curiosity - 2024",
    filters: {
      query: "curiosity mars",
      dateFrom: "2024-01-01",
      dateTo: "2024-12-31",
      rover: "Curiosity"
    }
  },
  {
    label: "James Webb Nebulae",
    filters: {
      query: "jwst nebula",
      mission: "JWST"
    }
  },
  {
    label: "Lunar Surface Studies",
    filters: {
      query: "lunar surface",
      mission: "Apollo"
    }
  },
  {
    label: "Earth at Night",
    filters: {
      query: "earth at night"
    }
  }
];

const missionOptions: readonly FilterOption[] = [
  { label: "All Missions", value: "" },
  { label: "JWST", value: "JWST" },
  { label: "Hubble", value: "Hubble" },
  { label: "Apollo", value: "Apollo" },
  { label: "Cassini", value: "Cassini" },
  { label: "Juno", value: "Juno" }
];

const roverOptions: readonly FilterOption[] = [
  { label: "All Rovers / Spacecraft", value: "" },
  { label: "Curiosity", value: "Curiosity" },
  { label: "Perseverance", value: "Perseverance" },
  { label: "Opportunity", value: "Opportunity" },
  { label: "Spirit", value: "Spirit" }
];

const cameraOptions: readonly FilterOption[] = [
  { label: "All Cameras", value: "" },
  { label: "NIRCam", value: "NIRCam" },
  { label: "Mastcam", value: "Mastcam" },
  { label: "JunoCam", value: "JunoCam" },
  { label: "WFC3", value: "WFC3" }
];

const mediaTypeOptions: readonly FilterOption[] = [
  { label: "Images", value: "image" }
];

const toDraft = (filters: Partial<NasaSearchFilters>, mediaType = "image"): SearchFilterDraft => ({
  query: filters.query ?? defaultDraft.query,
  datePreset: "custom",
  dateFrom: filters.dateFrom ?? "",
  dateTo: filters.dateTo ?? "",
  mission: filters.mission ?? "",
  rover: filters.rover ?? "",
  camera: filters.camera ?? "",
  mediaType
});

const toNullable = (value: string): string | null => {
  const trimmedValue = value.trim();

  return trimmedValue.length > 0 ? trimmedValue : null;
};

const formatDateInput = (date: Date): string => date.toISOString().slice(0, 10);

export function SearchFiltersPanel({ filters, isFetching, onApplyFilters }: SearchFiltersPanelProps) {
  const [draft, setDraft] = useState<SearchFilterDraft>(() => toDraft(filters));

  useEffect(() => {
    setDraft((currentDraft) => toDraft(filters, currentDraft.mediaType));
  }, [filters]);

  const updateDraftField =
    (field: keyof SearchFilterDraft) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setDraft((currentDraft) => ({
        ...currentDraft,
        [field]: event.target.value
      }));
    };

  const updateDateDraftField =
    (field: "dateFrom" | "dateTo") =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setDraft((currentDraft) => ({
        ...currentDraft,
        datePreset: "custom",
        [field]: event.target.value
      }));
    };

  const updateDatePreset = (event: ChangeEvent<HTMLSelectElement>) => {
    const datePreset = event.target.value;

    if (datePreset === "custom") {
      setDraft((currentDraft) => ({
        ...currentDraft,
        datePreset
      }));
      return;
    }

    const dateTo = new Date();
    const dateFrom = new Date(dateTo);

    if (datePreset === "last-30") {
      dateFrom.setDate(dateTo.getDate() - 30);
    }

    if (datePreset === "last-year") {
      dateFrom.setFullYear(dateTo.getFullYear() - 1);
    }

    setDraft((currentDraft) => ({
      ...currentDraft,
      datePreset,
      dateFrom: formatDateInput(dateFrom),
      dateTo: formatDateInput(dateTo)
    }));
  };

  const applyDraft = (nextDraft: SearchFilterDraft) => {
    onApplyFilters({
      query: nextDraft.query.trim() || defaultDraft.query,
      dateFrom: toNullable(nextDraft.dateFrom),
      dateTo: toNullable(nextDraft.dateTo),
      mission: toNullable(nextDraft.mission),
      rover: toNullable(nextDraft.rover),
      camera: toNullable(nextDraft.camera)
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    applyDraft(draft);
  };

  const clearFilters = () => {
    setDraft(defaultDraft);
    applyDraft(defaultDraft);
  };

  const applySavedSearch = (savedSearch: SavedSearch) => {
    const nextDraft = {
      ...defaultDraft,
      ...toDraft(savedSearch.filters)
    };

    setDraft(nextDraft);
    applyDraft(nextDraft);
  };

  const renderSavedSearch = (savedSearch: SavedSearch) => (
    <li key={savedSearch.label}>
      <button
        type="button"
        className="flex w-full items-center gap-2 rounded-md px-1 py-1.5 text-left text-xs text-muted-foreground transition-colors hover:bg-white/5 hover:text-white"
        onClick={() => applySavedSearch(savedSearch)}
      >
        <Bookmark className="h-3.5 w-3.5 shrink-0" />
        <span className="truncate">{savedSearch.label}</span>
      </button>
    </li>
  );

  return (
    <aside className="hidden min-h-0 border-r border-white/10 bg-space-shell/70 lg:block" aria-label="Search filters">
      <form className="flex h-full min-h-0 flex-col" onSubmit={handleSubmit}>
        <div className="flex items-center justify-between border-b border-white/10 px-3 py-4">
          <p className="text-xs font-semibold uppercase text-white">Filters</p>
          <button type="button" className="text-xs font-medium text-space-cyan hover:text-white" onClick={clearFilters}>
            Clear all
          </button>
        </div>
        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-3 py-4">
          <FilterGroup label="Search Query">
            <Input
              type="search"
              value={draft.query}
              onChange={updateDraftField("query")}
              className="h-10 rounded-md border-white/10 bg-space-panel text-sm text-white placeholder:text-muted-foreground focus-visible:ring-space-cyan/70"
              placeholder="Search NASA imagery..."
            />
          </FilterGroup>
          <FilterGroup label="Date Range" hasInfo>
            <select
              value={draft.datePreset}
              onChange={updateDatePreset}
              className="h-10 w-full rounded-md border-white/10 bg-space-panel text-sm text-white focus:border-space-cyan focus:ring-space-cyan"
            >
              <option value="custom">Custom Range</option>
              <option value="last-30">Last 30 days</option>
              <option value="last-year">Last year</option>
            </select>
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
              <DateInput value={draft.dateFrom} onChange={updateDateDraftField("dateFrom")} />
              <span className="text-muted-foreground">-&gt;</span>
              <DateInput value={draft.dateTo} onChange={updateDateDraftField("dateTo")} />
            </div>
          </FilterGroup>
          <FilterGroup label="Mission" hasInfo>
            <FilterSelect value={draft.mission} options={missionOptions} onChange={updateDraftField("mission")} />
          </FilterGroup>
          <FilterGroup label="Rover / Spacecraft" hasInfo>
            <FilterSelect value={draft.rover} options={roverOptions} onChange={updateDraftField("rover")} />
          </FilterGroup>
          <FilterGroup label="Camera" hasInfo>
            <FilterSelect value={draft.camera} options={cameraOptions} onChange={updateDraftField("camera")} />
          </FilterGroup>
          <FilterGroup label="Media Type" hasInfo>
            <FilterSelect value={draft.mediaType} options={mediaTypeOptions} onChange={updateDraftField("mediaType")} />
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
          <Button
            type="submit"
            className="h-10 w-full rounded-md bg-space-cyan text-space-void hover:bg-space-cyan/90"
            disabled={isFetching}
          >
            <SlidersHorizontal className="h-4 w-4" />
            {isFetching ? "Applying..." : "Apply Filters"}
          </Button>
        </div>
      </form>
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
  options: readonly FilterOption[];
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
};

const renderFilterOption = (option: FilterOption) => (
  <option key={option.value} value={option.value}>
    {option.label}
  </option>
);

function FilterSelect({ value, options, onChange }: FilterSelectProps) {
  return (
    <select
      value={value}
      onChange={onChange}
      className="h-10 w-full rounded-md border-white/10 bg-space-panel text-sm text-white focus:border-space-cyan focus:ring-space-cyan"
    >
      {options.map(renderFilterOption)}
    </select>
  );
}

type DateInputProps = {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

function DateInput({ value, onChange }: DateInputProps) {
  return (
    <label className="relative block">
      <span className="sr-only">Date</span>
      <input
        type="date"
        value={value}
        onChange={onChange}
        className="h-10 w-full rounded-md border-white/10 bg-space-panel pr-8 text-xs font-medium text-white focus:border-space-cyan focus:ring-space-cyan"
      />
      <CalendarDays className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    </label>
  );
}
