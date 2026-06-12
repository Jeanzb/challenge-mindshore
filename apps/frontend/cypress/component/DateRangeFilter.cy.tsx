import { DateRangeFilter } from "@/components/search/DateRangeFilter";

const noopDateChange = () => () => undefined;

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

  it("reveals from/to controls in custom mode", () => {
    cy.mount(
      <DateRangeFilter preset="custom" dateFrom="" dateTo="" onPresetChange={() => {}} onDateChange={noopDateChange} />
    );

    cy.contains("From").should("be.visible");
    cy.contains("To").should("be.visible");
    cy.contains("button", "yyyy-mm-dd").should("be.visible");
  });

  it("opens the calendar and reports selected dates", () => {
    const onDateChange = cy.stub().as("onDateChange");
    cy.mount(
      <DateRangeFilter
        preset="custom"
        dateFrom="2024-01-01"
        dateTo=""
        onPresetChange={() => {}}
        onDateChange={(field) => (value) => onDateChange(field, value)}
      />
    );

    cy.contains("button", "01/01/2024").click();
    cy.contains("January 2024").should("be.visible");
    cy.contains("button", /^15$/).click();
    cy.get("@onDateChange").should("have.been.calledWith", "dateFrom", "2024-01-15");
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
