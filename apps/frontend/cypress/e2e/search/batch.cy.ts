describe("Search batch actions", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/search");
    cy.get('[data-cy="image-card"]', { timeout: 30000 }).should("have.length.greaterThan", 2);
  });

  it("multi-selects images and shows the batch action bar", () => {
    cy.get('[data-cy="multi-select-toggle"]').eq(0).click({ force: true });
    cy.get('[data-cy="multi-select-toggle"]').eq(1).click({ force: true });

    cy.get('[data-cy="batch-action-bar"]').should("be.visible").and("contain.text", "2");
  });

  it("adds the selected images to a collection", () => {
    cy.get('[data-cy="multi-select-toggle"]').eq(0).click({ force: true });
    cy.get('[data-cy="multi-select-toggle"]').eq(1).click({ force: true });

    cy.get('[data-cy="batch-action-bar"]').should("be.visible");
    cy.get('[data-cy="batch-action-bar"] [role="combobox"]').click();
    cy.get('[role="option"]').contains("Apollo Missions").click();
    cy.get('[data-cy="batch-add-btn"]').click();

    cy.contains("Saved", { timeout: 20000 }).should("be.visible");
  });

  it("clears the selection", () => {
    cy.get('[data-cy="multi-select-toggle"]').eq(0).click({ force: true });
    cy.get('[data-cy="batch-action-bar"]').should("be.visible");
    cy.get('[data-cy="batch-action-bar"]').find('button[aria-label="Clear selection"]').click();
    cy.get('[data-cy="batch-action-bar"]').should("not.exist");
  });
});
