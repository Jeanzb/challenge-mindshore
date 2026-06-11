import { DateRangeFilter } from "@/components/search/DateRangeFilter";

const noopDateChange = () => () => {};

describe("<DateRangeFilter />", () => {
  it("renders the four quick presets", () => {
    cy.mount(
      <DateRangeFilter preset="any" dateFrom="" dateTo="" onPresetChange={() => {}} onDateChange={noopDateChange} />
    );

    cy.contains("button", "Any time").should("be.visible");
    cy.contains("button", "Last 30 days").should("be.visible");
    cy.contains("button", "Last year").should("be.visible");
    cy.contains("button", "Custom").should("be.visible");
  });

  it("marks the active preset as pressed", () => {
    cy.mount(
      <DateRangeFilter preset="last-year" dateFrom="" dateTo="" onPresetChange={() => {}} onDateChange={noopDateChange} />
    );

    cy.contains("button", "Last year").should("have.attr", "aria-pressed", "true");
    cy.contains("button", "Any time").should("have.attr", "aria-pressed", "false");
  });

  it("calls onPresetChange with the chosen preset", () => {
    const onPresetChange = cy.stub().as("onPresetChange");
    cy.mount(
      <DateRangeFilter preset="any" dateFrom="" dateTo="" onPresetChange={onPresetChange} onDateChange={noopDateChange} />
    );

    cy.contains("button", "Custom").click();
    cy.get("@onPresetChange").should("have.been.calledWith", "custom");
  });

  it("shows a plain-language range and hides the date inputs by default", () => {
    cy.mount(
      <DateRangeFilter preset="any" dateFrom="" dateTo="" onPresetChange={() => {}} onDateChange={noopDateChange} />
    );

    cy.contains("Spanning the entire NASA archive").should("be.visible");
    cy.contains("From").should("not.exist");
  });

  it("reveals the from/to inputs in custom mode and reports edits", () => {
    const onDateChange = cy.stub().as("onDateChange").returns(() => {});
    cy.mount(
      <DateRangeFilter preset="custom" dateFrom="" dateTo="" onPresetChange={() => {}} onDateChange={onDateChange} />
    );

    cy.contains("From").should("be.visible");
    cy.contains("To").should("be.visible");
    cy.get("@onDateChange").should("have.been.calledWith", "dateFrom");
    cy.get("@onDateChange").should("have.been.calledWith", "dateTo");
  });

  it("describes a closed range in plain language", () => {
    cy.mount(
      <DateRangeFilter
        preset="custom"
        dateFrom="2024-01-01"
        dateTo="2024-12-31"
        onPresetChange={() => {}}
        onDateChange={noopDateChange}
      />
    );

    cy.contains("Jan 2024 → Dec 2024").should("be.visible");
  });
});
