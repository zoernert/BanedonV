/**
 * Mock Database Configuration
 * This file configures the mock database settings for development
 * CRITICAL: This is a MOCK configuration - no real database connections
 */

export interface MockDatabaseConfig {
  type: 'memory' | 'file';
  persistence: boolean;
  autoSave: boolean;
  saveInterval: number;
  maxRecords: number;
  seedData: boolean;
  backupEnabled: boolean;
}

export const mockDatabaseConfig: MockDatabaseConfig = {
  type: 'memory',
  persistence: true,
  autoSave: true,
  saveInterval: 30000, // 30 seconds
  maxRecords: 10000,
  seedData: true,
  backupEnabled: false
};

export const mockConnectionConfig = {
  host: 'localhost',
  port: 0, // No real port for mock
  database: 'banedonv_mock',
  retryAttempts: 3,
  retryDelay: 1000,
  timeout: 5000,
  pool: {
    min: 1,
    max: 10,
    acquireTimeoutMillis: 30000,
    createTimeoutMillis: 30000,
    destroyTimeoutMillis: 5000,
    reapIntervalMillis: 1000,
    createRetryIntervalMillis: 100
  }
};

export default mockDatabaseConfig;
