import { ComparatorAnalysis } from "@/components/comparator/ComparatorAnalysis";

describe("<ComparatorAnalysis />", () => {
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

    cy.mount(<ComparatorAnalysis analysis={analysis} />);

    cy.contains("Similarities").should("be.visible");
    cy.contains("Differences").should("be.visible");
    cy.contains("Historical Context").should("be.visible");
    cy.contains("Scientific Value").should("be.visible");
    cy.contains("Conclusion").should("be.visible");
    cy.contains("A bold summary.").should("be.visible");
    cy.contains("Both are nebulae").should("be.visible");
  });

  it("omits sections that arrive empty", () => {
    const analysis = JSON.stringify({
      summary: "Only a summary.",
      similarities: [],
      differences: [],
      historicalContext: "",
      scientificValue: "",
      conclusion: ""
    });

    cy.mount(<ComparatorAnalysis analysis={analysis} />);

    cy.contains("Only a summary.").should("be.visible");
    cy.contains("Similarities").should("not.exist");
    cy.contains("Conclusion").should("not.exist");
  });

  it("falls back to plain text and strips markdown for a non-JSON analysis", () => {
    cy.mount(<ComparatorAnalysis analysis="This is **not** JSON output." />);

    cy.contains("This is not JSON output.").should("be.visible");
    cy.contains("Similarities").should("not.exist");
  });
});
