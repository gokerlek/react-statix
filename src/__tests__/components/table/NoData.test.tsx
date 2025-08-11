import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import NoData from "../../../components/table/NoData";

import "@testing-library/jest-dom";

vi.mock("../../../components/table/useStyle", () => ({
  useStyle: () => ({
    noData: {
      textAlign: "center",
      padding: "2rem",
      color: "#6b7280",
      fontSize: "1.125rem",
    }
  })
}));

describe("NoData", () => {
  it("should render with correct text", () => {
    render(
      <table>
        <tbody>
          <NoData colSpan={3} />
        </tbody>
      </table>
    );

    expect(screen.getByText("No data")).toBeInTheDocument();
  });

  it("should render with correct colspan", () => {
    render(
      <table>
        <tbody>
          <NoData colSpan={5} />
        </tbody>
      </table>
    );

    const cell = screen.getByText("No data").closest("td");
    expect(cell).toHaveAttribute("colspan", "5");
  });

  it("should apply styles correctly", () => {
    render(
      <table>
        <tbody>
          <NoData colSpan={1} />
        </tbody>
      </table>
    );

    const cell = screen.getByText("No data").closest("td");
    expect(cell).toHaveStyle({
      textAlign: "center",
      padding: "2rem",
      color: "#6b7280",
      fontSize: "1.125rem",
    });
  });
});