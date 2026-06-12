import { Info, Search, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { defaultNasaSearchQuery } from "@/constants";
import { cn } from "@/lib/utils";
import { useUiStore, uiSelectors } from "@/store";
import { m } from "@/paraglide/messages";
import type { NasaSearchFilters } from "@/types/search";
import { DateRangeFilter } from "@/components/search/DateRangeFilter";

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
  camera: ""
};

const emptySelectValue = "__all__";

const getSuggestedSearchPool = (): readonly SuggestedSearch[] => [
  {
    label: m.search_suggestion_mars_curiosity(),
    filters: {
      query: "curiosity mars",
      datePreset: "custom",
      dateFrom: "2024-01-01",
      dateTo: "2024-12-31",
      rover: "Curiosity"
    }
  },
  {
    label: m.search_suggestion_jwst_nebulae(),
    filters: {
      query: "jwst nebula",
      mission: "JWST"
    }
  },
  {
    label: m.search_suggestion_lunar_surface(),
    filters: {
      query: "lunar surface",
      mission: "Apollo"
    }
  },
  {
    label: m.search_suggestion_earth_night(),
    filters: {
      query: "earth at night"
    }
  },
  {
    label: m.search_suggestion_apollo_moonwalk(),
    filters: {
      query: "apollo moonwalk",
      mission: "Apollo"
    }
  },
  {
    label: m.search_suggestion_saturn_rings(),
    filters: {
      query: "saturn rings",
      mission: "Cassini"
    }
  },
  {
    label: m.search_suggestion_solar_flares(),
    filters: {
      query: "solar flare"
    }
  },
  {
    label: m.search_suggestion_space_station(),
    filters: {
      query: "international space station"
    }
  },
  {
    label: m.search_suggestion_jupiter_storms(),
    filters: {
      query: "jupiter storm",
      mission: "Juno"
    }
  },
  {
    label: m.search_suggestion_hubble_deep_field(),
    filters: {
      query: "hubble deep field",
      mission: "Hubble"
    }
  }
];

const suggestedSearchCount = 4;

const getMissionOptions = (): readonly FilterOption[] => [
  { label: m.search_all_missions(), value: "" },
  { label: "JWST", value: "JWST" },
  { label: "Hubble", value: "Hubble" },
  { label: "Apollo", value: "Apollo" },
  { label: "Cassini", value: "Cassini" },
  { label: "Juno", value: "Juno" }
];

const getRoverOptions = (): readonly FilterOption[] => [
  { label: m.search_all_rovers(), value: "" },
  { label: "Curiosity", value: "Curiosity" },
  { label: "Perseverance", value: "Perseverance" },
  { label: "Opportunity", value: "Opportunity" },
  { label: "Spirit", value: "Spirit" }
];

const getCameraOptions = (): readonly FilterOption[] => [
  { label: m.search_all_cameras(), value: "" },
  { label: "NIRCam", value: "NIRCam" },
  { label: "Mastcam", value: "Mastcam" },
  { label: "JunoCam", value: "JunoCam" },
  { label: "WFC3", value: "WFC3" }
];

const toDraft = (filters: Partial<NasaSearchFilters>): SearchFilterDraft => ({
  query: filters.query ?? defaultDraft.query,
  datePreset: filters.datePreset ?? (filters.dateFrom !== undefined || filters.dateTo !== undefined ? "custom" : "any"),
  dateFrom: filters.dateFrom ?? "",
  dateTo: filters.dateTo ?? "",
  mission: filters.mission ?? "",
  rover: filters.rover ?? "",
  camera: filters.camera ?? ""
});

const toNullable = (value: string): string | null => {
  const trimmedValue = value.trim();

  return trimmedValue.length > 0 ? trimmedValue : null;
};

const normalizeDateRange = (dateFrom: string, dateTo: string): Pick<SearchFilterDraft, "dateFrom" | "dateTo"> => {
  const normalizedDateFrom = dateFrom.trim();
  const normalizedDateTo = dateTo.trim();

  if (
    normalizedDateFrom.length > 0
    && normalizedDateTo.length > 0
    && normalizedDateFrom > normalizedDateTo
  ) {
    return {
      dateFrom: normalizedDateTo,
      dateTo: normalizedDateFrom
    };
  }

  return {
    dateFrom: normalizedDateFrom,
    dateTo: normalizedDateTo
  };
};

const formatDateInput = (date: Date): string => date.toISOString().slice(0, 10);

