/**
 * CollectionController Tests
 * Tests for collection management controller functionality
 * 
 * @author BanedonV Team
 * @since 1.0.0
 */

import { Request, Response, NextFunction } from 'express';
import { CollectionController } from '../../src/controllers/CollectionController';
import { ICollectionService } from '../../src/services/interfaces/ICollectionService';
import { Collection } from '../../src/domain/models/Collection';
import { ValidationError } from '../../src/domain/errors/ValidationError';
import { ErrorCodes } from '../../src/domain/errors/ErrorCodes';

describe('CollectionController', () => {
  let collectionController: CollectionController;
  let mockCollectionService: jest.Mocked<ICollectionService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  const mockCollection: Collection = {
    id: 'collection_1',
    name: 'Test Collection',
    description: 'Test description',
    type: 'private',
    owner: {
      id: 'user_1',
      email: 'test@example.com',
      name: 'Test User',
      role: 'user',
      active: true,
      createdAt: new Date().toISOString()
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    fileCount: 5,
    size: 1000000,
    tags: ['test'],
    permissions: []
  };

  beforeEach(() => {
    mockCollectionService = {
      getAllCollections: jest.fn(),
      getCollectionById: jest.fn(),
      getSharedCollections: jest.fn(),
      createCollection: jest.fn(),
      updateCollection: jest.fn(),
      deleteCollection: jest.fn(),
      getCollectionFiles: jest.fn(),
      addFileToCollection: jest.fn(),
      removeFileFromCollection: jest.fn()
    };

    collectionController = new CollectionController(mockCollectionService);

    mockRequest = {
      params: {},
      query: {},
      body: {},
      user: {
        id: 'user_1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
        active: true,
        createdAt: new Date().toISOString()
      }
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis()
    };

    mockNext = jest.fn();
  });

  describe('getAllCollections', () => {
    it('should get all collections successfully', async () => {
      const mockPaginatedResult = {
        items: [mockCollection],
        total: 1,
        page: 1,
        limit: 20
      };

      mockCollectionService.getAllCollections.mockResolvedValue(mockPaginatedResult);

      await collectionController.getAllCollections(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockCollectionService.getAllCollections).toHaveBeenCalledWith({
        page: 1,
        limit: 20
      });
    });

    it('should handle errors when getting collections fails', async () => {
      const error = new Error('Service error');
      mockCollectionService.getAllCollections.mockRejectedValue(error);

      await collectionController.getAllCollections(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getCollectionById', () => {
    it('should get collection by id successfully', async () => {
      mockRequest.params = { id: 'collection_1' };
      mockCollectionService.getCollectionById.mockResolvedValue(mockCollection);

      await collectionController.getCollectionById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockCollectionService.getCollectionById).toHaveBeenCalledWith('collection_1');
    });

    it('should return 404 when collection not found', async () => {
      mockRequest.params = { id: 'nonexistent' };
      mockCollectionService.getCollectionById.mockResolvedValue(null);

      await collectionController.getCollectionById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockCollectionService.getCollectionById).toHaveBeenCalledWith('nonexistent');
    });

    it('should handle errors when getting collection by id fails', async () => {
      mockRequest.params = { id: 'collection_1' };
      const error = new Error('Service error');
      mockCollectionService.getCollectionById.mockRejectedValue(error);

      await collectionController.getCollectionById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('createCollection', () => {
    it('should create collection successfully', async () => {
      const createData = {
        name: 'New Collection',
        description: 'New description',
        type: 'private' as const,
        tags: ['new']
      };

      mockRequest.body = createData;
      mockCollectionService.createCollection.mockResolvedValue(mockCollection);

      await collectionController.createCollection(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockCollectionService.createCollection).toHaveBeenCalledWith('user_1', createData);
    });

    it('should handle errors when creating collection fails', async () => {
      const createData = {
        name: 'New Collection',
        type: 'private' as const
      };

      mockRequest.body = createData;
      const error = new ValidationError(ErrorCodes.VALIDATION.REQUIRED_FIELD, 'Name is required');
      mockCollectionService.createCollection.mockRejectedValue(error);

      await collectionController.createCollection(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('updateCollection', () => {
    it('should update collection successfully', async () => {
      const updateData = {
        name: 'Updated Collection',
        description: 'Updated description'
      };

      mockRequest.params = { id: 'collection_1' };
      mockRequest.body = updateData;
      mockCollectionService.updateCollection.mockResolvedValue({
        ...mockCollection,
        ...updateData
      });

      await collectionController.updateCollection(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockCollectionService.updateCollection).toHaveBeenCalledWith(
        'collection_1',
        'user_1',
        updateData
      );
    });

    it('should handle errors when updating collection fails', async () => {
      mockRequest.params = { id: 'collection_1' };
      mockRequest.body = { name: 'Updated' };
      const error = new Error('Update failed');
      mockCollectionService.updateCollection.mockRejectedValue(error);

      await collectionController.updateCollection(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('deleteCollection', () => {
    it('should delete collection successfully', async () => {
      mockRequest.params = { id: 'collection_1' };
      mockCollectionService.deleteCollection.mockResolvedValue();

      await collectionController.deleteCollection(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockCollectionService.deleteCollection).toHaveBeenCalledWith('collection_1', 'user_1');
    });

    it('should handle errors when deleting collection fails', async () => {
      mockRequest.params = { id: 'collection_1' };
      const error = new Error('Delete failed');
      mockCollectionService.deleteCollection.mockRejectedValue(error);

      await collectionController.deleteCollection(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getSharedCollections', () => {
    it('should get shared collections successfully', async () => {
      const mockPaginatedResult = {
        items: [mockCollection],
        total: 1,
        page: 1,
        limit: 20
      };

      mockCollectionService.getSharedCollections.mockResolvedValue(mockPaginatedResult);

      await collectionController.getSharedCollections(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockCollectionService.getSharedCollections).toHaveBeenCalledWith('user_1', {
        page: 1,
        limit: 20
      });
    });
  });

  describe('getCollectionFiles', () => {
    it('should get collection files successfully', async () => {
      const mockFiles = {
        items: [],
        total: 0,
        page: 1,
        limit: 20
      };

      mockRequest.params = { id: 'collection_1' };
      mockCollectionService.getCollectionFiles.mockResolvedValue(mockFiles);

      await collectionController.getCollectionFiles(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockCollectionService.getCollectionFiles).toHaveBeenCalledWith('collection_1', {
        page: 1,
        limit: 20
      });
    });
  });

  describe('uploadFileToCollection', () => {
    it('should upload file to collection successfully', async () => {
      mockRequest.params = { id: 'collection_1' };
      mockRequest.body = { fileId: 'file_1' };
      mockCollectionService.addFileToCollection.mockResolvedValue();

      await collectionController.uploadFileToCollection(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockCollectionService.addFileToCollection).toHaveBeenCalledWith(
        'collection_1',
        'file_1',
        'user_1'
      );
    });
  });
});
