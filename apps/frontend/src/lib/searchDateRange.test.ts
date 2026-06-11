import { describe, expect, it } from "vitest";
import { formatFriendlyDateLabel, formatFriendlyDateRange } from "@/lib/searchDateRange";

describe("formatFriendlyDateRange", () => {
  it("describes the full archive when no dates are set", () => {
    expect(formatFriendlyDateRange("", "")).toBe("Spanning the entire NASA archive");
  });

  it("formats a closed range as month-year with an arrow", () => {
    expect(formatFriendlyDateRange("2024-01-01", "2024-12-31")).toBe("Jan 2024 → Dec 2024");
  });

  it("uses open-ended labels when only one bound is set", () => {
    expect(formatFriendlyDateRange("2020-06-15", "")).toBe("Jun 2020 → today");
    expect(formatFriendlyDateRange("", "2020-06-15")).toBe("the earliest archives → Jun 2020");
  });
});

describe("formatFriendlyDateLabel", () => {
  it("formats an ISO date to short month and year in UTC", () => {
    expect(formatFriendlyDateLabel("2019-07-20")).toBe("Jul 2019");
  });
});
