describe("Search timeline", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/search");
    cy.get('[data-cy="image-card"]', { timeout: 30000 }).should("have.length.greaterThan", 0);
  });

  it("shows the timeline and expands it", () => {
    cy.get('section[aria-label="Timeline"]').should("be.visible");
    cy.get('section[aria-label="Timeline"] button[aria-label="Expand timeline"]').click();
    cy.get('section[aria-label="Timeline"] button[aria-label="Compact timeline"]').should("exist");
  });

  it("selects an image from the timeline strip", () => {
    cy.get('section[aria-label="Timeline"] button[aria-pressed]').eq(2).click();
    cy.get('section[aria-label="Timeline"] button[aria-pressed="true"]').should("have.length", 1);
  });
});
