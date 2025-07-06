import { CollectionService } from '../../src/services/CollectionService';
import { ICollectionRepository } from '../../src/repositories/interfaces/ICollectionRepository';
import { Collection } from '../../src/domain/models/Collection';
import { CreateCollectionDto, UpdateCollectionDto } from '../../src/services/interfaces/ICollectionService';
import { PaginationOptions, PaginatedResult } from '../../src/domain/types';
import { ValidationError } from '../../src/domain/errors/ValidationError';

// Mock the id utility
jest.mock('../../src/utils/id.util', () => ({
  generateId: jest.fn((prefix) => `${prefix}_${Date.now()}`)
}));

// Mock the logger
jest.mock('../../src/utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn()
}));

describe('CollectionService', () => {
  let collectionService: CollectionService;
  let mockRepository: jest.Mocked<ICollectionRepository>;
  let mockCollection: Collection;

  beforeEach(() => {
    mockCollection = {
      id: 'collection_1',
      name: 'Test Collection',
      description: 'A test collection',
      type: 'private',
      owner: {
        id: 'user_1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
        active: true,
        createdAt: '2023-01-01T00:00:00.000Z'
      },
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
      fileCount: 0,
      size: 0,
      tags: [],
      permissions: []
    };

    mockRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByOwnerId: jest.fn(),
      findSharedWithUser: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      addFile: jest.fn(),
      removeFile: jest.fn(),
      getFiles: jest.fn()
    };

    collectionService = new CollectionService(mockRepository);
    jest.clearAllMocks();
  });

  describe('getAllCollections', () => {
    it('should return paginated collections', async () => {
      const pagination: PaginationOptions = { page: 1, limit: 10 };
      const expectedResult: PaginatedResult<Collection> = {
        items: [mockCollection],
        total: 1,
        page: 1,
        limit: 10
      };

      mockRepository.findAll.mockResolvedValue(expectedResult);

      const result = await collectionService.getAllCollections(pagination);

      expect(result).toEqual(expectedResult);
      expect(mockRepository.findAll).toHaveBeenCalledWith(pagination);
    });

    it('should handle repository errors', async () => {
      const pagination: PaginationOptions = { page: 1, limit: 10 };
      const error = new Error('Database error');

      mockRepository.findAll.mockRejectedValue(error);

      await expect(collectionService.getAllCollections(pagination)).rejects.toThrow(error);
    });
  });

  describe('getCollectionById', () => {
    it('should return a collection by id', async () => {
      mockRepository.findById.mockResolvedValue(mockCollection);

      const result = await collectionService.getCollectionById('collection_1');

      expect(result).toEqual(mockCollection);
      expect(mockRepository.findById).toHaveBeenCalledWith('collection_1');
    });

    it('should return null if collection not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      const result = await collectionService.getCollectionById('collection_1');

      expect(result).toBeNull();
      expect(mockRepository.findById).toHaveBeenCalledWith('collection_1');
    });

    it('should throw ValidationError for empty id', async () => {
      await expect(collectionService.getCollectionById('')).rejects.toThrow(ValidationError);
      expect(mockRepository.findById).not.toHaveBeenCalled();
    });

    it('should handle repository errors', async () => {
      const error = new Error('Database error');
      mockRepository.findById.mockRejectedValue(error);

      await expect(collectionService.getCollectionById('collection_1')).rejects.toThrow(error);
    });
  });

  describe('createCollection', () => {
    it('should create a new collection', async () => {
      const createDto: CreateCollectionDto = {
        name: 'New Collection',
        description: 'A new collection',
        type: 'private',
        tags: ['test']
      };

      mockRepository.create.mockResolvedValue(mockCollection);

      const result = await collectionService.createCollection('user_1', createDto);

      expect(result).toEqual(mockCollection);
      expect(mockRepository.create).toHaveBeenCalledWith({
        ...createDto,
        ownerId: 'user_1',
        id: expect.any(String)
      });
    });

    it('should throw ValidationError for empty userId', async () => {
      const createDto: CreateCollectionDto = {
        name: 'New Collection',
        description: 'A new collection',
        type: 'private',
        tags: ['test']
      };

      await expect(collectionService.createCollection('', createDto)).rejects.toThrow(ValidationError);
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('should handle repository errors', async () => {
      const createDto: CreateCollectionDto = {
        name: 'New Collection',
        description: 'A new collection',
        type: 'private',
        tags: ['test']
      };
      const error = new Error('Database error');

      mockRepository.create.mockRejectedValue(error);

      await expect(collectionService.createCollection('user_1', createDto)).rejects.toThrow(error);
    });
  });

  describe('updateCollection', () => {
    it('should update a collection', async () => {
      const updateDto: UpdateCollectionDto = {
        name: 'Updated Collection',
        description: 'Updated description'
      };

      mockRepository.findById.mockResolvedValue(mockCollection);
      mockRepository.update.mockResolvedValue({ ...mockCollection, ...updateDto });

      const result = await collectionService.updateCollection('collection_1', 'user_1', updateDto);

      expect(result).toEqual({ ...mockCollection, ...updateDto });
      expect(mockRepository.findById).toHaveBeenCalledWith('collection_1');
      expect(mockRepository.update).toHaveBeenCalledWith('collection_1', updateDto);
    });

    it('should throw ValidationError for empty id or userId', async () => {
      const updateDto: UpdateCollectionDto = { name: 'Updated Collection' };

      await expect(collectionService.updateCollection('', 'user_1', updateDto)).rejects.toThrow(ValidationError);
      await expect(collectionService.updateCollection('collection_1', '', updateDto)).rejects.toThrow(ValidationError);
      expect(mockRepository.findById).not.toHaveBeenCalled();
    });

    it('should throw ValidationError if collection not found', async () => {
      const updateDto: UpdateCollectionDto = { name: 'Updated Collection' };

      mockRepository.findById.mockResolvedValue(null);

      await expect(collectionService.updateCollection('collection_1', 'user_1', updateDto)).rejects.toThrow(ValidationError);
    });

    it('should throw ValidationError if user does not own collection', async () => {
      const updateDto: UpdateCollectionDto = { name: 'Updated Collection' };

      mockRepository.findById.mockResolvedValue(mockCollection);

      await expect(collectionService.updateCollection('collection_1', 'different_user', updateDto)).rejects.toThrow(ValidationError);
    });

    it('should handle repository errors', async () => {
      const updateDto: UpdateCollectionDto = { name: 'Updated Collection' };
      const error = new Error('Database error');

      mockRepository.findById.mockRejectedValue(error);

      await expect(collectionService.updateCollection('collection_1', 'user_1', updateDto)).rejects.toThrow(error);
    });
  });

  describe('deleteCollection', () => {
    it('should delete a collection', async () => {
      mockRepository.findById.mockResolvedValue(mockCollection);
      mockRepository.delete.mockResolvedValue();

      await collectionService.deleteCollection('collection_1', 'user_1');

      expect(mockRepository.findById).toHaveBeenCalledWith('collection_1');
      expect(mockRepository.delete).toHaveBeenCalledWith('collection_1');
    });

    it('should throw ValidationError for empty id or userId', async () => {
      await expect(collectionService.deleteCollection('', 'user_1')).rejects.toThrow(ValidationError);
      await expect(collectionService.deleteCollection('collection_1', '')).rejects.toThrow(ValidationError);
      expect(mockRepository.findById).not.toHaveBeenCalled();
    });

    it('should throw ValidationError if collection not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(collectionService.deleteCollection('collection_1', 'user_1')).rejects.toThrow(ValidationError);
    });

    it('should throw ValidationError if user does not own collection', async () => {
      mockRepository.findById.mockResolvedValue(mockCollection);

      await expect(collectionService.deleteCollection('collection_1', 'different_user')).rejects.toThrow(ValidationError);
    });

    it('should handle repository errors', async () => {
      const error = new Error('Database error');
      mockRepository.findById.mockRejectedValue(error);

      await expect(collectionService.deleteCollection('collection_1', 'user_1')).rejects.toThrow(error);
    });
  });

  describe('getSharedCollections', () => {
    it('should return shared collections for a user', async () => {
      const pagination: PaginationOptions = { page: 1, limit: 10 };
      const expectedResult: PaginatedResult<Collection> = {
        items: [mockCollection],
        total: 1,
        page: 1,
        limit: 10
      };

      mockRepository.findSharedWithUser.mockResolvedValue(expectedResult);

      const result = await collectionService.getSharedCollections('user_1', pagination);

      expect(result).toEqual(expectedResult);
      expect(mockRepository.findSharedWithUser).toHaveBeenCalledWith('user_1', pagination);
    });

    it('should throw ValidationError for empty userId', async () => {
      const pagination: PaginationOptions = { page: 1, limit: 10 };

      await expect(collectionService.getSharedCollections('', pagination)).rejects.toThrow(ValidationError);
      expect(mockRepository.findSharedWithUser).not.toHaveBeenCalled();
    });

    it('should handle repository errors', async () => {
      const pagination: PaginationOptions = { page: 1, limit: 10 };
      const error = new Error('Database error');

      mockRepository.findSharedWithUser.mockRejectedValue(error);

      await expect(collectionService.getSharedCollections('user_1', pagination)).rejects.toThrow(error);
    });
  });

  describe('getCollectionFiles', () => {
    it('should return collection files', async () => {
      const pagination: PaginationOptions = { page: 1, limit: 10 };
      const expectedResult: PaginatedResult<any> = {
        items: [],
        total: 0,
        page: 1,
        limit: 10
      };

      mockRepository.findById.mockResolvedValue(mockCollection);
      mockRepository.getFiles.mockResolvedValue(expectedResult);

      const result = await collectionService.getCollectionFiles('collection_1', pagination);

      expect(result).toEqual(expectedResult);
      expect(mockRepository.findById).toHaveBeenCalledWith('collection_1');
      expect(mockRepository.getFiles).toHaveBeenCalledWith('collection_1', pagination);
    });

    it('should throw ValidationError for empty id', async () => {
      const pagination: PaginationOptions = { page: 1, limit: 10 };

      await expect(collectionService.getCollectionFiles('', pagination)).rejects.toThrow(ValidationError);
      expect(mockRepository.findById).not.toHaveBeenCalled();
    });

    it('should throw ValidationError if collection not found', async () => {
      const pagination: PaginationOptions = { page: 1, limit: 10 };

      mockRepository.findById.mockResolvedValue(null);

      await expect(collectionService.getCollectionFiles('collection_1', pagination)).rejects.toThrow(ValidationError);
    });

    it('should handle repository errors', async () => {
      const pagination: PaginationOptions = { page: 1, limit: 10 };
      const error = new Error('Database error');

      mockRepository.findById.mockRejectedValue(error);

      await expect(collectionService.getCollectionFiles('collection_1', pagination)).rejects.toThrow(error);
    });
  });

  describe('addFileToCollection', () => {
    it('should add a file to collection', async () => {
      mockRepository.findById.mockResolvedValue(mockCollection);
      mockRepository.addFile.mockResolvedValue();

      await collectionService.addFileToCollection('collection_1', 'file_1', 'user_1');

      expect(mockRepository.findById).toHaveBeenCalledWith('collection_1');
      expect(mockRepository.addFile).toHaveBeenCalledWith('collection_1', 'file_1');
    });

    it('should throw ValidationError for missing required fields', async () => {
      await expect(collectionService.addFileToCollection('', 'file_1', 'user_1')).rejects.toThrow(ValidationError);
      await expect(collectionService.addFileToCollection('collection_1', '', 'user_1')).rejects.toThrow(ValidationError);
      await expect(collectionService.addFileToCollection('collection_1', 'file_1', '')).rejects.toThrow(ValidationError);
    });

    it('should throw ValidationError if collection not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(collectionService.addFileToCollection('collection_1', 'file_1', 'user_1')).rejects.toThrow(ValidationError);
    });

    it('should throw ValidationError if user does not have permission', async () => {
      mockRepository.findById.mockResolvedValue(mockCollection);

      await expect(collectionService.addFileToCollection('collection_1', 'file_1', 'different_user')).rejects.toThrow(ValidationError);
    });
  });

  describe('removeFileFromCollection', () => {
    it('should remove a file from collection', async () => {
      mockRepository.findById.mockResolvedValue(mockCollection);
      mockRepository.removeFile.mockResolvedValue();

      await collectionService.removeFileFromCollection('collection_1', 'file_1', 'user_1');

      expect(mockRepository.findById).toHaveBeenCalledWith('collection_1');
      expect(mockRepository.removeFile).toHaveBeenCalledWith('collection_1', 'file_1');
    });

    it('should throw ValidationError for missing required fields', async () => {
      await expect(collectionService.removeFileFromCollection('', 'file_1', 'user_1')).rejects.toThrow(ValidationError);
      await expect(collectionService.removeFileFromCollection('collection_1', '', 'user_1')).rejects.toThrow(ValidationError);
      await expect(collectionService.removeFileFromCollection('collection_1', 'file_1', '')).rejects.toThrow(ValidationError);
    });

    it('should throw ValidationError if collection not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(collectionService.removeFileFromCollection('collection_1', 'file_1', 'user_1')).rejects.toThrow(ValidationError);
    });

    it('should throw ValidationError if user does not have permission', async () => {
      mockRepository.findById.mockResolvedValue(mockCollection);

      await expect(collectionService.removeFileFromCollection('collection_1', 'file_1', 'different_user')).rejects.toThrow(ValidationError);
    });
  });
});
