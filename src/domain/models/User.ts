import { AuthUser } from './AuthUser';

/**
 * Represents a full user object, including sensitive data for internal use.
 */
export interface User extends AuthUser {
  password?: string;
}
