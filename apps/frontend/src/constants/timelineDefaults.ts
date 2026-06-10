import type { TimelineDensity } from "@/types/ui";

export const timelineDensityHeights: Record<TimelineDensity, string> = {
  compact: "clamp(7rem, 18svh, 9rem)",
  comfortable: "clamp(9.5rem, 26svh, 13rem)",
  expanded: "clamp(11rem, 30svh, 16rem)"
};

export const timelineMaxYearMarkers = 6;
