import { defineConfig } from "cypress";

export default defineConfig({
  projectId: '7b72cb',
  allowCypressEnv: false,
  e2e: {
    baseUrl: "http://localhost:5173",
    supportFile: "cypress/support/e2e.ts",
    specPattern: "cypress/e2e/**/*.cy.ts",
    fixturesFolder: "cypress/fixtures",
    defaultCommandTimeout: 15000,
    requestTimeout: 20000,
    viewportWidth: 1280,
    viewportHeight: 800,
    video: false,
    screenshotOnRunFailure: true,
    retries: {
      runMode: 1,
      openMode: 0
    }
  },
  component: {
    devServer: {
      framework: "react",
      bundler: "vite"
    },
    supportFile: "cypress/support/component.ts",
    indexHtmlFile: "cypress/support/component-index.html",
    specPattern: "cypress/component/**/*.cy.{ts,tsx}",
    viewportWidth: 500,
    viewportHeight: 500,
    video: false
  }
});
