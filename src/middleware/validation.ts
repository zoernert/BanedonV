/**
 * Validation Middleware
 * Request validation using Joi schemas
 */

import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ValidationUtil } from '../utils/validation';
import { ErrorMiddleware } from './error';

export class ValidationMiddleware {
  /**
   * Validate request body
   */
  static validateBody(schema: Joi.ObjectSchema) {
    return (req: Request, res: Response, next: NextFunction) => {
      const { error, value } = schema.validate(req.body);
      
      if (error) {
        const details = {
          body: error.details.map(d => ({ field: d.path.join('.'), message: d.message }))
        };
        return next(ErrorMiddleware.createError('Validation failed', 422, 'VALIDATION_ERROR', details));
      }
      
      req.body = value;
      next();
    };
  }

  /**
   * Validate request params
   */
  static validateParams(schema: Joi.ObjectSchema) {
    return (req: Request, res: Response, next: NextFunction) => {
      const { error, value } = schema.validate(req.params);
      
      if (error) {
        const details = {
          params: error.details.map(d => ({ field: d.path.join('.'), message: d.message }))
        };
        return next(ErrorMiddleware.createError('Validation failed', 422, 'VALIDATION_ERROR', details));
      }
      
      req.params = value;
      next();
    };
  }

  /**
   * Validate request query
   */
  static validateQuery(schema: Joi.ObjectSchema) {
    return (req: Request, res: Response, next: NextFunction) => {
      const { error, value } = schema.validate(req.query);
      
      if (error) {
        const details = {
          query: error.details.map(d => ({ field: d.path.join('.'), message: d.message }))
        };
        return next(ErrorMiddleware.createError('Validation failed', 422, 'VALIDATION_ERROR', details));
      }
      
      req.query = value;
      next();
    };
  }

  /**
   * Validate request headers
   */
  static validateHeaders(schema: Joi.ObjectSchema) {
    return (req: Request, res: Response, next: NextFunction) => {
      const { error, value } = schema.validate(req.headers);
      
      if (error) {
        const details = {
          headers: error.details.map(d => ({ field: d.path.join('.'), message: d.message }))
        };
        return next(ErrorMiddleware.createError('Validation failed', 422, 'VALIDATION_ERROR', details));
      }
      
      req.headers = value;
      next();
    };
  }

  /**
   * Validate complete request
   */
  static validateRequest(schemas: {
    body?: Joi.ObjectSchema;
    params?: Joi.ObjectSchema;
    query?: Joi.ObjectSchema;
    headers?: Joi.ObjectSchema;
  }) {
    return ValidationUtil.validate(schemas);
  }

  /**
   * Common validation middleware
   */
  static common = {
    // ID parameter validation
    validateId: ValidationMiddleware.validateParams(
      Joi.object({
        id: ValidationUtil.schemas.id
      })
    ),

    // Pagination validation
    validatePagination: ValidationMiddleware.validateQuery(
      ValidationUtil.schemas.pagination
    ),

    // User validation
    validateUserRegistration: ValidationMiddleware.validateBody(
      ValidationUtil.schemas.user.register
    ),

    validateUserLogin: ValidationMiddleware.validateBody(
      ValidationUtil.schemas.user.login
    ),

    validateUserUpdate: ValidationMiddleware.validateBody(
      ValidationUtil.schemas.user.update
    ),

    // Collection validation
    validateCollectionCreate: ValidationMiddleware.validateBody(
      ValidationUtil.schemas.collection.create
    ),

    validateCollectionUpdate: ValidationMiddleware.validateBody(
      ValidationUtil.schemas.collection.update
    ),

    // File validation
    validateFileUpload: ValidationMiddleware.validateBody(
      ValidationUtil.schemas.file.upload
    ),

    validateFileUpdate: ValidationMiddleware.validateBody(
      ValidationUtil.schemas.file.update
    ),

    // Search validation
    validateSearchQuery: ValidationMiddleware.validateQuery(
      ValidationUtil.schemas.search.query
    ),

    // Billing validation
    validateBillingSubscribe: ValidationMiddleware.validateBody(
      ValidationUtil.schemas.billing.subscribe
    ),

    validateBillingUpgrade: ValidationMiddleware.validateBody(
      ValidationUtil.schemas.billing.upgrade
    )
  };
}

export default ValidationMiddleware;
