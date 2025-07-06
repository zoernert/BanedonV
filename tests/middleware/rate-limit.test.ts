import { Request, Response, NextFunction } from 'express';
import { RateLimitMiddleware } from '../../src/middleware/rate-limit';

// Mock logger
jest.mock('../../src/utils/logger', () => ({
  __esModule: true,
  default: {
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn()
  },
  logError: jest.fn()
}));

// Mock ResponseUtil
jest.mock('../../src/utils/response', () => ({
  __esModule: true,
  default: {
    error: jest.fn(),
    tooManyRequests: jest.fn(),
    rateLimitExceeded: jest.fn()
  }
}));

describe('Rate Limit Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    mockRequest = {
      ip: '127.0.0.1',
      originalUrl: '/test',
      method: 'GET',
      headers: {},
      get: jest.fn().mockReturnValue('test-user-agent')
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis()
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe('RateLimitMiddleware', () => {
    it('should have standardRateLimit method', () => {
      expect(RateLimitMiddleware.standardRateLimit).toBeDefined();
      expect(typeof RateLimitMiddleware.standardRateLimit).toBe('function');
    });

    it('should have authRateLimit method', () => {
      expect(RateLimitMiddleware.authRateLimit).toBeDefined();
      expect(typeof RateLimitMiddleware.authRateLimit).toBe('function');
    });

    it('should create standard rate limit middleware', () => {
      const middleware = RateLimitMiddleware.standardRateLimit();
      expect(middleware).toBeDefined();
      expect(typeof middleware).toBe('function');
    });

    it('should create auth rate limit middleware', () => {
      const middleware = RateLimitMiddleware.authRateLimit();
      expect(middleware).toBeDefined();
      expect(typeof middleware).toBe('function');
    });

    it('should create API rate limit middleware', () => {
      const middleware = RateLimitMiddleware.apiRateLimit();
      expect(middleware).toBeDefined();
      expect(typeof middleware).toBe('function');
    });

    it('should create upload rate limit middleware', () => {
      const middleware = RateLimitMiddleware.uploadRateLimit();
      expect(middleware).toBeDefined();
      expect(typeof middleware).toBe('function');
    });

    it('should create search rate limit middleware', () => {
      const middleware = RateLimitMiddleware.searchRateLimit();
      expect(middleware).toBeDefined();
      expect(typeof middleware).toBe('function');
    });

    it('should create custom rate limit middleware', () => {
      const customConfig = {
        windowMs: 30000,
        max: 5,
        message: 'Custom rate limit message'
      };
      
      const middleware = RateLimitMiddleware.customRateLimit(customConfig);
      expect(middleware).toBeDefined();
      expect(typeof middleware).toBe('function');
    });

    it('should create development rate limit middleware', () => {
      const middleware = RateLimitMiddleware.developmentRateLimit();
      expect(middleware).toBeDefined();
      expect(typeof middleware).toBe('function');
    });

    it('should create user rate limit middleware', () => {
      const middleware = RateLimitMiddleware.userRateLimit();
      expect(middleware).toBeDefined();
      expect(typeof middleware).toBe('function');
    });

    it('should get rate limit configuration', () => {
      const config = RateLimitMiddleware.getRateLimitConfig();
      expect(config).toBeDefined();
      expect(config.standard).toBeDefined();
      expect(config.auth).toBeDefined();
      expect(config.api).toBeDefined();
      expect(config.upload).toBeDefined();
      expect(config.search).toBeDefined();
      expect(config.user).toBeDefined();
    });

    it('should handle development environment', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      
      const config = RateLimitMiddleware.getRateLimitConfig();
      expect(config).toBeDefined();
      
      process.env.NODE_ENV = originalEnv;
    });
  });
});