const pickSuggestedSearches = (): readonly SuggestedSearch[] => {
  const pool = [...getSuggestedSearchPool()];

  for (let index = pool.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [pool[index], pool[swapIndex]] = [pool[swapIndex], pool[index]];
  }

  return pool.slice(0, suggestedSearchCount);
};

export function SearchFiltersPanel({ filters, isFetching, onApplyFilters }: SearchFiltersPanelProps) {
  const [draft, setDraft] = useState<SearchFilterDraft>(() => toDraft(filters));
  const [suggestedSearches] = useState(pickSuggestedSearches);
  const mobileFiltersOpen = useUiStore(uiSelectors.mobileFiltersOpen);
  const closeMobileFilters = useUiStore(uiSelectors.closeMobileFiltersAction);

  useEffect(() => {
    setDraft(toDraft(filters));
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
    (field: "mission" | "rover" | "camera") =>
    (value: string) => {
      setDraft((currentDraft) => ({
        ...currentDraft,
        [field]: value
      }));
    };

  const updateDateDraftField =
    (field: "dateFrom" | "dateTo") =>
    (value: string) => {
      setDraft((currentDraft) => ({
        ...currentDraft,
        datePreset: "custom",
        [field]: value
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
    const normalizedDates = normalizeDateRange(nextDraft.dateFrom, nextDraft.dateTo);

    onApplyFilters({
      query: nextDraft.query.trim(),
      datePreset: nextDraft.datePreset,
      dateFrom: toNullable(normalizedDates.dateFrom),
      dateTo: toNullable(normalizedDates.dateTo),
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
    <>
      {mobileFiltersOpen ? (
        <div className="cosmara-mobile-overlay lg:hidden" aria-hidden="true" onClick={closeMobileFilters} />
      ) : null}
      <aside
        className={cn(
          "min-h-0 border-r border-white/10 bg-space-shell/70 lg:block",
          mobileFiltersOpen ? "cosmara-mobile-drawer" : "hidden"
        )}
        aria-label={m.search_filters_aria()}
      >
        <form className="flex h-full min-h-0 flex-col" onSubmit={handleSubmit}>
          <div className="flex items-center justify-between border-b border-white/10 px-3 py-4">
            <p className="text-xs font-semibold uppercase text-white">{m.search_filters_label()}</p>
            <div className="flex items-center gap-3">
              <button type="button" className="text-xs font-medium text-space-cyan hover:text-white" onClick={clearFilters}>
                {m.search_clear_all()}
              </button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-md text-muted-foreground hover:bg-white/5 hover:text-white lg:hidden"
                aria-label={m.search_close_filters()}
                onClick={closeMobileFilters}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <ScrollArea className="min-h-0 flex-1">
          <div className="space-y-5 px-3 py-4 pr-4">
            <FilterGroup label={m.search_query_label()}>
              <label className="relative block">
                <span className="sr-only">{m.search_aria()}</span>
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  value={draft.query}
                  onChange={updateDraftField("query")}
                  className="cosmara-control pl-9"
                  placeholder={m.search_placeholder()}
                  data-cy="search-input"
                />
              </label>
            </FilterGroup>
            <FilterGroup label={m.search_date_range_label()} hasInfo>
              <DateRangeFilter
                preset={draft.datePreset}
                dateFrom={draft.dateFrom}
                dateTo={draft.dateTo}
                onPresetChange={updateDatePreset}
                onDateChange={updateDateDraftField}
              />
            </FilterGroup>
            <FilterGroup label={m.search_mission_label()} hasInfo>
              <FilterSelect value={draft.mission} options={getMissionOptions()} onValueChange={updateSelectDraftField("mission")} />
            </FilterGroup>
            <FilterGroup label={m.search_rover_label()} hasInfo>
              <FilterSelect value={draft.rover} options={getRoverOptions()} onValueChange={updateSelectDraftField("rover")} />
            </FilterGroup>
            <FilterGroup label={m.search_camera_label()} hasInfo>
              <FilterSelect value={draft.camera} options={getCameraOptions()} onValueChange={updateSelectDraftField("camera")} />
            </FilterGroup>
            <div className="border-t border-white/10 pt-4">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase text-white">{m.search_suggested_label()}</p>
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
              onClick={closeMobileFilters}
            >
              <SlidersHorizontal className="h-4 w-4" />
              {isFetching ? m.search_applying() : m.search_apply_filters()}
            </Button>
          </div>
        </form>
      </aside>
    </>
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
