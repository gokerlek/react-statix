export interface Column {
    id: string;
    header: string;
    accessor: string;
    width?: number;
}

// RowData interface'i, i18n anahtarını ve dinamik dil kodlarını içerecek şekilde güncellendi.
// 'LocaleTable' yapısına uygun olarak path, key ve values içerir.
export interface RowData {
    id: string; // Tam yol (fullKey) için kullanılacak, örn: "app.title"
    key: string; // Yolun son kısmı, örn: "title"
    path: string; // Yolun geri kalanı, örn: "app"
    values: { [langCode: string]: string }; // Dinamik dil değerleri (örn: 'en', 'tr', 'fr')
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

// Yeni eklenen komponentler için tip tanımlamaları (Context kullanacak şekilde güncellendi)
export interface HeadTableCellProps {
    column: Column;
    index: number;
    isFirstColumn: boolean; // İlk kolon olup olmadığını belirtmek için
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
        [key: string]: any; // İç içe nesneler veya stringler olabilir
    };
};

// Table Context için tip tanımlaması
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
