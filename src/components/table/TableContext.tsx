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
    
    // First, set the key column width and visibility
    const keyColumn = initialColumns[0];
    const keyColumnWidth = keyColumn.width || 250;
    initialWidths[keyColumn.id] = keyColumnWidth;
    initialVisibility[keyColumn.id] = true;
    
    // Calculate the minimum width for language columns (12.5rem = 200px if 1rem = 16px)
    const minLanguageColumnWidth = 200; // 12.5rem
    
    // Get language columns (all columns except the first one)
    const languageColumns = initialColumns.slice(1);
    
    // Set visibility for all language columns
    languageColumns.forEach(col => {
      initialVisibility[col.id] = true;
    });
    
    // If there are language columns, set equal widths with minimum of 12.5rem
    if (languageColumns.length > 0) {
      // Set equal width for all language columns (minimum 12.5rem)
      // Use a reasonable default for window.innerWidth in case it's not available (e.g., during SSR)
      const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
      const languageColumnWidth = Math.max(minLanguageColumnWidth, 
        (windowWidth - keyColumnWidth) / languageColumns.length);
      
      languageColumns.forEach(col => {
        initialWidths[col.id] = languageColumnWidth;
      });
    }
    
    setColumnWidths(initialWidths);
    setColumnVisibility(initialVisibility);
  }, [initialColumns]);
  
  // Update column widths when window is resized
  useEffect(() => {
    const handleResize = () => {
      if (initialColumns.length <= 1) return;
      
      const keyColumn = initialColumns[0];
      const keyColumnWidth = columnWidths[keyColumn.id];
      const languageColumns = initialColumns.slice(1);
      const minLanguageColumnWidth = 200; // 12.5rem
      
      // Calculate equal width for language columns
      // Use a reasonable default for window.innerWidth in case it's not available
      const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
      const languageColumnWidth = Math.max(minLanguageColumnWidth, 
        (windowWidth - keyColumnWidth) / languageColumns.length);
      
      setColumnWidths(prev => {
        const newWidths = { ...prev };
        languageColumns.forEach(col => {
          newWidths[col.id] = languageColumnWidth;
        });
        return newWidths;
      });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [initialColumns, columnWidths]);

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
