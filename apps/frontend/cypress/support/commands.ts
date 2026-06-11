export const apiBaseUrl = "http://localhost:5207";

export const demoCredentials = {
  email: "demo@nasaexplorer.com",
  password: "Demo1234!"
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      login(email?: string, password?: string): Chainable<void>;
      logout(): Chainable<void>;
    }
  }
}

Cypress.Commands.add("login", (email = demoCredentials.email, password = demoCredentials.password) => {
  cy.session([email, password], () => {
    cy.request("POST", `${apiBaseUrl}/api/auth/login`, { email, password }).then((response) => {
      expect(response.status).to.eq(200);
      cy.visit("/search");
      cy.window().then((win) => {
        win.localStorage.setItem("access_token", response.body.accessToken);
        win.localStorage.setItem("refresh_token", response.body.refreshToken);
        win.localStorage.setItem("authenticated_user", JSON.stringify(response.body.user));
      });
    });
  });
});

Cypress.Commands.add("logout", () => {
  cy.clearLocalStorage();
});
