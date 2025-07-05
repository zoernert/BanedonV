/**
 * Environment Utility Functions
 */

/**
 * Validate environment variables
 */
export function validateEnv(requiredVars: string[]): void {
  const missing = requiredVars.filter(varName => !process.env[varName]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}
