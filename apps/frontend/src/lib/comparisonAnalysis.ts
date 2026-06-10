import type { ComparisonSections } from "@/types/ai";

export const stripMarkdown = (value: string): string =>
  value
    .replace(/\*\*/g, "")
    .replace(/__/g, "")
    .replace(/`/g, "")
    .replace(/^\s*#{1,6}\s*/gm, "")
    .replace(/^\s*[-*]\s+/gm, "")
    .trim();

const asSectionText = (value: unknown): string => (typeof value === "string" ? stripMarkdown(value) : "");

const asSectionList = (value: unknown): string[] =>
  Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string").map(stripMarkdown).filter((item) => item.length > 0)
    : [];

export const parseComparisonSections = (analysis: string): ComparisonSections | null => {
  let parsed: unknown;

  try {
    parsed = JSON.parse(analysis);
  } catch {
    return null;
  }

  if (typeof parsed !== "object" || parsed === null) {
    return null;
  }

  const record = parsed as Record<string, unknown>;
  const sections: ComparisonSections = {
    title: asSectionText(record.title),
    summary: asSectionText(record.summary),
    similarities: asSectionList(record.similarities),
    differences: asSectionList(record.differences),
    historicalContext: asSectionText(record.historicalContext),
    scientificValue: asSectionText(record.scientificValue),
    conclusion: asSectionText(record.conclusion)
  };

  const hasContent =
    sections.summary.length > 0 ||
    sections.similarities.length > 0 ||
    sections.differences.length > 0 ||
    sections.conclusion.length > 0;

  return hasContent ? sections : null;
};
