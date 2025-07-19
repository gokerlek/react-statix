import { beforeEach, describe, expect, it, vi } from "vitest";

import { render, screen } from "@testing-library/react";

import { StatixContent } from "../components/StatixContent";

import "@testing-library/jest-dom";

describe("StatixContent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render with correct structure", () => {
    render(<StatixContent isOpen={true} />);

    const contentArea = screen
      .getAllByRole("generic")
      .find((el) => el.style.position === "fixed");
    expect(contentArea).toBeInTheDocument();

    // Should have a nested div for children
    const childrenContainer = contentArea!.querySelector("div");
    expect(childrenContainer).toBeInTheDocument();
  });

  it("should render children when provided", () => {
    render(
      <StatixContent isOpen={true}>
        <div data-testid="test-child">Test Content</div>
      </StatixContent>,
    );

    const childElement = screen.getByTestId("test-child");
    expect(childElement).toBeInTheDocument();
    expect(childElement).toHaveTextContent("Test Content");
  });

  it("should render multiple children", () => {
    render(
      <StatixContent isOpen={true}>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
        <div data-testid="child-3">Child 3</div>
      </StatixContent>,
    );

    expect(screen.getByTestId("child-1")).toBeInTheDocument();
    expect(screen.getByTestId("child-2")).toBeInTheDocument();
    expect(screen.getByTestId("child-3")).toBeInTheDocument();
  });

  it("should handle no children gracefully", () => {
    render(<StatixContent isOpen={true} />);

    const contentArea = screen
      .getAllByRole("generic")
      .find((el) => el.style.position === "fixed");
    expect(contentArea).toBeInTheDocument();

    // Should still have the children container
    const childrenContainer = contentArea!.querySelector("div");
    expect(childrenContainer).toBeInTheDocument();
  });

  it("should apply correct styles when open", () => {
    render(<StatixContent isOpen={true} />);

    const contentArea = screen
      .getAllByRole("generic")
      .find((el) => el.style.position === "fixed");

    expect(contentArea).toHaveStyle({
      position: "fixed",
      bottom: "0",
      left: "0",
      width: "100%",
      height: "90vh",
      backgroundColor: "#ffffff",
      zIndex: "100000",
      borderTopLeftRadius: "10px",
      borderTopRightRadius: "10px",
      padding: "20px",
      overflow: "auto",
    });
  });

  it("should apply correct styles when closed", () => {
    render(<StatixContent isOpen={false} />);

    const contentArea = screen
      .getAllByRole("generic")
      .find((el) => el.style.position === "fixed");

    expect(contentArea).toHaveStyle({
      position: "fixed",
      bottom: "-90vh",
      left: "0",
      width: "100%",
      height: "90vh",
      backgroundColor: "#ffffff",
      zIndex: "100000",
      borderTopLeftRadius: "10px",
      borderTopRightRadius: "10px",
      padding: "20px",
      overflow: "auto",
    });
  });

  it("should apply transition styles", () => {
    render(<StatixContent isOpen={true} />);

    const contentArea = screen
      .getAllByRole("generic")
      .find((el) => el.style.position === "fixed");

    expect(contentArea).toHaveStyle({
      transition: "bottom 0.3s ease-in-out",
    });
  });

  it("should apply box shadow", () => {
    render(<StatixContent isOpen={true} />);

    const contentArea = screen
      .getAllByRole("generic")
      .find((el) => el.style.position === "fixed");

    expect(contentArea).toHaveStyle({
      boxShadow: "0 -2px 10px rgba(0,0,0,0.1)",
    });
  });

  it("should change bottom position based on isOpen prop", () => {
    const { rerender } = render(<StatixContent isOpen={false} />);

    let contentArea = screen
      .getAllByRole("generic")
      .find((el) => el.style.position === "fixed");

    // Initially closed
    expect(contentArea).toHaveStyle({ bottom: "-90vh" });

    // Change to open
    rerender(<StatixContent isOpen={true} />);
    contentArea = screen
      .getAllByRole("generic")
      .find((el) => el.style.position === "fixed");
    expect(contentArea).toHaveStyle({ bottom: "0" });

    // Change back to closed
    rerender(<StatixContent isOpen={false} />);
    contentArea = screen
      .getAllByRole("generic")
      .find((el) => el.style.position === "fixed");
    expect(contentArea).toHaveStyle({ bottom: "-90vh" });
  });

  it("should maintain children content when isOpen changes", () => {
    const { rerender } = render(
      <StatixContent isOpen={false}>
        <div data-testid="persistent-child">Persistent Content</div>
      </StatixContent>,
    );

    // Content should be present even when closed
    expect(screen.getByTestId("persistent-child")).toBeInTheDocument();

    // Change to open
    rerender(
      <StatixContent isOpen={true}>
        <div data-testid="persistent-child">Persistent Content</div>
      </StatixContent>,
    );

    // Content should still be present
    expect(screen.getByTestId("persistent-child")).toBeInTheDocument();
  });

  it("should handle complex children", () => {
    const ComplexChild = () => (
      <div data-testid="complex-child">
        <h1>Header</h1>
        <p>Paragraph</p>
        <button>Button</button>
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
        </ul>
      </div>
    );

    render(
      <StatixContent isOpen={true}>
        <ComplexChild />
      </StatixContent>,
    );

    const complexChild = screen.getByTestId("complex-child");
    expect(complexChild).toBeInTheDocument();

    // Check all nested elements
    expect(screen.getByText("Header")).toBeInTheDocument();
    expect(screen.getByText("Paragraph")).toBeInTheDocument();
    expect(screen.getByText("Button")).toBeInTheDocument();
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
  });

  it("should handle null children", () => {
    render(<StatixContent isOpen={true}>{null}</StatixContent>);

    const contentArea = screen
      .getAllByRole("generic")
      .find((el) => el.style.position === "fixed");
    expect(contentArea).toBeInTheDocument();

    // Should still have the children container
    const childrenContainer = contentArea!.querySelector("div");
    expect(childrenContainer).toBeInTheDocument();
  });

  it("should handle undefined children", () => {
    render(<StatixContent isOpen={true}>{undefined}</StatixContent>);

    const contentArea = screen
      .getAllByRole("generic")
      .find((el) => el.style.position === "fixed");
    expect(contentArea).toBeInTheDocument();

    // Should still have the children container
    const childrenContainer = contentArea!.querySelector("div");
    expect(childrenContainer).toBeInTheDocument();
  });

  it("should handle text content as children", () => {
    render(<StatixContent isOpen={true}>Simple text content</StatixContent>);

    expect(screen.getByText("Simple text content")).toBeInTheDocument();
  });

  it("should handle mixed content types", () => {
    render(
      <StatixContent isOpen={true}>
        <div>Component child</div>
        Text content
        <span>Another component</span>
      </StatixContent>,
    );

    expect(screen.getByText("Component child")).toBeInTheDocument();
    expect(screen.getByText("Text content")).toBeInTheDocument();
    expect(screen.getByText("Another component")).toBeInTheDocument();
  });

  it("should be positioned as a drawer", () => {
    render(<StatixContent isOpen={true} />);

    const contentArea = screen
      .getAllByRole("generic")
      .find((el) => el.style.position === "fixed");

    // Should be positioned at the bottom of the screen
    expect(contentArea).toHaveStyle({
      position: "fixed",
      left: "0",
      width: "100%",
      height: "90vh",
    });
  });

  it("should have proper z-index for overlay", () => {
    render(<StatixContent isOpen={true} />);

    const contentArea = screen
      .getAllByRole("generic")
      .find((el) => el.style.position === "fixed");

    expect(contentArea).toHaveStyle({
      zIndex: "100000",
    });
  });

  it("should have scrollable content", () => {
    render(<StatixContent isOpen={true} />);

    const contentArea = screen
      .getAllByRole("generic")
      .find((el) => el.style.position === "fixed");

    expect(contentArea).toHaveStyle({
      overflow: "auto",
    });
  });

  it("should have proper padding for content", () => {
    render(<StatixContent isOpen={true} />);

    const contentArea = screen
      .getAllByRole("generic")
      .find((el) => el.style.position === "fixed");

    expect(contentArea).toHaveStyle({
      padding: "20px",
    });
  });

  it("should work with dynamic content", () => {
    const { rerender } = render(
      <StatixContent isOpen={true}>
        <div data-testid="dynamic-content">Initial Content</div>
      </StatixContent>,
    );

    expect(screen.getByText("Initial Content")).toBeInTheDocument();

    // Change content
    rerender(
      <StatixContent isOpen={true}>
        <div data-testid="dynamic-content">Updated Content</div>
      </StatixContent>,
    );

    expect(screen.getByText("Updated Content")).toBeInTheDocument();
    expect(screen.queryByText("Initial Content")).not.toBeInTheDocument();
  });
});
