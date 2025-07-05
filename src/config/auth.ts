/**
 * Authentication Configuration
 * Mock authentication settings for JWT simulation
 * CRITICAL: This is a MOCK authentication system - no real security
 */

export interface AuthConfig {
  jwtSecret: string;
  jwtExpiresIn: string;
  refreshTokenExpiresIn: string;
  bcryptSaltRounds: number;
  sessionTimeout: number;
  maxLoginAttempts: number;
  lockoutDuration: number;
  passwordResetExpires: number;
}

export const authConfig: AuthConfig = {
  jwtSecret: 'mock-jwt-secret-key-for-development-only',
  jwtExpiresIn: '1h',
  refreshTokenExpiresIn: '7d',
  bcryptSaltRounds: 12,
  sessionTimeout: 3600000, // 1 hour in milliseconds
  maxLoginAttempts: 5,
  lockoutDuration: 900000, // 15 minutes in milliseconds
  passwordResetExpires: 3600000 // 1 hour in milliseconds
};

export const mockUsers = [
  {
    id: 'user_1',
    email: 'admin@banedonv.com',
    password: 'admin123', // Will be hashed
    role: 'admin',
    name: 'BanedonV Admin',
    active: true,
    lastLogin: null,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'user_2',
    email: 'user@banedonv.com',
    password: 'user123', // Will be hashed
    role: 'user',
    name: 'Demo User',
    active: true,
    lastLogin: null,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'user_3',
    email: 'manager@banedonv.com',
    password: 'manager123', // Will be hashed
    role: 'manager',
    name: 'Team Manager',
    active: true,
    lastLogin: null,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

export const roles = {
  admin: {
    name: 'Administrator',
    permissions: ['*'], // All permissions
    description: 'Full system access'
  },
  manager: {
    name: 'Manager',
    permissions: [
      'users:read',
      'users:create',
      'users:update',
      'collections:*',
      'files:*',
      'search:*',
      'billing:read',
      'integrations:*'
    ],
    description: 'Team management and content access'
  },
  user: {
    name: 'User',
    permissions: [
      'collections:read',
      'collections:create',
      'collections:update',
      'files:read',
      'files:create',
      'files:update',
      'search:read',
      'billing:read'
    ],
    description: 'Standard user access'
  }
};

export default authConfig;
