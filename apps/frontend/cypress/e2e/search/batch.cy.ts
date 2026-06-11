import { apiBaseUrl, demoCredentials } from "../../support/commands";

describe("Search batch actions", () => {
  let token = "";
  let collectionId = "";
  const collectionName = `E2E Batch ${Date.now()}`;

  before(() => {
    cy.request("POST", `${apiBaseUrl}/api/auth/login`, demoCredentials).then((response) => {
      token = response.body.accessToken;

      cy.request({
        method: "POST",
        url: `${apiBaseUrl}/api/collections`,
        headers: { Authorization: `Bearer ${token}` },
        body: { name: collectionName }
      }).then((created) => {
        collectionId = created.body.id;
      });
    });
  });

  after(() => {
    if (collectionId) {
      cy.request({
        method: "DELETE",
        url: `${apiBaseUrl}/api/collections/${collectionId}`,
        headers: { Authorization: `Bearer ${token}` },
        failOnStatusCode: false
      });
    }
  });

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
    cy.get('[role="option"]').contains(collectionName).click();
    cy.get('[data-cy="batch-add-btn"]').click();

    cy.contains(`2 images saved to “${collectionName}”.`, { timeout: 20000 }).should("be.visible");
  });

  it("clears the selection", () => {
    cy.get('[data-cy="multi-select-toggle"]').eq(0).click({ force: true });
    cy.get('[data-cy="batch-action-bar"]').should("be.visible");
    cy.get('[data-cy="batch-action-bar"]').find('button[aria-label="Clear selection"]').click();
    cy.get('[data-cy="batch-action-bar"]').should("not.exist");
  });
});
