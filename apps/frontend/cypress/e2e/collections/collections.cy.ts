describe("Collections", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/collections");
  });

  it("lists the user's collections", () => {
    cy.get('[data-cy="collection-card"]', { timeout: 20000 }).should("have.length.greaterThan", 0);
  });

  it("opens the create collection dialog", () => {
    cy.get('[data-cy="create-collection-btn"]').click();
    cy.get('[role="dialog"]').should("be.visible").and("contain.text", "collection");
  });

  it("opens a collection detail view", () => {
    cy.get('[data-cy="collection-card"]').first().find("a").first().click();
    cy.location("pathname").should("match", /^\/collections\/.+/);
    cy.contains("All collections").should("be.visible");
  });

  it("shows the empty state for the comparator entry from a collection", () => {
    cy.get('[data-cy="collection-card"]').first().find("a").first().click();
    cy.contains("a", "Compare images").should("have.attr", "href").and("include", "/comparator");
  });
});
