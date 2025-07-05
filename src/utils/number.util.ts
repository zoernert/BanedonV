/**
 * Number Utility Functions
 */

/**
 * Random integer between min and max
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Random float between min and max
 */
export function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/**
 * Calculate percentage
 */
export function calculatePercentage(value: number, total: number): number {
  return total === 0 ? 0 : Math.round((value / total) * 100);
}
