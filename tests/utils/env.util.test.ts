import { validateEnv } from '../../src/utils/env.util';

describe('Environment Utilities', () => {
  describe('validateEnv', () => {
    const originalEnv = process.env;

    beforeEach(() => {
      process.env = { ...originalEnv };
    });

    afterEach(() => {
      process.env = originalEnv;
    });

    it('should not throw when all required variables are present', () => {
      process.env.TEST_VAR1 = 'value1';
      process.env.TEST_VAR2 = 'value2';
      
      expect(() => validateEnv(['TEST_VAR1', 'TEST_VAR2'])).not.toThrow();
    });

    it('should throw when required variables are missing', () => {
      delete process.env.TEST_VAR1;
      delete process.env.TEST_VAR2;
      
      expect(() => validateEnv(['TEST_VAR1', 'TEST_VAR2']))
        .toThrow('Missing required environment variables: TEST_VAR1, TEST_VAR2');
    });

    it('should throw when some required variables are missing', () => {
      process.env.TEST_VAR1 = 'value1';
      delete process.env.TEST_VAR2;
      
      expect(() => validateEnv(['TEST_VAR1', 'TEST_VAR2']))
        .toThrow('Missing required environment variables: TEST_VAR2');
    });

    it('should not throw when no variables are required', () => {
      expect(() => validateEnv([])).not.toThrow();
    });

    it('should handle undefined environment variables', () => {
      process.env.TEST_VAR = undefined;
      
      expect(() => validateEnv(['TEST_VAR']))
        .toThrow('Missing required environment variables: TEST_VAR');
    });

    it('should handle empty string environment variables', () => {
      process.env.TEST_VAR = '';
      
      expect(() => validateEnv(['TEST_VAR']))
        .toThrow('Missing required environment variables: TEST_VAR');
    });
  });
});
