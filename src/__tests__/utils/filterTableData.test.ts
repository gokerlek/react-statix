import { describe, expect, it, vi } from "vitest";
import { filterTableData } from "../../utils";
import { RowData } from "../../components/table/types";

// Mock getDisplayValueForTable
vi.mock("../../utils/getDisplayValueForTable", () => ({
    getDisplayValueForTable: vi.fn((fullKey: string, lang: string, originalValue: string, pendingChanges: Record<string, any>) => {
        const pendingValue = pendingChanges?.[lang]?.[fullKey];
        return pendingValue !== undefined ? pendingValue : originalValue;
    }),
}));

describe("filterTableData", () => {
    const mockTableData: RowData[] = [
        {
            id: "app.title",
            key: "title",
            path: "app",
            values: { en: "Application Title", tr: "Uygulama Başlığı", fr: "Titre de l'application" }
        },
        {
            id: "app.description",
            key: "description",
            path: "app",
            values: { en: "App description", tr: "Uygulama açıklaması", fr: "Description de l'app" }
        },
        {
            id: "user.name",
            key: "name",
            path: "user",
            values: { en: "User Name", tr: "Kullanıcı Adı", fr: "Nom d'utilisateur" }
        },
        {
            id: "user.email",
            key: "email",
            path: "user",
            values: { en: "Email Address", tr: "E-posta Adresi", fr: "Adresse e-mail" }
        },
        {
            id: "welcome",
            key: "welcome",
            path: "",
            values: { en: "Welcome", tr: "Hoşgeldiniz", fr: "Bienvenue" }
        }
    ];

    const mockLanguages = ["en", "tr", "fr"];
    const mockPendingChanges = {
        en: {
            "app.title": "Modified Application Title"
        },
        tr: {
            "user.name": "Değiştirilmiş Kullanıcı Adı"
        }
    };

    describe("usedLocales filtering", () => {
        it("should return all data when usedLocales is not provided", () => {
            const result = filterTableData(mockTableData, "", mockLanguages, {});

            expect(result).toEqual(mockTableData);
            expect(result).toHaveLength(5);
        });

        it("should return all data when usedLocales is empty", () => {
            const usedLocales = new Set<string>();
            const result = filterTableData(mockTableData, "", mockLanguages, {}, usedLocales);

            expect(result).toEqual(mockTableData);
            expect(result).toHaveLength(5);
        });

        it("should filter data by usedLocales when provided", () => {
            const usedLocales = new Set(["app.title", "user.email", "welcome"]);
            const result = filterTableData(mockTableData, "", mockLanguages, {}, usedLocales);

            expect(result).toHaveLength(3);
            expect(result.map(row => row.id)).toEqual(["app.title", "user.email", "welcome"]);
        });

        it("should return empty array when usedLocales has no matches", () => {
            const usedLocales = new Set(["nonexistent.key", "another.missing"]);
            const result = filterTableData(mockTableData, "", mockLanguages, {}, usedLocales);

            expect(result).toHaveLength(0);
        });
    });

    describe("search term filtering", () => {
        it("should return all data when search term is empty", () => {
            const result = filterTableData(mockTableData, "", mockLanguages, {});

            expect(result).toEqual(mockTableData);
        });

        it("should return all data when search term is only whitespace", () => {
            const result = filterTableData(mockTableData, "   ", mockLanguages, {});

            expect(result).toEqual(mockTableData);
        });

        it("should filter by key path (case insensitive)", () => {
            const result = filterTableData(mockTableData, "app", mockLanguages, {});

            expect(result).toHaveLength(2);
            expect(result.map(row => row.id)).toEqual(["app.title", "app.description"]);
        });

        it("should filter by exact key name", () => {
            const result = filterTableData(mockTableData, "title", mockLanguages, {});

            expect(result).toHaveLength(1);
            expect(result[0].id).toBe("app.title");
        });

        it("should filter by full key path", () => {
            const result = filterTableData(mockTableData, "user.email", mockLanguages, {});

            expect(result).toHaveLength(1);
            expect(result[0].id).toBe("user.email");
        });

        it("should filter by translation values in any language", () => {
            const result = filterTableData(mockTableData, "welcome", mockLanguages, {});

            expect(result).toHaveLength(1);
            expect(result[0].id).toBe("welcome");
        });

        it("should filter by Turkish translation values", () => {
            const result = filterTableData(mockTableData, "hoşgeldiniz", mockLanguages, {});

            expect(result).toHaveLength(1);
            expect(result[0].id).toBe("welcome");
        });

        it("should filter by French translation values", () => {
            const result = filterTableData(mockTableData, "utilisateur", mockLanguages, {});

            expect(result).toHaveLength(1);
            expect(result[0].id).toBe("user.name");
        });

        it("should be case insensitive for translation values", () => {
            const result = filterTableData(mockTableData, "APPLICATION", mockLanguages, {});

            expect(result).toHaveLength(1);
            expect(result[0].id).toBe("app.title");
        });

        it("should return multiple matches when search term appears in multiple places", () => {
            const result = filterTableData(mockTableData, "app", mockLanguages, {});

            expect(result).toHaveLength(2);
            expect(result.map(row => row.id).sort()).toEqual(["app.description", "app.title"]);
        });

        it("should return empty array when no matches found", () => {
            const result = filterTableData(mockTableData, "nonexistent", mockLanguages, {});

            expect(result).toHaveLength(0);
        });
    });

    describe("pending changes integration", () => {
        it("should search in pending changes instead of original values", () => {
            const result = filterTableData(mockTableData, "modified", mockLanguages, mockPendingChanges);

            expect(result).toHaveLength(1);
            expect(result[0].id).toBe("app.title");
        });

        it("should search in Turkish pending changes", () => {
            const result = filterTableData(mockTableData, "değiştirilmiş", mockLanguages, mockPendingChanges);

            expect(result).toHaveLength(1);
            expect(result[0].id).toBe("user.name");
        });

        it("should fall back to original values when no pending changes exist", () => {
            const result = filterTableData(mockTableData, "description", mockLanguages, mockPendingChanges);

            expect(result).toHaveLength(1);
            expect(result[0].id).toBe("app.description");
        });
    });

    describe("combined filtering (usedLocales + search)", () => {
        it("should apply both usedLocales and search filters", () => {
            const usedLocales = new Set(["app.title", "app.description", "user.name"]);
            const result = filterTableData(mockTableData, "app", mockLanguages, {}, usedLocales);

            expect(result).toHaveLength(2);
            expect(result.map(row => row.id)).toEqual(["app.title", "app.description"]);
        });

        it("should return empty when usedLocales filters out all search matches", () => {
            const usedLocales = new Set(["user.name", "user.email"]);
            const result = filterTableData(mockTableData, "app", mockLanguages, {}, usedLocales);

            expect(result).toHaveLength(0);
        });

        it("should work with both filters and pending changes", () => {
            const usedLocales = new Set(["app.title", "user.name"]);
            const result = filterTableData(mockTableData, "değiştirilmiş", mockLanguages, mockPendingChanges, usedLocales);

            expect(result).toHaveLength(1);
            expect(result[0].id).toBe("user.name");
        });
    });

    describe("edge cases", () => {
        it("should handle empty tableData", () => {
            const result = filterTableData([], "test", mockLanguages, {});

            expect(result).toEqual([]);
        });

        it("should handle empty languages array", () => {
            const result = filterTableData(mockTableData, "test", [], {});

            expect(result).toHaveLength(0);
        });

        it("should handle null/undefined values gracefully", () => {
            const dataWithNulls: RowData[] = [
                {
                    id: "test.null",
                    key: "null",
                    path: "test",
                    values: { en: "", tr: null as any, fr: undefined as any }
                }
            ];

            const result = filterTableData(dataWithNulls, "test", mockLanguages, {});

            expect(result).toHaveLength(1);
        });

        it("should trim search term", () => {
            const result = filterTableData(mockTableData, "  app  ", mockLanguages, {});

            expect(result).toHaveLength(2);
            expect(result.map(row => row.id)).toEqual(["app.title", "app.description"]);
        });

        it("should handle special characters in search", () => {
            const specialData: RowData[] = [
                {
                    id: "special.chars",
                    key: "chars",
                    path: "special",
                    values: { en: "Email: user@example.com", tr: "E-posta: kullanici@ornek.com", fr: "E-mail: utilisateur@exemple.com" }
                }
            ];

            const result = filterTableData(specialData, "@example", mockLanguages, {});

            expect(result).toHaveLength(1);
            expect(result[0].id).toBe("special.chars");
        });
    });
});
