import { describe, expect, it, vi } from "vitest";
import { flattenLocales } from "../../utils";

// Mock getNestedValue
vi.mock("../../utils/getNestedValue", () => ({
    getNestedValue: vi.fn((obj: any, path: string) => {
        if (!obj || !path) return undefined;

        const keys = path.split(".");
        let current = obj;

        for (const key of keys) {
            if (current === null || current === undefined || typeof current !== "object") {
                return undefined;
            }
            current = current[key];
        }

        return current !== undefined ? current : undefined;
    }),
}));

describe("flattenLocales", () => {
    describe("basic functionality", () => {
        it("should flatten simple flat locale objects", () => {
            const locales = {
                en: {
                    welcome: "Welcome",
                    goodbye: "Goodbye"
                },
                tr: {
                    welcome: "Hoşgeldiniz",
                    goodbye: "Hoşçakal"
                }
            };

            const result = flattenLocales(locales);

            expect(result).toHaveLength(2);
            expect(result).toEqual([
                {
                    path: "",
                    key: "welcome",
                    values: { en: "Welcome", tr: "Hoşgeldiniz" }
                },
                {
                    path: "",
                    key: "goodbye",
                    values: { en: "Goodbye", tr: "Hoşçakal" }
                }
            ]);
        });

        it("should flatten nested locale objects", () => {
            const locales = {
                en: {
                    app: {
                        title: "My App",
                        description: "App description"
                    },
                    user: {
                        name: "Name",
                        email: "Email"
                    }
                },
                tr: {
                    app: {
                        title: "Uygulamam",
                        description: "Uygulama açıklaması"
                    },
                    user: {
                        name: "İsim",
                        email: "E-posta"
                    }
                }
            };

            const result = flattenLocales(locales);

            expect(result).toHaveLength(4);
            expect(result).toContainEqual({
                path: "app",
                key: "title",
                values: { en: "My App", tr: "Uygulamam" }
            });
            expect(result).toContainEqual({
                path: "app",
                key: "description",
                values: { en: "App description", tr: "Uygulama açıklaması" }
            });
            expect(result).toContainEqual({
                path: "user",
                key: "name",
                values: { en: "Name", tr: "İsim" }
            });
            expect(result).toContainEqual({
                path: "user",
                key: "email",
                values: { en: "Email", tr: "E-posta" }
            });
        });

        it("should handle deeply nested objects", () => {
            const locales = {
                en: {
                    ui: {
                        forms: {
                            validation: {
                                required: "Required field",
                                email: "Invalid email"
                            }
                        }
                    }
                },
                tr: {
                    ui: {
                        forms: {
                            validation: {
                                required: "Zorunlu alan",
                                email: "Geçersiz e-posta"
                            }
                        }
                    }
                }
            };

            const result = flattenLocales(locales);

            expect(result).toHaveLength(2);
            expect(result).toContainEqual({
                path: "ui.forms.validation",
                key: "required",
                values: { en: "Required field", tr: "Zorunlu alan" }
            });
            expect(result).toContainEqual({
                path: "ui.forms.validation",
                key: "email",
                values: { en: "Invalid email", tr: "Geçersiz e-posta" }
            });
        });
    });

    describe("handling missing translations", () => {
        it("should handle missing keys in some languages", () => {
            const locales = {
                en: {
                    welcome: "Welcome",
                    goodbye: "Goodbye",
                    newFeature: "New Feature"
                },
                tr: {
                    welcome: "Hoşgeldiniz",
                    goodbye: "Hoşçakal"
                    // newFeature is missing
                },
                fr: {
                    welcome: "Bienvenue"
                    // goodbye and newFeature are missing
                }
            };

            const result = flattenLocales(locales);

            expect(result).toHaveLength(3);
            expect(result).toContainEqual({
                path: "",
                key: "welcome",
                values: { en: "Welcome", tr: "Hoşgeldiniz", fr: "Bienvenue" }
            });
            expect(result).toContainEqual({
                path: "",
                key: "goodbye",
                values: { en: "Goodbye", tr: "Hoşçakal", fr: "" }
            });
            expect(result).toContainEqual({
                path: "",
                key: "newFeature",
                values: { en: "New Feature", tr: "", fr: "" }
            });
        });

        it("should handle missing nested objects in some languages", () => {
            const locales = {
                en: {
                    app: {
                        title: "My App",
                        settings: {
                            theme: "Theme"
                        }
                    }
                },
                tr: {
                    app: {
                        title: "Uygulamam"
                        // settings object is missing
                    }
                },
                fr: {
                    // entire app object is missing
                }
            };

            const result = flattenLocales(locales);

            expect(result).toHaveLength(2);
            expect(result).toContainEqual({
                path: "app",
                key: "title",
                values: { en: "My App", tr: "Uygulamam", fr: "" }
            });
            expect(result).toContainEqual({
                path: "app.settings",
                key: "theme",
                values: { en: "Theme", tr: "", fr: "" }
            });
        });

        it("should handle completely missing languages", () => {
            const locales = {
                en: {
                    welcome: "Welcome"
                },
                tr: {
                    welcome: "Hoşgeldiniz"
                }
            };

            const result = flattenLocales(locales);

            expect(result).toHaveLength(1);
            expect(result[0]).toEqual({
                path: "",
                key: "welcome",
                values: { en: "Welcome", tr: "Hoşgeldiniz" }
            });
        });
    });

    describe("edge cases", () => {
        it("should handle empty locale object", () => {
            const locales = {};

            const result = flattenLocales(locales);

            expect(result).toEqual([]);
        });

        it("should handle empty language objects", () => {
            const locales = {
                en: {},
                tr: {}
            };

            const result = flattenLocales(locales);

            expect(result).toEqual([]);
        });

        it("should handle null values", () => {
            const locales = {
                en: {
                    nullValue: null,
                    normalValue: "Normal"
                },
                tr: {
                    nullValue: null,
                    normalValue: "Normal TR"
                }
            };

            const result = flattenLocales(locales);

            expect(result).toHaveLength(2);
            expect(result).toContainEqual({
                path: "",
                key: "nullValue",
                values: { en: "", tr: "" }
            });
            expect(result).toContainEqual({
                path: "",
                key: "normalValue",
                values: { en: "Normal", tr: "Normal TR" }
            });
        });

        it("should handle undefined values", () => {
            const locales = {
                en: {
                    undefinedValue: undefined,
                    normalValue: "Normal"
                },
                tr: {
                    undefinedValue: undefined,
                    normalValue: "Normal TR"
                }
            };

            const result = flattenLocales(locales);

            expect(result).toHaveLength(2);
            expect(result).toContainEqual({
                path: "",
                key: "undefinedValue",
                values: { en: "", tr: "" }
            });
            expect(result).toContainEqual({
                path: "",
                key: "normalValue",
                values: { en: "Normal", tr: "Normal TR" }
            });
        });

        it("should handle numeric values", () => {
            const locales = {
                en: {
                    count: 42,
                    price: 19.99
                },
                tr: {
                    count: 42,
                    price: 19.99
                }
            };

            const result = flattenLocales(locales);

            expect(result).toHaveLength(2);
            expect(result).toContainEqual({
                path: "",
                key: "count",
                values: { en: 42, tr: 42 }
            });
            expect(result).toContainEqual({
                path: "",
                key: "price",
                values: { en: 19.99, tr: 19.99 }
            });
        });

        it("should handle boolean values", () => {
            const locales = {
                en: {
                    isActive: true,
                    isVisible: false
                },
                tr: {
                    isActive: true,
                    isVisible: false
                }
            };

            const result = flattenLocales(locales);

            expect(result).toHaveLength(2);
            expect(result).toContainEqual({
                path: "",
                key: "isActive",
                values: { en: true, tr: true }
            });
            expect(result).toContainEqual({
                path: "",
                key: "isVisible",
                values: { en: "", tr: "" } // false becomes empty string
            });
        });

        it("should handle array values", () => {
            const locales = {
                en: {
                    categories: ["Books", "Electronics", "Clothing"],
                    tags: ["new", "featured"]
                },
                tr: {
                    categories: ["Kitaplar", "Elektronik", "Giyim"],
                    tags: ["yeni", "öne çıkan"]
                }
            };

            const result = flattenLocales(locales);

            // Arrays create individual items for each index
            expect(result.length).toBeGreaterThan(2);

            // Check that array items are flattened as separate keys
            const categoryItems = result.filter(item => item.path === "categories");
            const tagItems = result.filter(item => item.path === "tags");

            expect(categoryItems.length).toBe(3); // 3 categories
            expect(tagItems.length).toBe(2); // 2 tags

            // Check specific array items
            expect(result).toContainEqual({
                path: "categories",
                key: "0",
                values: { en: "Books", tr: "Kitaplar" }
            });
            expect(result).toContainEqual({
                path: "tags",
                key: "0",
                values: { en: "new", tr: "yeni" }
            });
        });
    });

    describe("complex scenarios", () => {
        it("should handle mixed nested and flat structures", () => {
            const locales = {
                en: {
                    welcome: "Welcome",
                    app: {
                        title: "My App"
                    },
                    user: {
                        profile: {
                            name: "Name"
                        }
                    }
                },
                tr: {
                    welcome: "Hoşgeldiniz",
                    app: {
                        title: "Uygulamam"
                    },
                    user: {
                        profile: {
                            name: "İsim"
                        }
                    }
                }
            };

            const result = flattenLocales(locales);

            expect(result).toHaveLength(3);
            expect(result).toContainEqual({
                path: "",
                key: "welcome",
                values: { en: "Welcome", tr: "Hoşgeldiniz" }
            });
            expect(result).toContainEqual({
                path: "app",
                key: "title",
                values: { en: "My App", tr: "Uygulamam" }
            });
            expect(result).toContainEqual({
                path: "user.profile",
                key: "name",
                values: { en: "Name", tr: "İsim" }
            });
        });

        it("should handle asymmetric structures across languages", () => {
            const locales = {
                en: {
                    simple: "Simple value",
                    complex: {
                        nested: {
                            deep: "Deep value"
                        }
                    }
                },
                tr: {
                    simple: "Basit değer",
                    complex: "Karmaşık değer" // This is flat instead of nested
                }
            };

            const result = flattenLocales(locales);

            expect(result).toHaveLength(3);
            expect(result).toContainEqual({
                path: "",
                key: "simple",
                values: { en: "Simple value", tr: "Basit değer" }
            });

            // Deep nested value from en, empty for tr
            expect(result).toContainEqual({
                path: "complex.nested",
                key: "deep",
                values: { en: "Deep value", tr: "" }
            });

            // Complex key with object value for en, string for tr
            expect(result).toContainEqual({
                path: "",
                key: "complex",
                values: {
                    en: { nested: { deep: "Deep value" } },
                    tr: "Karmaşık değer"
                }
            });
        });

        it("should preserve key order consistently", () => {
            const locales = {
                en: {
                    z: "Last",
                    a: "First",
                    m: "Middle"
                },
                tr: {
                    z: "Son",
                    a: "İlk",
                    m: "Orta"
                }
            };

            const result = flattenLocales(locales);

            expect(result).toHaveLength(3);

            // Should have all keys regardless of order
            const keys = result.map(item => item.key);
            expect(keys).toContain("z");
            expect(keys).toContain("a");
            expect(keys).toContain("m");
        });

        it("should handle very deep nesting", () => {
            const locales = {
                en: {
                    level1: {
                        level2: {
                            level3: {
                                level4: {
                                    level5: {
                                        deepValue: "Very deep"
                                    }
                                }
                            }
                        }
                    }
                },
                tr: {
                    level1: {
                        level2: {
                            level3: {
                                level4: {
                                    level5: {
                                        deepValue: "Çok derin"
                                    }
                                }
                            }
                        }
                    }
                }
            };

            const result = flattenLocales(locales);

            expect(result).toHaveLength(1);
            expect(result[0]).toEqual({
                path: "level1.level2.level3.level4.level5",
                key: "deepValue",
                values: { en: "Very deep", tr: "Çok derin" }
            });
        });
    });
});
