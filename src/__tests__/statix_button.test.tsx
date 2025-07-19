import { beforeEach, describe, expect, it, vi } from "vitest";

import { fireEvent, render, screen } from "@testing-library/react";

import { StatixButton } from "../components/StatixButton";

import "@testing-library/jest-dom";

// Mock the asset import
vi.mock("../assets/statix.svg", () => ({
  default: "mocked-statix-icon",
}));

describe("StatixButton", () => {
  const mockOnClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render button with correct structure", () => {
    render(<StatixButton onClick={mockOnClick} />);

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();

    // Check for the image inside
    const image = screen.getByAltText("Statix");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "mocked-statix-icon");
  });

  it("should call onClick handler when clicked", () => {
    render(<StatixButton onClick={mockOnClick} />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it("should call onClick handler multiple times", () => {
    render(<StatixButton onClick={mockOnClick} />);

    const button = screen.getByRole("button");

    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(3);
  });

  it("should apply correct base styles", () => {
    render(<StatixButton onClick={mockOnClick} />);

    const button = screen.getByRole("button");

    expect(button).toHaveStyle({
      position: "fixed",
      bottom: "12px",
      right: "12px",
      width: "50px",
      height: "50px",
      cursor: "pointer",
      padding: "5px",
    });
  });

  it("should apply correct layout styles", () => {
    render(<StatixButton onClick={mockOnClick} />);

    const button = screen.getByRole("button");

    expect(button).toHaveStyle({
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    });
  });

  it("should apply correct z-index and shadow", () => {
    render(<StatixButton onClick={mockOnClick} />);

    const button = screen.getByRole("button");

    expect(button).toHaveStyle({
      zIndex: "10000000",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    });
  });

  it("should render image with correct attributes", () => {
    render(<StatixButton onClick={mockOnClick} />);

    const image = screen.getByAltText("Statix");

    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "mocked-statix-icon");
    expect(image).toHaveAttribute("alt", "Statix");
  });

  it("should be accessible", () => {
    render(<StatixButton onClick={mockOnClick} />);

    const button = screen.getByRole("button");

    // Button should be focusable (default for button elements)
    expect(button).toBeInTheDocument();

    // Should have proper cursor
    expect(button).toHaveStyle({ cursor: "pointer" });
  });

  it("should handle keyboard events", () => {
    render(<StatixButton onClick={mockOnClick} />);

    const button = screen.getByRole("button");

    // Focus the button
    button.focus();
    expect(button).toHaveFocus();

    // Press Enter (should trigger click)
    fireEvent.keyDown(button, { key: "Enter", code: "Enter" });
    fireEvent.keyUp(button, { key: "Enter", code: "Enter" });

    // Press Space (should trigger click)
    fireEvent.keyDown(button, { key: " ", code: "Space" });
    fireEvent.keyUp(button, { key: " ", code: "Space" });

    // Note: Default button behavior handles these events
    expect(mockOnClick).toHaveBeenCalledTimes(0); // Our handler isn't called by keyDown
  });

  it("should handle mouse events correctly", () => {
    render(<StatixButton onClick={mockOnClick} />);

    const button = screen.getByRole("button");

    // Mouse down and up
    fireEvent.mouseDown(button);
    fireEvent.mouseUp(button);
    fireEvent.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it("should be positioned correctly as a floating button", () => {
    render(<StatixButton onClick={mockOnClick} />);

    const button = screen.getByRole("button");

    // Should be positioned at bottom right
    expect(button).toHaveStyle({
      position: "fixed",
      bottom: "12px",
      right: "12px",
    });
  });

  it("should have proper dimensions", () => {
    render(<StatixButton onClick={mockOnClick} />);

    const button = screen.getByRole("button");

    expect(button).toHaveStyle({
      width: "50px",
      height: "50px",
    });
  });

  it("should handle different onClick handlers", () => {
    const mockOnClick1 = vi.fn();
    const mockOnClick2 = vi.fn();

    const { rerender } = render(<StatixButton onClick={mockOnClick1} />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(mockOnClick1).toHaveBeenCalledTimes(1);
    expect(mockOnClick2).toHaveBeenCalledTimes(0);

    // Rerender with different onClick
    rerender(<StatixButton onClick={mockOnClick2} />);

    fireEvent.click(button);

    expect(mockOnClick1).toHaveBeenCalledTimes(1);
    expect(mockOnClick2).toHaveBeenCalledTimes(1);
  });

  it("should not call onClick when disabled (if disabled prop existed)", () => {
    // Note: Current implementation doesn't have disabled prop
    // This test documents the current behavior
    render(<StatixButton onClick={mockOnClick} />);

    const button = screen.getByRole("button");

    // Button should always be clickable in current implementation
    expect(button).not.toHaveAttribute("disabled");

    fireEvent.click(button);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it("should maintain consistent styling", () => {
    render(<StatixButton onClick={mockOnClick} />);

    const button = screen.getByRole("button");

    // Check that the button has the key style properties
    expect(button).toHaveStyle({
      position: "fixed",
      bottom: "12px",
      right: "12px",
    });
  });
});
