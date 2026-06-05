import { CalendarDays, Info, Search, SlidersHorizontal } from "lucide-react";
import { useEffect, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { defaultNasaSearchQuery } from "@/constants";
import type { NasaSearchFilters } from "@/types/search";

type SearchFiltersPanelProps = {
  filters: NasaSearchFilters;
  isFetching: boolean;
  onApplyFilters: (filters: Partial<NasaSearchFilters>) => void;
};

type SearchFilterDraft = {
  query: string;
  datePreset: "any" | "custom" | "last-30" | "last-year";
  dateFrom: string;
  dateTo: string;
  mission: string;
  rover: string;
  camera: string;
  mediaType: string;
};

type SuggestedSearch = {
  label: string;
  filters: Partial<NasaSearchFilters>;
};

type FilterOption = {
  label: string;
  value: string;
};

const defaultDraft: SearchFilterDraft = {
  query: defaultNasaSearchQuery,
  datePreset: "any",
  dateFrom: "",
  dateTo: "",
  mission: "",
  rover: "",
  camera: "",
  mediaType: "image"
};

const emptySelectValue = "__all__";

const suggestedSearches: readonly SuggestedSearch[] = [
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

const datePresetOptions: readonly FilterOption[] = [
  { label: "Any date", value: "any" },
  { label: "Custom range", value: "custom" },
  { label: "Last 30 days", value: "last-30" },
  { label: "Last year", value: "last-year" }
];

const toDraft = (filters: Partial<NasaSearchFilters>, mediaType = "image"): SearchFilterDraft => ({
  query: filters.query ?? defaultDraft.query,
  datePreset: filters.dateFrom !== undefined || filters.dateTo !== undefined ? "custom" : "any",
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
    (field: "query") =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setDraft((currentDraft) => ({
        ...currentDraft,
        [field]: event.target.value
      }));
    };

  const updateSelectDraftField =
    (field: "mission" | "rover" | "camera" | "mediaType") =>
    (value: string) => {
      setDraft((currentDraft) => ({
        ...currentDraft,
        [field]: value
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

  const updateDatePreset = (datePreset: string) => {
    const nextDatePreset = datePreset as SearchFilterDraft["datePreset"];

    if (nextDatePreset === "any") {
      setDraft((currentDraft) => ({
        ...currentDraft,
        datePreset: nextDatePreset,
        dateFrom: "",
        dateTo: ""
      }));
      return;
    }

    if (nextDatePreset === "custom") {
      setDraft((currentDraft) => ({
        ...currentDraft,
        datePreset: nextDatePreset
      }));
      return;
    }

    const dateTo = new Date();
    const dateFrom = new Date(dateTo);

    if (nextDatePreset === "last-30") {
      dateFrom.setDate(dateTo.getDate() - 30);
    }

    if (nextDatePreset === "last-year") {
      dateFrom.setFullYear(dateTo.getFullYear() - 1);
    }

    setDraft((currentDraft) => ({
      ...currentDraft,
      datePreset: nextDatePreset,
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

  const applySuggestedSearch = (suggestedSearch: SuggestedSearch) => {
    const nextDraft = {
      ...defaultDraft,
      ...toDraft(suggestedSearch.filters)
    };

    setDraft(nextDraft);
    applyDraft(nextDraft);
  };

  const renderSuggestedSearch = (suggestedSearch: SuggestedSearch) => (
    <SuggestedSearchButton key={suggestedSearch.label} suggestedSearch={suggestedSearch} onApply={applySuggestedSearch} />
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
        <ScrollArea className="min-h-0 flex-1">
          <div className="space-y-5 px-3 py-4 pr-4">
            <FilterGroup label="Search Query">
              <label className="relative block">
                <span className="sr-only">Search NASA imagery</span>
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  value={draft.query}
                  onChange={updateDraftField("query")}
                  className="cosmara-control pl-9"
                  placeholder="Search NASA imagery..."
                  data-cy="search-input"
                />
              </label>
            </FilterGroup>
            <FilterGroup label="Date Range" hasInfo>
              <FilterSelect value={draft.datePreset} options={datePresetOptions} onValueChange={updateDatePreset} />
              <div className="grid grid-cols-1 gap-2">
                <DateInput label="From" value={draft.dateFrom} onChange={updateDateDraftField("dateFrom")} />
                <DateInput label="To" value={draft.dateTo} onChange={updateDateDraftField("dateTo")} />
              </div>
            </FilterGroup>
            <FilterGroup label="Mission" hasInfo>
              <FilterSelect value={draft.mission} options={missionOptions} onValueChange={updateSelectDraftField("mission")} />
            </FilterGroup>
            <FilterGroup label="Rover / Spacecraft" hasInfo>
              <FilterSelect value={draft.rover} options={roverOptions} onValueChange={updateSelectDraftField("rover")} />
            </FilterGroup>
            <FilterGroup label="Camera" hasInfo>
              <FilterSelect value={draft.camera} options={cameraOptions} onValueChange={updateSelectDraftField("camera")} />
            </FilterGroup>
            <FilterGroup label="Media Type" hasInfo>
              <FilterSelect value={draft.mediaType} options={mediaTypeOptions} onValueChange={updateSelectDraftField("mediaType")} />
            </FilterGroup>
            <div className="border-t border-white/10 pt-4">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase text-white">Suggested Searches</p>
              </div>
              <ul className="space-y-1">{suggestedSearches.map(renderSuggestedSearch)}</ul>
            </div>
          </div>
        </ScrollArea>
        <div className="border-t border-white/10 p-3">
          <Button
            type="submit"
            className="h-10 w-full rounded-md bg-space-cyan text-space-void hover:bg-space-cyan/90"
            disabled={isFetching}
            data-cy="search-btn"
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
  onValueChange: (value: string) => void;
};

const renderFilterOption = (option: FilterOption) => (
  <SelectItem
    key={option.label}
    value={option.value.length > 0 ? option.value : emptySelectValue}
    className="cursor-pointer text-xs text-white focus:bg-space-cyan/15 focus:text-white data-[state=checked]:text-space-cyan"
  >
    {option.label}
  </SelectItem>
);

function FilterSelect({ value, options, onValueChange }: FilterSelectProps) {
  const handleValueChange = (nextValue: string) => {
    onValueChange(nextValue === emptySelectValue ? "" : nextValue);
  };

  return (
    <Select value={value.length > 0 ? value : emptySelectValue} onValueChange={handleValueChange}>
      <SelectTrigger className="cosmara-control h-10 px-3 text-left shadow-inner shadow-black/20 [&>svg]:text-muted-foreground [&>svg]:opacity-100">
        <SelectValue />
      </SelectTrigger>
      <SelectContent
        position="popper"
        className="z-[80] rounded-md border-white/10 bg-space-panel text-white shadow-2xl shadow-black/50"
      >
        {options.map(renderFilterOption)}
      </SelectContent>
    </Select>
  );
}

type DateInputProps = {
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

function DateInput({ label, value, onChange }: DateInputProps) {
  return (
    <label className="block min-w-0">
      <span className="mb-1.5 block text-[10px] font-semibold uppercase text-muted-foreground">{label}</span>
      <span className="relative block min-w-0">
        <input
          type="date"
          value={value}
          onChange={onChange}
          className="cosmara-control cosmara-date min-w-0 pr-9 text-xs font-medium"
        />
        <CalendarDays className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      </span>
    </label>
  );
}

type SuggestedSearchButtonProps = {
  suggestedSearch: SuggestedSearch;
  onApply: (suggestedSearch: SuggestedSearch) => void;
};

function SuggestedSearchButton({ suggestedSearch, onApply }: SuggestedSearchButtonProps) {
  const handleClick = () => {
    onApply(suggestedSearch);
  };

  return (
    <li>
      <button
        type="button"
        className="flex w-full items-center gap-2 rounded-md px-1.5 py-1.5 text-left text-xs text-muted-foreground transition-colors hover:bg-white/5 hover:text-white"
        onClick={handleClick}
      >
        <Search className="h-3.5 w-3.5 shrink-0 text-space-cyan/80" />
        <span className="truncate">{suggestedSearch.label}</span>
      </button>
    </li>
  );
}
