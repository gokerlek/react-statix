// src/context/StatixContext.tsx

import { createContext } from "react";

export interface StatixContextType {
  editable: boolean;
  setEditable: (value: boolean) => void;
  locales: Record<string, any>;
  updateLocalValue: (lang: string, key: string, value: string) => void;
  pendingChanges: Record<string, Record<string, string>>;
  resetChanges: () => void;
  saveChanges: () => void;
}

export const StatixContext = createContext<StatixContextType | undefined>(
  undefined,
);
