import { Response, NextFunction } from 'express';
import ResponseUtil from '../utils/response';
import { ErrorMiddleware } from '../middleware/error';
import { DomainError } from '../domain/errors/DomainError';
import { PaginatedResult } from '../domain/types';

export abstract class BaseController {
  protected async executeWithDelay<T>(
    operation: () => Promise<T>,
    res: Response,
    successMessage: string,
    statusCode: number = 200
  ): Promise<void> {
    await ResponseUtil.withDelay(async () => {
      const result = await operation();
      return ResponseUtil.success(res, result, successMessage, statusCode);
    });
  }

  protected async executeWithPagination<T>(
    operation: () => Promise<PaginatedResult<T>>,
    res: Response,
    successMessage: string
  ): Promise<void> {
    await ResponseUtil.withDelay(async () => {
      const result = await operation();
      return ResponseUtil.success(res, result.items, successMessage, 200, {
        page: result.page,
        limit: result.limit,
        total: result.total,
      });
    });
  }

  protected handleError(error: Error, next: NextFunction): void {
    if (error instanceof DomainError) {
      next(ErrorMiddleware.createError(error.message, error.statusCode, error.code));
    } else {
      next(error);
    }
  }
}
