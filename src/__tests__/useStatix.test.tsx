import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { act, renderHook } from "@testing-library/react";

import { StatixProvider } from "../context/StatixProvider";
import { useStatix } from "../hooks/useStatix";

import "@testing-library/jest-dom";

// Mock dependencies
vi.mock("../utils/loadLocales", () => ({
  loadLocaleFiles: vi.fn().mockResolvedValue({
    en: { "test.key": "Test Value" },
    tr: { "test.key": "Test Değeri" },
  }),
}));

vi.mock("../components/StatixDrawer.tsx", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="statix-drawer">{children}</div>
  ),
}));

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
});

describe("useStatix", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  it("should throw an error when used outside of StatixProvider", () => {
    // Suppress console.error for this test since we expect an error
    const originalError = console.error;
    console.error = vi.fn();

    expect(() => {
      renderHook(() => useStatix());
    }).toThrow("useStatix must be used within a StatixProvider");

    console.error = originalError;
  });

  it("should return context values when used within StatixProvider", async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <StatixProvider config={{ localePath: "test", languagesKeys: {} }}>
        {children}
      </StatixProvider>
    );

    let result: any;
    await act(async () => {
      const hookResult = renderHook(() => useStatix(), { wrapper });
      result = hookResult.result;
    });

    expect(result.current).toEqual({
      editable: expect.any(Boolean),
      locales: expect.any(Object),
      updateLocalValue: expect.any(Function),
      pendingChanges: expect.any(Object),
      resetChanges: expect.any(Function),
      saveChanges: expect.any(Function),
    });
  });

  it("should provide correct context properties", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <StatixProvider config={{ localePath: "test", languagesKeys: {} }}>
        {children}
      </StatixProvider>
    );

    const { result } = renderHook(() => useStatix(), { wrapper });

    // Check that all required properties are present
    expect(result.current.editable).toBeDefined();
    expect(result.current.locales).toBeDefined();
    expect(result.current.updateLocalValue).toBeDefined();
    expect(result.current.pendingChanges).toBeDefined();
    expect(result.current.resetChanges).toBeDefined();
    expect(result.current.saveChanges).toBeDefined();
  });

  it("should have correct function signatures", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <StatixProvider config={{ localePath: "test", languagesKeys: {} }}>
        {children}
      </StatixProvider>
    );

    const { result } = renderHook(() => useStatix(), { wrapper });

    // Check function types
    expect(typeof result.current.updateLocalValue).toBe("function");
    expect(typeof result.current.resetChanges).toBe("function");
    expect(typeof result.current.saveChanges).toBe("function");
  });

  it("should work with default config", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <StatixProvider>{children}</StatixProvider>
    );

    const { result } = renderHook(() => useStatix(), { wrapper });

    expect(result.current).toBeDefined();
    expect(result.current.editable).toBe(false);
    expect(result.current.locales).toEqual({});
    expect(result.current.pendingChanges).toEqual({});
  });

  it("should work with custom config", () => {
    const customConfig = {
      localePath: "custom/path",
      languagesKeys: { en: "english", tr: "turkish" },
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <StatixProvider config={customConfig}>{children}</StatixProvider>
    );

    const { result } = renderHook(() => useStatix(), { wrapper });

    expect(result.current).toBeDefined();
    expect(result.current.editable).toBe(false);
  });

  it("should handle localStorage data correctly", () => {
    const storedData = JSON.stringify({
      en: { "test.key": "Modified Value" },
    });
    mockLocalStorage.getItem.mockReturnValue(storedData);

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <StatixProvider>{children}</StatixProvider>
    );

    const { result } = renderHook(() => useStatix(), { wrapper });

    expect(result.current.pendingChanges).toEqual({
      en: { "test.key": "Modified Value" },
    });
  });

  it("should handle invalid localStorage data gracefully", () => {
    mockLocalStorage.getItem.mockReturnValue("invalid json");

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <StatixProvider>{children}</StatixProvider>
    );

    // Should not throw an error
    const { result } = renderHook(() => useStatix(), { wrapper });

    expect(result.current.pendingChanges).toEqual({});
  });

  it("should maintain hook stability across re-renders", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <StatixProvider>{children}</StatixProvider>
    );

    const { result, rerender } = renderHook(() => useStatix(), { wrapper });

    const firstRender = result.current;

    rerender();

    const secondRender = result.current;

    // Context should be the same reference
    expect(firstRender).toBe(secondRender);
  });

  it("should throw error with correct message", () => {
    const originalError = console.error;
    console.error = vi.fn();

    try {
      renderHook(() => useStatix());
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toBe(
        "useStatix must be used within a StatixProvider",
      );
    }

    console.error = originalError;
  });
});
