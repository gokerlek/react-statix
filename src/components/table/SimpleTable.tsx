import React, { useRef } from 'react';
import { useTableContext } from './TableContext';
import { useStyle } from './useStyle';
import HeadTableCell from "./HeadTableCell";
import NoData from "./NoData";
import BodyRow from "./BodyRow";
import ColumnVisibilityToggle from "./ColumnVisibilityToggle";

// LocaleTable için sadeleştirilmiş tablo komponenti (başlık olmadan)
const SimpleTable: React.FC = () => {
    const { data, visibleColumns } = useTableContext();
    const styles = useStyle();
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    return (
        <>
            {/* Kolon Görünürlüğü Toggle */}
            <div style={{ marginBottom: "16px", flexShrink: 0 }}>
                <ColumnVisibilityToggle />
            </div>

            {/* Ana Tablo Konteyneri */}
                <div
                    ref={scrollContainerRef}
                    style={{ ...styles.scrollContainer }}
                >
                    <table style={styles.table}>
                        <thead style={styles.thead}>
                            <tr>
                                {visibleColumns.map((column, index) => (
                                    <HeadTableCell
                                        key={column.id}
                                        column={column}
                                        index={index}
                                        isFirstColumn={index === 0}
                                    />
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {/* Tablo Gövdesi */}
                            {data.length === 0 ? (
                                <NoData colSpan={visibleColumns.length} />
                            ) : (
                                data.map((row, rowIndex) => (
                                    <BodyRow
                                        key={row.id}
                                        row={row}
                                        rowIndex={rowIndex}
                                    />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </>
    );
};

export default SimpleTable;
