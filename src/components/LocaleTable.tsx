import React, { useMemo, useState } from "react";

import { useStatix } from "../hooks/useStatix";
import { flattenLocales } from "../utils/flattenLocales";
import { getNestedValue } from "../utils/getNestedValue";

import ColumnVisibilityToggle from "./table/ColumnVisibilityToggle";
import SearchInput from "./table/SearchInput";
import SimpleTable from "./table/SimpleTable";
import { TableProvider } from "./table/TableContext";
import { Column, RowData } from "./table/types";
import { SaveStatix } from "./SaveStatix";

interface LocaleTableProps {
    localeData: Record<string, any>;
}

export const LocaleTable: React.FC<LocaleTableProps> = ({ localeData }) => {
    const { updateLocalValue, pendingChanges, usedLocales } = useStatix();
    const [searchTerm, setSearchTerm] = useState("");
    const flattenedData = flattenLocales(localeData);
    const languages = Object.keys(localeData);

    // Create columns for the table
    const columns: Column[] = useMemo(
        () => [
            { id: "key", header: "Key/Path", accessor: "key", width: 250 },
            ...languages.map((lang) => ({
                id: lang,
                header: lang.toUpperCase(),
                accessor: lang,
                width: 200,
            })),
        ],
        [languages],
    );

    // Transform data for the table
    const tableData: RowData[] = useMemo(() => {
        return flattenedData.map((row) => {
            const fullKey = row.path ? `${row.path}.${row.key}` : row.key;
            return {
                id: fullKey,
                key: row.key,
                path: row.path,
                values: row.values,
            };
        });
    }, [flattenedData]);

    const getDisplayValue = (
        fullKey: string,
        lang: string,
        originalValue: string,
    ) => {
        const pendingValue = getNestedValue(pendingChanges?.[lang], fullKey);
        return pendingValue !== undefined ? pendingValue : originalValue;
    };

    const filteredData = useMemo(() => {
        // First filter by used locales
        const usedLocalesArray = Array.from(usedLocales);
        let filteredByUsed = tableData;

        if (usedLocalesArray.length > 0) {
            filteredByUsed = tableData.filter((row) => {
                return usedLocalesArray.indexOf(row.id) !== -1;
            });
        }

        // Then apply search filter
        if (!searchTerm.trim()) return filteredByUsed;

        const searchLower = searchTerm.toLowerCase().trim();

        return filteredByUsed.filter((row) => {
            const fullKey = row.id;

            // Search in key path
            if (fullKey.toLowerCase().includes(searchLower)) {
                return true;
            }

            // Search in language values
            return languages.some((lang) => {
                const value = getDisplayValue(fullKey, lang, row.values[lang]);
                return value && value.toLowerCase().includes(searchLower);
            });
        });
    }, [
        tableData,
        searchTerm,
        languages,
        pendingChanges,
        getDisplayValue,
        usedLocales,
    ]);

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <TableProvider
                initialColumns={columns}
                initialData={filteredData}
                getDisplayValue={getDisplayValue}
                updateLocalValue={updateLocalValue}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "12px 0",
                    }}
                >
                    <SearchInput
                        value={searchTerm}
                        onChange={setSearchTerm}
                        placeholder="Search keys or translations..."
                    />

                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <SaveStatix />
                        <ColumnVisibilityToggle />
                    </div>
                </div>

                <SimpleTable />
            </TableProvider>
        </div>
    );
};
