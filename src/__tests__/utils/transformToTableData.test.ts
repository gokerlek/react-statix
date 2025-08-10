import { describe, expect, it } from "vitest";
import { transformToTableData } from "../../utils";

describe("transformToTableData", () => {
    it("should transform flat data correctly", () => {
        const flattenedData = [
            {
                path: "",
                key: "welcome",
                values: { en: "Welcome", tr: "Hoşgeldiniz" }
            }
        ];

        const result = transformToTableData(flattenedData);

        expect(result).toEqual([
            {
                id: "welcome",
                key: "welcome",
                path: "",
                values: { en: "Welcome", tr: "Hoşgeldiniz" }
            }
        ]);
    });

    it("should transform nested data correctly", () => {
        const flattenedData = [
            {
                path: "app.settings",
                key: "theme",
                values: { en: "Theme", tr: "Tema" }
            }
        ];

        const result = transformToTableData(flattenedData);

        expect(result).toEqual([
            {
                id: "app.settings.theme",
                key: "theme",
                path: "app.settings",
                values: { en: "Theme", tr: "Tema" }
            }
        ]);
    });

    it("should handle empty array", () => {
        const result = transformToTableData([]);
        expect(result).toEqual([]);
    });

    it("should handle null/empty path", () => {
        const flattenedData = [
            { path: null as any, key: "test", values: { en: "Test" } },
            { path: "", key: "empty", values: { en: "Empty" } }
        ];

        const result = transformToTableData(flattenedData);

        expect(result[0].id).toBe("test");
        expect(result[1].id).toBe("empty");
    });
});
