import { useMemo } from 'react';

interface UseStyleOptions {
  isFirstColumn?: boolean;
  isEvenRow?: boolean;
  isOpen?: boolean;
  disabled?: boolean;
}

// Design Tokens
export const colors = {
  // Background colors
  bg: {
    primary: '#ffffff',
    secondary: '#f9fafb',
    header: '#e3e3e3',
    body: '#fafafa',
    hover: '#eff6ff',
    focus: '#f0f9ff',
  },
  
  // Border colors
  border: {
    primary: '#e3e3e3',
    focus: '#747272',
    light: '#f3f4f6',
    textarea: '#e3e3e3',
  },
  
  // Text colors
  text: {
    primary: '#3a3a3a',
    secondary: '#6b7280',
    muted: '#9ca3af',
  },
  
  // State colors
  state: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  }
};

export const typography = {
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
  },
  
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  }
};

export const spacing = {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '0.75rem',    // 12px
  lg: '1rem',       // 16px
  xl: '1.5rem',     // 24px
  '2xl': '2rem',    // 32px
};

export const borderRadius = {
  none: '0',
  sm: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  table: '0.625rem',
  xl: '0.75rem',
  full: '9999px',
};

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  focus: '0 0 0 1px #3b82f6',
  focusRing: '0 0 0 1px rgba(59, 130, 246, 0.25)',
  textareaFocus: '0 0 0 1px rgba(160, 160, 160, 0.3)',
};

export const transitions = {
  fast: '150ms ease',
  normal: '300ms ease',
  slow: '500ms ease',
};

