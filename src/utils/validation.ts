/**
 * Validation Utility Functions
 * Joi schema validation helpers for API requests
 */

import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { ErrorMiddleware } from '../middleware/error';

export interface ValidationOptions {
  body?: Joi.ObjectSchema;
  params?: Joi.ObjectSchema;
  query?: Joi.ObjectSchema;
  headers?: Joi.ObjectSchema;
}

export class ValidationUtil {
  /**
   * Validate request middleware
   */
  static validate(schemas: ValidationOptions) {
    return (req: Request, res: Response, next: NextFunction) => {
      const errors: any = {};

      // Validate body
      if (schemas.body) {
        const { error } = schemas.body.validate(req.body);
        if (error) {
          errors.body = error.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message
          }));
        }
      }

      // Validate params
      if (schemas.params) {
        const { error } = schemas.params.validate(req.params);
        if (error) {
          errors.params = error.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message
          }));
        }
      }

      // Validate query
      if (schemas.query) {
        const { error } = schemas.query.validate(req.query);
        if (error) {
          errors.query = error.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message
          }));
        }
      }

      // Validate headers
      if (schemas.headers) {
        const { error } = schemas.headers.validate(req.headers);
        if (error) {
          errors.headers = error.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message
          }));
        }
      }

      if (Object.keys(errors).length > 0) {
        const err = ErrorMiddleware.createError('Validation failed', 422, 'VALIDATION_ERROR', errors);
        return next(err);
      }

      next();
    };
  }

  /**
   * Common validation schemas
   */
  static schemas = {
    // ID validation
    id: Joi.string().required().min(1),
    
    // User validation
    user: {
      register: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        name: Joi.string().min(2).max(50).required(),
        role: Joi.string().valid('admin', 'manager', 'user').default('user')
      }),
      login: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
      }),
      update: Joi.object({
        name: Joi.string().min(2).max(50),
        email: Joi.string().email(),
        role: Joi.string().valid('admin', 'manager', 'user')
      })
    },

    // Collection validation
    collection: {
      create: Joi.object({
        name: Joi.string().min(1).max(100).required(),
        description: Joi.string().max(500),
        tags: Joi.array().items(Joi.string()),
        isPublic: Joi.boolean().default(false),
        parentId: Joi.string().allow(null)
      }),
      update: Joi.object({
        name: Joi.string().min(1).max(100),
        description: Joi.string().max(500),
        tags: Joi.array().items(Joi.string()),
        isPublic: Joi.boolean(),
        parentId: Joi.string().allow(null)
      })
    },

    // File validation
    file: {
      upload: Joi.object({
        collectionId: Joi.string().required(),
        name: Joi.string().min(1).max(255),
        description: Joi.string().max(1000),
        tags: Joi.array().items(Joi.string())
      }),
      update: Joi.object({
        name: Joi.string().min(1).max(255),
        description: Joi.string().max(1000),
        tags: Joi.array().items(Joi.string())
      })
    },

    // Search validation
    search: {
      query: Joi.object({
        q: Joi.string().min(1).max(200).required(),
        type: Joi.string().valid('text', 'semantic', 'hybrid').default('text'),
        collections: Joi.array().items(Joi.string()),
        tags: Joi.array().items(Joi.string()),
        dateFrom: Joi.date(),
        dateTo: Joi.date(),
        limit: Joi.number().integer().min(1).max(100).default(20),
        page: Joi.number().integer().min(1).default(1)
      })
    },

    // Billing validation
    billing: {
      subscribe: Joi.object({
        planId: Joi.string().required(),
        paymentMethodId: Joi.string().required()
      }),
      upgrade: Joi.object({
        planId: Joi.string().required()
      })
    },

    // Pagination validation
    pagination: Joi.object({
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(20),
      sort: Joi.string().valid('name', 'createdAt', 'updatedAt', 'size').default('createdAt'),
      order: Joi.string().valid('asc', 'desc').default('desc')
    })
  };

  /**
   * Validate email format
   */
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate password strength
   */
  static validatePasswordStrength(password: string): {
    isValid: boolean;
    score: number;
    feedback: string[];
  } {
    const feedback: string[] = [];
    let score = 0;

    if (password.length < 6) {
      feedback.push('Password must be at least 6 characters long');
    } else if (password.length < 8) {
      feedback.push('Password should be at least 8 characters long');
      score += 1;
    } else {
      score += 2;
    }

    if (!/[a-z]/.test(password)) {
      feedback.push('Password should contain lowercase letters');
    } else {
      score += 1;
    }

    if (!/[A-Z]/.test(password)) {
      feedback.push('Password should contain uppercase letters');
    } else {
      score += 1;
    }

    if (!/[0-9]/.test(password)) {
      feedback.push('Password should contain numbers');
    } else {
      score += 1;
    }

    if (!/[^a-zA-Z0-9]/.test(password)) {
      feedback.push('Password should contain special characters');
    } else {
      score += 1;
    }

    return {
      isValid: score >= 3,
      score,
      feedback
    };
  }

  /**
   * Sanitize string input
   */
  static sanitizeString(input: string): string {
    return input.trim().replace(/[<>]/g, '');
  }

  /**
   * Validate UUID format
   */
  static isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  /**
   * Validate file type
   */
  static validateFileType(filename: string, allowedTypes: string[]): boolean {
    const extension = filename.split('.').pop()?.toLowerCase();
    return extension ? allowedTypes.includes(extension) : false;
  }

  /**
   * Validate file size
   */
  static validateFileSize(size: number, maxSize: number): boolean {
    return size <= maxSize;
  }
}

export default ValidationUtil;
