export const getNestedValue = (
  obj: any,
  path: string,
  defaultValue: any = undefined,
): any => {
  if (!obj || !path) return defaultValue;

  const keys = path.split(".");
  let current = obj;

  for (const key of keys) {
    if (
      current === null ||
      current === undefined ||
      typeof current !== "object"
    ) {
      return defaultValue;
    }
    current = current[key];
  }

  return current !== undefined ? current : defaultValue;
};
