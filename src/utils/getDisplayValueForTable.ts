import { getNestedValue } from "./getNestedValue";

/**
 * Gets display value for a translation key in a specific language
 * @param fullKey The full translation key path
 * @param lang Language code
 * @param originalValue Original translation value
 * @param pendingChanges Pending changes object
 * @returns The display value (pending change or original)
 */
export const getDisplayValueForTable = (
  fullKey: string, 
  lang: string, 
  originalValue: string,
  pendingChanges: Record<string, any>
): string => {
  const pendingValue = getNestedValue(pendingChanges?.[lang], fullKey);
  return pendingValue !== undefined ? pendingValue : originalValue;
};