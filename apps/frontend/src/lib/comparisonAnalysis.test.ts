import { describe, expect, it } from "vitest";
import { parseComparisonSections, stripMarkdown } from "@/lib/comparisonAnalysis";

describe("stripMarkdown", () => {
  it("removes emphasis, code and heading markers", () => {
    expect(stripMarkdown("**bold** and `code`")).toBe("bold and code");
    expect(stripMarkdown("# Heading")).toBe("Heading");
  });
});

describe("parseComparisonSections", () => {
  it("parses a valid JSON analysis into sections", () => {
    const sections = parseComparisonSections(
      JSON.stringify({
        summary: "S",
        similarities: ["a"],
        differences: [],
        historicalContext: "",
        scientificValue: "",
        conclusion: ""
      })
    );

    expect(sections).not.toBeNull();
    expect(sections?.summary).toBe("S");
    expect(sections?.similarities).toEqual(["a"]);
  });

  it("returns null for plain text", () => {
    expect(parseComparisonSections("just narrative text")).toBeNull();
  });

  it("returns null when the JSON carries no meaningful content", () => {
    expect(parseComparisonSections(JSON.stringify({ title: "only a title" }))).toBeNull();
  });
});
