import { CalendarDays, Sparkles } from "lucide-react";
import type { ChangeEvent } from "react";
import { cn } from "@/lib/utils";
import { formatFriendlyDateRange } from "@/lib/searchDateRange";
import { m } from "@/paraglide/messages";

type DatePreset = "any" | "custom" | "last-30" | "last-year";

type DateRangeFilterProps = {
  preset: DatePreset;
  dateFrom: string;
  dateTo: string;
  onPresetChange: (preset: string) => void;
  onDateChange: (field: "dateFrom" | "dateTo") => (event: ChangeEvent<HTMLInputElement>) => void;
};

type PresetChip = {
  value: DatePreset;
  label: string;
};

const getPresetChips = (): readonly PresetChip[] => [
  { value: "any", label: m.search_any_time() },
  { value: "last-30", label: m.search_last_30_days() },
  { value: "last-year", label: m.search_last_year() },
  { value: "custom", label: m.search_custom() }
];

export function DateRangeFilter({ preset, dateFrom, dateTo, onPresetChange, onDateChange }: DateRangeFilterProps) {
  const showCustomInputs = preset === "custom";
  const friendlyRange = formatFriendlyDateRange(dateFrom, dateTo);

  const renderChip = (chip: PresetChip) => {
    const isActive = preset === chip.value;

    return (
      <button
        key={chip.value}
        type="button"
        aria-pressed={isActive}
        className={cn(
          "rounded-full border px-3 py-1 text-[11px] font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-space-cyan/70",
          isActive
            ? "border-space-orange/60 bg-space-orange/15 text-space-orange"
            : "border-white/10 bg-space-void/40 text-muted-foreground hover:border-white/25 hover:text-white"
        )}
        onClick={() => onPresetChange(chip.value)}
      >
        {chip.label}
      </button>
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5">{getPresetChips().map(renderChip)}</div>
      {showCustomInputs ? (
        <div className="grid grid-cols-1 gap-2">
          <DateInput label={m.search_from()} value={dateFrom} onChange={onDateChange("dateFrom")} />
          <DateInput label={m.search_to()} value={dateTo} onChange={onDateChange("dateTo")} />
        </div>
      ) : null}
      <div className="flex items-center gap-2 rounded-lg border border-space-cyan/15 bg-space-cyan/5 px-3 py-2">
        <Sparkles className="h-3.5 w-3.5 shrink-0 text-space-cyan" />
        <p className="text-[11px] leading-4 text-muted-foreground">
          <span className="font-medium text-space-cyan">{friendlyRange}</span>
        </p>
      </div>
    </div>
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
