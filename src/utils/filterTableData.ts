import { RowData } from "../components/table/types";
import { getDisplayValueForTable } from "./getDisplayValueForTable";

/**
 * Filters table data based on used locales and search term
 * @param tableData Array of table rows
 * @param searchTerm Search string
 * @param languages Array of language codes
 * @param pendingChanges Pending changes object
 * @param usedLocales Set of used locale keys
 * @returns Filtered table data
 */
export const filterTableData = (
    tableData: RowData[],
    searchTerm: string,
    languages: string[],
    pendingChanges: Record<string, any>,
    usedLocales?: Set<string>
): RowData[] => {
    let filteredData = tableData;

    // First filter by used locales if provided
    if (usedLocales && usedLocales.size > 0) {
        const usedLocalesArray = Array.from(usedLocales);
        filteredData = tableData.filter((row) => {
            return usedLocalesArray.indexOf(row.id) !== -1;
        });
    }

    // Then apply search filter
    if (!searchTerm.trim()) return filteredData;

    const searchLower = searchTerm.toLowerCase().trim();

    return filteredData.filter((row) => {
        const fullKey = row.id;

        // Search in key path
        if (fullKey.toLowerCase().includes(searchLower)) {
            return true;
        }

        // Search in language values
        return languages.some((lang) => {
            const value = getDisplayValueForTable(fullKey, lang, row.values[lang], pendingChanges);
            return value && value.toLowerCase().includes(searchLower);
        });
    });
};
