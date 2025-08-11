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

  it("should render StatixButton and StatixContent when editable is true", () => {
    renderWithProvider(<div />);

    // Check that the button is rendered (from StatixProvider's StatixDrawer)
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    
    // Check for the SVG inside the button
    const svg = screen.getByTestId("statix-button").querySelector("svg");
    expect(svg).toBeInTheDocument();

    // Check that the content area is rendered (but closed by default)
    const contentArea = screen.getAllByRole("generic").find(el => el.style.position === "fixed");
    expect(contentArea).toBeInTheDocument();
  });

  it("should not render when editable is false", () => {
    renderWithProvider(<div />, false);

    // Should not render the button or content when editable is false
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.queryByTestId("statix-button")).not.toBeInTheDocument();
  });

  it("should pass children to StatixContent", () => {
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

  it("should toggle drawer state when button is clicked", () => {
    renderWithProvider(<div />);

    const button = screen.getByTestId("statix-button");
    const contentArea = screen.getAllByRole("generic").find(el => el.style.position === "fixed");

    // Initially closed (bottom: -90vh)
    expect(contentArea).toHaveStyle({ bottom: "-90vh" });

    // Click to open
    fireEvent.click(button!);

    // Should be open (bottom: 0)
    expect(contentArea).toHaveStyle({ bottom: "0" });

    // Click again to close
    fireEvent.click(button!);

    // Should be closed again
    expect(contentArea).toHaveStyle({ bottom: "-90vh" });
  });

  it("should maintain drawer state across multiple toggles", () => {
    renderWithProvider(<div />);

    const button = screen.getByTestId("statix-button");
    const contentArea = screen.getAllByRole("generic").find(el => el.style.position === "fixed");

    // Multiple toggles
    fireEvent.click(button!); // Open
    expect(contentArea).toHaveStyle({ bottom: "0" });

    fireEvent.click(button!); // Close
    expect(contentArea).toHaveStyle({ bottom: "-90vh" });

    fireEvent.click(button!); // Open
    expect(contentArea).toHaveStyle({ bottom: "0" });

    fireEvent.click(button!); // Close
    expect(contentArea).toHaveStyle({ bottom: "-90vh" });
  });

  it("should apply correct styles to StatixButton", () => {
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

  it("should apply correct styles to StatixContent", () => {
    renderWithProvider(<div />);

    const contentArea = screen.getAllByRole("generic").find(el => el.style.position === "fixed");

    // Check key style properties
    expect(contentArea).toHaveStyle({
      position: "fixed",
      left: "0",
      width: "100%",
      height: "90vh",
      backgroundColor: "#ffffff",
      zIndex: "100000",
      borderTopLeftRadius: "10px",
      borderTopRightRadius: "10px",
      padding: "20px",
    });
  });

  it("should handle children rendering correctly", () => {
    const TestChild = () => (
      <div data-testid="test-child">
        <h1>Test Header</h1>
        <p>Test paragraph</p>
      </div>
    );

    renderWithProvider(
      <StatixDrawer>
        <TestChild />
      </StatixDrawer>
    );

    // Child should be rendered
    const testChild = screen.getByTestId("test-child");
    expect(testChild).toBeInTheDocument();

    // Child content should be present
    expect(screen.getByText("Test Header")).toBeInTheDocument();
    expect(screen.getByText("Test paragraph")).toBeInTheDocument();
  });

  it("should handle empty children gracefully", () => {
    renderWithProvider(<StatixDrawer>{null}</StatixDrawer>);

    // Should still render the structure
    const button = screen.getAllByTestId("statix-button")[0];
    const contentArea = screen.getAllByRole("generic").find(el => el.style.position === "fixed");

    expect(button).toBeInTheDocument();
    expect(contentArea).toBeInTheDocument();
  });

  it("should handle multiple children", () => {
    renderWithProvider(
      <StatixDrawer>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
        <div data-testid="child-3">Child 3</div>
      </StatixDrawer>
    );

    // All children should be rendered
    expect(screen.getByTestId("child-1")).toBeInTheDocument();
    expect(screen.getByTestId("child-2")).toBeInTheDocument();
    expect(screen.getByTestId("child-3")).toBeInTheDocument();
  });

  it("should maintain component state correctly", () => {
    renderWithProvider(
      <StatixDrawer>
        <div data-testid="test-child">Test Child</div>
      </StatixDrawer>
    );

    // Verify child is rendered
    expect(screen.getByTestId("test-child")).toBeInTheDocument();
    
    // Drawer functionality should work correctly - get the first button
    const button = screen.getAllByTestId("statix-button")[0];
    const contentAreas = screen.getAllByRole("generic").filter(el => el.style.position === "fixed");
    const contentArea = contentAreas[0];
    
    // Initially closed
    expect(contentArea).toHaveStyle({ bottom: "-90vh" });
    
    // Click to open
    fireEvent.click(button!);
    expect(contentArea).toHaveStyle({ bottom: "0" });
    
    // Click to close
    fireEvent.click(button!);
    expect(contentArea).toHaveStyle({ bottom: "-90vh" });
  });

  it("should use correct button onClick handler", () => {
    renderWithProvider(<div />);

    const button = screen.getByTestId("statix-button");
    const contentArea = screen.getAllByRole("generic").find(el => el.style.position === "fixed");

    // Verify initial state
    expect(contentArea).toHaveStyle({ bottom: "-90vh" });

    // Test click handler
    fireEvent.click(button!);
    expect(contentArea).toHaveStyle({ bottom: "0" });
  });

  it("should pass isOpen prop correctly to StatixContent", () => {
    renderWithProvider(<div />);

    const button = screen.getByTestId("statix-button");
    const contentArea = screen.getAllByRole("generic").find(el => el.style.position === "fixed");

    // Initially closed
    expect(contentArea).toHaveStyle({ bottom: "-90vh" });

    // Open
    fireEvent.click(button!);
    expect(contentArea).toHaveStyle({ bottom: "0" });

    // Close
    fireEvent.click(button!);
    expect(contentArea).toHaveStyle({ bottom: "-90vh" });
  });
});
