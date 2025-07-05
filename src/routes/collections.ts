/**
 * Collection Routes
 * Collection management endpoints
 */

import { Router, Request, Response, NextFunction } from 'express';
import { AuthMiddleware } from '../middleware/auth';
import { ValidationMiddleware } from '../middleware/validation';
import { ErrorMiddleware } from '../middleware/error';
import ResponseUtil from '../utils/response';
import logger from '../utils/logger';
import { randomInt, randomFloat } from '../utils/number.util';
import { generateId } from '../utils/id.util';

const router = Router();

/**
 * Get all collections
 */
router.get('/', 
  AuthMiddleware.authenticate,
  ValidationMiddleware.common.validatePagination,
  ErrorMiddleware.asyncHandler(async (req: Request, res: Response) => {
    const { page = 1, limit = 20 } = ResponseUtil.parsePagination(req.query);
    
    await ResponseUtil.withDelay(async () => {
      // Mock collection data
      const mockCollections = Array.from({ length: 25 }, (_, i) => ({
        id: `collection_${i + 1}`,
        name: `Collection ${i + 1}`,
        description: `Description for collection ${i + 1}`,
        type: ['public', 'private', 'shared'][i % 3] as 'public' | 'private' | 'shared',
        owner: {
          id: `user_${Math.floor(i / 3) + 1}`,
          email: `user${Math.floor(i / 3) + 1}@example.com`,
          name: `User ${Math.floor(i / 3) + 1}`,
          role: 'user' as const,
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=user${Math.floor(i / 3) + 1}`,
          createdAt: new Date(Date.now() - randomFloat(0, 86400000 * 365)).toISOString(),
          updatedAt: new Date().toISOString(),
          isActive: true
        },
        createdAt: new Date(Date.now() - randomFloat(0, 86400000 * 90)).toISOString(),
        updatedAt: new Date(Date.now() - randomFloat(0, 86400000 * 30)).toISOString(),
        fileCount: randomInt(0, 99),
        size: randomInt(0, 999999999), // Size in bytes
        tags: [`tag${i % 5 + 1}`, `category${i % 3 + 1}`],
        permissions: []
      }));
      
      const { items, total } = ResponseUtil.paginateArray(mockCollections, page, limit);
      
      logger.info('Collections retrieved', {
        total,
        page,
        limit,
        requestId: req.requestId,
        userId: req.user?.id
      });
      
      return ResponseUtil.success(res, items, 'Collections retrieved successfully', 200, {
        page,
        limit,
        total
      });
    });
  })
);

/**
 * Get all files (flat view)
 */
router.get('/files', 
  AuthMiddleware.authenticate,
  ValidationMiddleware.common.validatePagination,
  ErrorMiddleware.asyncHandler(async (req: Request, res: Response) => {
    const { page = 1, limit = 20 } = ResponseUtil.parsePagination(req.query);
    
    await ResponseUtil.withDelay(async () => {
      // Mock file data
      const mockFiles = Array.from({ length: 50 }, (_, i) => ({
        id: `file_${i + 1}`,
        name: `document_${i + 1}.pdf`,
        type: ['pdf', 'docx', 'txt', 'jpg', 'png'][i % 5],
        size: randomInt(0, 9999999), // Size in bytes
        mimeType: ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'image/jpeg', 'image/png'][i % 5],
        url: `https://api.banedonv.com/files/file_${i + 1}`,
        thumbnailUrl: i % 2 === 0 ? `https://api.banedonv.com/files/file_${i + 1}/thumbnail` : undefined,
        collectionId: `collection_${Math.floor(i / 5) + 1}`,
        collection: {
          id: `collection_${Math.floor(i / 5) + 1}`,
          name: `Collection ${Math.floor(i / 5) + 1}`,
          description: `Collection ${Math.floor(i / 5) + 1} description`,
          type: 'private' as const,
          owner: {
            id: `user_${Math.floor(i / 10) + 1}`,
            email: `user${Math.floor(i / 10) + 1}@example.com`,
            name: `User ${Math.floor(i / 10) + 1}`,
            role: 'user' as const,
            avatar: `https://api.dicebear.com/7.x/initials/svg?seed=user${Math.floor(i / 10) + 1}`,
            createdAt: new Date(Date.now() - randomFloat(0, 86400000 * 365)).toISOString(),
            updatedAt: new Date().toISOString(),
            isActive: true
          },
          createdAt: new Date(Date.now() - randomFloat(0, 86400000 * 90)).toISOString(),
          updatedAt: new Date().toISOString(),
          fileCount: randomInt(0, 99),
          size: randomInt(0, 999999999),
          tags: []
        },
        owner: {
          id: `user_${Math.floor(i / 10) + 1}`,
          email: `user${Math.floor(i / 10) + 1}@example.com`,
          name: `User ${Math.floor(i / 10) + 1}`,
          role: 'user' as const,
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=user${Math.floor(i / 10) + 1}`,
          createdAt: new Date(Date.now() - randomFloat(0, 86400000 * 365)).toISOString(),
          updatedAt: new Date().toISOString(),
          isActive: true
        },
        createdAt: new Date(Date.now() - randomFloat(0, 86400000 * 30)).toISOString(),
        updatedAt: new Date(Date.now() - randomFloat(0, 86400000 * 10)).toISOString(),
        tags: [`tag${i % 5 + 1}`],
        metadata: {
          author: `Author ${i + 1}`,
          version: '1.0',
          category: ['document', 'image', 'spreadsheet'][i % 3]
        }
      }));
      
      const { items, total } = ResponseUtil.paginateArray(mockFiles, page, limit);
      
      logger.info('All files retrieved', {
        total,
        page,
        limit,
        requestId: req.requestId,
        userId: req.user?.id
      });
      
      return ResponseUtil.success(res, items, 'Files retrieved successfully', 200, {
        page,
        limit,
        total
      });
    });
  })
);

/**
 * Get recent files
 */
router.get('/recent', 
  AuthMiddleware.authenticate,
  ErrorMiddleware.asyncHandler(async (req: Request, res: Response) => {
    await ResponseUtil.withDelay(async () => {
      // Mock recent file data (e.g., last 15 files created/updated in last 7 days)
      const mockFiles = Array.from({ length: 15 }, (_, i) => ({
        id: `file_recent_${i + 1}`,
        name: `recent_document_${i + 1}.pdf`,
        type: ['pdf', 'docx', 'txt', 'jpg', 'png'][i % 5],
        size: randomInt(0, 9999999),
        collectionId: `collection_${Math.floor(i / 5) + 1}`,
        owner: { id: `user_${Math.floor(i / 10) + 1}`, name: `User ${Math.floor(i / 10) + 1}` },
        createdAt: new Date(Date.now() - randomFloat(0, 86400000 * 7)).toISOString(),
        updatedAt: new Date(Date.now() - randomFloat(0, 86400000 * 2)).toISOString(),
      }));
      
      logger.info('Recent files retrieved', {
        count: mockFiles.length,
        requestId: req.requestId,
        userId: req.user?.id
      });
      
      return ResponseUtil.success(res, mockFiles, 'Recent files retrieved successfully');
    });
  })
);

/**
 * Get collections shared with the user
 */
router.get('/shared', 
  AuthMiddleware.authenticate,
  ErrorMiddleware.asyncHandler(async (req: Request, res: Response) => {
    const { page = 1, limit = 20 } = ResponseUtil.parsePagination(req.query);
    
    await ResponseUtil.withDelay(async () => {
      // Mock shared collection data
      const mockCollections = Array.from({ length: 5 }, (_, i) => ({
        id: `collection_shared_${i + 1}`,
        name: `Shared Collection ${i + 1}`,
        description: `Shared by another user`,
        type: 'shared' as const,
        owner: {
          id: `user_other_${i + 1}`,
          email: `user_other_${i + 1}@example.com`,
          name: `Other User ${i + 1}`,
          role: 'user' as const,
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=other_user${i + 1}`,
          createdAt: new Date(Date.now() - randomFloat(0, 86400000 * 365)).toISOString(),
          updatedAt: new Date().toISOString(),
          isActive: true
        },
        createdAt: new Date(Date.now() - randomFloat(0, 86400000 * 90)).toISOString(),
        updatedAt: new Date(Date.now() - randomFloat(0, 86400000 * 30)).toISOString(),
        fileCount: randomInt(5, 20),
        size: randomInt(10000000, 500000000),
        tags: [`shared`, `project${i+1}`],
        permissions: ['read']
      }));
      
      const { items, total } = ResponseUtil.paginateArray(mockCollections, page, limit);
      
      logger.info('Shared collections retrieved', {
        total,
        page,
        limit,
        requestId: req.requestId,
        userId: req.user?.id
      });
      
      return ResponseUtil.success(res, items, 'Shared collections retrieved successfully', 200, {
        page,
        limit,
        total
      });
    });
  })
);

/**
 * Get file by ID
 */
router.get('/files/:id',
  AuthMiddleware.authenticate,
  ValidationMiddleware.common.validateId,
  ErrorMiddleware.asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    
    await ResponseUtil.withDelay(async () => {
      // Mock file data
      const mockFile = {
        id: id,
        name: `document_${id}.pdf`,
        type: 'pdf',
        size: randomInt(0, 9999999),
        mimeType: 'application/pdf',
        url: `https://api.banedonv.com/files/${id}`,
        thumbnailUrl: `https://api.banedonv.com/files/${id}/thumbnail`,
        collectionId: 'collection_1',
        collection: {
          id: 'collection_1',
          name: 'Documents Collection',
          description: 'Important documents',
          type: 'private' as const,
          owner: {
            id: req.user?.id || 'user_1',
            email: req.user?.email || 'user@example.com',
            name: req.user?.name || 'User',
            role: req.user?.role || 'user' as const,
            avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${req.user?.id}`,
            createdAt: new Date(Date.now() - randomFloat(0, 86400000 * 365)).toISOString(),
            updatedAt: new Date().toISOString(),
            isActive: true
          },
          createdAt: new Date(Date.now() - randomFloat(0, 86400000 * 90)).toISOString(),
          updatedAt: new Date().toISOString(),
          fileCount: 25,
          size: 250000000,
          tags: ['documents', 'important']
        },
        owner: {
          id: req.user?.id || 'user_1',
          email: req.user?.email || 'user@example.com',
          name: req.user?.name || 'User',
          role: req.user?.role || 'user' as const,
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${req.user?.id}`,
          createdAt: new Date(Date.now() - randomFloat(0, 86400000 * 365)).toISOString(),
          updatedAt: new Date().toISOString(),
          isActive: true
        },
        createdAt: new Date(Date.now() - randomFloat(0, 86400000 * 30)).toISOString(),
        updatedAt: new Date(Date.now() - randomFloat(0, 86400000 * 10)).toISOString(),
        tags: ['important', 'work'],
        metadata: {
          author: 'Document Author',
          version: '1.0',
          category: 'document',
          pages: 10,
          lastModified: new Date().toISOString()
        }
      };
      
      logger.info('File retrieved', {
        fileId: id,
        requestId: req.requestId,
        userId: req.user?.id
      });
      
      return ResponseUtil.success(res, mockFile, 'File retrieved successfully');
    });
  })
);

