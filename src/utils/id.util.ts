/**
 * ID Utility Functions
 */

import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

/**
 * Generate unique ID
 */
export function generateId(prefix?: string): string {
  const id = uuidv4();
  return prefix ? `${prefix}_${id}` : id;
}

/**
 * Generate short ID
 */
export function generateShortId(length: number = 8): string {
  return crypto.randomBytes(length).toString('hex').slice(0, length);
}

/**
 * Generate request ID
 */
export function generateRequestId(): string {
  return `req_${Date.now()}_${generateShortId(6)}`;
}

/**
 * Validate UUID format
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}
