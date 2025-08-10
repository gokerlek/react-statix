import { describe, expect, test } from "vitest";

import {setNestedValue} from "../../utils";

    describe("setNestedValue", () => {
        test("sets value for simple key", () => {
            const obj = { existing: "value" };
            setNestedValue(obj, "newKey", "newValue");
            expect(obj).toEqual({ existing: "value", newKey: "newValue" });
        });

        test("sets value for nested path, creating objects as needed", () => {
            const obj = { existing: "value" };
            setNestedValue(obj, "nested.level1", "level1Value");
            expect(obj).toEqual({
                existing: "value",
                nested: {
                    level1: "level1Value",
                },
            });
        });

        test("sets value for deeply nested path", () => {
            const obj = { existing: "value" };
            setNestedValue(obj, "nested.level1.level2.level3", "level3Value");
            expect(obj).toEqual({
                existing: "value",
                nested: {
                    level1: {
                        level2: {
                            level3: "level3Value",
                        },
                    },
                },
            });
        });

        test("updates existing nested value", () => {
            const obj = {
                existing: "value",
                nested: {
                    level1: "oldValue",
                },
            };
            setNestedValue(obj, "nested.level1", "newValue");
            expect(obj).toEqual({
                existing: "value",
                nested: {
                    level1: "newValue",
                },
            });
        });

        test("handles empty or invalid paths", () => {
            const obj = { existing: "value" };
            setNestedValue(obj, "", "newValue");
            expect(obj).toEqual({ existing: "value" });

            setNestedValue(null, "key", "value");
            // Should not throw an error
        });
    });
