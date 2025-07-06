/**
 * Collection Routes
 * Collection management endpoints
 */

import { Router } from 'express';
import { AuthMiddleware } from '../middleware/auth';
import { ValidationMiddleware } from '../middleware/validation';
import { ErrorMiddleware } from '../middleware/error';
import { CollectionController } from '../controllers/CollectionController';
import { CollectionService } from '../services/CollectionService';
import { MockCollectionRepository } from '../repositories/mock/MockCollectionRepository';

const router = Router();

// Dependency injection setup
const collectionRepository = new MockCollectionRepository();
const collectionService = new CollectionService(collectionRepository);
const collectionController = new CollectionController(collectionService);

/**
 * Get all collections
 */
router.get('/', 
  AuthMiddleware.mockAuthenticate,
  ValidationMiddleware.common.validatePagination,
  (req, res, next) => collectionController.getAllCollections(req, res, next)
);

/**
 * Get collections shared with the user
 */
router.get('/shared', 
  AuthMiddleware.mockAuthenticate,
  ValidationMiddleware.common.validatePagination,
  (req, res, next) => collectionController.getSharedCollections(req, res, next)
);

/**
 * Create collection
 */
router.post('/',
  AuthMiddleware.mockAuthenticate,
  (req, res, next) => collectionController.createCollection(req, res, next)
);

/**
 * Get collection by ID
 */
router.get('/:id',
  AuthMiddleware.mockAuthenticate,
  ValidationMiddleware.common.validateId,
  (req, res, next) => collectionController.getCollectionById(req, res, next)
);

/**
 * Update collection
 */
router.patch('/:id',
  AuthMiddleware.mockAuthenticate,
  ValidationMiddleware.common.validateId,
  (req, res, next) => collectionController.updateCollection(req, res, next)
);

/**
 * Delete collection
 */
router.delete('/:id',
  AuthMiddleware.mockAuthenticate,
  ValidationMiddleware.common.validateId,
  (req, res, next) => collectionController.deleteCollection(req, res, next)
);

/**
 * Get all files in a collection
 */
router.get('/:id/files',
  AuthMiddleware.mockAuthenticate,
  ValidationMiddleware.common.validateId,
  ValidationMiddleware.common.validatePagination,
  (req, res, next) => collectionController.getCollectionFiles(req, res, next)
);

/**
 * Upload file to a collection
 */
router.post('/:id/files',
  AuthMiddleware.mockAuthenticate,
  ValidationMiddleware.common.validateId,
  (req, res, next) => collectionController.uploadFileToCollection(req, res, next)
);

export default router;
