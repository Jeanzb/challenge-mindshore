import { getCurrentAppLanguage } from "@/lib/i18n";
import { m } from "@/paraglide/messages";

const monthYearFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric",
  timeZone: "UTC"
});

const parseIsoDate = (value: string): Date | null => {
  const parsed = new Date(`${value}T00:00:00Z`);

  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const formatFriendlyDateLabel = (value: string): string => {
  const parsed = parseIsoDate(value);

  if (parsed === null) {
    return value;
  }

  if (getCurrentAppLanguage() === "en") {
    return monthYearFormatter.format(parsed);
  }

  return new Intl.DateTimeFormat("es", {
    month: "short",
    year: "numeric",
    timeZone: "UTC"
  }).format(parsed);
};

export const formatFriendlyDateRange = (dateFrom: string, dateTo: string): string => {
  const hasFrom = dateFrom.trim().length > 0;
  const hasTo = dateTo.trim().length > 0;

  if (!hasFrom && !hasTo) {
    return m.search_date_range_full();
  }

  const fromLabel = hasFrom ? formatFriendlyDateLabel(dateFrom) : m.timeline_range_earliest();
  const toLabel = hasTo ? formatFriendlyDateLabel(dateTo) : m.timeline_range_present();

  return `${fromLabel} → ${toLabel}`;
};
