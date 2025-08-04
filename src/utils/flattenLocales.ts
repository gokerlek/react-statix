import {getNestedValue} from "./getNestedValue";
import {FlattenedLocale} from "../types";

export const flattenLocales = (
    locales: Record<string, any>
): FlattenedLocale[] => {
    const result: FlattenedLocale[] = [];
    const languages = Object.keys(locales);

    const collectKeys = (obj: any, currentPath = ""): string[] => {
        const keys: string[] = [];

        if (typeof obj === "object" && obj !== null) {
            Object.keys(obj).forEach((key) => {
                const fullPath = currentPath ? `${currentPath}.${key}` : key;
                if (typeof obj[key] === "object" && obj[key] !== null) {
                    keys.push(...collectKeys(obj[key], fullPath));
                } else {
                    keys.push(fullPath);
                }
            });
        }

        return keys;
    };

    const allKeys = new Set<string>();
    languages.forEach((lang) => {
        collectKeys(locales[lang]).forEach((key) => allKeys.add(key));
    });

    Array.from(allKeys).forEach((fullKey) => {
        const pathParts = fullKey.split(".");
        const key = pathParts[pathParts.length - 1];
        const path = pathParts.slice(0, -1).join(".");

        const values: Record<string, string> = {};
        languages.forEach((lang) => {
            const value = getNestedValue(locales[lang], fullKey);
            values[lang] = value || "";
        });

        result.push({
            path: path || "",
            key,
            values,
        });
    });

    return result;
};
