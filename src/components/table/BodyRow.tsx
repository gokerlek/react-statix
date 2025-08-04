import React, { useCallback, useEffect, useRef } from "react";

import { useTableContext } from "./TableContext";
import { useStyle } from "./useStyle";
import { BodyRowProps } from "./types";

const BodyRow: React.FC<BodyRowProps> = ({ row, rowIndex }) => {
    const { visibleColumns, columnWidths, onCellEdit, getDisplayValue, handleInputChange } = useTableContext();
    const styles = useStyle();
    const textareaRefs = useRef<{ [key: string]: HTMLTextAreaElement | null }>({});

    // Textarea yüksekliğini ayarlayan fonksiyon
    const adjustTextareaHeight = useCallback(
        (textarea: HTMLTextAreaElement | null) => {
            if (textarea) {
                textarea.style.height = "auto"; // Yüksekliği sıfırla
                textarea.style.height = `${textarea.scrollHeight}px`; // İçeriğe göre ayarla
            }
        },
        [],
    );

    // Satır render edildiğinde veya veri değiştiğinde textarea yüksekliğini ayarla
    useEffect(() => {
        visibleColumns.forEach((column) => {
            if (column.id !== "key") {
                adjustTextareaHeight(textareaRefs.current[column.id]);
            }
        });
    }, [row, visibleColumns, adjustTextareaHeight]);

    // Tam anahtar yolu (fullKey)
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
                    {/* İlk kolon (key/path) düzenlenemez, diğerleri textarea */}
                    {column.id === "key" ? (
                        <>
                            {row.path&&<span style={styles.keyDisplay}>{row.path}.</span>}
                            {row.key}
                        </>
                    ) : (
                        <textarea
                            ref={(el) => (textareaRefs.current[column.id] = el)}
                            value={
                                getDisplayValue 
                                    ? getDisplayValue(fullKey, column.id, row.values[column.id])
                                    : row.values[column.id]
                            }
                            onChange={(e) => {
                                if (handleInputChange) {
                                    handleInputChange(fullKey, column.id, e.target.value);
                                } else {
                                    onCellEdit(fullKey, column.id, e.target.value);
                                }
                            }}
                            onInput={(e) => adjustTextareaHeight(e.currentTarget)}
                            onFocus={(e) => {
                                Object.assign(e.target.style, styles.textareaFocus);
                            }}
                            onBlur={(e) => {
                                Object.assign(e.target.style, styles.textarea);
                            }}
                            rows={1}
                            style={styles.textarea}
                        />
                    )}
                </td>
            ))}
        </tr>
    );
};

export default BodyRow;
