/**
 * Rate Limiting Middleware
 * Request rate limiting and throttling
 */

import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';
import ResponseUtil from '../utils/response';
import logger from '../utils/logger';

export class RateLimitMiddleware {
  /**
   * Standard rate limiting
   */
  static standardRateLimit() {
    return rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // Limit each IP to 100 requests per windowMs
      message: {
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many requests from this IP, please try again later.'
        }
      },
      standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
      legacyHeaders: false, // Disable the `X-RateLimit-*` headers
      handler: (req: Request, res: Response) => {
        logger.warn('Rate limit exceeded', {
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          url: req.originalUrl,
          userId: req.user?.id,
          timestamp: new Date().toISOString()
        });
        
        ResponseUtil.rateLimitExceeded(res);
      }
    });
  }

  /**
   * Strict rate limiting for authentication endpoints
   */
  static authRateLimit() {
    return rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 5, // Limit each IP to 5 requests per windowMs
      message: {
        error: {
          code: 'AUTH_RATE_LIMIT_EXCEEDED',
          message: 'Too many authentication attempts, please try again later.'
        }
      },
      standardHeaders: true,
      legacyHeaders: false,
      handler: (req: Request, res: Response) => {
        logger.warn('Auth rate limit exceeded', {
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          url: req.originalUrl,
          timestamp: new Date().toISOString()
        });
        
        ResponseUtil.rateLimitExceeded(res, 'Too many authentication attempts');
      }
    });
  }

  /**
   * API rate limiting
   */
  static apiRateLimit() {
    return rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 200, // Higher limit for API endpoints
      message: {
        error: {
          code: 'API_RATE_LIMIT_EXCEEDED',
          message: 'Too many API requests, please try again later.'
        }
      },
      standardHeaders: true,
      legacyHeaders: false,
      handler: (req: Request, res: Response) => {
        logger.warn('API rate limit exceeded', {
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          url: req.originalUrl,
          userId: req.user?.id,
          timestamp: new Date().toISOString()
        });
        
        ResponseUtil.rateLimitExceeded(res, 'Too many API requests');
      }
    });
  }

  /**
   * Upload rate limiting
   */
  static uploadRateLimit() {
    return rateLimit({
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 10, // Limit each IP to 10 uploads per hour
      message: {
        error: {
          code: 'UPLOAD_RATE_LIMIT_EXCEEDED',
          message: 'Too many file uploads, please try again later.'
        }
      },
      standardHeaders: true,
      legacyHeaders: false,
      handler: (req: Request, res: Response) => {
        logger.warn('Upload rate limit exceeded', {
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          url: req.originalUrl,
          userId: req.user?.id,
          timestamp: new Date().toISOString()
        });
        
        ResponseUtil.rateLimitExceeded(res, 'Too many file uploads');
      }
    });
  }

  /**
   * Search rate limiting
   */
  static searchRateLimit() {
    return rateLimit({
      windowMs: 60 * 1000, // 1 minute
      max: 30, // Limit each IP to 30 searches per minute
      message: {
        error: {
          code: 'SEARCH_RATE_LIMIT_EXCEEDED',
          message: 'Too many search requests, please try again later.'
        }
      },
      standardHeaders: true,
      legacyHeaders: false,
      handler: (req: Request, res: Response) => {
        logger.warn('Search rate limit exceeded', {
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          url: req.originalUrl,
          userId: req.user?.id,
          timestamp: new Date().toISOString()
        });
        
        ResponseUtil.rateLimitExceeded(res, 'Too many search requests');
      }
    });
  }

  /**
   * Development rate limiting (more permissive)
   */
  static developmentRateLimit() {
    return rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 1000, // Much higher limit for development
      message: {
        error: {
          code: 'DEV_RATE_LIMIT_EXCEEDED',
          message: 'Development rate limit exceeded.'
        }
      },
      standardHeaders: true,
      legacyHeaders: false,
      handler: (req: Request, res: Response) => {
        logger.warn('Development rate limit exceeded', {
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          url: req.originalUrl,
          userId: req.user?.id,
          timestamp: new Date().toISOString()
        });
        
        ResponseUtil.rateLimitExceeded(res);
      }
    });
  }

  /**
   * Custom rate limiting with dynamic limits
   */
  static customRateLimit(options: {
    windowMs: number;
    max: number;
    message?: string;
    skipSuccessfulRequests?: boolean;
    skipFailedRequests?: boolean;
    keyGenerator?: (req: Request) => string;
  }) {
    return rateLimit({
      windowMs: options.windowMs,
      max: options.max,
      message: {
        error: {
          code: 'CUSTOM_RATE_LIMIT_EXCEEDED',
          message: options.message || 'Rate limit exceeded'
        }
      },
      standardHeaders: true,
      legacyHeaders: false,
      skipSuccessfulRequests: options.skipSuccessfulRequests || false,
      skipFailedRequests: options.skipFailedRequests || false,
      keyGenerator: options.keyGenerator || ((req: Request) => req.ip || 'unknown'),
      handler: (req: Request, res: Response) => {
        logger.warn('Custom rate limit exceeded', {
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          url: req.originalUrl,
          userId: req.user?.id,
          timestamp: new Date().toISOString()
        });
        
        ResponseUtil.rateLimitExceeded(res, options.message);
      }
    });
  }

  /**
   * User-based rate limiting
   */
  static userRateLimit() {
    return rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 500, // Higher limit for authenticated users
      keyGenerator: (req: Request) => {
        return req.user?.id || req.ip || 'unknown';
      },
      message: {
        error: {
          code: 'USER_RATE_LIMIT_EXCEEDED',
          message: 'Too many requests from this user, please try again later.'
        }
      },
      standardHeaders: true,
      legacyHeaders: false,
      handler: (req: Request, res: Response) => {
        logger.warn('User rate limit exceeded', {
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          url: req.originalUrl,
          userId: req.user?.id,
          timestamp: new Date().toISOString()
        });
        
        ResponseUtil.rateLimitExceeded(res, 'Too many requests from this user');
      }
    });
  }

  /**
   * Get rate limit configuration based on environment
   */
  static getRateLimitConfig() {
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    return {
      standard: isDevelopment ? this.developmentRateLimit() : this.standardRateLimit(),
      auth: this.authRateLimit(),
      api: isDevelopment ? this.developmentRateLimit() : this.apiRateLimit(),
      upload: this.uploadRateLimit(),
      search: this.searchRateLimit(),
      user: isDevelopment ? this.developmentRateLimit() : this.userRateLimit()
    };
  }
}

export default RateLimitMiddleware;
