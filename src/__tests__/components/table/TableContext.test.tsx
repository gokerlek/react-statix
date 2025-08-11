import React from "react";
import { renderHook, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { TableProvider, useTableContext } from "../../../components/table/TableContext";

import "@testing-library/jest-dom";

// Mock window.innerWidth
Object.defineProperty(window, 'innerWidth', {
  writable: true,
  configurable: true,
  value: 1200,
});

const mockColumns = [
  { id: "key", header: "Key/Path", width: 250, accessor: "key" },
  { id: "en", header: "English", accessor: "en" },
  { id: "tr", header: "Turkish", accessor: "tr" }
];

const mockData = [
  { id: "1", key: "hello", path: "common", values: { en: "Hello", tr: "Merhaba" } },
  { id: "2", key: "world", path: "common", values: { en: "World", tr: "Dünya" } }
];

describe("TableContext", () => {
  describe("useTableContext", () => {
    it("should throw error when used outside provider", () => {
      const originalError = console.error;
      console.error = vi.fn();

      expect(() => {
        renderHook(() => useTableContext());
      }).toThrow("useTableContext must be used within a TableProvider");

      console.error = originalError;
    });

    it("should return context values when used within provider", () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <TableProvider initialColumns={mockColumns} initialData={mockData}>
          {children}
        </TableProvider>
      );

      const { result } = renderHook(() => useTableContext(), { wrapper });

      expect(result.current.columns).toEqual(mockColumns);
      expect(result.current.data).toEqual(mockData);
      expect(result.current.columnWidths).toBeDefined();
      expect(result.current.columnVisibility).toBeDefined();
      expect(result.current.visibleColumns).toBeDefined();
      expect(typeof result.current.onMouseDown).toBe("function");
      expect(typeof result.current.toggleColumnVisibility).toBe("function");
    });
  });

  describe("TableProvider", () => {
    it("should render children correctly", () => {
      render(
        <TableProvider initialColumns={mockColumns} initialData={mockData}>
          <div data-testid="child">Test Child</div>
        </TableProvider>
      );

      expect(document.querySelector('[data-testid="child"]')).toBeInTheDocument();
    });

    it("should initialize column widths correctly", () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <TableProvider initialColumns={mockColumns} initialData={mockData}>
          {children}
        </TableProvider>
      );

      const { result } = renderHook(() => useTableContext(), { wrapper });

      expect(result.current.columnWidths.key).toBe(250);
      expect(result.current.columnWidths.en).toBeGreaterThan(0);
      expect(result.current.columnWidths.tr).toBeGreaterThan(0);
    });

    it("should initialize column visibility correctly", () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <TableProvider initialColumns={mockColumns} initialData={mockData}>
          {children}
        </TableProvider>
      );

      const { result } = renderHook(() => useTableContext(), { wrapper });

      expect(result.current.columnVisibility.key).toBe(true);
      expect(result.current.columnVisibility.en).toBe(true);
      expect(result.current.columnVisibility.tr).toBe(true);
    });

    it("should filter visible columns correctly", () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <TableProvider initialColumns={mockColumns} initialData={mockData}>
          {children}
        </TableProvider>
      );

      const { result } = renderHook(() => useTableContext(), { wrapper });

      expect(result.current.visibleColumns).toHaveLength(3);
      expect(result.current.visibleColumns).toEqual(mockColumns);
    });

    it("should pass optional props correctly", () => {
      const mockGetDisplayValue = vi.fn();
      const mockUpdateLocalValue = vi.fn();

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <TableProvider 
          initialColumns={mockColumns} 
          initialData={mockData}
          getDisplayValue={mockGetDisplayValue}
          updateLocalValue={mockUpdateLocalValue}
        >
          {children}
        </TableProvider>
      );

      const { result } = renderHook(() => useTableContext(), { wrapper });

      expect(result.current.getDisplayValue).toBe(mockGetDisplayValue);
      expect(result.current.updateLocalValue).toBe(mockUpdateLocalValue);
    });
  });
});
