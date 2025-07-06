/**
 * File Routes
 * Endpoints for file management
 */

import { Router } from 'express';
import { AuthMiddleware } from '../middleware/auth';
import { ValidationMiddleware } from '../middleware/validation';
import { ErrorMiddleware } from '../middleware/error';
import { FileController } from '../controllers/FileController';
import { FileService } from '../services/FileService';
import { MockFileRepository } from '../repositories/mock/MockFileRepository';

const router = Router();

// Initialize dependencies
const fileRepository = new MockFileRepository();
const fileService = new FileService(fileRepository);
const fileController = new FileController(fileService);

/**
 * Get all files (flat view)
 * This was previously GET /collections/files
 */
router.get('/', 
  AuthMiddleware.mockAuthenticate,
  ValidationMiddleware.common.validatePagination,
  ErrorMiddleware.asyncHandler(fileController.getAllFiles.bind(fileController))
);

/**
 * Get recent files
 * This was previously GET /collections/recent
 */
router.get('/recent', 
  AuthMiddleware.mockAuthenticate,
  ErrorMiddleware.asyncHandler(fileController.getRecentFiles.bind(fileController))
);

/**
 * Get file by ID
 * This was previously GET /collections/files/:id
 */
router.get('/:id',
  AuthMiddleware.mockAuthenticate,
  ValidationMiddleware.common.validateId,
  ErrorMiddleware.asyncHandler(fileController.getFileById.bind(fileController))
);

/**
 * Delete file by ID
 * This was previously DELETE /collections/files/:id
 */
router.delete('/:id',
  AuthMiddleware.mockAuthenticate,
  ValidationMiddleware.common.validateId,
  ErrorMiddleware.asyncHandler(fileController.deleteFile.bind(fileController))
);

export default router;
