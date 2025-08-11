import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import SearchInput from "../../../components/table/SearchInput";

import "@testing-library/jest-dom";

vi.mock("../../../components/table/useStyle", () => ({
  useStyle: () => ({
    searchInput: {
      border: "1px solid #ccc",
      borderRadius: "4px",
      padding: "8px",
      backgroundColor: "#fff",
    },
    searchInputFocus: {
      borderColor: "#007bff",
      backgroundColor: "#f8f9fa",
      boxShadow: "0 0 0 2px rgba(0,123,255,0.25)",
    }
  })
}));

describe("SearchInput", () => {
  const mockOnChange = vi.fn();
  const mockOnFocus = vi.fn();
  const mockOnBlur = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render with correct value", () => {
    render(<SearchInput value="test" onChange={mockOnChange} />);
    
    const input = screen.getByRole("textbox");
    expect(input).toHaveValue("test");
  });

  it("should render with default placeholder", () => {
    render(<SearchInput value="" onChange={mockOnChange} />);
    
    const input = screen.getByPlaceholderText("Search...");
    expect(input).toBeInTheDocument();
  });

  it("should render with custom placeholder", () => {
    render(<SearchInput value="" onChange={mockOnChange} placeholder="Custom search" />);
    
    const input = screen.getByPlaceholderText("Custom search");
    expect(input).toBeInTheDocument();
  });

  it("should call onChange when typing", () => {
    render(<SearchInput value="" onChange={mockOnChange} />);
    
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "new value" } });
    
    expect(mockOnChange).toHaveBeenCalledWith("new value");
  });

  it("should call onFocus when focused", () => {
    render(<SearchInput value="" onChange={mockOnChange} onFocus={mockOnFocus} />);
    
    const input = screen.getByRole("textbox");
    fireEvent.focus(input);
    
    expect(mockOnFocus).toHaveBeenCalled();
  });

  it("should call onBlur when blurred", () => {
    render(<SearchInput value="" onChange={mockOnChange} onBlur={mockOnBlur} />);
    
    const input = screen.getByRole("textbox");
    fireEvent.focus(input);
    fireEvent.blur(input);
    
    expect(mockOnBlur).toHaveBeenCalled();
  });

  it("should apply correct initial styles", () => {
    render(<SearchInput value="" onChange={mockOnChange} />);
    
    const input = screen.getByRole("textbox");
    expect(input).toHaveStyle({
      border: "1px solid #ccc",
      borderRadius: "4px",
      padding: "8px",
      backgroundColor: "#fff",
    });
  });
});