import { beforeEach, describe, expect, it, vi } from "vitest";

import { StatixConfig } from "../../types";
import { loadLocaleFiles, fetchJSON } from "../../utils";

// Mock fetchJSON
vi.mock("../../utils/fetchJSON", () => ({
  fetchJSON: vi.fn(),
}));

const mockFetchJSON = vi.mocked(fetchJSON);

describe("loadLocaleFiles", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  it("should load locale files for all configured languages", async () => {
    const config: StatixConfig = {
      localePath: "/locales",
      languagesKeys: {
        en: "English",
        fr: "French",
        tr: "Turkish",
      },
    };

    const mockEnData = { title: "Hello", description: "World" };
    const mockFrData = { title: "Bonjour", description: "Monde" };
    const mockTrData = { title: "Merhaba", description: "Dunya" };

    mockFetchJSON
      .mockResolvedValueOnce(mockEnData)
      .mockResolvedValueOnce(mockFrData)
      .mockResolvedValueOnce(mockTrData);

    const result = await loadLocaleFiles(config);

    expect(result).toEqual({
      en: mockEnData,
      fr: mockFrData,
      tr: mockTrData,
    });

    expect(mockFetchJSON).toHaveBeenCalledTimes(3);
    expect(mockFetchJSON).toHaveBeenCalledWith("/locales/en/translation.json");
    expect(mockFetchJSON).toHaveBeenCalledWith("/locales/fr/translation.json");
    expect(mockFetchJSON).toHaveBeenCalledWith("/locales/tr/translation.json");
  });

  it("should handle empty languagesKeys", async () => {
    const config: StatixConfig = {
      localePath: "/locales",
      languagesKeys: {},
    };

    const result = await loadLocaleFiles(config);

    expect(result).toEqual({});
    expect(mockFetchJSON).not.toHaveBeenCalled();
  });

  it("should handle undefined languagesKeys", async () => {
    const config: StatixConfig = {
      localePath: "/locales",
    };

    const result = await loadLocaleFiles(config);

    expect(result).toEqual({});
    expect(mockFetchJSON).not.toHaveBeenCalled();
  });

  it("should continue loading other files when one fails", async () => {
    const config: StatixConfig = {
      localePath: "/locales",
      languagesKeys: {
        en: "English",
        fr: "French",
        tr: "Turkish",
      },
    };

    const mockEnData = { title: "Hello" };
    const mockTrData = { title: "Merhaba" };
    const error = new Error("File not found");

    mockFetchJSON
      .mockResolvedValueOnce(mockEnData)
      .mockRejectedValueOnce(error)
      .mockResolvedValueOnce(mockTrData);

    const result = await loadLocaleFiles(config);

    expect(result).toEqual({
      en: mockEnData,
      tr: mockTrData,
    });

    expect(console.warn).toHaveBeenCalledWith(
      "Dil dosyası yüklenemedi: /locales/fr/translation.json",
      error
    );
  });

  it("should handle all files failing to load", async () => {
    const config: StatixConfig = {
      localePath: "/locales",
      languagesKeys: {
        en: "English",
        fr: "French",
      },
    };

    const error1 = new Error("Network error");
    const error2 = new Error("File not found");

    mockFetchJSON
      .mockRejectedValueOnce(error1)
      .mockRejectedValueOnce(error2);

    const result = await loadLocaleFiles(config);

    expect(result).toEqual({});
    expect(console.warn).toHaveBeenCalledTimes(2);
    expect(console.warn).toHaveBeenCalledWith(
      "Dil dosyası yüklenemedi: /locales/en/translation.json",
      error1
    );
    expect(console.warn).toHaveBeenCalledWith(
      "Dil dosyası yüklenemedi: /locales/fr/translation.json",
      error2
    );
  });

  it("should use correct file paths with different localePath", async () => {
    const config: StatixConfig = {
      localePath: "/assets/i18n",
      languagesKeys: {
        "en-US": "English (US)",
        "fr-CA": "French (Canada)",
      },
    };

    const mockData = { test: "data" };
    mockFetchJSON.mockResolvedValue(mockData);

    await loadLocaleFiles(config);

    expect(mockFetchJSON).toHaveBeenCalledWith("/assets/i18n/en-US/translation.json");
    expect(mockFetchJSON).toHaveBeenCalledWith("/assets/i18n/fr-CA/translation.json");
  });

  it("should handle single language configuration", async () => {
    const config: StatixConfig = {
      localePath: "/locales",
      languagesKeys: {
        en: "English",
      },
    };

    const mockData = { welcome: "Welcome" };
    mockFetchJSON.mockResolvedValueOnce(mockData);

    const result = await loadLocaleFiles(config);

    expect(result).toEqual({
      en: mockData,
    });
    expect(mockFetchJSON).toHaveBeenCalledTimes(1);
    expect(mockFetchJSON).toHaveBeenCalledWith("/locales/en/translation.json");
  });
});
