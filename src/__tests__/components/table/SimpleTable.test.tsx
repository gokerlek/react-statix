import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import SimpleTable from "../../../components/table/SimpleTable";
import { TableProvider } from "../../../components/table/TableContext";

import "@testing-library/jest-dom";

vi.mock("../../../components/table/useStyle", () => ({
  useStyle: () => ({
    scrollContainer: {
      overflowY: "auto",
      overflowX: "auto",
      position: "relative",
      flex: "1 1 0%",
      borderRadius: "0.625rem",
      border: "1px solid #e3e3e3",
      zIndex: 10,
      maxHeight: "max-content",
    },
    table: {
      tableLayout: "fixed",
      borderCollapse: "collapse",
    },
    thead: {
      position: "sticky",
      top: "0px",
      backgroundColor: "#e3e3e3",
      color: "#3a3a3a",
      fontWeight: "500",
      zIndex: 20,
    }
  })
}));

// Mock child components since they're already tested
vi.mock("../../../components/table/HeadTableCell", () => ({
  default: ({ column }: { column: { id: string; header: string } }) => (
    <th data-testid={`head-cell-${column.id}`}>{column.header}</th>
  )
}));

vi.mock("../../../components/table/NoData", () => ({
  default: ({ colSpan }: { colSpan: number }) => (
    <tr data-testid="no-data">
      <td colSpan={colSpan}>No data</td>
    </tr>
  )
}));

vi.mock("../../../components/table/BodyRow", () => ({
  default: ({ row, rowIndex }: { row: any; rowIndex: number }) => (
    <tr data-testid={`body-row-${row.id}`}>
      <td>{row.key}</td>
    </tr>
  )
}));

const mockColumns = [
  { id: "key", header: "Key/Path", width: 250, accessor: "key" },
  { id: "en", header: "English", accessor: "en" },
  { id: "tr", header: "Turkish", accessor: "tr" }
];

const mockDataWithRows = [
  { id: "1", key: "hello", path: "common", values: { en: "Hello", tr: "Merhaba" } },
  { id: "2", key: "world", path: "common", values: { en: "World", tr: "Dünya" } }
];

const mockEmptyData: any[] = [];

describe("SimpleTable", () => {
  it("should render table structure correctly", () => {
    render(
      <TableProvider initialColumns={mockColumns} initialData={mockDataWithRows}>
        <SimpleTable />
      </TableProvider>
    );

    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(document.querySelector("thead")).toBeInTheDocument();
    expect(document.querySelector("tbody")).toBeInTheDocument();
  });

  it("should render header cells for visible columns", () => {
    render(
      <TableProvider initialColumns={mockColumns} initialData={mockDataWithRows}>
        <SimpleTable />
      </TableProvider>
    );

    expect(screen.getByTestId("head-cell-key")).toBeInTheDocument();
    expect(screen.getByTestId("head-cell-en")).toBeInTheDocument();
    expect(screen.getByTestId("head-cell-tr")).toBeInTheDocument();
    expect(screen.getByText("Key/Path")).toBeInTheDocument();
    expect(screen.getByText("English")).toBeInTheDocument();
    expect(screen.getByText("Turkish")).toBeInTheDocument();
  });

  it("should render body rows when data exists", () => {
    render(
      <TableProvider initialColumns={mockColumns} initialData={mockDataWithRows}>
        <SimpleTable />
      </TableProvider>
    );

    expect(screen.getByTestId("body-row-1")).toBeInTheDocument();
    expect(screen.getByTestId("body-row-2")).toBeInTheDocument();
    expect(screen.queryByTestId("no-data")).not.toBeInTheDocument();
  });

  it("should render NoData component when data is empty", () => {
    render(
      <TableProvider initialColumns={mockColumns} initialData={mockEmptyData}>
        <SimpleTable />
      </TableProvider>
    );

    expect(screen.getByTestId("no-data")).toBeInTheDocument();
    expect(screen.getByText("No data")).toBeInTheDocument();
    expect(screen.queryByTestId("body-row-1")).not.toBeInTheDocument();
  });

  it("should apply correct styles to scroll container", () => {
    render(
      <TableProvider initialColumns={mockColumns} initialData={mockDataWithRows}>
        <SimpleTable />
      </TableProvider>
    );

    const scrollContainer = screen.getByRole("table").parentElement;
    expect(scrollContainer).toHaveStyle({
      overflowY: "auto",
      overflowX: "auto",
      position: "relative",
      borderRadius: "0.625rem",
      border: "1px solid #e3e3e3",
    });
  });

  it("should apply correct styles to table", () => {
    render(
      <TableProvider initialColumns={mockColumns} initialData={mockDataWithRows}>
        <SimpleTable />
      </TableProvider>
    );

    const table = screen.getByRole("table");
    expect(table).toHaveStyle({
      tableLayout: "fixed",
      borderCollapse: "collapse",
    });
  });

  it("should apply correct styles to thead", () => {
    render(
      <TableProvider initialColumns={mockColumns} initialData={mockDataWithRows}>
        <SimpleTable />
      </TableProvider>
    );

    const thead = document.querySelector("thead");
    expect(thead).toHaveStyle({
      position: "sticky",
      top: "0px",
      backgroundColor: "#e3e3e3",
      color: "#3a3a3a",
      fontWeight: "500",
      zIndex: "20",
    });
  });
});
