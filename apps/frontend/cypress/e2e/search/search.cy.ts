describe("Search dashboard", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/search");
  });

  it("renders NASA result cards", () => {
    cy.get('[data-cy="image-card"]', { timeout: 30000 }).should("have.length.greaterThan", 0);
  });

  it("selects a card and shows it in the inspector", () => {
    cy.get('[data-cy="image-card"]', { timeout: 30000 }).should("have.length.greaterThan", 0);
    cy.get('[data-cy="image-card"]').first().click();
    cy.get('[data-cy="search-inspector"]').should("be.visible").find("h2").should("not.be.empty");
  });

  it("activates a date-range preset", () => {
    cy.contains('aside[aria-label="Search filters"] button', "Last year")
      .click()
      .should("have.attr", "aria-pressed", "true");
  });

  it("toggles semantic search", () => {
    cy.contains("button", "Semantic Search").click().should("have.attr", "aria-pressed", "true");
  });

  it("recovers from an empty result with the reset action", () => {
    cy.visit("/search?q=zzqqxx000nope");
    cy.contains("No NASA images found", { timeout: 30000 }).should("be.visible");
    cy.contains("button", "Reset search").click();
    cy.get('[data-cy="image-card"]', { timeout: 30000 }).should("have.length.greaterThan", 0);
    cy.location("search").should("eq", "");
  });
});
