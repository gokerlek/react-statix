import React, { createContext, useContext, useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { TableContextType, TableProviderProps } from './types';

// Table Context oluşturuluyor
const TableContext = createContext<TableContextType | undefined>(undefined);

// Custom hook: TableContext'i kullanmak için
export const useTableContext = () => {
  const context = useContext(TableContext);
  if (context === undefined) {
    throw new Error('useTableContext must be used within a TableProvider');
  }
  return context;
};

// TableProvider Komponenti
export const TableProvider: React.FC<TableProviderProps> = ({ 
  initialColumns, 
  initialData, 
  children,
  getDisplayValue,
  updateLocalValue
}) => {
  const [columnWidths, setColumnWidths] = useState<{ [key: string]: number }>({});
  const [columnVisibility, setColumnVisibility] = useState<{ [key: string]: boolean }>({});

  // Resizer'ın state'leri
  const startX = useRef<number>(0);
  const startWidth = useRef<number>(0);
  const currentColumn = useRef<string | null>(null);

  // İlk render'da kolon genişliklerini ve görünürlüğünü ayarla
  useEffect(() => {
    const initialWidths: { [key: string]: number } = {};
    const initialVisibility: { [key: string]: boolean } = {};
    initialColumns.forEach(col => {
      initialWidths[col.id] = col.width || 150; // Varsayılan genişlik 150px
      initialVisibility[col.id] = true; // Varsayılan olarak tüm kolonlar görünür
    });
    setColumnWidths(initialWidths);
    setColumnVisibility(initialVisibility);
  }, [initialColumns]);

  // Kolon yeniden boyutlandırma başlangıcı
  const onMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>, columnId: string) => {
    startX.current = e.clientX;
    startWidth.current = columnWidths[columnId];
    currentColumn.current = columnId;
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, [columnWidths]);

  // Kolon yeniden boyutlandırma sırasında
  const onMouseMove = useCallback((e: MouseEvent) => {
    if (currentColumn.current) {
      const diff = e.clientX - startX.current;
      setColumnWidths(prevWidths => ({
        ...prevWidths,
        [currentColumn.current as string]: Math.max(50, startWidth.current + diff), // Minimum genişlik 50px
      }));
    }
  }, []);

  // Kolon yeniden boyutlandırma bitişi
  const onMouseUp = useCallback(() => {
    currentColumn.current = null;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }, [onMouseMove]);

  // Kolon görünürlüğünü değiştirme
  const toggleColumnVisibility = useCallback((columnId: string) => {
    // İlk kolon daima görünür olmalı
    if (columnId === initialColumns[0].id) return;

    setColumnVisibility(prev => ({
      ...prev,
      [columnId]: !prev[columnId],
    }));
  }, [initialColumns]);

  // Görünür kolonları filtrele
  const visibleColumns = useMemo(() => initialColumns.filter(col => columnVisibility[col.id]), [initialColumns, columnVisibility]);

  const contextValue = useMemo(() => ({
    columns: initialColumns,
    data: initialData,
    columnWidths,
    columnVisibility,
    onMouseDown,
    toggleColumnVisibility,
    visibleColumns,
    getDisplayValue,
    updateLocalValue,
  }), [initialColumns, initialData, columnWidths, columnVisibility, onMouseDown, toggleColumnVisibility, visibleColumns, getDisplayValue, updateLocalValue]);

  return (
    <TableContext.Provider value={contextValue}>
      {children}
    </TableContext.Provider>
  );
};
