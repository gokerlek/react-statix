// src/context/StatixProvider.tsx

import React, { useEffect, useMemo, useState } from "react";

import StatixDrawer from "../components/StatixDrawer";
import { StatixContext } from "./StatixContext";
import { StatixConfig } from "../types";
import { loadLocaleFiles } from "../utils/loadLocales";
import { setNestedValue } from "../utils/setNestedValue";
import { removeNestedValue } from "../utils/removeNestedValue";
import { cleanRedundantChanges } from "../utils/cleanRedundantChanges";
import { LocalStorageKeys } from "../constants/localStorage";
import {getNestedValue} from "../utils/getNestedValue";
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

  // Dil dosyalarını yükle
  useEffect(() => {
    const init = async () => {
      const loadedLocales = await loadLocaleFiles(config);
      setLocales(loadedLocales);
    };

    init();
  }, []);

  // LocalStorage'dan bekleyen değişiklikleri yükle ve filtrele
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

  // LocalStorage'a yaz
  useEffect(() => {
    if (Object.keys(pendingChanges).length > 0) {
      localStorage.setItem(LocalStorageKeys.LOCALE_EDITS, JSON.stringify(pendingChanges));
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

  const resetChanges = () => {
    setPendingChanges({});
    localStorage.removeItem(LocalStorageKeys.LOCALE_EDITS);
  };

  const saveChanges = () => {
    if (config.onSave) {
      // Use the custom save handler if provided
      config.onSave(pendingChanges);
    } else {
      // Default behavior
      alert("Değişiklikler hazır!");
      console.log("Payload:", pendingChanges);
    }

    // Optionally clear changes after saving
    if (
      window.confirm(
        "Değişiklikler kaydedildi. Yerel önbelleği temizlemek ister misiniz?",
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
