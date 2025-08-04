import React from "react";

import { useTableContext } from "./TableContext";
import { useStyle } from "./useStyle";
import { BodyRowProps } from "./types";
import EditableTextarea from "./EditableTextarea";

const BodyRow: React.FC<BodyRowProps> = ({ row, rowIndex }) => {
    const { visibleColumns, columnWidths, getDisplayValue, updateLocalValue } = useTableContext();
    const styles = useStyle();

    const fullKey = row.path ? `${row.path}.${row.key}` : row.key;

    return (
        <tr
            key={row.id}
            style={{
                ...styles.tr,
            }}

        >
            {visibleColumns.map((column, colIndex) => (
                <td
                    key={`${row.id}-${column.id}`}
                    style={{
                        ...styles.td({ 
                            isFirstColumn: colIndex === 0,
                            isEvenRow: rowIndex % 2 === 0
                        }),
                        width: columnWidths[column.id]
                    }}
                >
                    {column.id === "key" ? (
                        <>
                            {row.path&&<span style={styles.keyDisplay}>{row.path}.</span>}
                            {row.key}
                        </>
                    ) : (
                        <EditableTextarea
                            value={
                                getDisplayValue 
                                    ? getDisplayValue(fullKey, column.id, row.values[column.id])
                                    : row.values[column.id]
                            }
                            onChange={(value) => {
                                if (updateLocalValue) {
                                    updateLocalValue(column.id, fullKey, value);
                                }
                            }}
                        />
                    )}
                </td>
            ))}
        </tr>
    );
};

export default BodyRow;
