import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import HeadTableCell from "../../../components/table/HeadTableCell";
import { TableProvider } from "../../../components/table/TableContext";

import "@testing-library/jest-dom";

vi.mock("../../../components/table/useStyle", () => ({
  useStyle: () => ({
    th: ({ isFirstColumn }: { isFirstColumn: boolean }) => ({
      padding: "0.75rem 1rem",
      textAlign: "left",
      fontWeight: "500",
      fontSize: "0.875rem",
      position: isFirstColumn ? "sticky" : "static",
      left: isFirstColumn ? "0px" : "auto",
      backgroundColor: "#e3e3e3",
      zIndex: isFirstColumn ? 30 : "auto",
    }),
    resizer: {
      position: "absolute",
      top: "0px",
      right: "0px",
      width: "0.5rem",
      height: "100%",
      cursor: "col-resize",
      opacity: 1,
    }
  })
}));

const mockColumns = [
  { id: "key", header: "Key/Path", width: 250, accessor: "key" },
  { id: "en", header: "English", accessor: "en" },
];

const mockData = [
  { id: "1", key: "hello", path: "common", values: { en: "Hello" } },
];

describe("HeadTableCell", () => {
  it("should render column header correctly", () => {
    render(
      <TableProvider initialColumns={mockColumns} initialData={mockData}>
        <table>
          <thead>
            <tr>
              <HeadTableCell index={0} column={mockColumns[0]} isFirstColumn={true} />
            </tr>
          </thead>
        </table>
      </TableProvider>
    );

    expect(screen.getByText("Key/Path")).toBeInTheDocument();
  });

  it("should render resizer element", () => {
    render(
      <TableProvider initialColumns={mockColumns} initialData={mockData}>
        <table>
          <thead>
            <tr>
              <HeadTableCell index={0} column={mockColumns[0]} isFirstColumn={true} />
            </tr>
          </thead>
        </table>
      </TableProvider>
    );

    const resizer = document.querySelector('.resizer');
    expect(resizer).toBeInTheDocument();
  });

  it("should apply correct styles for first column", () => {
    render(
      <TableProvider initialColumns={mockColumns} initialData={mockData}>
        <table>
          <thead>
            <tr>
              <HeadTableCell index={0} column={mockColumns[0]} isFirstColumn={true} />
            </tr>
          </thead>
        </table>
      </TableProvider>
    );

    const cell = screen.getByText("Key/Path").closest("th");
    expect(cell).toHaveStyle({
      position: "sticky",
      left: "0px",
      zIndex: "30",
    });
  });

  it("should apply correct styles for non-first column", () => {
    render(
      <TableProvider initialColumns={mockColumns} initialData={mockData}>
        <table>
          <thead>
            <tr>
              <HeadTableCell index={0} column={mockColumns[1]} isFirstColumn={false} />
            </tr>
          </thead>
        </table>
      </TableProvider>
    );

    const cell = screen.getByText("English").closest("th");
    expect(cell).toHaveStyle({
      position: "static",
      left: "auto",
    });
  });
});
