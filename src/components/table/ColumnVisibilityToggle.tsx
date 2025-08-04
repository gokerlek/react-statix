import React, { useEffect, useRef, useState } from 'react';
import { useTableContext } from './TableContext';
import { useStyle } from './useStyle';

const ColumnVisibilityToggle: React.FC = () => {
    const { columns, columnVisibility, toggleColumnVisibility } = useTableContext();
    const styles = useStyle();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Dışarı tıklamaları dinle
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
            <div>
                <button
                    type="button"
                    style={styles.button}
                    id="options-menu"
                    aria-haspopup="true"
                    aria-expanded={isOpen}
                    onClick={() => setIsOpen(!isOpen)}
                    onFocus={(e) => {
                        Object.assign(e.currentTarget.style, styles.buttonFocus);
                    }}
                    onBlur={(e) => {
                        Object.assign(e.currentTarget.style, styles.button);
                    }}
                >
                    Kolonları Yönet
                    <svg style={styles.icon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>

            <div
                style={styles.dropdownMenu({ isOpen })}
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="options-menu"
            >
                <div style={{ padding: '0.25rem 0' }} role="none">
                    {columns.map((column) => {
                        const isDisabled = column.id === columns[0].id;
                        return (
                            <label
                                key={column.id}
                                style={styles.dropdownItem({ disabled: isDisabled })}
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
        </div>
    );
};

export default ColumnVisibilityToggle;
