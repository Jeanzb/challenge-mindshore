import { demoCredentials } from "../../support/commands";

describe("Auth", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit("/auth");
  });

  it("renders the sign-in form when logged out", () => {
    cy.contains("h1", "Cosmara").should("be.visible");
    cy.get('[data-cy="save-btn"]').filter(":visible").should("contain.text", "Sign In");
  });

  it("reveals the name field when switching to create account", () => {
    cy.get('input[placeholder="Katherine Johnson"]').should("not.be.visible");
    cy.contains('[role="tab"]', "Create Account").click();
    cy.contains('[role="tab"]', "Create Account").should("have.attr", "aria-selected", "true");
    cy.get('input[placeholder="Katherine Johnson"]').should("be.visible");
  });

  it("logs in with the demo credentials and lands on search", () => {
    cy.get('input[type="email"]').filter(":visible").clear().type(demoCredentials.email);
    cy.get('input[type="password"]').filter(":visible").clear().type(demoCredentials.password, { log: false });
    cy.get('[data-cy="save-btn"]').filter(":visible").click();

    cy.location("pathname").should("eq", "/search");
    cy.get("header").should("contain.text", "DU");
  });

  it("shows a validation error for an invalid email", () => {
    cy.get('input[type="email"]').filter(":visible").clear().type("not-an-email");
    cy.get('input[type="password"]').filter(":visible").clear().type("Demo1234!", { log: false });
    cy.get('[data-cy="save-btn"]').filter(":visible").click();

    cy.contains("Enter a valid email").should("be.visible");
    cy.location("pathname").should("eq", "/auth");
  });
});
