import React, { useState, useMemo } from "react";

import { useStatix } from "../hooks/useStatix";
import { flattenLocales, createLocaleColumns ,transformToTableData ,getDisplayValueForTable ,filterTableData } from "../utils";

import { TableProvider } from './table/TableContext';
import SimpleTable from './table/SimpleTable';

import {TableHeader} from "./LocaleTableHeader";

interface LocaleTableProps {
    localeData: Record<string, any>;
}

export const LocaleTable: React.FC<LocaleTableProps> = ({ localeData }) => {
    const { updateLocalValue, pendingChanges, usedLocales } = useStatix();
    const [searchTerm, setSearchTerm] = useState("");

    // Extract languages and flatten data
    const languages = useMemo(() => Object.keys(localeData), [localeData]);
    const flattenedData = useMemo(() => flattenLocales(localeData), [localeData]);

    // Create a table structure
    const columns = useMemo(() => createLocaleColumns(languages), [languages]);
    const tableData = useMemo(() => transformToTableData(flattenedData), [flattenedData]);

    // Create display value function with current context
    const getDisplayValue = useMemo(() =>
            (fullKey: string, lang: string, originalValue: string) =>
                getDisplayValueForTable(fullKey, lang, originalValue, pendingChanges),
        [pendingChanges]
    );

    // Filter data: Apply both used locales and search filters in one function
    const filteredData = useMemo(() =>
            filterTableData(tableData, searchTerm, languages, pendingChanges, usedLocales),
        [tableData, searchTerm, languages, pendingChanges, usedLocales]
    );

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <TableProvider
                initialColumns={columns}
                initialData={filteredData}
                getDisplayValue={getDisplayValue}
                updateLocalValue={updateLocalValue}
            >
                {/* Header Controls */}
                <TableHeader
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                />

                {/* Main Table */}
                <SimpleTable />
            </TableProvider>
        </div>
    );
};
