import React from "react";
import { useTranslation } from "react-i18next";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useEditableTranslation } from "@/react-statix/hooks/useEditableTranslation.tsx";
import { useStatix } from "@/react-statix/hooks/useStatix.tsx";
import { renderHook } from "@testing-library/react";

import "@testing-library/jest-dom";

// Mock the dependencies
vi.mock("react-i18next", () => ({
  useTranslation: vi.fn(),
}));

vi.mock("../hooks/useStatix", () => ({
  useStatix: vi.fn(),
}));

// Mock the Statix component
vi.mock("../components/Statix", () => ({
  Statix: ({ children, keyPath }: { children: string; keyPath: string }) => (
    <span data-testid="statix-component" data-key={keyPath}>
      {children}
    </span>
  ),
}));

describe("useEditableTranslation", () => {
  const mockT = vi.fn();
  const mockI18n = { language: "en" };

  beforeEach(() => {
    vi.clearAllMocks();

    (useTranslation as ReturnType<typeof vi.fn>).mockReturnValue({
      t: mockT,
      i18n: mockI18n,
    });
  });

  describe("when editable is false", () => {
    beforeEach(() => {
      (useStatix as ReturnType<typeof vi.fn>).mockReturnValue({
        editable: false,
      });
    });

    it("should return the translated value directly for string translations", () => {
      mockT.mockReturnValue("Hello World");

      const { result } = renderHook(() => useEditableTranslation());
      const translatedValue = result.current.t("greeting");

      expect(mockT).toHaveBeenCalledWith("greeting", undefined);
      expect(translatedValue).toBe("Hello World");
    });

    it("should return the translated value directly for number translations", () => {
      mockT.mockReturnValue(42);

      const { result } = renderHook(() => useEditableTranslation());
      const translatedValue = result.current.t("count");

      expect(mockT).toHaveBeenCalledWith("count", undefined);
      expect(translatedValue).toBe(42);
    });

    it("should return the translated value directly for boolean translations", () => {
      mockT.mockReturnValue(true);

      const { result } = renderHook(() => useEditableTranslation());
      const translatedValue = result.current.t("isActive");

      expect(mockT).toHaveBeenCalledWith("isActive", undefined);
      expect(translatedValue).toBe(true);
    });

    it("should return the translated value directly for null translations", () => {
      mockT.mockReturnValue(null);

      const { result } = renderHook(() => useEditableTranslation());
      const translatedValue = result.current.t("nullValue");

      expect(mockT).toHaveBeenCalledWith("nullValue", undefined);
      expect(translatedValue).toBe(null);
    });

    it("should return the translated value directly for undefined translations", () => {
      mockT.mockReturnValue(undefined);

      const { result } = renderHook(() => useEditableTranslation());
      const translatedValue = result.current.t("undefinedValue");

      expect(mockT).toHaveBeenCalledWith("undefinedValue", undefined);
      expect(translatedValue).toBe(undefined);
    });

    it("should return the translated value directly for React element translations", () => {
      const mockElement = <div>Test Element</div>;
      mockT.mockReturnValue(mockElement);

      const { result } = renderHook(() => useEditableTranslation());
      const translatedValue = result.current.t("elementValue");

      expect(mockT).toHaveBeenCalledWith("elementValue", undefined);
      expect(translatedValue).toBe(mockElement);
    });

    it("should convert non-ReactNode values to string", () => {
      const mockObject = { test: "value" };
      mockT.mockReturnValue(mockObject);

      const { result } = renderHook(() => useEditableTranslation());
      const translatedValue = result.current.t("objectValue");

      expect(mockT).toHaveBeenCalledWith("objectValue", undefined);
      expect(translatedValue).toBe("[object Object]");
    });

    it("should pass options to the translation function", () => {
      mockT.mockReturnValue("Hello John");
      const options = { name: "John" };

      const { result } = renderHook(() => useEditableTranslation());
      const translatedValue = result.current.t("greeting", options);

      expect(mockT).toHaveBeenCalledWith("greeting", options);
      expect(translatedValue).toBe("Hello John");
    });
  });

  describe("when editable is true", () => {
    beforeEach(() => {
      (useStatix as ReturnType<typeof vi.fn>).mockReturnValue({
        editable: true,
      });
    });

    it("should return Statix component for string translations", () => {
      mockT.mockReturnValue("Hello World");

      const { result } = renderHook(() => useEditableTranslation());
      const translatedValue = result.current.t("greeting");

      expect(mockT).toHaveBeenCalledWith("greeting", undefined);
      expect(React.isValidElement(translatedValue)).toBe(true);

      // Check if it's a Statix component by checking the props
      const element = translatedValue as React.ReactElement;
      expect(element.props.keyPath).toBe("greeting");
      expect(element.props.children).toBe("Hello World");
    });

    it("should return Statix component for number translations", () => {
      mockT.mockReturnValue(42);

      const { result } = renderHook(() => useEditableTranslation());
      const translatedValue = result.current.t("count");

      expect(mockT).toHaveBeenCalledWith("count", undefined);
      expect(React.isValidElement(translatedValue)).toBe(true);

      const element = translatedValue as React.ReactElement;
      expect(element.props.keyPath).toBe("count");
      expect(element.props.children).toBe("42");
    });

    it("should return Statix component for boolean translations", () => {
      mockT.mockReturnValue(true);

      const { result } = renderHook(() => useEditableTranslation());
      const translatedValue = result.current.t("isActive");

      expect(mockT).toHaveBeenCalledWith("isActive", undefined);
      expect(React.isValidElement(translatedValue)).toBe(true);

      const element = translatedValue as React.ReactElement;
      expect(element.props.keyPath).toBe("isActive");
      expect(element.props.children).toBe("true");
    });

    it("should return Statix component for null translations", () => {
      mockT.mockReturnValue(null);

      const { result } = renderHook(() => useEditableTranslation());
      const translatedValue = result.current.t("nullValue");

      expect(mockT).toHaveBeenCalledWith("nullValue", undefined);
      expect(React.isValidElement(translatedValue)).toBe(true);

      const element = translatedValue as React.ReactElement;
      expect(element.props.keyPath).toBe("nullValue");
      expect(element.props.children).toBe("null");
    });

    it("should return Statix component for undefined translations", () => {
      mockT.mockReturnValue(undefined);

      const { result } = renderHook(() => useEditableTranslation());
      const translatedValue = result.current.t("undefinedValue");

      expect(mockT).toHaveBeenCalledWith("undefinedValue", undefined);
      expect(React.isValidElement(translatedValue)).toBe(true);

      const element = translatedValue as React.ReactElement;
      expect(element.props.keyPath).toBe("undefinedValue");
      expect(element.props.children).toBe("undefined");
    });

    it("should return Statix component for React element translations", () => {
      const mockElement = <div>Test Element</div>;
      mockT.mockReturnValue(mockElement);

      const { result } = renderHook(() => useEditableTranslation());
      const translatedValue = result.current.t("elementValue");

      expect(mockT).toHaveBeenCalledWith("elementValue", undefined);
      expect(React.isValidElement(translatedValue)).toBe(true);

      const element = translatedValue as React.ReactElement;
      expect(element.props.keyPath).toBe("elementValue");
      expect(element.props.children).toBe(mockElement.toString());
    });

    it("should convert non-ReactNode values to string for Statix component", () => {
      const mockObject = { test: "value" };
      mockT.mockReturnValue(mockObject);

      const { result } = renderHook(() => useEditableTranslation());
      const translatedValue = result.current.t("objectValue");

      expect(mockT).toHaveBeenCalledWith("objectValue", undefined);
      expect(React.isValidElement(translatedValue)).toBe(true);

      const element = translatedValue as React.ReactElement;
      expect(element.props.keyPath).toBe("objectValue");
      expect(element.props.children).toBe("[object Object]");
    });

    it("should pass options to the translation function", () => {
      mockT.mockReturnValue("Hello John");
      const options = { name: "John" };

      const { result } = renderHook(() => useEditableTranslation());
      const translatedValue = result.current.t("greeting", options);

      expect(mockT).toHaveBeenCalledWith("greeting", options);
      expect(React.isValidElement(translatedValue)).toBe(true);

      const element = translatedValue as React.ReactElement;
      expect(element.props.keyPath).toBe("greeting");
      expect(element.props.children).toBe("Hello John");
    });
  });

  describe("return values", () => {
    beforeEach(() => {
      (useStatix as ReturnType<typeof vi.fn>).mockReturnValue({
        editable: false,
      });
    });

    it("should return the wrapped t function", () => {
      const { result } = renderHook(() => useEditableTranslation());

      expect(typeof result.current.t).toBe("function");
    });

    it("should return the i18n instance", () => {
      const { result } = renderHook(() => useEditableTranslation());

      expect(result.current.i18n).toBe(mockI18n);
    });
  });

  describe("edge cases", () => {
    beforeEach(() => {
      (useStatix as ReturnType<typeof vi.fn>).mockReturnValue({
        editable: true,
      });
    });

    it("should handle empty string translations", () => {
      mockT.mockReturnValue("");

      const { result } = renderHook(() => useEditableTranslation());
      const translatedValue = result.current.t("emptyString");

      expect(mockT).toHaveBeenCalledWith("emptyString", undefined);
      expect(React.isValidElement(translatedValue)).toBe(true);

      const element = translatedValue as React.ReactElement;
      expect(element.props.keyPath).toBe("emptyString");
      expect(element.props.children).toBe("");
    });

    it("should handle zero as a translation value", () => {
      mockT.mockReturnValue(0);

      const { result } = renderHook(() => useEditableTranslation());
      const translatedValue = result.current.t("zero");

      expect(mockT).toHaveBeenCalledWith("zero", undefined);
      expect(React.isValidElement(translatedValue)).toBe(true);

      const element = translatedValue as React.ReactElement;
      expect(element.props.keyPath).toBe("zero");
      expect(element.props.children).toBe("0");
    });

    it("should handle false as a translation value", () => {
      mockT.mockReturnValue(false);

      const { result } = renderHook(() => useEditableTranslation());
      const translatedValue = result.current.t("false");

      expect(mockT).toHaveBeenCalledWith("false", undefined);
      expect(React.isValidElement(translatedValue)).toBe(true);

      const element = translatedValue as React.ReactElement;
      expect(element.props.keyPath).toBe("false");
      expect(element.props.children).toBe("false");
    });
  });
});
