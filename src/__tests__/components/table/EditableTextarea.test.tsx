import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import EditableTextarea from "../../../components/table/EditableTextarea";

import "@testing-library/jest-dom";

vi.mock("../../../components/table/useStyle", () => ({
  useStyle: () => ({
    textarea: {
      border: "1px solid #ccc",
      borderRadius: "4px",
      padding: "8px",
      backgroundColor: "#fff",
      resize: "none",
      overflow: "hidden",
    },
    textareaFocus: {
      borderColor: "#007bff",
      backgroundColor: "#f8f9fa",
      boxShadow: "0 0 0 2px rgba(0,123,255,0.25)",
    }
  })
}));

describe("EditableTextarea", () => {
  const mockOnChange = vi.fn();
  const mockOnFocus = vi.fn();
  const mockOnBlur = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render with correct value", () => {
    render(<EditableTextarea value="test content" onChange={mockOnChange} />);
    
    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveValue("test content");
  });

  it("should call onChange when typing", () => {
    render(<EditableTextarea value="" onChange={mockOnChange} />);
    
    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "new content" } });
    
    expect(mockOnChange).toHaveBeenCalledWith("new content");
  });

  it("should call onFocus when focused", () => {
    render(<EditableTextarea value="" onChange={mockOnChange} onFocus={mockOnFocus} />);
    
    const textarea = screen.getByRole("textbox");
    fireEvent.focus(textarea);
    
    expect(mockOnFocus).toHaveBeenCalled();
  });

  it("should call onBlur when blurred", () => {
    render(<EditableTextarea value="" onChange={mockOnChange} onBlur={mockOnBlur} />);
    
    const textarea = screen.getByRole("textbox");
    fireEvent.focus(textarea);
    fireEvent.blur(textarea);
    
    expect(mockOnBlur).toHaveBeenCalled();
  });

  it("should apply correct initial styles", () => {
    render(<EditableTextarea value="" onChange={mockOnChange} />);
    
    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveStyle({
      border: "1px solid #ccc",
      borderRadius: "4px",
      padding: "8px",
      backgroundColor: "#fff",
      resize: "none",
      overflow: "hidden",
    });
  });

  it("should have single row initially", () => {
    render(<EditableTextarea value="" onChange={mockOnChange} />);
    
    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;
    expect(textarea.rows).toBe(1);
  });
});