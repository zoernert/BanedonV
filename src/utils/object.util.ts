/**
 * Object Utility Functions
 */

/**
 * Deep clone object
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Check if object is empty
 */
export function isEmpty(obj: any): boolean {
  if (obj === null || obj === undefined) return true;
  if (typeof obj === 'string' || Array.isArray(obj)) return obj.length === 0;
  if (typeof obj === 'object') return Object.keys(obj).length === 0;
  return false;
}

/**
 * Parse JSON safely
 */
export function parseJSON(json: string, defaultValue: any = null): any {
  try {
    return JSON.parse(json);
  } catch {
    return defaultValue;
  }
}
