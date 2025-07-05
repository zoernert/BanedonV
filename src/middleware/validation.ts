/**
 * Validation Middleware
 * Request validation using Joi schemas
 */

import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ErrorMiddleware } from './error';
import { billingSchemas } from '../validation-schemas/billing.schema';
import { collectionSchemas } from '../validation-schemas/collection.schema';
import { commonSchemas } from '../validation-schemas/common.schema';
import { fileSchemas } from '../validation-schemas/file.schema';
import { searchSchemas } from '../validation-schemas/search.schema';
import { userSchemas } from '../validation-schemas/user.schema';

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
   * Common validation middleware
   */
  static common = {
    // ID parameter validation
    validateId: ValidationMiddleware.validateParams(
      Joi.object({
        id: commonSchemas.id
      })
    ),

    // Pagination validation
    validatePagination: ValidationMiddleware.validateQuery(
      commonSchemas.pagination
    ),

    // User validation
    validateUserRegistration: ValidationMiddleware.validateBody(
      userSchemas.register
    ),

    validateUserLogin: ValidationMiddleware.validateBody(
      userSchemas.login
    ),

    validateUserUpdate: ValidationMiddleware.validateBody(
      userSchemas.update
    ),

    // Collection validation
    validateCollectionCreate: ValidationMiddleware.validateBody(
      collectionSchemas.create
    ),

    validateCollectionUpdate: ValidationMiddleware.validateBody(
      collectionSchemas.update
    ),

    // File validation
    validateFileUpload: ValidationMiddleware.validateBody(
      fileSchemas.upload
    ),

    validateFileUpdate: ValidationMiddleware.validateBody(
      fileSchemas.update
    ),

    // Search validation
    validateSearchQuery: ValidationMiddleware.validateQuery(
      searchSchemas.query
    ),

    validateSearchSuggestions: ValidationMiddleware.validateQuery(
      searchSchemas.suggestions
    ),

    // Billing validation
    validateBillingSubscribe: ValidationMiddleware.validateBody(
      billingSchemas.subscribe
    ),

    validateBillingUpgrade: ValidationMiddleware.validateBody(
      billingSchemas.upgrade
    )
  };
}

export default ValidationMiddleware;
