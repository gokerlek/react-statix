export const setNestedValue = (obj: any, path: string, value: any): any => {
  if (!obj || !path) return obj;

  const keys = path.split(".");
  const lastKey = keys.pop()!;
  let current = obj;

  // Create or traverse the nested structure
  for (const key of keys) {
    if (
      current[key] === undefined ||
      current[key] === null ||
      typeof current[key] !== "object"
    ) {
      current[key] = {};
    }
    current = current[key];
  }

  // Set the value at the final level
  current[lastKey] = value;

  return obj;
};
