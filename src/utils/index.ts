// Core utilities
export { getNestedValue } from "./getNestedValue";
export { setNestedValue } from "./setNestedValue";
export { removeNestedValue } from "./removeNestedValue";
export { cleanRedundantChanges } from "./cleanRedundantChanges";
export { fetchJSON } from "./fetchJSON";
export { loadLocaleFiles } from "./loadLocales";
export { flattenLocales } from "./flattenLocales";

// Table utilities
export { createLocaleColumns } from "./createLocaleColumns";
export { transformToTableData } from "./transformToTableData";
export { getDisplayValueForTable } from "./getDisplayValueForTable";
export { filterTableData } from "./filterTableData";

// Legacy helpers (if needed for backward compatibility)
export { flattenObject, setNestedValue as setNestedValueLegacy, transformLocalizationDataToTableProps } from "./tableHelpers";
