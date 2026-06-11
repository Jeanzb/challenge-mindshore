import { CollectionPreviewCollage } from "@/components/collections";

describe("<CollectionPreviewCollage />", () => {
  it("renders empty slots without sample NASA images when the collection has no images", () => {
    cy.mount(<CollectionPreviewCollage accentClassName="from-space-cyan/20 via-space-cyan/5 to-transparent" previewImageUrls={[]} />);

    cy.get('[data-cy="collection-preview-image"]').should("not.exist");
    cy.get('[data-cy="collection-preview-empty-slot"]').should("have.length", 3);
  });

  it("renders each saved preview once instead of repeating it across the collage", () => {
    cy.mount(
      <CollectionPreviewCollage
        accentClassName="from-space-orange/25 via-space-orange/5 to-transparent"
        previewImageUrls={["https://images.test/one.jpg"]}
      />
    );

    cy.get('[data-cy="collection-preview-image"]')
      .should("have.length", 1)
      .and("have.attr", "src", "https://images.test/one.jpg");
    cy.get('[data-cy="collection-preview-empty-slot"]').should("have.length", 2);
  });
});
