/**
 * Logging Middleware
 * Request/response logging with comprehensive tracking
 */

import { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import logger, { logRequest, logPerformance } from '../utils/logger';
import { HelperUtil } from '../utils/helpers';

export class LoggingMiddleware {
  /**
   * Generate unique request ID
   */
  static generateRequestId(req: Request, res: Response, next: NextFunction): void {
    const requestId = HelperUtil.generateRequestId();
    req.requestId = requestId;
    res.locals.requestId = requestId;
    
    // Add request ID to response headers
    res.setHeader('X-Request-ID', requestId);
    
    next();
  }

  /**
   * Request timing middleware
   */
  static requestTiming(req: Request, res: Response, next: NextFunction): void {
    const startTime = Date.now();
    
    res.on('finish', () => {
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      // Log request details
      logRequest(req, res, responseTime);
      
      // Log performance warnings for slow requests
      if (responseTime > 1000) { // More than 1 second
        logPerformance('slow_request', responseTime, {
          method: req.method,
          url: req.originalUrl,
          statusCode: res.statusCode,
          userAgent: req.get('User-Agent'),
          ip: req.ip,
          userId: req.user?.id
        });
      }
    });
    
    next();
  }

  /**
   * Morgan logger configuration
   */
  static getMorganLogger(): any {
    // Custom format with request ID
    const customFormat = ':requestId :method :url :status :res[content-length] - :response-time ms';
    
    // Add custom tokens
    morgan.token('requestId', (req: Request) => req.requestId || 'unknown');
    morgan.token('userId', (req: Request) => req.user?.id || 'anonymous');
    
    return morgan(customFormat, {
      stream: {
        write: (message: string) => {
          logger.info(message.trim());
        }
      },
      skip: (req: Request, res: Response) => {
        // Skip logging for health checks and metrics
        return req.originalUrl === '/health' || req.originalUrl === '/metrics';
      }
    });
  }

  /**
   * Request context logging
   */
  static logContext(req: Request, res: Response, next: NextFunction): void {
    const context = {
      requestId: req.requestId,
      method: req.method,
      url: req.originalUrl,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
      userId: req.user?.id,
      timestamp: new Date().toISOString()
    };
    
    logger.info('Request started', context);
    
    // Log response context
    res.on('finish', () => {
      logger.info('Request completed', {
        ...context,
        statusCode: res.statusCode,
        contentLength: res.get('Content-Length')
      });
    });
    
    next();
  }

  /**
   * Error logging middleware
   */
  static logErrors(err: Error, req: Request, res: Response, next: NextFunction): void {
    const errorContext = {
      requestId: req.requestId,
      method: req.method,
      url: req.originalUrl,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
      userId: req.user?.id,
      error: {
        name: err.name,
        message: err.message,
        stack: err.stack
      },
      timestamp: new Date().toISOString()
    };
    
    logger.error('Request error', errorContext);
    
    next(err);
  }

  /**
   * API usage tracking
   */
  static trackApiUsage(req: Request, res: Response, next: NextFunction): void {
    res.on('finish', () => {
      const endpoint = req.route?.path || req.originalUrl;
      const method = req.method;
      const statusCode = res.statusCode;
      
      logger.info('API usage', {
        endpoint,
        method,
        statusCode,
        userId: req.user?.id,
        userRole: req.user?.role,
        requestId: req.requestId,
        timestamp: new Date().toISOString()
      });
    });
    
    next();
  }

  /**
   * Security event logging
   */
  static logSecurityEvents(req: Request, res: Response, next: NextFunction): void {
    const suspiciousPatterns = [
      /\.\./,           // Directory traversal
      /<script>/i,      // XSS attempts
      /union.*select/i, // SQL injection
      /javascript:/i,   // JavaScript execution
      /eval\(/i,        // Code evaluation
      /exec\(/i         // Command execution
    ];
    
    const checkSuspicious = (value: string): boolean => {
      return suspiciousPatterns.some(pattern => pattern.test(value));
    };
    
    const logSuspiciousActivity = (type: string, value: string): void => {
      logger.warn('Security event', {
        type,
        value,
        requestId: req.requestId,
        method: req.method,
        url: req.originalUrl,
        userAgent: req.get('User-Agent'),
        ip: req.ip,
        userId: req.user?.id,
        timestamp: new Date().toISOString()
      });
    };
    
    // Check URL for suspicious patterns
    if (checkSuspicious(req.originalUrl)) {
      logSuspiciousActivity('suspicious_url', req.originalUrl);
    }
    
    // Check query parameters
    Object.entries(req.query).forEach(([key, value]) => {
      if (typeof value === 'string' && checkSuspicious(value)) {
        logSuspiciousActivity('suspicious_query', `${key}=${value}`);
      }
    });
    
    // Check body for suspicious content
    if (req.body && typeof req.body === 'object') {
      Object.entries(req.body).forEach(([key, value]) => {
        if (typeof value === 'string' && checkSuspicious(value)) {
          logSuspiciousActivity('suspicious_body', `${key}=${value}`);
        }
      });
    }
    
    next();
  }

  /**
   * Rate limiting logging
   */
  static logRateLimit(req: Request, res: Response, next: NextFunction): void {
    const remaining = parseInt(res.get('X-RateLimit-Remaining') || '0');
    const limit = parseInt(res.get('X-RateLimit-Limit') || '0');
    
    if (remaining < limit * 0.1) { // Less than 10% remaining
      logger.warn('Rate limit warning', {
        remaining,
        limit,
        requestId: req.requestId,
        ip: req.ip,
        userId: req.user?.id,
        timestamp: new Date().toISOString()
      });
    }
    
    next();
  }

  /**
   * Comprehensive logging middleware stack
   */
  static getLoggingStack(): Array<(req: Request, res: Response, next: NextFunction) => void> {
    return [
      LoggingMiddleware.generateRequestId,
      LoggingMiddleware.requestTiming,
      LoggingMiddleware.logContext,
      LoggingMiddleware.trackApiUsage,
      LoggingMiddleware.logSecurityEvents,
      LoggingMiddleware.logRateLimit
    ];
  }
}

export default LoggingMiddleware;
