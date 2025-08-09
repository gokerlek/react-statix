import React, {useState, useMemo} from "react";

import {useStatix} from "../hooks/useStatix";
import {getNestedValue} from "../utils/getNestedValue";
import {flattenLocales} from "../utils/flattenLocales";
import { TableProvider } from './table/TableContext';
import SimpleTable from './table/SimpleTable';
import { Column, RowData } from './table/types';
import ColumnVisibilityToggle from "./table/ColumnVisibilityToggle";
import SearchInput from './table/SearchInput';
import {SaveStatix} from "./SaveStatix";

interface LocaleTableProps {
    localeData: Record<string, any>;
}



export const LocaleTable: React.FC<LocaleTableProps> = ({localeData}) => {
    const {updateLocalValue, pendingChanges} = useStatix();
    const [searchTerm, setSearchTerm] = useState("");
    const flattenedData = flattenLocales(localeData);
    const languages = Object.keys(localeData);

    // Table için kolonları oluştur
    const columns: Column[] = useMemo(() => [
        { id: 'key', header: 'Key/Path', accessor: 'key', width: 250 },
        ...languages.map(lang => ({
            id: lang,
            header: lang.toUpperCase(),
            accessor: lang,
            width: 200
        }))
    ], [languages]);

    // Table için veriyi dönüştür
    const tableData: RowData[] = useMemo(() => {
        return flattenedData.map(row => {
            const fullKey = row.path ? `${row.path}.${row.key}` : row.key;
            return {
                id: fullKey,
                key: row.key,
                path: row.path,
                values: row.values
            };
        });
    }, [flattenedData]);

    const getDisplayValue = (fullKey: string, lang: string, originalValue: string) => {
        const pendingValue = getNestedValue(pendingChanges?.[lang], fullKey);
        return pendingValue !== undefined ? pendingValue : originalValue;
    };

    const filteredData = useMemo(() => {
        if (!searchTerm.trim()) return tableData;

        const searchLower = searchTerm.toLowerCase().trim();

        return tableData.filter((row) => {
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
    }, [tableData, searchTerm, languages, pendingChanges, getDisplayValue]);

    return (
        <div style={{height: "100%", display: "flex", flexDirection: "column"}}>
            <TableProvider
                initialColumns={columns}
                initialData={filteredData}
                getDisplayValue={getDisplayValue}
                updateLocalValue={updateLocalValue}
            >
            <div style={{display:"flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0",}}>
                    <SearchInput
                        value={searchTerm}
                        onChange={setSearchTerm}
                        placeholder="Search keys or translations..."
                    />

                <div style={{display:'flex', gap:'8px', alignItems:'center'}}>
                 <SaveStatix/>
                <ColumnVisibilityToggle />

                </div>

            </div>



                <SimpleTable />
            </TableProvider>
        </div>
    );
};

