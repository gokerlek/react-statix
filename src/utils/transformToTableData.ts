import { RowData } from "../components/table/types";

/**
 * Transforms flattened locale data into table rows
 * @param flattenedData Flattened locale data
 * @returns Array of table row data
 */
export const transformToTableData = (flattenedData: any[]): RowData[] => {
    return flattenedData.map(row => {
        const fullKey = row.path ? `${row.path}.${row.key}` : row.key;
        return {
            id: fullKey,
            key: row.key,
            path: row.path,
            values: row.values
        };
    });
};
