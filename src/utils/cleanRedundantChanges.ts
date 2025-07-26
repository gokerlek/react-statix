import { getNestedValue } from "./getNestedValue";

// Recursive function to clean nested objects
const cleanObjectRecursively = (
  changesObj: any,
  localeObj: any,
  currentPath: string = ""
): any => {
  if (!changesObj || typeof changesObj !== 'object') {
    return changesObj;
  }

  const cleaned: any = {};
  let hasChanges = false;

  for (const key in changesObj) {
    if (changesObj.hasOwnProperty(key)) {
      const value = changesObj[key];
      const fullPath = currentPath ? `${currentPath}.${key}` : key;
      
      if (typeof value === 'object' && value !== null) {
        // If it's a nested object, recurse
        const nestedCleaned = cleanObjectRecursively(
          value,
          localeObj,
          fullPath
        );
        
        if (nestedCleaned && Object.keys(nestedCleaned).length > 0) {
          cleaned[key] = nestedCleaned;
          hasChanges = true;
        }
      } else {
        // It's a primitive value, compare with original
        const originalValue = getNestedValue(localeObj, fullPath);

        if (originalValue !== value) {
          cleaned[key] = value;
          hasChanges = true;
        }
      }
    }
  }
  
  return hasChanges ? cleaned : {};
};

// Clean pending changes that match original locale values
export const cleanRedundantChanges = (
  pendingChanges: Record<string, any>,
  locales: Record<string, any>
): Record<string, any> => {
  const cleaned: Record<string, any> = {};

  for (const lang in pendingChanges) {
    if (pendingChanges.hasOwnProperty(lang)) {
      const changes = pendingChanges[lang];
      const localeData = locales[lang] || {};
      
      const cleanedLangChanges = cleanObjectRecursively(changes, localeData);
      
      // Only include language if it has actual changes
      if (cleanedLangChanges && Object.keys(cleanedLangChanges).length > 0) {
        cleaned[lang] = cleanedLangChanges;
      }
    }
  }
  
  return cleaned;
};
