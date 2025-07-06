import winston from 'winston';

// Mock the logger module first before imports
jest.mock('../../src/utils/logger', () => {
  const mockLogger = {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    verbose: jest.fn(),
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

import logger, { 
  logRequest, 
  logError, 
  logPerformance, 
  logAuth, 
  logApiUsage, 
  logSecurity 
} from '../../src/utils/logger';

// Mock winston to avoid actual logging during tests
jest.mock('winston', () => {
  const mockLogger = {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    verbose: jest.fn(),
  };

  return {
    createLogger: jest.fn(() => mockLogger),
    addColors: jest.fn(),
    format: {
      combine: jest.fn(() => 'combined-format'),
      timestamp: jest.fn(() => 'timestamp-format'),
      errors: jest.fn(() => 'errors-format'),
      metadata: jest.fn(() => 'metadata-format'),
      json: jest.fn(() => 'json-format'),
      colorize: jest.fn(() => 'colorize-format'),
      printf: jest.fn(() => 'printf-format'),
    },
    transports: {
      Console: jest.fn(),
      File: jest.fn(),
    },
  };
});

// Mock fs operations
jest.mock('fs', () => ({
  existsSync: jest.fn(() => true),
  mkdirSync: jest.fn(),
}));

describe('Logger Module', () => {
  let mockLogger: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      verbose: jest.fn(),
    };
    (winston.createLogger as jest.Mock).mockReturnValue(mockLogger);
  });

  describe('logger instance', () => {
    it('should create a winston logger instance', () => {
      expect(winston.createLogger).toHaveBeenCalled();
    });

    it('should add colors to winston', () => {
      expect(winston.addColors).toHaveBeenCalled();
    });
  });

  describe('logRequest', () => {
    it('should log successful HTTP requests', () => {
      const mockReq = {
        method: 'GET',
        originalUrl: '/api/test',
        get: jest.fn((header) => header === 'User-Agent' ? 'test-agent' : undefined),
        ip: '127.0.0.1',
        user: { id: 'user123' },
        requestId: 'req-123'
      };
      const mockRes = {
        statusCode: 200,
        get: jest.fn(() => '1024')
      };

      logRequest(mockReq, mockRes, 150);

      expect(mockLogger.info).toHaveBeenCalledWith('HTTP Request', expect.objectContaining({
        method: 'GET',
        url: '/api/test',
        statusCode: 200,
        responseTime: 150,
        userAgent: 'test-agent',
        ip: '127.0.0.1',
        userId: 'user123',
        requestId: 'req-123',
        contentLength: '1024'
      }));
    });

    it('should log error HTTP requests', () => {
      const mockReq = {
        method: 'POST',
        originalUrl: '/api/error',
        get: jest.fn(() => 'test-agent'),
        ip: '127.0.0.1'
      };
      const mockRes = {
        statusCode: 500,
        get: jest.fn(() => '512')
      };

      logRequest(mockReq, mockRes, 300);

      expect(mockLogger.error).toHaveBeenCalledWith('HTTP Request Error', expect.objectContaining({
        method: 'POST',
        url: '/api/error',
        statusCode: 500,
        responseTime: 300
      }));
    });
  });

  describe('logError', () => {
    it('should log application errors', () => {
      const error = new Error('Test error');
      const context = { module: 'test' };

      logError(error, context);

      expect(mockLogger.error).toHaveBeenCalledWith('Application Error', expect.objectContaining({
        error: {
          name: 'Error',
          message: 'Test error',
          stack: expect.any(String)
        },
        context
      }));
    });

    it('should log errors without context', () => {
      const error = new Error('Another test error');

      logError(error);

      expect(mockLogger.error).toHaveBeenCalledWith('Application Error', expect.objectContaining({
        error: {
          name: 'Error',
          message: 'Another test error',
          stack: expect.any(String)
        },
        context: undefined
      }));
    });
  });

  describe('logPerformance', () => {
    it('should log performance warnings for slow operations', () => {
      // Mock the loggingConfig module to simulate enabled performance logging
      jest.doMock('../../src/config/logging', () => ({
        loggingConfig: {
          performanceLogging: {
            enabled: true,
            threshold: 1000
          }
        }
      }));

      const operation = 'database-query';
      const duration = 1500;
      const context = { query: 'SELECT * FROM users' };

      logPerformance(operation, duration, context);

      expect(mockLogger.warn).toHaveBeenCalledWith('Performance Warning', expect.objectContaining({
        operation,
        duration,
        context
      }));
    });
  });

  describe('logAuth', () => {
    it('should log successful authentication events', () => {
      const action = 'login';
      const userId = 'user123';
      const context = { ip: '127.0.0.1' };

      logAuth(action, userId, true, context);

      expect(mockLogger.info).toHaveBeenCalledWith('Authentication Event', expect.objectContaining({
        action,
        userId,
        success: true,
        context
      }));
    });

    it('should log failed authentication events', () => {
      const action = 'login';
      const userId = 'user123';

      logAuth(action, userId, false);

      expect(mockLogger.warn).toHaveBeenCalledWith('Authentication Failure', expect.objectContaining({
        action,
        userId,
        success: false
      }));
    });

    it('should default to success true', () => {
      const action = 'logout';

      logAuth(action);

      expect(mockLogger.info).toHaveBeenCalledWith('Authentication Event', expect.objectContaining({
        action,
        success: true
      }));
    });
  });

  describe('logApiUsage', () => {
    it('should log API usage', () => {
      const endpoint = '/api/users';
      const method = 'GET';
      const userId = 'user123';
      const responseTime = 200;

      logApiUsage(endpoint, method, userId, responseTime);

      expect(mockLogger.info).toHaveBeenCalledWith('API Usage', expect.objectContaining({
        endpoint,
        method,
        userId,
        responseTime
      }));
    });

    it('should log API usage without optional parameters', () => {
      const endpoint = '/api/public';
      const method = 'POST';

      logApiUsage(endpoint, method);

      expect(mockLogger.info).toHaveBeenCalledWith('API Usage', expect.objectContaining({
        endpoint,
        method,
        userId: undefined,
        responseTime: undefined
      }));
    });
  });

  describe('logSecurity', () => {
    it('should log security events', () => {
      const event = 'suspicious-activity';
      const severity = 'high' as const;
      const context = { attempts: 5, ip: '192.168.1.1' };

      logSecurity(event, severity, context);

      expect(mockLogger.warn).toHaveBeenCalledWith('Security Event', expect.objectContaining({
        event,
        severity,
        context
      }));
    });

    it('should log security events with different severity levels', () => {
      const event = 'rate-limit-exceeded';
      const severity = 'medium' as const;

      logSecurity(event, severity);

      expect(mockLogger.warn).toHaveBeenCalledWith('Security Event', expect.objectContaining({
        event,
        severity,
        context: undefined
      }));
    });
  });
});
