import {Column, RowData, LocalizationData} from "../components/table/types";

export function flattenObject(obj: any, currentPath = "", res: { [key: string]: string } = {}) {
    if (typeof obj === "object" && obj !== null && !Array.isArray(obj)) {
        Object.keys(obj).forEach((key) => {
            const fullPath = currentPath ? `${currentPath}.${key}` : key;
            if (typeof obj[key] === "object" && obj[key] !== null && !Array.isArray(obj[key])) {
                flattenObject(obj[key], fullPath, res);
            } else {
                res[fullPath] = obj[key];
            }
        });
    }
    return res;
}

// Helper function: Sets a value in a nested object
export function setNestedValue(obj: any, path: string, value: any) {
    const pathParts = path.split('.');
    let current = obj;
    for (let i = 0; i < pathParts.length - 1; i++) {
        const part = pathParts[i];
        if (typeof current[part] !== 'object' || current[part] === null) {
            current[part] = {};
        }
        current = current[part];
    }
    current[pathParts[pathParts.length - 1]] = value;
}


// Helper function: Transforms i18n data into table props (adapted from LocaleTable)
export function transformLocalizationDataToTableProps(localizationData: LocalizationData): { columns: Column[], data: RowData[] } {
    const languages = Object.keys(localizationData);
    const allKeys = new Set<string>();

    // Collect unique keys from all languages
    languages.forEach(lang => {
        const flattened = flattenObject(localizationData[lang]);
        Object.keys(flattened).forEach(key => allKeys.add(key));
    });

    // Create columns
    const columns: Column[] = [
        { id: 'key', header: 'Key/Path', accessor: 'key', width: 250 }, // Fixed first column
        ...languages.map(lang => ({
            id: lang,
            header: lang.toUpperCase(), // Show language code as header
            accessor: lang, // This accessor won't actually be used, row.values[lang] will be accessed directly
            width: 150, // Default width for language columns
        })),
    ];

    // Create data rows
    const data: RowData[] = Array.from(allKeys).map(fullKey => {
        const pathParts = fullKey.split(".");
        const key = pathParts[pathParts.length - 1];
        const path = pathParts.slice(0, -1).join(".");

        const values: { [langCode: string]: string } = {};
        languages.forEach(lang => {
            const flattenedLangData = flattenObject(localizationData[lang]);
            values[lang] = flattenedLangData[fullKey] || ''; // Get the translation, use empty string if not found
        });
        return { id: fullKey, key, path, values }; // id is now fullKey
    });

    // Sort by key for consistent ordering
    data.sort((a, b) => a.id.localeCompare(b.id)); // id (fullKey) üzerinden sırala

    return { columns, data };
}
