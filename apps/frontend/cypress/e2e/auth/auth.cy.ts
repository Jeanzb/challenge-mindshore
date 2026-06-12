import { apiBaseUrl, demoCredentials } from "../../support/commands";

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

  it("shows duplicate email feedback and clears it when returning to sign in", () => {
    cy.contains('[role="tab"]', "Create Account").click();
    cy.get('input[placeholder="Katherine Johnson"]').clear().type("Demo User");
    cy.get('input[placeholder="explorer@cosmara.io"]').clear().type(demoCredentials.email);
    cy.get('input[autocomplete="new-password"]').clear().type("Demo1234!", { log: false });
    cy.get('[data-cy="save-btn"]').filter(":visible").click();

    cy.get("[data-sonner-toast]", { timeout: 20000 })
      .should("be.visible")
      .and("contain.text", "Email is already registered.");
    cy.contains("button", "Sign In").click();
    cy.get('[data-cy="auth-error"]').should("not.exist");
  });

  it("recovers a password without email and signs in with the new one", () => {
    const email = `recover.${Date.now()}@cosmara.dev`;
    const newPassword = "Recovered2026";

    cy.request("POST", `${apiBaseUrl}/api/auth/register`, {
      displayName: "Recover Flow",
      email,
      password: "Original123"
    });

    cy.reload();
    cy.get('[data-cy="forgot-password-btn"]').click();
    cy.get('[data-cy="recovery-panel"]').should("be.visible").and("contain.text", "Recover your password");

    cy.get('[data-cy="recovery-panel"] input[type="email"]').clear().type(email);
    cy.get('[data-cy="recovery-panel"] [data-cy="save-btn"]').click();

    cy.get('[data-cy="recovery-panel"]').should("contain.text", "Set a new password");
    cy.get('[data-cy="recovery-panel"] input[autocomplete="new-password"]').clear().type(newPassword, { log: false });
    cy.get('[data-cy="recovery-panel"] [data-cy="save-btn"]').click();

    cy.get("[data-sonner-toast]", { timeout: 20000 }).should("contain.text", "Password updated");
    cy.get('[data-cy="recovery-panel"]').should("not.exist");

    cy.get('input[type="email"]').filter(":visible").clear().type(email);
    cy.get('input[type="password"]').filter(":visible").clear().type(newPassword, { log: false });
    cy.get('[data-cy="save-btn"]').filter(":visible").click();

    cy.location("pathname").should("eq", "/search");
  });
});
