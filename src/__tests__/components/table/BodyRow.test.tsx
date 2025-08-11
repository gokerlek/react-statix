import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import BodyRow from "../../../components/table/BodyRow";
import { TableProvider } from "../../../components/table/TableContext";

import "@testing-library/jest-dom";

vi.mock("../../../components/table/useStyle", () => ({
  useStyle: () => ({
    tr: {
      borderBottom: "1px solid #e5e7eb",
    },
    td: ({ isFirstColumn, isEvenRow }: { isFirstColumn: boolean; isEvenRow: boolean }) => ({
      padding: "0.75rem 1rem",
      textAlign: "left",
      position: isFirstColumn ? "sticky" : "static",
      left: isFirstColumn ? "0px" : "auto",
      backgroundColor: isEvenRow ? "#f9fafb" : "#ffffff",
      zIndex: isFirstColumn ? 20 : "auto",
    }),
    keyDisplay: {
      color: "#6b7280",
      fontSize: "0.875rem",
    }
  })
}));

// Mock EditableTextarea since it's already tested
vi.mock("../../../components/table/EditableTextarea", () => ({
  default: ({ value, onChange }: { value: string; onChange: (value: string) => void }) => (
    <div data-testid="editable-textarea" data-value={value}>
      {value}
    </div>
  )
}));

const mockColumns = [
  { id: "key", header: "Key/Path", width: 250, accessor: "key" },
  { id: "en", header: "English", accessor:'en' },
];

const mockData = [
  { id: "1", key: "hello", path: "common", values: { en: "Hello" } },
  { id: "2", key: "world", path: "", values: { en: "World" } },
];

describe("BodyRow", () => {
  it("should render key column with path correctly", () => {
    render(
      <TableProvider initialColumns={mockColumns} initialData={mockData}>
        <table>
          <tbody>
            <BodyRow row={mockData[0]} rowIndex={0} />
          </tbody>
        </table>
      </TableProvider>
    );

    expect(screen.getByText("common.")).toBeInTheDocument();
    expect(screen.getByText("hello")).toBeInTheDocument();
  });

  it("should render key column without path correctly", () => {
    render(
      <TableProvider initialColumns={mockColumns} initialData={mockData}>
        <table>
          <tbody>
            <BodyRow row={mockData[1]} rowIndex={0} />
          </tbody>
        </table>
      </TableProvider>
    );

    expect(screen.queryByText(".")).not.toBeInTheDocument();
    expect(screen.getByText("world")).toBeInTheDocument();
  });

  it("should render editable textarea for non-key columns", () => {
    render(
      <TableProvider initialColumns={mockColumns} initialData={mockData}>
        <table>
          <tbody>
            <BodyRow row={mockData[0]} rowIndex={0} />
          </tbody>
        </table>
      </TableProvider>
    );

    const textarea = screen.getByTestId("editable-textarea");
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveAttribute("data-value", "Hello");
  });

  it("should apply correct styles for even row", () => {
    render(
      <TableProvider initialColumns={mockColumns} initialData={mockData}>
        <table>
          <tbody>
            <BodyRow row={mockData[0]} rowIndex={0} />
          </tbody>
        </table>
      </TableProvider>
    );

    const cells = screen.getAllByRole("cell");
    expect(cells[0]).toHaveStyle({
      backgroundColor: "#f9fafb", // Even row
      position: "sticky",
      left: "0px",
      zIndex: "20",
    });
  });

  it("should apply correct styles for odd row", () => {
    render(
      <TableProvider initialColumns={mockColumns} initialData={mockData}>
        <table>
          <tbody>
            <BodyRow row={mockData[0]} rowIndex={1} />
          </tbody>
        </table>
      </TableProvider>
    );

    const cells = screen.getAllByRole("cell");
    expect(cells[0]).toHaveStyle({
      backgroundColor: "#ffffff", // Odd row
    });
  });
});
