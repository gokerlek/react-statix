import { describe, expect, test } from "vitest";

import { getNestedValue } from "../../utils";

    describe("getNestedValue", () => {
        const testObj = {
            simple: "value",
            nested: {
                level1: "level1Value",
                level2: {
                    level3: "level3Value",
                },
            },
        };

        test("returns value for simple key", () => {
            expect(getNestedValue(testObj, "simple")).toBe("value");
        });

        test("returns value for nested path", () => {
            expect(getNestedValue(testObj, "nested.level1")).toBe("level1Value");
            expect(getNestedValue(testObj, "nested.level2.level3")).toBe(
                "level3Value",
            );
        });

        test("returns default value for non-existent path", () => {
            expect(getNestedValue(testObj, "nonexistent")).toBeUndefined();
            expect(getNestedValue(testObj, "nonexistent", "default")).toBe("default");
            expect(getNestedValue(testObj, "nested.nonexistent")).toBeUndefined();
            expect(getNestedValue(testObj, "nested.nonexistent", "default")).toBe(
                "default",
            );
        });

        test("handles null or undefined object", () => {
            expect(getNestedValue(null, "key")).toBeUndefined();
            expect(getNestedValue(undefined, "key")).toBeUndefined();
            expect(getNestedValue(null, "key", "default")).toBe("default");
        });
    });

