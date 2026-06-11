import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ComparatorAnalysis } from "@/components/comparator/ComparatorAnalysis";

describe("ComparatorAnalysis", () => {
  it("renders structured sections from a JSON analysis", () => {
    const analysis = JSON.stringify({
      title: "Two Nebulae",
      summary: "A **bold** summary.",
      similarities: ["Both are nebulae"],
      differences: ["Different distances"],
      historicalContext: "Imaged decades apart.",
      scientificValue: "High resolution data.",
      conclusion: "Both are iconic."
    });

    render(<ComparatorAnalysis analysis={analysis} />);

    expect(screen.getByText("Similarities")).toBeInTheDocument();
    expect(screen.getByText("Differences")).toBeInTheDocument();
    expect(screen.getByText("Historical Context")).toBeInTheDocument();
    expect(screen.getByText("Scientific Value")).toBeInTheDocument();
    expect(screen.getByText("Conclusion")).toBeInTheDocument();
    expect(screen.getByText("A bold summary.")).toBeInTheDocument();
    expect(screen.getByText("Both are nebulae")).toBeInTheDocument();
  });

  it("falls back to plain text and strips markdown for a non-JSON analysis", () => {
    render(<ComparatorAnalysis analysis="This is **not** JSON output." />);

    expect(screen.getByText("This is not JSON output.")).toBeInTheDocument();
    expect(screen.queryByText("Similarities")).not.toBeInTheDocument();
  });
});
