import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { render, screen, fireEvent } from "@testing-library/react";

import { StatixProvider } from "../../context/StatixProvider";
import { StatixDrawer } from "../../components/StatixDrawer";

import "@testing-library/jest-dom";

// Mock dependencies
vi.mock("../../utils/loadLocales", () => ({
  loadLocaleFiles: vi.fn().mockResolvedValue({
    en: { "test.key": "Test Value" },
    tr: { "test.key": "Test Değeri" },
  }),
}));

// Mock the asset import
vi.mock("../../assets/statix.svg", () => ({
  default: "mocked-statix-icon",
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

describe("StatixDrawer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  const renderWithProvider = (component: React.ReactNode, editable = true) => {
    return render(
      <StatixProvider config={{ localePath: "public/locales", languagesKeys: {}, editable }}>
        {component}
      </StatixProvider>
    );
  };

  it("should render when editable is true", () => {
    renderWithProvider(<div />);

    // Check that the statix button is rendered
    const button = screen.getByTestId("statix-button");
    expect(button).toBeInTheDocument();
    
    // Check for the SVG inside the button
    const svg = button.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("should not render when editable is false", () => {
    renderWithProvider(<div />, false);

    // Should not render the statix button when editable is false
    expect(screen.queryByTestId("statix-button")).not.toBeInTheDocument();
  });

  it("should render children content", () => {
    renderWithProvider(
      <StatixDrawer>
        <div data-testid="child-content">Test Child Content</div>
      </StatixDrawer>
    );

    // Child content should be rendered within the drawer
    const childContent = screen.getByTestId("child-content");
    expect(childContent).toBeInTheDocument();
    expect(childContent).toHaveTextContent("Test Child Content");
  });

  it("should toggle drawer when button is clicked", () => {
    renderWithProvider(<div />);

    const button = screen.getByTestId("statix-button");
    const contentArea = screen.getAllByRole("generic").find(el => el.style.position === "fixed");

    // Initially closed
    expect(contentArea).toHaveStyle({ bottom: "-70vh" });

    // Click to open
    fireEvent.click(button!);
    expect(contentArea).toHaveStyle({ bottom: "0px" });

    // Click again to close
    fireEvent.click(button!);
    expect(contentArea).toHaveStyle({ bottom: "-70vh" });
  });

  it("should apply correct button styles", () => {
    renderWithProvider(<div />);

    const button = screen.getByTestId("statix-button");

    // Check key style properties
    expect(button).toHaveStyle({
      position: "fixed",
      bottom: "12px",
      right: "12px",
      width: "50px",
      height: "50px",
    });
  });
});
