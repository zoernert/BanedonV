/**
 * Test Setup
 * Global test configuration and utilities
 */

import { beforeAll, afterAll, beforeEach, afterEach } from '@jest/globals';

// Suppress console.log during tests unless needed
const originalConsole = console;
beforeAll(() => {
  console.log = jest.fn();
  console.warn = jest.fn();
  console.error = jest.fn();
});

afterAll(() => {
  console.log = originalConsole.log;
  console.warn = originalConsole.warn;
  console.error = originalConsole.error;
});

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.PORT = '3001';

// Mock external dependencies
jest.mock('../src/utils/logger', () => {
  const mockLogger = {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
    verbose: jest.fn(),
    silly: jest.fn(),
    log: jest.fn()
  };
  
  return {
    __esModule: true,
    default: mockLogger,
    logRequest: jest.fn(),
    logError: jest.fn(),
    logPerformance: jest.fn(),
    logAuth: jest.fn(),
    logApiUsage: jest.fn(),
    logSecurity: jest.fn()
  };
});

// Global test utilities
declare global {
  var testUtils: {
    generateMockUser: () => any;
    generateMockRequest: () => any;
    generateMockResponse: () => any;
    getAuthHeaders: () => { Authorization: string };
    getAdminAuthHeaders: () => { Authorization: string };
  };
}

global.testUtils = {
  generateMockUser: () => ({
    id: 'test_user_1',
    email: 'test@example.com',
    name: 'Test User',
    role: 'user' as const,
    active: true,
    createdAt: new Date().toISOString()
  }),
  
  generateMockRequest: (overrides = {}) => ({
    method: 'GET',
    url: '/test',
    headers: {},
    body: {},
    params: {},
    query: {},
    user: null,
    requestId: 'test_req_123',
    ...overrides
  }),
  
  generateMockResponse: () => {
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      setHeader: jest.fn().mockReturnThis(),
      get: jest.fn(),
      locals: {},
      statusCode: 200
    };
    return res;
  },

  getAuthHeaders: () => ({
    Authorization: 'Bearer mock_user_token'
  }),

  getAdminAuthHeaders: () => ({
    Authorization: 'Bearer mock_admin_token'
  })
};
