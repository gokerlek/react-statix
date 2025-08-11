import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import ColumnVisibilityToggle from "../../../components/table/ColumnVisibilityToggle";
import { TableProvider } from "../../../components/table/TableContext";

import "@testing-library/jest-dom";

vi.mock("../../../components/table/useStyle", () => ({
  useStyle: () => ({
    dropdown: {
      position: "relative",
      display: "inline-block",
    },
    dropdownMenu: ({ isOpen }: { isOpen: boolean }) => ({
      display: isOpen ? "block" : "none",
      position: "absolute",
      right: "0px",
      marginTop: "0.5rem",
      width: "14rem",
      borderRadius: "0.375rem",
      backgroundColor: "#fafafa",
      border: "1px solid #e3e3e3",
      zIndex: 50,
    }),
    dropdownItem: {
      display: "flex",
      alignItems: "center",
      padding: "0.5rem 1rem",
      cursor: "pointer",
    },
    checkbox: {
      marginRight: "0.5rem",
    },
    checkboxChecked: {
      backgroundColor: "#007bff",
    }
  })
}));

// Mock IconButton since it's already tested
vi.mock("../../../components/IconButton", () => ({
  IconButton: ({ onClick, children, label }: { onClick: () => void; children: React.ReactNode; label: string }) => (
    <button onClick={onClick} data-testid="icon-button" aria-label={label}>
      {children}
    </button>
  )
}));

const mockColumns = [
  { id: "key", header: "Key/Path", width: 250, accessor: "path" },
  { id: "en", header: "English", accessor: "en" },
  { id: "tr", header: "Turkish" ,  accessor: "tr" },
  { id: "es", header: "Spanish",  accessor: "es" },
];

const mockData = [
  { id: "1", key: "hello", path: "common", values: { en: "Hello", tr: "Merhaba", es: "Hola" } },
];

describe("ColumnVisibilityToggle", () => {
  it("should render toggle button", () => {
    render(
      <TableProvider initialColumns={mockColumns} initialData={mockData}>
        <ColumnVisibilityToggle />
      </TableProvider>
    );

    const button = screen.getByTestId("icon-button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("aria-label", "Column Visibility");
  });

  it("should show dropdown when button is clicked", () => {
    render(
      <TableProvider initialColumns={mockColumns} initialData={mockData}>
        <ColumnVisibilityToggle />
      </TableProvider>
    );

    const button = screen.getByTestId("icon-button");
    fireEvent.click(button);

    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("should render checkboxes for non-key columns", () => {
    render(
      <TableProvider initialColumns={mockColumns} initialData={mockData}>
        <ColumnVisibilityToggle />
      </TableProvider>
    );

    const button = screen.getByTestId("icon-button");
    fireEvent.click(button);

    // Should have checkboxes for en, tr, es but not key
    expect(screen.getByText("English")).toBeInTheDocument();
    expect(screen.getByText("Turkish")).toBeInTheDocument();
    expect(screen.getByText("Spanish")).toBeInTheDocument();
    expect(screen.queryByText("Key/Path")).not.toBeInTheDocument();
  });

  it("should have all checkboxes checked initially", () => {
    render(
      <TableProvider initialColumns={mockColumns} initialData={mockData}>
        <ColumnVisibilityToggle />
      </TableProvider>
    );

    const button = screen.getByTestId("icon-button");
    fireEvent.click(button);

    const checkboxes = screen.getAllByRole("checkbox");
    checkboxes.forEach(checkbox => {
      expect(checkbox).toBeChecked();
    });
  });

  it("should toggle checkbox when clicked", () => {
    render(
      <TableProvider initialColumns={mockColumns} initialData={mockData}>
        <ColumnVisibilityToggle />
      </TableProvider>
    );

    const button = screen.getByTestId("icon-button");
    fireEvent.click(button);

    const englishCheckbox = screen.getAllByRole("checkbox")[0];
    expect(englishCheckbox).toBeChecked();

    fireEvent.click(englishCheckbox);
    expect(englishCheckbox).not.toBeChecked();
  });

  it("should close dropdown when clicked outside", () => {
    render(
      <div>
        <TableProvider initialColumns={mockColumns} initialData={mockData}>
          <ColumnVisibilityToggle />
        </TableProvider>
        <div data-testid="outside">Outside element</div>
      </div>
    );

    const button = screen.getByTestId("icon-button");
    fireEvent.click(button);

    expect(screen.getByRole("menu")).toBeInTheDocument();

    const outsideElement = screen.getByTestId("outside");
    fireEvent.mouseDown(outsideElement);

    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });
});
