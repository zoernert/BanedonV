/**
 * Error Handling Middleware
 * Comprehensive error handling and formatting
 */

import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'joi';
import ResponseUtil from '../utils/response';
import logger, { logError } from '../utils/logger';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
  isOperational?: boolean;
  details?: any;
}

export class ErrorMiddleware {
  /**
   * Create application error
   */
  static createError(
    message: string,
    statusCode: number = 500,
    code?: string,
    details?: any
  ): AppError {
    const error: AppError = new Error(message);
    error.statusCode = statusCode;
    error.isOperational = true;
    error.details = details;
    
    if (code) {
      error.code = code;
    }
    
    return error;
  }

  /**
   * Async error handler wrapper
   */
  static asyncHandler(fn: Function) {
    return (req: Request, res: Response, next: NextFunction) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  }

  /**
   * Not found handler
   */
  static notFoundHandler(req: Request, res: Response, next: NextFunction): void {
    const error = ErrorMiddleware.createError(
      `Resource not found: ${req.originalUrl}`,
      404,
      'NOT_FOUND'
    );
    
    logError(error, {
      requestId: req.requestId,
      method: req.method,
      url: req.originalUrl,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
      userId: req.user?.id
    });
    
    next(error);
  }

  /**
   * Global error handler
   */
  static globalErrorHandler(
    err: AppError,
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    // Set default values
    err.statusCode = err.statusCode || 500;
    err.code = err.code || 'INTERNAL_SERVER_ERROR';

    // Log error
    logError(err, {
      requestId: req.requestId,
      method: req.method,
      url: req.originalUrl,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
      userId: req.user?.id
    });

    // Handle specific error types
    if (err instanceof ValidationError) {
      return ErrorMiddleware.handleValidationError(err, req, res);
    }

    if (err.name === 'JsonWebTokenError') {
      return ErrorMiddleware.handleJWTError(err, req, res);
    }

    if (err.name === 'TokenExpiredError') {
      return ErrorMiddleware.handleJWTExpiredError(err, req, res);
    }

    if (err.name === 'MulterError') {
      return ErrorMiddleware.handleMulterError(err, req, res);
    }

    if (err.code === 'ENOENT') {
      return ErrorMiddleware.handleFileNotFoundError(err, req, res);
    }

    // Handle operational errors
    if (err.isOperational) {
      return ResponseUtil.error(
        res,
        err.code || 'OPERATIONAL_ERROR',
        err.message,
        err.statusCode || 500,
        err.details
      );
    }

    // Handle programming errors
    logger.error('Programming error', {
      error: {
        name: err.name,
        message: err.message,
        stack: err.stack
      },
      requestId: req.requestId,
      url: req.originalUrl
    });

    // Don't leak error details in production
    if (process.env.NODE_ENV === 'production') {
      return ResponseUtil.internalServerError(res, 'Something went wrong');
    }

    // Send detailed error in development
    return ResponseUtil.error(
      res,
      'INTERNAL_SERVER_ERROR',
      err.message,
      500,
      {
        stack: err.stack,
        name: err.name
      }
    );
  }

  /**
   * Handle validation errors
   */
  private static handleValidationError(
    err: ValidationError,
    req: Request,
    res: Response
  ): void {
    const errors = err.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message,
      value: detail.context?.value
    }));

    ResponseUtil.validationError(res, errors, 'Validation failed');
  }

  /**
   * Handle JWT errors
   */
  private static handleJWTError(
    err: Error,
    req: Request,
    res: Response
  ): void {
    ResponseUtil.unauthorized(res, 'Invalid authentication token');
  }

  /**
   * Handle JWT expired errors
   */
  private static handleJWTExpiredError(
    err: Error,
    req: Request,
    res: Response
  ): void {
    ResponseUtil.unauthorized(res, 'Authentication token expired');
  }

  /**
   * Handle Multer errors
   */
  private static handleMulterError(
    err: any,
    req: Request,
    res: Response
  ): void {
    switch (err.code) {
      case 'LIMIT_FILE_SIZE':
        ResponseUtil.error(res, 'FILE_TOO_LARGE', 'File too large', 413);
        break;
      case 'LIMIT_FILE_COUNT':
        ResponseUtil.error(res, 'TOO_MANY_FILES', 'Too many files', 413);
        break;
      case 'LIMIT_FIELD_KEY':
        ResponseUtil.error(res, 'FIELD_NAME_TOO_LONG', 'Field name too long', 400);
        break;
      case 'LIMIT_FIELD_VALUE':
        ResponseUtil.error(res, 'FIELD_VALUE_TOO_LONG', 'Field value too long', 400);
        break;
      case 'LIMIT_FIELD_COUNT':
        ResponseUtil.error(res, 'TOO_MANY_FIELDS', 'Too many fields', 400);
        break;
      default:
        ResponseUtil.error(res, 'UPLOAD_ERROR', 'File upload error', 400);
    }
  }

  /**
   * Handle file not found errors
   */
  private static handleFileNotFoundError(
    err: Error,
    req: Request,
    res: Response
  ): void {
    ResponseUtil.notFound(res, 'File not found');
  }

  /**
   * Handle uncaught exceptions
   */
  static handleUncaughtException(err: Error): void {
    logger.error('Uncaught exception', {
      error: {
        name: err.name,
        message: err.message,
        stack: err.stack
      },
      timestamp: new Date().toISOString()
    });

    // Graceful shutdown
    process.exit(1);
  }

  /**
   * Handle unhandled promise rejections
   */
  static handleUnhandledRejection(reason: any, promise: Promise<any>): void {
    logger.error('Unhandled promise rejection', {
      reason: reason?.message || reason,
      stack: reason?.stack,
      timestamp: new Date().toISOString()
    });

    // Graceful shutdown
    process.exit(1);
  }

  /**
   * Setup global error handlers
   */
  static setupGlobalHandlers(): void {
    process.on('uncaughtException', ErrorMiddleware.handleUncaughtException);
    process.on('unhandledRejection', ErrorMiddleware.handleUnhandledRejection);
  }
}

export default ErrorMiddleware;
