import { mockDatabaseConfig, mockConnectionConfig } from '../../src/config/database';

describe('Database Configuration', () => {
  describe('mockDatabaseConfig', () => {
    it('should have correct default configuration', () => {
      expect(mockDatabaseConfig).toEqual({
        type: 'memory',
        persistence: true,
        autoSave: true,
        saveInterval: 30000,
        maxRecords: 10000,
        seedData: true,
        backupEnabled: false
      });
    });

    it('should have memory type by default', () => {
      expect(mockDatabaseConfig.type).toBe('memory');
    });

    it('should have persistence enabled', () => {
      expect(mockDatabaseConfig.persistence).toBe(true);
    });

    it('should have auto-save enabled', () => {
      expect(mockDatabaseConfig.autoSave).toBe(true);
    });

    it('should have reasonable save interval', () => {
      expect(mockDatabaseConfig.saveInterval).toBe(30000);
    });

    it('should have reasonable max records limit', () => {
      expect(mockDatabaseConfig.maxRecords).toBe(10000);
    });

    it('should have seed data enabled', () => {
      expect(mockDatabaseConfig.seedData).toBe(true);
    });

    it('should have backup disabled for mock', () => {
      expect(mockDatabaseConfig.backupEnabled).toBe(false);
    });
  });

  describe('mockConnectionConfig', () => {
    it('should have correct connection configuration', () => {
      expect(mockConnectionConfig).toEqual({
        host: 'localhost',
        port: 0,
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
      });
    });

    it('should have localhost as default host', () => {
      expect(mockConnectionConfig.host).toBe('localhost');
    });

    it('should have port 0 for mock database', () => {
      expect(mockConnectionConfig.port).toBe(0);
    });

    it('should have correct database name', () => {
      expect(mockConnectionConfig.database).toBe('banedonv_mock');
    });

    it('should have reasonable retry configuration', () => {
      expect(mockConnectionConfig.retryAttempts).toBe(3);
      expect(mockConnectionConfig.retryDelay).toBe(1000);
      expect(mockConnectionConfig.timeout).toBe(5000);
    });

    it('should have pool configuration', () => {
      expect(mockConnectionConfig.pool).toBeDefined();
      expect(mockConnectionConfig.pool.min).toBe(1);
      expect(mockConnectionConfig.pool.max).toBe(10);
    });

    it('should have reasonable pool timeouts', () => {
      const { pool } = mockConnectionConfig;
      expect(pool.acquireTimeoutMillis).toBe(30000);
      expect(pool.createTimeoutMillis).toBe(30000);
      expect(pool.destroyTimeoutMillis).toBe(5000);
      expect(pool.reapIntervalMillis).toBe(1000);
      expect(pool.createRetryIntervalMillis).toBe(100);
    });
  });
});