/**
 * Delete file by ID
 */
router.delete('/files/:id',
  AuthMiddleware.authenticate,
  ValidationMiddleware.common.validateId,
  ErrorMiddleware.asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    
    await ResponseUtil.withDelay(async () => {
      logger.info('File deleted', {
        fileId: id,
        requestId: req.requestId,
        userId: req.user?.id
      });
      
      return ResponseUtil.success(res, null, 'File deleted successfully');
    });
  })
);

/**
 * Get collection by ID
 */
router.get('/:id',
  AuthMiddleware.authenticate,
  ValidationMiddleware.common.validateId,
  ErrorMiddleware.asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    
    await ResponseUtil.withDelay(async () => {
      // Mock collection data
      const mockCollection = {
        id: id,
        name: `Collection ${id}`,
        description: `Detailed description for collection ${id}`,
        type: 'private' as const,
        owner: {
          id: req.user?.id || 'user_1',
          email: req.user?.email || 'user@example.com',
          name: req.user?.name || 'User',
          role: req.user?.role || 'user' as const,
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${req.user?.id}`,
          createdAt: new Date(Date.now() - randomFloat(0, 86400000 * 365)).toISOString(),
          updatedAt: new Date().toISOString(),
          isActive: true
        },
        createdAt: new Date(Date.now() - randomFloat(0, 86400000 * 90)).toISOString(),
        updatedAt: new Date(Date.now() - randomFloat(0, 86400000 * 30)).toISOString(),
        fileCount: randomInt(0, 99),
        size: randomInt(0, 999999999),
        tags: ['important', 'work', 'documents'],
        permissions: []
      };
      
      logger.info('Collection retrieved', {
        collectionId: id,
        requestId: req.requestId,
        userId: req.user?.id
      });
      
      return ResponseUtil.success(res, mockCollection, 'Collection retrieved successfully');
    });
  })
);

/**
 * Create collection
 */
router.post('/',
  AuthMiddleware.authenticate,
  ErrorMiddleware.asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { name, description, type = 'private', tags = [] } = req.body;
    
    if (!name) {
      return next(ErrorMiddleware.createError('Collection name is required', 400, 'NAME_REQUIRED'));
    }
    
    await ResponseUtil.withDelay(async () => {
      const newCollection = {
        id: generateId('collection'),
        name,
        description,
        type: type as 'public' | 'private' | 'shared',
        owner: {
          id: req.user?.id || 'user_1',
          email: req.user?.email || 'user@example.com',
          name: req.user?.name || 'User',
          role: req.user?.role || 'user' as const,
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${req.user?.id}`,
          createdAt: new Date(Date.now() - randomFloat(0, 86400000 * 365)).toISOString(),
          updatedAt: new Date().toISOString(),
          isActive: true
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        fileCount: 0,
        size: 0,
        tags: tags,
        permissions: []
      };
      
      logger.info('Collection created', {
        collectionId: newCollection.id,
        name,
        requestId: req.requestId,
        userId: req.user?.id
      });
      
      return ResponseUtil.success(res, newCollection, 'Collection created successfully', 201);
    });
  })
);

