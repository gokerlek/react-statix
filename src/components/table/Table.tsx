import React, { useRef } from 'react';
import { useTableContext } from './TableContext';
import { useStyle } from './useStyle';
import HeadTableCell from "./HeadTableCell";
import NoData from "./NoData";
import BodyRow from "./BodyRow";
import ColumnVisibilityToggle from "./ColumnVisibilityToggle";

const Table: React.FC = () => {
    const { data, visibleColumns } = useTableContext();
    const styles = useStyle();
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Gelişmiş Tablo Komponenti</h1>

            {/* Kolon Görünürlüğü Toggle */}
            <ColumnVisibilityToggle />

            {/* Ana Tablo Konteyneri */}
            <div style={styles.tableWrapper}>
                <div ref={scrollContainerRef} style={styles.scrollContainer}>
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
                        </thead><tbody>{/* Tablo Gövdesi */}
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
            </div>
        </div>
    );
};

export default Table;
