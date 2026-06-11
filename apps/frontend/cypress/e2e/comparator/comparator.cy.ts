import { apiBaseUrl, demoCredentials } from "../../support/commands";

describe("Comparator", () => {
  let token = "";
  let collectionId = "";

  const buildImage = (suffix: string) => ({
    nasaImageId: `E2E-${suffix}`,
    title: `E2E Image ${suffix}`,
    description: "Seeded for comparator e2e.",
    imageUrl: `https://images-assets.nasa.gov/image/E2E-${suffix}/E2E-${suffix}~large.jpg`,
    thumbnailUrl: `https://images-assets.nasa.gov/image/E2E-${suffix}/E2E-${suffix}~thumb.jpg`,
    sourceUrl: null,
    mediaType: "image",
    center: "NASA",
    mission: "E2E",
    rover: null,
    camera: null,
    dateCreated: "2020-01-01T00:00:00Z",
    keywords: "e2e, test",
    userNote: null
  });

  before(() => {
    cy.request("POST", `${apiBaseUrl}/api/auth/login`, demoCredentials).then((response) => {
      token = response.body.accessToken;
      const headers = { Authorization: `Bearer ${token}` };

      cy.request({
        method: "POST",
        url: `${apiBaseUrl}/api/collections`,
        headers,
        body: { name: "E2E Compare Set" }
      }).then((created) => {
        collectionId = created.body.id;
        cy.request({ method: "POST", url: `${apiBaseUrl}/api/collections/${collectionId}/images`, headers, body: buildImage("A") });
        cy.request({ method: "POST", url: `${apiBaseUrl}/api/collections/${collectionId}/images`, headers, body: buildImage("B") });
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
  });

  it("runs a comparison and renders structured sections", () => {
    cy.intercept("POST", "**/api/ai/compare", {
      statusCode: 200,
      body: {
        id: "11111111-1111-1111-1111-111111111111",
        title: "Two views",
        analysis: JSON.stringify({
          title: "Two views",
          summary: "A concise comparative summary.",
          similarities: ["Both are NASA imagery"],
          differences: ["Captured by different missions"],
          historicalContext: "Taken years apart.",
          scientificValue: "Useful for comparative study.",
          conclusion: "Both remain scientifically valuable."
        }),
        imageIds: [],
        createdAt: "2020-01-01T00:00:00Z"
      }
    }).as("compare");

    cy.visit("/comparator");
    cy.get('[role="combobox"]').first().click();
    cy.get('[role="option"]').contains("E2E Compare Set").click();
    cy.contains("button", "Run comparison").should("not.be.disabled").click();
    cy.wait("@compare");

    cy.contains("Similarities").should("be.visible");
    cy.contains("A concise comparative summary.").should("be.visible");
    cy.contains("Both are NASA imagery").should("be.visible");
  });
});
