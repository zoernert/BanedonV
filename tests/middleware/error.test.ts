import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'joi';
import { ErrorMiddleware, AppError } from '../../src/middleware/error';
import ResponseUtil from '../../src/utils/response';

// Mock ResponseUtil
jest.mock('../../src/utils/response', () => ({
  error: jest.fn(),
  internalServerError: jest.fn(),
  validationError: jest.fn(),
  unauthorized: jest.fn(),
  notFound: jest.fn()
}));

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

describe('ErrorMiddleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    mockRequest = {
      originalUrl: '/test',
      method: 'GET',
      ip: '127.0.0.1',
      requestId: 'test-request-id',
      get: jest.fn().mockReturnValue('test-user-agent'),
      user: { 
        id: 'user_1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe('createError', () => {
    it('should create an error with default values', () => {
      const error = ErrorMiddleware.createError('Test error');

      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(500);
      expect(error.isOperational).toBe(true);
      expect(error.code).toBeUndefined();
      expect(error.details).toBeUndefined();
    });

    it('should create an error with custom values', () => {
      const details = { field: 'test' };
      const error = ErrorMiddleware.createError('Test error', 400, 'CUSTOM_ERROR', details);

      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(400);
      expect(error.isOperational).toBe(true);
      expect(error.code).toBe('CUSTOM_ERROR');
      expect(error.details).toBe(details);
    });
  });

  describe('asyncHandler', () => {
    it('should catch and pass errors to next', async () => {
      const error = new Error('Async error');
      const asyncFn = jest.fn().mockRejectedValue(error);
      const wrappedFn = ErrorMiddleware.asyncHandler(asyncFn);

      await wrappedFn(mockRequest as Request, mockResponse as Response, mockNext);

      expect(asyncFn).toHaveBeenCalledWith(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledWith(error);
    });

    it('should not call next if no error', async () => {
      const asyncFn = jest.fn().mockResolvedValue(undefined);
      const wrappedFn = ErrorMiddleware.asyncHandler(asyncFn);

      await wrappedFn(mockRequest as Request, mockResponse as Response, mockNext);

      expect(asyncFn).toHaveBeenCalledWith(mockRequest, mockResponse, mockNext);
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('notFoundHandler', () => {
    it('should create 404 error and call next', () => {
      ErrorMiddleware.notFoundHandler(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Resource not found: /test',
          statusCode: 404,
          code: 'NOT_FOUND'
        })
      );
    });
  });

  describe('globalErrorHandler', () => {
    it('should handle basic errors', () => {
      const error: AppError = new Error('Test error');
      
      ErrorMiddleware.globalErrorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

      expect(error.statusCode).toBe(500);
      expect(error.code).toBe('INTERNAL_SERVER_ERROR');
    });

    it('should handle validation errors', () => {
      const validationError = new ValidationError('Validation failed', [
        {
          message: 'Field is required',
          path: ['field'],
          type: 'any.required',
          context: { value: undefined }
        }
      ], 'value');

      ErrorMiddleware.globalErrorHandler(validationError, mockRequest as Request, mockResponse as Response, mockNext);

      expect(ResponseUtil.validationError).toHaveBeenCalledWith(
        mockResponse,
        expect.arrayContaining([
          expect.objectContaining({
            field: 'field',
            message: 'Field is required'
          })
        ]),
        'Validation failed'
      );
    });

    it('should handle JWT errors', () => {
      const jwtError = new Error('Invalid token');
      jwtError.name = 'JsonWebTokenError';

      ErrorMiddleware.globalErrorHandler(jwtError, mockRequest as Request, mockResponse as Response, mockNext);

      expect(ResponseUtil.unauthorized).toHaveBeenCalledWith(mockResponse, 'Invalid authentication token');
    });

    it('should handle JWT expired errors', () => {
      const jwtExpiredError = new Error('Token expired');
      jwtExpiredError.name = 'TokenExpiredError';

      ErrorMiddleware.globalErrorHandler(jwtExpiredError, mockRequest as Request, mockResponse as Response, mockNext);

      expect(ResponseUtil.unauthorized).toHaveBeenCalledWith(mockResponse, 'Authentication token expired');
    });

    it('should handle operational errors', () => {
      const operationalError: AppError = new Error('Operational error');
      operationalError.statusCode = 400;
      operationalError.code = 'BAD_REQUEST';
      operationalError.isOperational = true;

      ErrorMiddleware.globalErrorHandler(operationalError, mockRequest as Request, mockResponse as Response, mockNext);

      expect(ResponseUtil.error).toHaveBeenCalledWith(
        mockResponse,
        'BAD_REQUEST',
        'Operational error',
        400,
        undefined
      );
    });

    it('should handle file not found errors', () => {
      const fileError: AppError = new Error('File not found');
      fileError.code = 'ENOENT';

      ErrorMiddleware.globalErrorHandler(fileError, mockRequest as Request, mockResponse as Response, mockNext);

      expect(ResponseUtil.notFound).toHaveBeenCalledWith(mockResponse, 'File not found');
    });

    it('should handle Multer file size errors', () => {
      const multerError: AppError = new Error('File too large');
      multerError.name = 'MulterError';
      multerError.code = 'LIMIT_FILE_SIZE';

      ErrorMiddleware.globalErrorHandler(multerError, mockRequest as Request, mockResponse as Response, mockNext);

      expect(ResponseUtil.error).toHaveBeenCalledWith(
        mockResponse,
        'FILE_TOO_LARGE',
        'File too large',
        413
      );
    });

    it('should handle Multer file count errors', () => {
      const multerError: AppError = new Error('Too many files');
      multerError.name = 'MulterError';
      multerError.code = 'LIMIT_FILE_COUNT';

      ErrorMiddleware.globalErrorHandler(multerError, mockRequest as Request, mockResponse as Response, mockNext);

      expect(ResponseUtil.error).toHaveBeenCalledWith(
        mockResponse,
        'TOO_MANY_FILES',
        'Too many files',
        413
      );
    });

    it('should handle unknown Multer errors', () => {
      const multerError: AppError = new Error('Unknown multer error');
      multerError.name = 'MulterError';
      multerError.code = 'UNKNOWN';

      ErrorMiddleware.globalErrorHandler(multerError, mockRequest as Request, mockResponse as Response, mockNext);

      expect(ResponseUtil.error).toHaveBeenCalledWith(
        mockResponse,
        'UPLOAD_ERROR',
        'File upload error',
        400
      );
    });
  });

  describe('setupGlobalHandlers', () => {
    it('should setup global error handlers', () => {
      const processOnSpy = jest.spyOn(process, 'on');
      
      ErrorMiddleware.setupGlobalHandlers();

      expect(processOnSpy).toHaveBeenCalledWith('uncaughtException', ErrorMiddleware.handleUncaughtException);
      expect(processOnSpy).toHaveBeenCalledWith('unhandledRejection', ErrorMiddleware.handleUnhandledRejection);
      
      processOnSpy.mockRestore();
    });
  });
});
