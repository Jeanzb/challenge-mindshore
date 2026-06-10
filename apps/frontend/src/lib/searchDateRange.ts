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

  return parsed === null ? value : monthYearFormatter.format(parsed);
};

export const formatFriendlyDateRange = (dateFrom: string, dateTo: string): string => {
  const hasFrom = dateFrom.trim().length > 0;
  const hasTo = dateTo.trim().length > 0;

  if (!hasFrom && !hasTo) {
    return "Spanning the entire NASA archive";
  }

  const fromLabel = hasFrom ? formatFriendlyDateLabel(dateFrom) : "the earliest archives";
  const toLabel = hasTo ? formatFriendlyDateLabel(dateTo) : "today";

  return `${fromLabel} → ${toLabel}`;
};
