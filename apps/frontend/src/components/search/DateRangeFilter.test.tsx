import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DateRangeFilter } from "@/components/search/DateRangeFilter";

const noopDateChange = () => () => {};

describe("DateRangeFilter", () => {
  it("renders the four quick presets", () => {
    render(
      <DateRangeFilter preset="any" dateFrom="" dateTo="" onPresetChange={() => {}} onDateChange={noopDateChange} />
    );

    expect(screen.getByRole("button", { name: "Any time" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Last 30 days" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Last year" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Custom" })).toBeInTheDocument();
  });

  it("marks the active preset as pressed", () => {
    render(
      <DateRangeFilter preset="last-year" dateFrom="" dateTo="" onPresetChange={() => {}} onDateChange={noopDateChange} />
    );

    expect(screen.getByRole("button", { name: "Last year" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Any time" })).toHaveAttribute("aria-pressed", "false");
  });

  it("calls onPresetChange with the chosen preset", () => {
    const onPresetChange = vi.fn();
    render(
      <DateRangeFilter preset="any" dateFrom="" dateTo="" onPresetChange={onPresetChange} onDateChange={noopDateChange} />
    );

    fireEvent.click(screen.getByRole("button", { name: "Custom" }));

    expect(onPresetChange).toHaveBeenCalledWith("custom");
  });

  it("shows a plain-language range and hides the date inputs by default", () => {
    render(
      <DateRangeFilter preset="any" dateFrom="" dateTo="" onPresetChange={() => {}} onDateChange={noopDateChange} />
    );

    expect(screen.getByText("Spanning the entire NASA archive")).toBeInTheDocument();
    expect(screen.queryByText("From")).not.toBeInTheDocument();
  });

  it("reveals the from/to inputs in custom mode", () => {
    render(
      <DateRangeFilter preset="custom" dateFrom="" dateTo="" onPresetChange={() => {}} onDateChange={noopDateChange} />
    );

    expect(screen.getByText("From")).toBeInTheDocument();
    expect(screen.getByText("To")).toBeInTheDocument();
  });
});
