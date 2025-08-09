export interface Column {
    id: string;
    header: string;
    accessor: string;
    width?: number;
}

// RowData interface has been updated to include i18n key and dynamic language codes.
// Contains path, key and values according to the 'LocaleTable' structure.
export interface RowData {
    id: string; // Used for full path (fullKey), e.g.: "app.title"
    key: string; // Last part of the path, e.g.: "title"
    path: string; // Rest of the path, e.g.: "app"
    values: { [langCode: string]: string }; // Dynamic language values (e.g.: 'en', 'tr', 'fr')
}

export interface TableProps {
    columns: Column[];
    data: RowData[];
}

export interface ColumnVisibilityToggleProps {
    columns: Column[];
    columnVisibility: { [key: string]: boolean };
    toggleColumnVisibility: (columnId: string) => void;
}

// Type definitions for newly added components (updated to use Context)
export interface HeadTableCellProps {
    column: Column;
    index: number;
    isFirstColumn: boolean; // To indicate whether it is the first column
}

export interface BodyRowProps {
    row: RowData;
    rowIndex: number;
}

export interface NoDataProps {
    colSpan: number;
}

export type LocalizationData = {
    [lang: string]: {
        [key: string]: any; // Can be nested objects or strings
    };
};

// Type definition for Table Context
export interface TableContextType {
    columns: Column[];
    data: RowData[];
    columnWidths: { [key: string]: number };
    columnVisibility: { [key: string]: boolean };
    onMouseDown: (e: React.MouseEvent<HTMLDivElement>, columnId: string) => void;
    toggleColumnVisibility: (columnId: string) => void;
    visibleColumns: Column[];
    getDisplayValue?: (fullKey: string, lang: string, originalValue: string) => string;
    updateLocalValue?: (lang: string, key: string, value: string) => void;
}

// TableProvider Props
export interface TableProviderProps {
    initialColumns: Column[];
    initialData: RowData[];
    children: React.ReactNode;
    getDisplayValue?: (fullKey: string, lang: string, originalValue: string) => string;
    updateLocalValue?: (lang: string, key: string, value: string) => void;
}
