import { describe, expect, it, vi } from "vitest";
import { getDisplayValueForTable } from "../../utils";

// Mock getNestedValue - already tested separately
vi.mock("../../utils/getNestedValue", () => ({
    getNestedValue: vi.fn((obj: any, path: string) => {
        // More accurate mock implementation
        if (!obj || !path) return undefined;

        // First check if the exact path exists as a key (for flat structures with dotted keys)
        if (obj[path] !== undefined) {
            return obj[path];
        }

        // Handle nested paths like "en.app.title"
        const keys = path.split(".");
        let current = obj;

        for (const key of keys) {
            if (current === null || current === undefined || typeof current !== "object") {
                return undefined;
            }
            current = current[key];
        }

        return current;
    }),
}));

describe("getDisplayValueForTable", () => {
    describe("pending changes priority", () => {
        it("should return pending value when it exists", () => {
            const pendingChanges = {
                en: {
                    "app.title": "Modified Title"
                }
            };

            const result = getDisplayValueForTable("app.title", "en", "Original Title", pendingChanges);

            expect(result).toBe("Modified Title");
        });

        it("should return original value when no pending changes", () => {
            const pendingChanges = {};

            const result = getDisplayValueForTable("app.title", "en", "Original Title", pendingChanges);

            expect(result).toBe("Original Title");
        });

        it("should return original value when pending value is undefined", () => {
            const pendingChanges = {
                en: {
                    "other.key": "Some value"
                }
            };

            const result = getDisplayValueForTable("app.title", "en", "Original Title", pendingChanges);

            expect(result).toBe("Original Title");
        });
    });

    describe("language handling", () => {
        it("should handle different languages correctly", () => {
            const pendingChanges = {
                en: { "title": "English Title" },
                tr: { "title": "Türkçe Başlık" }
            };

            expect(getDisplayValueForTable("title", "en", "Original", pendingChanges))
                .toBe("English Title");
            expect(getDisplayValueForTable("title", "tr", "Original", pendingChanges))
                .toBe("Türkçe Başlık");
            expect(getDisplayValueForTable("title", "fr", "Original", pendingChanges))
                .toBe("Original");
        });
    });

    describe("edge cases", () => {
        it("should handle null/undefined pending changes", () => {
            expect(getDisplayValueForTable("key", "en", "Original", null as any))
                .toBe("Original");
            expect(getDisplayValueForTable("key", "en", "Original", undefined as any))
                .toBe("Original");
        });

        it("should handle empty string and null values in pending changes", () => {
            const pendingChanges = {
                en: {
                    "empty": "",
                    "nullValue": null
                }
            };

            expect(getDisplayValueForTable("empty", "en", "Original", pendingChanges))
                .toBe("");
            expect(getDisplayValueForTable("nullValue", "en", "Original", pendingChanges))
                .toBe(null);
        });

        it("should handle non-string values", () => {
            const pendingChanges = {
                en: {
                    "count": 42,
                    "active": true,
                    "config": { theme: "dark" }
                }
            };

            expect(getDisplayValueForTable("count", "en", "0", pendingChanges))
                .toBe(42);
            expect(getDisplayValueForTable("active", "en", "false", pendingChanges))
                .toBe(true);
            expect(getDisplayValueForTable("config", "en", "{}", pendingChanges))
                .toEqual({ theme: "dark" });
        });
    });
});
