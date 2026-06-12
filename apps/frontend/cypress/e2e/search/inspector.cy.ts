describe("Image inspector", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/search");
    cy.get('[data-cy="image-card"]', { timeout: 30000 }).should("have.length.greaterThan", 0);
    cy.get('[data-cy="image-card"]').first().click();
    cy.get('[data-cy="search-inspector"]').should("be.visible");
  });

  it("shows metadata for the selected image", () => {
    cy.contains('[data-cy="search-inspector"] button', "Metadata").click();
    cy.get('[data-cy="search-inspector"]').should("contain.text", "Media Type");
  });

  it("generates AI historical context", () => {
    cy.intercept("POST", "**/api/ai/enrich", (request) => {
      request.reply({
        statusCode: 200,
        body: {
          spaceImageId: "00000000-0000-0000-0000-000000000001",
          nasaImageId: request.body.nasaImageId,
          description: "Stubbed description.",
          funFacts: ["Stubbed fact."],
          historicalContext: "A pivotal moment in exploration history.",
          fromCache: false
        }
      });
    }).as("enrich");

    cy.contains('[data-cy="search-inspector"] button', /Generate context|Load cached context/).click();
    cy.wait("@enrich");
    cy.contains("A pivotal moment in exploration history.").should("be.visible");
  });

  it("downloads the image and surfaces a toast", () => {
    cy.intercept("GET", "https://images-assets.nasa.gov/**", {
      statusCode: 200,
      headers: { "content-type": "image/jpeg" },
      body: "stub-binary"
    });

    cy.contains('[data-cy="search-inspector"] button', "Download").click();
    cy.contains("Image downloaded", { timeout: 20000 }).should("be.visible");
  });
});
