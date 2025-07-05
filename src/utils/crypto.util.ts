/**
 * Crypto Utility Functions
 */
import crypto from 'crypto';

/**
 * Generate hash
 */
export function generateHash(input: string, algorithm: string = 'sha256'): string {
  return crypto.createHash(algorithm).update(input).digest('hex');
}
