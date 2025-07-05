/**
 * Response Utility Functions
 * Standardized response formatting for API endpoints
 */

import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { sleep } from './async.util';
import { randomFloat } from './number.util';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
  requestId: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
  total?: number;
}

export class ResponseUtil {
  /**
   * Send success response
   */
  static success<T>(
    res: Response,
    data?: T,
    message?: string,
    statusCode: number = 200,
    pagination?: PaginationOptions
  ): void {
    const response: ApiResponse<T> = {
      success: true,
      message: message || 'Operation successful',
      timestamp: new Date().toISOString(),
      requestId: res.locals.requestId || uuidv4()
    };

    if (data !== undefined) {
      response.data = data;
    }

    if (pagination) {
      response.pagination = {
        page: pagination.page || 1,
        limit: pagination.limit || 20,
        total: pagination.total || 0,
        pages: Math.ceil((pagination.total || 0) / (pagination.limit || 20))
      };
    }

    res.status(statusCode).json(response);
  }

  /**
   * Send error response
   */
  static error(
    res: Response,
    code: string,
    message: string,
    statusCode: number = 400,
    details?: any
  ): void {
    const response: ApiResponse = {
      success: false,
      error: {
        code,
        message,
        details
      },
      timestamp: new Date().toISOString(),
      requestId: res.locals.requestId || uuidv4()
    };

    res.status(statusCode).json(response);
  }

  /**
   * Send validation error response
   */
  static validationError(
    res: Response,
    details: any,
    message: string = 'Validation failed'
  ): void {
    this.error(res, 'VALIDATION_ERROR', message, 400, details);
  }

  /**
   * Send unauthorized response
   */
  static unauthorized(
    res: Response,
    message: string = 'Unauthorized access'
  ): void {
    this.error(res, 'UNAUTHORIZED', message, 401);
  }

  /**
   * Send forbidden response
   */
  static forbidden(
    res: Response,
    message: string = 'Forbidden access'
  ): void {
    this.error(res, 'FORBIDDEN', message, 403);
  }

  /**
   * Send not found response
   */
  static notFound(
    res: Response,
    message: string = 'Resource not found'
  ): void {
    this.error(res, 'NOT_FOUND', message, 404);
  }

  /**
   * Send method not allowed response
   */
  static methodNotAllowed(
    res: Response,
    message: string = 'Method not allowed'
  ): void {
    this.error(res, 'METHOD_NOT_ALLOWED', message, 405);
  }

  /**
   * Send rate limit exceeded response
   */
  static rateLimitExceeded(
    res: Response,
    message: string = 'Rate limit exceeded'
  ): void {
    this.error(res, 'RATE_LIMIT_EXCEEDED', message, 429);
  }

  /**
   * Send internal server error response
   */
  static internalServerError(
    res: Response,
    message: string = 'Internal server error'
  ): void {
    this.error(res, 'INTERNAL_SERVER_ERROR', message, 500);
  }

  /**
   * Send service unavailable response
   */
  static serviceUnavailable(
    res: Response,
    message: string = 'Service unavailable'
  ): void {
    this.error(res, 'SERVICE_UNAVAILABLE', message, 503);
  }

  /**
   * Add realistic response delay for mock API
   */
  static async withDelay<T>(
    operation: () => Promise<T>,
    minDelay: number = 100,
    maxDelay: number = 2000
  ): Promise<T> {
    const delay = randomFloat(minDelay, maxDelay);
    await sleep(delay);
    return operation();
  }

  /**
   * Simulate network error scenarios
   */
  static simulateNetworkError(probability: number = 0.01): boolean {
    return randomFloat(0, 1) < probability;
  }

  /**
   * Parse pagination parameters from request
   */
  static parsePagination(query: any): PaginationOptions {
    const page = parseInt(query.page as string) || 1;
    const limit = Math.min(parseInt(query.limit as string) || 20, 100); // Max 100 per page
    
    return {
      page: Math.max(1, page),
      limit: Math.max(1, limit)
    };
  }

  /**
   * Apply pagination to array data
   */
  static paginateArray<T>(
    data: T[],
    page: number,
    limit: number
  ): { items: T[]; total: number } {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    return {
      items: data.slice(startIndex, endIndex),
      total: data.length
    };
  }
}

export default ResponseUtil;
