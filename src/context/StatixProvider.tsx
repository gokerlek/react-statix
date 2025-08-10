// src/context/StatixProvider.tsx

import React, { useEffect, useMemo, useState, useRef } from "react";

import StatixDrawer from "../components/StatixDrawer";
import { StatixContext } from "./StatixContext";
import { StatixConfig } from "../types";
import { loadLocaleFiles, setNestedValue, removeNestedValue, cleanRedundantChanges,getNestedValue} from "../utils";
import { LocalStorageKeys } from "../constants/localStorage";
import {LocaleTable} from "../components/LocaleTable";

const defaultConfig: StatixConfig = {
  localePath: "public/locales",
  languagesKeys: {},
  editable: false,
};

interface StatixProviderProps {
  config?: StatixConfig;
  children: React.ReactNode;
}

export const StatixProvider: React.FC<StatixProviderProps> = ({
  config = defaultConfig,
  children,
}) => {
  const [locales, setLocales] = useState<Record<string, any>>({});
  const usedLocales = useRef<Set<string>>(new Set());
  
  // Cache localStorage value to avoid multiple reads
  const savedLocaleEdits = useMemo(() => {
    return localStorage.getItem(LocalStorageKeys.LOCALE_EDITS);
  }, []);

  const [pendingChanges, setPendingChanges] = useState<
    Record<string, Record<string, string>>
  >(() => {
    if (savedLocaleEdits) {
      try {
        return JSON.parse(savedLocaleEdits);
      } catch (error) {
        console.warn(
          "Invalid localStorage data for localeEdits, using empty object",
        );
        return {};
      }
    }
    return {};
  });

  // Load language files
  useEffect(() => {
    const init = async () => {
      const loadedLocales = await loadLocaleFiles(config);
      setLocales(loadedLocales);
    };

    init();
  }, []);

  // Load and filter pending changes from LocalStorage
  useEffect(() => {
    if (savedLocaleEdits && locales && Object.keys(locales).length > 0) {
      try {
        const parsedChanges = JSON.parse(savedLocaleEdits);

        // Clean redundant changes that match original locale values
        const cleanedChanges = cleanRedundantChanges(parsedChanges, locales);

        // Always set cleaned changes, even if they're the same
        setPendingChanges(cleanedChanges);
        
        // Force localStorage update if changes were cleaned
        const originalCount = JSON.stringify(parsedChanges).length;
        const cleanedCount = JSON.stringify(cleanedChanges).length;
        if (originalCount !== cleanedCount) {
          console.log('Forcing localStorage update due to cleanup');
          localStorage.setItem(LocalStorageKeys.LOCALE_EDITS, JSON.stringify(cleanedChanges));
        }
      } catch (error) {
        console.warn("Invalid localStorage data for localeEdits, skipping");
      }
    }
  }, [locales]);

  // Write to LocalStorage
  useEffect(() => {
    if (Object.keys(pendingChanges).length > 0) {
      localStorage.setItem(LocalStorageKeys.LOCALE_EDITS, JSON.stringify(pendingChanges));
    } else {
      // If no pending changes, remove from localStorage
      localStorage.removeItem(LocalStorageKeys.LOCALE_EDITS);
    }
  }, [pendingChanges]);

  const updateLocalValue = (lang: string, key: string, value: string) => {
    setPendingChanges((prev) => {
      const updated = { ...prev };
      updated[lang] = updated[lang] || {};

      // Use prev (current state) instead of pendingChanges for comparison
      const originalValue = getNestedValue(locales[lang] || {}, key);
      const isSame = value === originalValue;

      if (isSame) {
        // If value is same as original, remove from pending changes
        return removeNestedValue(updated, `${lang}.${key}`);
      } else {
        // Use setNestedValue to handle nested paths
        updated[lang] = setNestedValue(updated[lang], key, value);
        return updated;
      }
    });
  };

  const addUsedLocale = (key: string) => {
    usedLocales.current.add(key);
  };

  const resetChanges = () => {
    setPendingChanges({});
    localStorage.removeItem(LocalStorageKeys.LOCALE_EDITS);
  };

  const saveChanges = () => {
    // Log the payload
    console.log("Payload:", pendingChanges);
    
    if (config.onSave) {
      // Use the custom save handler if provided
      config.onSave(pendingChanges);
    } else {
      // Default behavior
      alert("Changes are ready!");
    }

    // Optionally clear changes after saving
    if (
      window.confirm(
        "Changes saved. Do you want to clear the local cache?",
      )
    ) {
      resetChanges();
    }
  };

  const contextValue = useMemo(
    () => ({
      editable: config.editable ?? false,
      locales,
      updateLocalValue,
      pendingChanges,
      resetChanges,
      saveChanges,
      usedLocales: usedLocales.current,
      addUsedLocale,
    }),
    [config.editable, locales, pendingChanges],
  );

  return (
    <StatixContext.Provider value={contextValue}>
      {children}
      <StatixDrawer>
          <LocaleTable localeData={locales}/>
      </StatixDrawer>
    </StatixContext.Provider>
  );
};
