import React from 'react';
import { useTableContext } from './TableContext';
import { useStyle } from './useStyle';
import {HeadTableCellProps} from "./types";

const HeadTableCell: React.FC<HeadTableCellProps> = ({ column, isFirstColumn }) => {
    const { columnWidths, onMouseDown } = useTableContext();
    const styles = useStyle();
    return (
        <th
            key={column.id}
            style={{
                ...styles.th({ isFirstColumn }),
                width: columnWidths[column.id]
            }}
        >
            {column.header}
            <div
                className="resizer"
                onMouseDown={(e) => onMouseDown(e, column.id)}
                style={{
                    ...styles.resizer,
                }}
            />
        </th>
    );
};

export default HeadTableCell;
