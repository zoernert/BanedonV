import { MockCollectionRepository } from '../../src/repositories/mock/MockCollectionRepository';
import { Collection } from '../../src/domain/models/Collection';
import { CreateCollectionDto, UpdateCollectionDto } from '../../src/services/interfaces/ICollectionService';
import { PaginationOptions } from '../../src/domain/types';

// Mock the id utility
jest.mock('../../src/utils/id.util', () => ({
  generateId: jest.fn((prefix) => `${prefix}_${Date.now()}`)
}));

describe('MockCollectionRepository', () => {
  let repository: MockCollectionRepository;

  beforeEach(() => {
    repository = new MockCollectionRepository();
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should initialize with mock data', () => {
      expect(repository).toBeDefined();
      // The constructor should initialize mock collections
      const collections = repository['collections'];
      expect(Array.isArray(collections)).toBe(true);
      expect(collections.length).toBeGreaterThan(0);
    });
  });

  describe('findAll', () => {
    it('should return paginated collections', async () => {
      const pagination: PaginationOptions = { page: 1, limit: 10 };
      const result = await repository.findAll(pagination);

      expect(result).toHaveProperty('items');
      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('page');
      expect(result).toHaveProperty('limit');
      expect(Array.isArray(result.items)).toBe(true);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
    });

    it('should handle pagination correctly', async () => {
      const pagination: PaginationOptions = { page: 1, limit: 1 };
      const result = await repository.findAll(pagination);

      expect(result.items.length).toBeLessThanOrEqual(1);
      expect(result.total).toBeGreaterThanOrEqual(result.items.length);
    });

    it('should return empty page when page is too high', async () => {
      const pagination: PaginationOptions = { page: 999, limit: 10 };
      const result = await repository.findAll(pagination);

      expect(result.items).toEqual([]);
      expect(result.page).toBe(999);
    });
  });

  describe('findById', () => {
    it('should return a collection by id', async () => {
      const allCollections = await repository.findAll({ page: 1, limit: 100 });
      const firstCollection = allCollections.items[0];
      
      if (firstCollection) {
        const result = await repository.findById(firstCollection.id);
        expect(result).toEqual(firstCollection);
      }
    });

    it('should return null for non-existent id', async () => {
      const result = await repository.findById('non-existent-id');
      expect(result).toBeNull();
    });
  });

  describe('findByOwnerId', () => {
    it('should return collections owned by specific user', async () => {
      const allCollections = await repository.findAll({ page: 1, limit: 100 });
      const firstCollection = allCollections.items[0];
      
      if (firstCollection) {
        const pagination: PaginationOptions = { page: 1, limit: 10 };
        const result = await repository.findByOwnerId(firstCollection.owner.id, pagination);
        
        expect(result).toHaveProperty('items');
        result.items.forEach(collection => {
          expect(collection.owner.id).toBe(firstCollection.owner.id);
        });
      }
    });

    it('should return empty result for non-existent owner', async () => {
      const pagination: PaginationOptions = { page: 1, limit: 10 };
      const result = await repository.findByOwnerId('non-existent-user', pagination);
      
      expect(result.items).toEqual([]);
      expect(result.total).toBe(0);
    });
  });

  describe('findSharedWithUser', () => {
    it('should return shared collections', async () => {
      const pagination: PaginationOptions = { page: 1, limit: 10 };
      const result = await repository.findSharedWithUser('test-user', pagination);
      
      expect(result).toHaveProperty('items');
      expect(result).toHaveProperty('total');
      expect(Array.isArray(result.items)).toBe(true);
    });
  });

  describe('create', () => {
    it('should create a new collection', async () => {
      const createDto: CreateCollectionDto & { id: string; ownerId: string } = {
        id: 'new-collection',
        name: 'New Collection',
        description: 'A new test collection',
        type: 'private',
        tags: ['test'],
        ownerId: 'test-user'
      };

      const result = await repository.create(createDto);

      expect(result).toMatchObject({
        id: createDto.id,
        name: createDto.name,
        description: createDto.description,
        type: createDto.type,
        tags: createDto.tags
      });
      expect(result.owner.id).toBe(createDto.ownerId);
      expect(result.createdAt).toBeDefined();
      expect(result.updatedAt).toBeDefined();
    });
  });

  describe('update', () => {
    it('should update an existing collection', async () => {
      // First create a collection
      const createDto: CreateCollectionDto & { id: string; ownerId: string } = {
        id: 'update-test',
        name: 'Original Name',
        description: 'Original description',
        type: 'private',
        tags: ['original'],
        ownerId: 'test-user'
      };

      const created = await repository.create(createDto);

      // Add a small delay to ensure timestamps are different
      await new Promise(resolve => setTimeout(resolve, 1));

      // Then update it
      const updateDto: UpdateCollectionDto = {
        name: 'Updated Name',
        description: 'Updated description'
      };

      const updated = await repository.update(created.id, updateDto);

      expect(updated.name).toBe(updateDto.name);
      expect(updated.description).toBe(updateDto.description);
      expect(new Date(updated.updatedAt).getTime()).toBeGreaterThan(new Date(created.updatedAt).getTime());
    });

    it('should throw error for non-existent collection', async () => {
      const updateDto: UpdateCollectionDto = {
        name: 'Updated Name'
      };

      await expect(repository.update('non-existent', updateDto)).rejects.toThrow('Collection not found');
    });
  });

  describe('delete', () => {
    it('should delete an existing collection', async () => {
      // First create a collection
      const createDto: CreateCollectionDto & { id: string; ownerId: string } = {
        id: 'delete-test',
        name: 'To Delete',
        description: 'Will be deleted',
        type: 'private',
        tags: [],
        ownerId: 'test-user'
      };

      const created = await repository.create(createDto);
      
      // Delete it
      await repository.delete(created.id);

      // Verify it's gone
      const found = await repository.findById(created.id);
      expect(found).toBeNull();
    });

    it('should throw error for non-existent collection', async () => {
      await expect(repository.delete('non-existent')).rejects.toThrow('Collection not found');
    });
  });

  describe('addFile', () => {
    it('should add file to collection', async () => {
      const allCollections = await repository.findAll({ page: 1, limit: 1 });
      const collection = allCollections.items[0];
      
      if (collection) {
        const originalFileCount = collection.fileCount;
        await repository.addFile(collection.id, 'test-file-id');
        
        const updated = await repository.findById(collection.id);
        expect(updated?.fileCount).toBe(originalFileCount + 1);
      }
    });

    it('should throw error for non-existent collection', async () => {
      await expect(repository.addFile('non-existent', 'file-id')).rejects.toThrow('Collection not found');
    });
  });

  describe('removeFile', () => {
    it('should remove file from collection', async () => {
      const allCollections = await repository.findAll({ page: 1, limit: 1 });
      const collection = allCollections.items[0];
      
      if (collection && collection.fileCount > 0) {
        const originalFileCount = collection.fileCount;
        await repository.removeFile(collection.id, 'test-file-id');
        
        const updated = await repository.findById(collection.id);
        expect(updated?.fileCount).toBe(originalFileCount - 1);
      }
    });

    it('should throw error for non-existent collection', async () => {
      await expect(repository.removeFile('non-existent', 'file-id')).rejects.toThrow('Collection not found');
    });
  });

  describe('getFiles', () => {
    it('should return paginated files for collection', async () => {
      const allCollections = await repository.findAll({ page: 1, limit: 1 });
      const collection = allCollections.items[0];
      
      if (collection) {
        const pagination: PaginationOptions = { page: 1, limit: 10 };
        const result = await repository.getFiles(collection.id, pagination);
        
        expect(result).toHaveProperty('items');
        expect(result).toHaveProperty('total');
        expect(Array.isArray(result.items)).toBe(true);
      }
    });

    it('should return empty result for non-existent collection', async () => {
      const pagination: PaginationOptions = { page: 1, limit: 10 };
      const result = await repository.getFiles('non-existent', pagination);
      
      expect(result).toHaveProperty('items');
      expect(result).toHaveProperty('total');
      expect(Array.isArray(result.items)).toBe(true);
    });
  });
});