/**
 * Update collection
 */
router.patch('/:id',
  AuthMiddleware.authenticate,
  ValidationMiddleware.common.validateId,
  ErrorMiddleware.asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;
    
    await ResponseUtil.withDelay(async () => {
      const updatedCollection = {
        id: id,
        name: updateData.name || `Collection ${id}`,
        description: updateData.description || `Updated description for collection ${id}`,
        type: (updateData.type || 'private') as 'public' | 'private' | 'shared',
        owner: {
          id: req.user?.id || 'user_1',
          email: req.user?.email || 'user@example.com',
          name: req.user?.name || 'User',
          role: req.user?.role || 'user' as const,
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${req.user?.id}`,
          createdAt: new Date(Date.now() - randomFloat(0, 86400000 * 365)).toISOString(),
          updatedAt: new Date().toISOString(),
          isActive: true
        },
        createdAt: new Date(Date.now() - randomFloat(0, 86400000 * 90)).toISOString(),
        updatedAt: new Date().toISOString(),
        fileCount: randomInt(0, 99),
        size: randomInt(0, 999999999),
        tags: updateData.tags || ['updated'],
        permissions: updateData.permissions || []
      };
      
      logger.info('Collection updated', {
        collectionId: id,
        updateData,
        requestId: req.requestId,
        userId: req.user?.id
      });
      
      return ResponseUtil.success(res, updatedCollection, 'Collection updated successfully');
    });
  })
);

/**
 * Delete collection
 */
router.delete('/:id',
  AuthMiddleware.authenticate,
  ValidationMiddleware.common.validateId,
  ErrorMiddleware.asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    
    await ResponseUtil.withDelay(async () => {
      logger.info('Collection deleted', {
        collectionId: id,
        requestId: req.requestId,
        userId: req.user?.id
      });
      
      return ResponseUtil.success(res, null, 'Collection deleted successfully');
    });
  })
);

/**
 * Get all files in a collection
 */
router.get('/:id/files',
  AuthMiddleware.authenticate,
  ValidationMiddleware.common.validateId,
  ValidationMiddleware.common.validatePagination,
  ErrorMiddleware.asyncHandler(async (req: Request, res: Response) => {
    const { id: collectionId } = req.params;
    const { page = 1, limit = 20 } = ResponseUtil.parsePagination(req.query);

    await ResponseUtil.withDelay(async () => {
      // Mock file data for a specific collection
      const mockFiles = Array.from({ length: 15 }, (_, i) => ({
        id: `file_coll_${collectionId}_${i + 1}`,
        name: `document_${i + 1}.pdf`,
        type: ['pdf', 'docx', 'txt'][i % 3],
        size: randomInt(0, 9999999),
        collectionId: collectionId,
        owner: { id: req.user?.id || 'user_1', name: req.user?.name || 'User' },
        createdAt: new Date(Date.now() - randomFloat(0, 86400000 * 30)).toISOString(),
        updatedAt: new Date(Date.now() - randomFloat(0, 86400000 * 10)).toISOString(),
      }));

      const { items, total } = ResponseUtil.paginateArray(mockFiles, page, limit);

      logger.info('Files for collection retrieved', {
        collectionId,
        total,
        page,
        limit,
        requestId: req.requestId,
        userId: req.user?.id
      });
      
      return ResponseUtil.success(res, items, 'Files for collection retrieved successfully', 200, {
        page,
        limit,
        total
      });
    });
  })
);

/**
 * Upload file to a collection
 */
router.post('/:id/files',
  AuthMiddleware.authenticate,
  ValidationMiddleware.common.validateId,
  ErrorMiddleware.asyncHandler(async (req: Request, res: Response) => {
    const { id: collectionId } = req.params;
    
    await ResponseUtil.withDelay(async () => {
      // Mock file upload
      const fileId = generateId('file');
      const uploadedFile = {
        id: fileId,
        name: 'uploaded_file.pdf',
        type: 'pdf',
        size: randomInt(0, 9999999),
        mimeType: 'application/pdf',
        url: `https://api.banedonv.com/files/${fileId}`,
        thumbnailUrl: `https://api.banedonv.com/files/${fileId}/thumbnail`,
        collectionId: collectionId,
        owner: {
          id: req.user?.id || 'user_1',
          email: req.user?.email || 'user@example.com',
          name: req.user?.name || 'User',
          role: req.user?.role || 'user' as const,
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${req.user?.id}`,
          createdAt: new Date(Date.now() - randomFloat(0, 86400000 * 365)).toISOString(),
          updatedAt: new Date().toISOString(),
          isActive: true
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: ['uploaded'],
        metadata: {
          uploadSource: 'web',
          originalName: 'uploaded_file.pdf',
          uploadedAt: new Date().toISOString()
        }
      };
      
      logger.info('File uploaded to collection', {
        fileId: uploadedFile.id,
        collectionId,
        requestId: req.requestId,
        userId: req.user?.id
      });
      
      return ResponseUtil.success(res, uploadedFile, 'File uploaded successfully', 201);
    });
  })
);

export default router;
