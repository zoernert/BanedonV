/**
 * File Routes
 * Endpoints for file management
 */

import { Router } from 'express';
import { AuthMiddleware } from '../middleware/auth';
import { ValidationMiddleware } from '../middleware/validation';
import { ErrorMiddleware } from '../middleware/error';
import { FileController } from '../controllers/file.controller';

const router = Router();

/**
 * Get all files (flat view)
 * This was previously GET /collections/files
 */
router.get('/', 
  AuthMiddleware.mockAuthenticate,
  ValidationMiddleware.common.validatePagination,
  ErrorMiddleware.asyncHandler(FileController.getAllFiles)
);

/**
 * Get recent files
 * This was previously GET /collections/recent
 */
router.get('/recent', 
  AuthMiddleware.mockAuthenticate,
  ErrorMiddleware.asyncHandler(FileController.getRecentFiles)
);

/**
 * Get file by ID
 * This was previously GET /collections/files/:id
 */
router.get('/:id',
  AuthMiddleware.mockAuthenticate,
  ValidationMiddleware.common.validateId,
  ErrorMiddleware.asyncHandler(FileController.getFileById)
);

/**
 * Delete file by ID
 * This was previously DELETE /collections/files/:id
 */
router.delete('/:id',
  AuthMiddleware.mockAuthenticate,
  ValidationMiddleware.common.validateId,
  ErrorMiddleware.asyncHandler(FileController.deleteFileById)
);

export default router;
