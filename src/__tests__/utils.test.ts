import { beforeEach, describe, expect, test, vi } from "vitest";

import { fetchJSON } from "../utils/fetchJSON";
import { loadLocaleFiles } from "../utils/loadLocales";

// Mock the fetchJSON function
vi.mock("../utils/fetchJSON", () => ({
  fetchJSON: vi.fn(),
}));

describe("Utility Functions", () => {
  describe("loadLocaleFiles", () => {
    beforeEach(() => {
      // Clear all mocks before each test
      vi.clearAllMocks();
    });

    test("loads locale files for each language", async () => {
      // Setup mock return values
      (fetchJSON as vi.Mock).mockResolvedValueOnce({
        "test.key": "Test Value",
      });
      (fetchJSON as vi.Mock).mockResolvedValueOnce({
        "test.key": "Test Değeri",
      });

      const config = {
        localePath: "public/locales",
        languagesKeys: {
          en: "en",
          tr: "tr",
        },
      };

      const result = await loadLocaleFiles(config);

      // Check that fetchJSON was called for each language
      expect(fetchJSON).toHaveBeenCalledTimes(2);
      expect(fetchJSON).toHaveBeenCalledWith(
        "public/locales/en/translation.json",
      );
      expect(fetchJSON).toHaveBeenCalledWith(
        "public/locales/tr/translation.json",
      );

      // Check the result
      expect(result).toEqual({
        en: { "test.key": "Test Value" },
        tr: { "test.key": "Test Değeri" },
      });
    });

    test("handles fetch errors gracefully", async () => {
      // Setup mock to throw an error for one language
      (fetchJSON as vi.Mock).mockResolvedValueOnce({
        "test.key": "Test Value",
      });
      (fetchJSON as vi.Mock).mockRejectedValueOnce(
        new Error("Failed to fetch"),
      );

      // Mock console.warn to prevent test output pollution
      const originalWarn = console.warn;
      console.warn = vi.fn();

      const config = {
        localePath: "public/locales",
        languagesKeys: {
          en: "en",
          tr: "tr",
        },
      };

      const result = await loadLocaleFiles(config);

      // Check that fetchJSON was called for each language
      expect(fetchJSON).toHaveBeenCalledTimes(2);

      // Check that console.warn was called for the failed fetch
      expect(console.warn).toHaveBeenCalled();

      // Check the result - should still have the successful language
      expect(result).toEqual({
        en: { "test.key": "Test Value" },
      });

      // Restore console.warn
      console.warn = originalWarn;
    });

    test("handles empty languagesKeys", async () => {
      const config = {
        localePath: "public/locales",
        languagesKeys: {},
      };

      const result = await loadLocaleFiles(config);

      // Check that fetchJSON was not called
      expect(fetchJSON).not.toHaveBeenCalled();

      // Check the result - should be an empty object
      expect(result).toEqual({});
    });
  });
});
