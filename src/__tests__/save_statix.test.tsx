import { describe, expect, test, vi } from "vitest";

import { fireEvent, render, screen } from "@testing-library/react";

import { SaveStatix } from "../components/SaveStatix";

import "@testing-library/jest-dom";

// Mock the context values
const mockContextValue = {
  editable: true,
  setEditable: vi.fn(),
  locales: {},
  updateLocalValue: vi.fn(),
  pendingChanges: {},
  resetChanges: vi.fn(),
  saveChanges: vi.fn(),
};

// Mock the useStatix hook
vi.mock("../hooks/useStatix", () => ({
  useStatix: () => mockContextValue,
}));

describe("SaveStatix Component", () => {
  test("renders save and reset buttons when editable is true", () => {
    render(<SaveStatix />);

    expect(screen.getByText("Save")).toBeInTheDocument();
    expect(screen.getByText("Reset")).toBeInTheDocument();
  });

  test("does not render when editable is false", () => {
    // Set editable to false
    mockContextValue.editable = false;

    const { container } = render(<SaveStatix />);

    // Check that the component didn't render anything
    expect(container).toBeEmptyDOMElement();

    // Reset for other tests
    mockContextValue.editable = true;
  });

  test("calls saveChanges when save button is clicked", () => {
    render(<SaveStatix />);

    fireEvent.click(screen.getByText("Save"));

    expect(mockContextValue.saveChanges).toHaveBeenCalled();
  });

  test("calls resetChanges when reset button is clicked", () => {
    render(<SaveStatix />);

    fireEvent.click(screen.getByText("Reset"));

    expect(mockContextValue.resetChanges).toHaveBeenCalled();
  });
});
