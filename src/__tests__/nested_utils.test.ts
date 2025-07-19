import { describe, expect, test } from "vitest";

import { getNestedValue } from "../utils/getNestedValue";
import { setNestedValue } from "../utils/setNestedValue";

describe("Nested Object Utilities", () => {
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
});
