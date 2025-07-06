/**
 * Collection Routes
 * Collection management endpoints
 */

import { Router } from 'express';
import { AuthMiddleware } from '../middleware/auth';
import { ValidationMiddleware } from '../middleware/validation';
import { ErrorMiddleware } from '../middleware/error';
import { CollectionController } from '../controllers/collection.controller';

const router = Router();

/**
 * Get all collections
 */
router.get('/', 
  AuthMiddleware.mockAuthenticate,
  ValidationMiddleware.common.validatePagination,
  ErrorMiddleware.asyncHandler(CollectionController.getAllCollections)
);

/**
 * Get collections shared with the user
 */
router.get('/shared', 
  AuthMiddleware.mockAuthenticate,
  ValidationMiddleware.common.validatePagination,
  ErrorMiddleware.asyncHandler(CollectionController.getSharedCollections)
);

/**
 * Create collection
 */
router.post('/',
  AuthMiddleware.mockAuthenticate,
  ErrorMiddleware.asyncHandler(CollectionController.createCollection)
);

/**
 * Get collection by ID
 */
router.get('/:id',
  AuthMiddleware.mockAuthenticate,
  ValidationMiddleware.common.validateId,
  ErrorMiddleware.asyncHandler(CollectionController.getCollectionById)
);

/**
 * Update collection
 */
router.patch('/:id',
  AuthMiddleware.mockAuthenticate,
  ValidationMiddleware.common.validateId,
  ErrorMiddleware.asyncHandler(CollectionController.updateCollection)
);

/**
 * Delete collection
 */
router.delete('/:id',
  AuthMiddleware.mockAuthenticate,
  ValidationMiddleware.common.validateId,
  ErrorMiddleware.asyncHandler(CollectionController.deleteCollection)
);

/**
 * Get all files in a collection
 */
router.get('/:id/files',
  AuthMiddleware.mockAuthenticate,
  ValidationMiddleware.common.validateId,
  ValidationMiddleware.common.validatePagination,
  ErrorMiddleware.asyncHandler(CollectionController.getCollectionFiles)
);

/**
 * Upload file to a collection
 */
router.post('/:id/files',
  AuthMiddleware.mockAuthenticate,
  ValidationMiddleware.common.validateId,
  ErrorMiddleware.asyncHandler(CollectionController.uploadFileToCollection)
);

export default router;
