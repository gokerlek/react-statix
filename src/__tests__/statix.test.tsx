import { beforeEach, describe, expect, test, vi } from "vitest";

import { fireEvent, render, screen } from "@testing-library/react";

import { Statix } from "../components/Statix";

import "@testing-library/jest-dom";

// Mock the i18n hook
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    i18n: {
      language: "en",
    },
    t: (key: string) => key,
  }),
}));

// Mock the getNestedValue utility
vi.mock("../utils/getNestedValue", () => ({
  getNestedValue: vi.fn((obj, path) => {
    if (obj && path === "test.key") return "Mocked Translation";
    if (obj && path === "another.key") return "Another Translation";
    if (
      obj &&
      obj === mockContextValue.pendingChanges.en &&
      path === "another.key"
    )
      return "Updated English Text";
    return undefined;
  }),
}));

// Mock the context values
const mockContextValue = {
  editable: true,
  locales: {
    en: { test: { key: "English Text" } },
    tr: { test: { key: "Turkish Text" } },
  },
  updateLocalValue: vi.fn(),
  pendingChanges: {
    en: { another: { key: "Updated English Text" } },
  },
  resetChanges: vi.fn(),
  saveChanges: vi.fn(),
};

// Mock the useStatix hook
vi.mock("../hooks/useStatix", () => ({
  useStatix: () => mockContextValue,
}));

describe("Statix Component", () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
    mockContextValue.editable = true;
  });

  test("renders children when editable is false", () => {
    // Set editable to false for this test
    mockContextValue.editable = false;

    render(<Statix>test.key</Statix>);

    // Should just render the children text
    expect(screen.getByText("test.key")).toBeInTheDocument();
  });

  test("renders translated value when editable is true", () => {
    render(<Statix>test.key</Statix>);

    // Should render the translated value
    expect(screen.getByText("Mocked Translation")).toBeInTheDocument();
  });

  test("uses explicit keyPath when provided", () => {
    render(<Statix keyPath="another.key">Some text</Statix>);

    // Should use the explicit keyPath instead of the children text
    expect(screen.getByText("Another Translation")).toBeInTheDocument();
  });

  test("calls updateLocalValue when input value changes", () => {
    render(<Statix>test.key</Statix>);

    // Get the span element
    const span = screen.getByText("Mocked Translation");

    // Trigger mouse enter to show the editor
    fireEvent.mouseEnter(span);

    // Find the input for English
    const enInput = screen.getAllByRole("textbox")[0];

    // Change the input value
    fireEvent.change(enInput, { target: { value: "New English Text" } });

    // Should call updateLocalValue with the correct parameters
    expect(mockContextValue.updateLocalValue).toHaveBeenCalledWith(
      "en",
      "test.key",
      "New English Text",
    );
  });

  test("shows editor on mouse enter and hides on mouse leave", () => {
    render(<Statix>test.key</Statix>);

    // Get the span element
    const span = screen.getByText("Mocked Translation");

    // Initially, the editor should not be visible
    expect(screen.queryByText("EN")).not.toBeInTheDocument();

    // Trigger mouse enter to show the editor
    fireEvent.mouseEnter(span);

    // The editor should now be visible
    expect(screen.getByText("EN")).toBeInTheDocument();

    // Trigger mouse leave to hide the editor
    fireEvent.mouseLeave(span);

    // The editor should no longer be visible
    expect(screen.queryByText("EN")).not.toBeInTheDocument();
  });

  test("renders inputs for all available locales", () => {
    render(<Statix>test.key</Statix>);

    // Get the span element
    const span = screen.getByText("Mocked Translation");

    // Trigger mouse enter to show the editor
    fireEvent.mouseEnter(span);

    // Should render inputs for all locales in the context
    Object.keys(mockContextValue.locales).forEach((lang) => {
      expect(screen.getByText(lang.toUpperCase())).toBeInTheDocument();
    });

    // Should render the correct number of inputs
    const inputs = screen.getAllByRole("textbox");
    expect(inputs.length).toBe(Object.keys(mockContextValue.locales).length);
  });
});
