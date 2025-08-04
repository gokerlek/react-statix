import React, {useState, useMemo} from "react";

import {useStatix} from "../hooks/useStatix";
import {getNestedValue} from "../utils/getNestedValue";
import {flattenLocales} from "../utils/flattenLocales";
import { TableProvider } from './table/TableContext';
import SimpleTable from './table/SimpleTable';
import { Column, RowData } from './table/types';

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

    const handleInputChange = (
        fullKey: string,
        lang: string,
        value: string
    ) => {
        updateLocalValue(lang, fullKey, value);
    };

    return (
        <div style={{height: "100%", display: "flex", flexDirection: "column"}}>
            <div style={{marginBottom: "16px", flexShrink: 0}}>
                <input
                    type="text"
                    placeholder="Search keys or translations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        width: "100%",
                        maxWidth: "400px",
                        padding: "10px 12px",
                        border: "1px solid #ddd",
                        borderRadius: "6px",
                        fontSize: "14px",
                        outline: "none",
                    }}
                    onFocus={(e) => {
                        e.target.style.borderColor = "#007bff";
                        e.target.style.boxShadow = "0 0 0 2px rgba(0,123,255,0.25)";
                    }}
                    onBlur={(e) => {
                        e.target.style.borderColor = "#ddd";
                        e.target.style.boxShadow = "none";
                    }}
                />
                {searchTerm && (
                    <div style={{marginTop: "8px", fontSize: "14px", color: "#666"}}>
                        {filteredData.length} result{filteredData.length !== 1 ? 's' : ''} found
                    </div>
                )}
            </div>


            <TableProvider
                initialColumns={columns}
                initialData={filteredData}
                onCellEdit={() => {}} // Boş bırakılabilir, handleInputChange kullanılacak
                getDisplayValue={getDisplayValue}
                handleInputChange={handleInputChange}
            >
                <SimpleTable />
            </TableProvider>
        </div>
    );
};

