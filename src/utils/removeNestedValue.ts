export const removeNestedValue = (obj: any, path: string): any => {
  if (!obj || !path) return obj;

  const keys = path.split(".");
  const lastKey = keys.pop()!;
  
  // If no nested keys, simple deletion
  if (keys.length === 0) {
    const result = { ...obj };
    delete result[lastKey];
    return result;
  }

  // Deep clone and remove nested value
  const result = { ...obj };
  let current = result;
  const parents: any[] = [result];

  // Traverse to the parent of the target key
  for (const key of keys) {
    if (
      current[key] === undefined ||
      current[key] === null ||
      typeof current[key] !== "object"
    ) {
      // Path doesn't exist, nothing to remove
      return obj;
    }
    current[key] = { ...current[key] };
    current = current[key];
    parents.push(current);
  }

  // Remove the value at the final level
  delete current[lastKey];

  // Clean up empty parent objects
  for (let i = parents.length - 1; i >= 1; i--) {
    const parent = parents[i];
    if (Object.keys(parent).length === 0) {
      const grandParent = parents[i - 1];
      const keyToDelete = keys[i - 1];
      delete grandParent[keyToDelete];
    } else {
      break;
    }
  }

  return result;
};