export const useStyle = () => {
  return useMemo(() => ({
    // Container styles
    container: {
      padding: spacing.lg,
      backgroundColor: colors.bg.secondary,
      minHeight: '100vh',
    },

    title: {
      fontSize: typography.fontSize.xl,
      lineHeight: typography.lineHeight.relaxed,
      fontWeight: typography.fontWeight.semibold,
      marginBottom: spacing.xl,
      textAlign: 'center' as const,
      color: colors.text.primary,
    },

    // Table container
    tableWrapper: {
      position: 'relative' as const,
      overflow: 'hidden',
      borderRadius: borderRadius.table,
      border: `1px solid ${colors.border.primary}`,
      backgroundColor: colors.bg.primary,
    },

    scrollContainer: {
      overflowY: 'auto' as const,
      overflowX: 'auto' as const,
      position: 'relative' as const,
      flex: 1,
      borderRadius: borderRadius.table,
      border: `1px solid ${colors.border.primary}`,
      zIndex: 10,
      maxHeight: 'max-content',
    },

    table: {
      tableLayout: 'fixed' as const,
      borderCollapse: 'collapse' as const,
    },

    // Header styles
    thead: {
      position: 'sticky' as const,
      top: 0,
      backgroundColor: colors.bg.header,
      color: colors.text.primary,
      fontWeight: typography.fontWeight.medium,
      zIndex: 20,
    },

    th: (options: UseStyleOptions = {}) => ({
      padding: `${spacing.md} ${spacing.lg}`,
      textAlign: 'left' as const,
      fontWeight: typography.fontWeight.medium,
      fontSize: typography.fontSize.sm,
      lineHeight: typography.lineHeight.tight,
      position: 'relative' as const,
      ...(options.isFirstColumn && {
        position: 'sticky' as const,
        left: 0,
        backgroundColor: colors.bg.header,
        zIndex: 30,
      }),
    }),

    // Row styles
    tr: {
      backgroundColor: colors.bg.body,
      transition: transitions.fast,
      borderBottom: `1px solid ${colors.border.primary}`,
      borderTop: `1px solid ${colors.border.primary}`,
      borderRight: `1px solid ${colors.border.primary}`,
    },


    // Cell styles
    td: (options: UseStyleOptions = {}) => ({
      padding: `${spacing.xs} ${spacing.lg}`,
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.normal,
      lineHeight: typography.lineHeight.tight,
      color: colors.text.primary,
      verticalAlign: 'middle',
      ...(options.isFirstColumn && {
        position: 'sticky' as const,
        left: 0,
        zIndex: 10,
        backgroundColor: colors.bg.body,
      }),
    }),

    // Input/Textarea styles
    textarea: {
      width: '100%',
      padding: spacing.sm,
      border: `1px solid ${colors.border.textarea}`,
      borderRadius: borderRadius.sm,
      fontSize: typography.fontSize.sm,
      color: colors.text.primary,
      fontWeight: typography.fontWeight.normal,
      lineHeight: typography.lineHeight.tight,
      outline: 'none',
      resize: 'none' as const,
      overflow: 'hidden',
      minHeight: '24px',
      backgroundColor: colors.bg.body,
      transition: transitions.fast,
    },

    textareaFocus: {
      borderColor: colors.border.textarea,
      backgroundColor: colors.bg.body,
      boxShadow: shadows.textareaFocus,
    },

    // Search input styles (textarea-like design)
    searchInput: {
      width: '100%',
      maxWidth: '400px',
      padding: spacing.sm,
      border: `1px solid ${colors.border.textarea}`,
      borderRadius: borderRadius.md,
      fontSize: typography.fontSize.sm,
      color: colors.text.primary,
      fontWeight: typography.fontWeight.normal,
      lineHeight: typography.lineHeight.normal,
      outline: 'none',
      backgroundColor: colors.bg.body,
      transition: transitions.fast,
      fontFamily: 'inherit',
    },

    searchInputFocus: {
      borderColor: colors.border.textarea,
      backgroundColor: colors.bg.body,
      boxShadow: shadows.textareaFocus,
    },

    // Key/Path display
    keyDisplay: {
      fontSize: typography.fontSize.xs,
      color: colors.text.secondary,
    },

    // Resizer handle
    resizer: {
      position: 'absolute' as const,
      top: 0,
      right: 0,
      width: spacing.sm,
      height: '100%',
      cursor: 'col-resize',
      opacity: 1,
      transition: 'background-color 150ms ease-in-out, box-shadow 150ms ease-in-out',
      backgroundColor: colors.text.secondary,
    },


    resizerVisible: {
      opacity: 1,
    },

    // Button styles
    button: {
      display: 'inline-flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      border: `1px solid ${colors.border.textarea}`,
      borderRadius: borderRadius.md,
        fontSize: typography.fontSize.sm,
        color: colors.text.primary,
        fontWeight: typography.fontWeight.normal,
        lineHeight: typography.lineHeight.normal,
      boxShadow: shadows.sm,
      padding: spacing.sm,
      cursor: 'pointer',
      transition: transitions.fast,
      backgroundColor: colors.bg.body,

    },


    buttonFocus: {
        borderColor: colors.border.textarea,
        backgroundColor: colors.bg.body,
        boxShadow: shadows.textareaFocus,
    },

    // Dropdown styles
    dropdown: {
      position: 'relative' as const,
      display: 'inline-block',
      textAlign: 'left' as const,
    },

    dropdownMenu: (options: UseStyleOptions = {}) => ({
      ...(options.isOpen ? {} : { display: 'none' }),
      position: 'absolute' as const,
      right: 0,
      marginTop: spacing.sm,
      width: '14rem',
      borderRadius: borderRadius.md,
      backgroundColor: colors.bg.body,
      borderColor: colors.border.textarea,
      boxShadow: shadows.textareaFocus,

        zIndex: 50,
    }),

    dropdownItem: {
      display: 'flex',
      alignItems: 'center',
      padding: `${spacing.sm} ${spacing.lg}`,
      fontSize: typography.fontSize.sm,
      lineHeight: typography.lineHeight.tight,
      color: colors.text.primary,
      cursor: 'pointer',
      backgroundColor:'transparent',
    },


    // Checkbox styles
    checkbox: {
      appearance: 'none' as const,
      backgroundColor: colors.bg.primary,
      border: `1px solid ${colors.border.light}`,
      borderRadius: borderRadius.sm,
      display: 'inline-block',
      flexShrink: 0,
      height: spacing.lg,
      width: spacing.lg,
      color: colors.state.info,
      transition: transitions.fast,
      marginRight: spacing.sm,
    },

    checkboxChecked: {
      backgroundColor: 'currentColor',
      borderColor: 'transparent',
      backgroundImage: `url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='m13.854 3.646-7.5 7.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6 10.293l7.146-7.147a.5.5 0 0 1 .708.708z'/%3e%3c/svg%3e")`,
    },

    // No data styles
    noData: {
      textAlign: 'center' as const,
      padding: spacing['2xl'],
      color: colors.text.secondary,
      fontSize: typography.fontSize.lg,
      lineHeight: typography.lineHeight.relaxed,
    },

    // Icon styles
    icon: {
      marginLeft: spacing.sm,
      marginRight: `-${spacing.xs}`,
      height: spacing.lg,
      width: spacing.lg,
    },

  }), []);
};
