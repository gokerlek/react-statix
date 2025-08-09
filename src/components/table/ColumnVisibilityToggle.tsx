import React, { useEffect, useRef, useState } from 'react';
import { useTableContext } from './TableContext';
import { useStyle } from './useStyle';
import {IconButton} from "../IconButton";

const ColumnVisibilityToggle: React.FC = () => {
    const { columns, columnVisibility, toggleColumnVisibility } = useTableContext();
    const styles = useStyle();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Listen for clicks outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    return (
        <div style={styles.dropdown} ref={dropdownRef}>
            <IconButton
                onClick={() => setIsOpen(!isOpen)}
                label="Column Visibility"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                     className="lucide lucide-settings-icon lucide-settings">
                    <path
                        d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"/>
                    <circle cx="12" cy="12" r="3"/>
                </svg>
            </IconButton>

            <div
                style={styles.dropdownMenu({isOpen})}
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="options-menu"
            >
                {columns.map((column) => {
                    const isDisabled = column.id === columns[0].id;
                    if (isDisabled) return null;
                    return (
                        <label
                            key={column.id}
                            style={styles.dropdownItem}
                            role="menuitem"
                        >
                                <input
                                    type="checkbox"
                                    style={{
                                        ...styles.checkbox,
                                        ...(columnVisibility[column.id] ? styles.checkboxChecked : {})
                                    }}
                                    checked={columnVisibility[column.id]}
                                    onChange={() => toggleColumnVisibility(column.id)}
                                    disabled={isDisabled}
                                />
                                <span>{column.header}</span>
                            </label>
                        );
                    })}
            </div>
        </div>
    );
};

export default ColumnVisibilityToggle;
