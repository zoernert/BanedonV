/**
 * Represents a user object safe for client exposure.
 */
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'user';
  active: boolean;
  lastLogin?: string | null;
  createdAt: string;
  updatedAt?: string;
}
