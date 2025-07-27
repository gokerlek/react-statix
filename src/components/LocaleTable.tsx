import React, {useState, useMemo} from "react";

import {useStatix} from "../hooks/useStatix";
import {getNestedValue} from "../utils/getNestedValue";

interface LocaleTableProps {
    localeData: Record<string, any>;
}

interface FlattenedLocale {
    path: string;
    key: string;
    values: Record<string, string>;
}

const flattenLocales = (
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

export const LocaleTable: React.FC<LocaleTableProps> = ({localeData}) => {
    const {updateLocalValue, pendingChanges} = useStatix();
    const [searchTerm, setSearchTerm] = useState("");
    const flattenedData = flattenLocales(localeData);
    const languages = Object.keys(localeData);

    const getDisplayValue = (fullKey: string, lang: string, originalValue: string) => {
        const pendingValue = getNestedValue(pendingChanges?.[lang], fullKey);
        return pendingValue !== undefined ? pendingValue : originalValue;
    };

    const filteredData = useMemo(() => {
        if (!searchTerm.trim()) return flattenedData;

        const searchLower = searchTerm.toLowerCase().trim();

        return flattenedData.filter((row) => {
            const fullKey = row.path ? `${row.path}.${row.key}` : row.key;

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
    }, [flattenedData, searchTerm, languages, pendingChanges]);

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

            <div
                style={{
                    height: "100%",
                    minHeight: "0",
                    display: "flex",
                    flexDirection: "column",
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px"
                }}
            >
                <div
                    style={{
                        flex: "1",
                        overflowY: "auto",
                        overflowX: "auto",
                    }}
                >
                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "separate",
                            borderSpacing: "0",
                            fontSize: "14px",
                        }}
                    >
                        <thead>
                        <tr style={{
                            backgroundColor: "#f8f9fa",
                            position: "sticky",
                            top: "0",
                            zIndex: "10"
                        }}>
                           <th
                                style={{
                                    padding: "12px 16px",
                                    textAlign: "left",
                                    fontWeight: "600",
                                    minWidth: "120px",
                                    backgroundColor: "#f8f9fa",
                                    borderBottom: "2px solid #e0e0e0"
                                }}
                            >
                                Key/Path
                            </th>
                            {languages.map((lang) => (
                                <th
                                    key={lang}
                                    style={{
                                        padding: "12px 16px",
                                        textAlign: "left",
                                        fontWeight: "600",
                                        minWidth: "200px",
                                        backgroundColor: "#f8f9fa",
                                        borderBottom: "2px solid #e0e0e0"
                                    }}
                                >
                                    {lang.toUpperCase()}
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {filteredData.map((row, index) => {
                            const fullKey = row.path ? `${row.path}.${row.key}` : row.key;

                            return (
                                <tr
                                    key={index}
                                    style={{
                                        backgroundColor: index % 2 === 0 ? "#ffffff" : "#f8f9fa"
                                    }}
                                >
                                     <td
                                        style={{
                                            padding: "12px 16px",
                                            fontWeight: "500",
                                        }}
                                    >
                                        {row.key}
                                        <div style={{
                                            fontSize: "13px",
                                            color: "#666",
                                        }}
                                        >
                                        {row.path}
                                        </div>
                                    </td>
                                    {languages.map((lang) => (
                                        <td
                                            key={lang}
                                            style={{
                                                padding: "8px 16px",
                                            }}
                                        >
                                            <input
                                                type="text"
                                                value={getDisplayValue(fullKey, lang, row.values[lang])}
                                                onChange={(e) =>
                                                    handleInputChange(fullKey, lang, e.target.value)
                                                }
                                                style={{
                                                    width: "100%",
                                                    padding: "8px 12px",
                                                    border: "1px solid #ddd",
                                                    borderRadius: "6px",
                                                    fontSize: "13px",
                                                    outline: "none",
                                                    backgroundColor: "#ffffff"
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
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

