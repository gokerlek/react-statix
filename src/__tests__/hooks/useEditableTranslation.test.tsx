import React from "react";
import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useTranslation } from "react-i18next";

import { useEditableTranslation } from "../../hooks/useEditableTranslation";
import { useStatix } from "../../hooks/useStatix";

import "@testing-library/jest-dom";

vi.mock("react-i18next", () => ({
  useTranslation: vi.fn(),
}));

vi.mock("../../hooks/useStatix", () => ({
  useStatix: vi.fn(),
}));

vi.mock("../../components/Statix", () => ({
  Statix: ({ children, keyPath }: { children: string; keyPath?: string }) => {
    const MockStatix = ({ children }: { children: string }) => <span>{children}</span>;
    (MockStatix as any).keyPath = keyPath;
    return MockStatix({ children });
  }
}));

describe("useEditableTranslation", () => {
  const mockT = vi.fn();
  const mockAddUsedLocale = vi.fn();
  const mockI18n = { language: "en", changeLanguage: vi.fn() };

  beforeEach(() => {
    vi.clearAllMocks();
    
    (useTranslation as any).mockReturnValue({
      t: mockT,
      i18n: mockI18n,
    });
    
    (useStatix as any).mockReturnValue({
      editable: false,
      addUsedLocale: mockAddUsedLocale,
    });
  });

  describe("basic functionality", () => {
    it("should return t function and i18n instance", () => {
      const { result } = renderHook(() => useEditableTranslation());

      expect(typeof result.current.t).toBe("function");
      expect(result.current.i18n).toBe(mockI18n);
    });

    it("should track used locale keys", () => {
      mockT.mockReturnValue("test");
      
      const { result } = renderHook(() => useEditableTranslation());
      result.current.t("test.key");

      expect(mockAddUsedLocale).toHaveBeenCalledWith("test.key");
    });

    it("should call original t function with correct parameters", () => {
      mockT.mockReturnValue("translated text");
      const options = { count: 5 };
      
      const { result } = renderHook(() => useEditableTranslation());
      result.current.t("test.key", options);

      expect(mockT).toHaveBeenCalledWith("test.key", options);
    });
  });

  describe("when editable is false", () => {
    beforeEach(() => {
      (useStatix as any).mockReturnValue({
        editable: false,
        addUsedLocale: mockAddUsedLocale,
      });
    });

    it("should return string values directly", () => {
      mockT.mockReturnValue("hello world");
      
      const { result } = renderHook(() => useEditableTranslation());
      const translated = result.current.t("greeting");

      expect(translated).toBe("hello world");
    });

    it("should return number values directly", () => {
      mockT.mockReturnValue(42);
      
      const { result } = renderHook(() => useEditableTranslation());
      const translated = result.current.t("count");

      expect(translated).toBe(42);
    });

    it("should convert non-ReactNode objects to strings", () => {
      const obj = { key: "value" };
      mockT.mockReturnValue(obj);
      
      const { result } = renderHook(() => useEditableTranslation());
      const translated = result.current.t("object");

      expect(translated).toBe("[object Object]");
    });
  });

  describe("when editable is true", () => {
    beforeEach(() => {
      (useStatix as any).mockReturnValue({
        editable: true,
        addUsedLocale: mockAddUsedLocale,
      });
    });

    it("should return React elements when editable", () => {
      mockT.mockReturnValue("hello world");
      
      const { result } = renderHook(() => useEditableTranslation());
      const translated = result.current.t("greeting");

      expect(React.isValidElement(translated)).toBe(true);
    });

    it("should handle translation with options", () => {
      mockT.mockReturnValue("Hello John");
      const options = { name: "John" };
      
      const { result } = renderHook(() => useEditableTranslation());
      const translated = result.current.t("greeting", options);

      expect(mockT).toHaveBeenCalledWith("greeting", options);
      expect(React.isValidElement(translated)).toBe(true);
    });
  });
});
