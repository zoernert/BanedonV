import { ICollectionRepository } from '../interfaces/ICollectionRepository';
import { Collection } from '../../domain/models/Collection';
import { CreateCollectionDto, UpdateCollectionDto } from '../../services/interfaces/ICollectionService';
import { PaginationOptions, PaginatedResult } from '../../domain/types';
import { randomInt, randomFloat } from '../../utils/number.util';
import { generateId } from '../../utils/id.util';
import { AuthUser } from '../../domain/models/AuthUser';

export class MockCollectionRepository implements ICollectionRepository {
  private collections: Collection[] = [];

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData(): void {
    // Create mock collections with realistic data
    this.collections = [
      {
        id: 'marketing-resources',
        name: 'Marketing Resources',
        description: 'Brand guidelines, templates, and marketing materials',
        type: 'shared' as const,
        owner: {
          id: 'user_1',
          email: 'sarah.johnson@banedonv.com',
          name: 'Sarah Johnson',
          role: 'manager' as const,
          avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=SarahJohnson',
          createdAt: new Date(Date.now() - 86400000 * 180).toISOString(),
          updatedAt: new Date().toISOString(),
          active: true
        },
        createdAt: new Date(Date.now() - 86400000 * 45).toISOString(),
        updatedAt: new Date(Date.now() - 7200000).toISOString(),
        fileCount: 24,
        size: 1288490188,
        tags: ['marketing', 'brand', 'templates'],
        permissions: []
      },
      {
        id: 'product-documentation',
        name: 'Product Documentation',
        description: 'Technical docs, user guides, and API references',
        type: 'public' as const,
        owner: {
          id: 'user_2',
          email: 'alex.rodriguez@banedonv.com',
          name: 'Alex Rodriguez',
          role: 'admin' as const,
          avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=AlexRodriguez',
          createdAt: new Date(Date.now() - 86400000 * 200).toISOString(),
          updatedAt: new Date().toISOString(),
          active: true
        },
        createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
        updatedAt: new Date(Date.now() - 3600000).toISOString(),
        fileCount: 156,
        size: 2847392034,
        tags: ['documentation', 'api', 'guides'],
        permissions: []
      }
    ];
  }

  async findAll(pagination: PaginationOptions): Promise<PaginatedResult<Collection>> {
    const { page = 1, limit = 20 } = pagination;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const items = this.collections.slice(startIndex, endIndex);
    const total = this.collections.length;
    
    return {
      items,
      total,
      page,
      limit
    };
  }

  async findById(id: string): Promise<Collection | null> {
    return this.collections.find(c => c.id === id) || null;
  }

  async findByOwnerId(ownerId: string, pagination: PaginationOptions): Promise<PaginatedResult<Collection>> {
    const filtered = this.collections.filter(c => c.owner.id === ownerId);
    const { page = 1, limit = 20 } = pagination;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const items = filtered.slice(startIndex, endIndex);
    const total = filtered.length;
    
    return {
      items,
      total,
      page,
      limit
    };
  }

  async findSharedWithUser(userId: string, pagination: PaginationOptions): Promise<PaginatedResult<Collection>> {
    const sharedCollections = this.collections.filter(c => 
      c.type === 'shared' && c.owner.id !== userId
    );
    
    const { page = 1, limit = 20 } = pagination;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const items = sharedCollections.slice(startIndex, endIndex);
    const total = sharedCollections.length;
    
    return {
      items,
      total,
      page,
      limit
    };
  }

  async create(collectionData: CreateCollectionDto & { id: string; ownerId: string }): Promise<Collection> {
    const mockOwner: AuthUser = {
      id: collectionData.ownerId,
      email: 'user@example.com',
      name: 'Mock User',
      role: 'user',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=MockUser',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      active: true
    };

    const collection: Collection = {
      id: collectionData.id,
      name: collectionData.name,
      description: collectionData.description || '',
      type: collectionData.type,
      owner: mockOwner,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      fileCount: 0,
      size: 0,
      tags: collectionData.tags || [],
      permissions: []
    };

    this.collections.push(collection);
    return collection;
  }

  async update(id: string, updates: UpdateCollectionDto): Promise<Collection> {
    const collectionIndex = this.collections.findIndex(c => c.id === id);
    if (collectionIndex === -1) {
      throw new Error('Collection not found');
    }

    const existingCollection = this.collections[collectionIndex]!;
    const updatedCollection: Collection = {
      id: existingCollection.id,
      name: updates.name ?? existingCollection.name,
      description: updates.description ?? existingCollection.description,
      type: updates.type ?? existingCollection.type,
      owner: existingCollection.owner,
      createdAt: existingCollection.createdAt,
      updatedAt: new Date().toISOString(),
      fileCount: existingCollection.fileCount,
      size: existingCollection.size,
      tags: updates.tags ?? existingCollection.tags,
      permissions: existingCollection.permissions
    };
    
    this.collections[collectionIndex] = updatedCollection;
    return updatedCollection;
  }

  async delete(id: string): Promise<void> {
    const index = this.collections.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Collection not found');
    }

    this.collections.splice(index, 1);
  }

  async addFile(collectionId: string, fileId: string): Promise<void> {
    const collection = this.collections.find(c => c.id === collectionId);
    if (!collection) {
      throw new Error('Collection not found');
    }

    collection.fileCount += 1;
    collection.updatedAt = new Date().toISOString();
  }

  async removeFile(collectionId: string, fileId: string): Promise<void> {
    const collection = this.collections.find(c => c.id === collectionId);
    if (!collection) {
      throw new Error('Collection not found');
    }

    collection.fileCount = Math.max(0, collection.fileCount - 1);
    collection.updatedAt = new Date().toISOString();
  }

  async getFiles(collectionId: string, pagination: PaginationOptions): Promise<PaginatedResult<any>> {
    // Mock file data for a collection
    const mockFiles = Array.from({ length: 10 }, (_, i) => ({
      id: `file_${i + 1}`,
      name: `File ${i + 1}.pdf`,
      type: 'pdf',
      size: randomInt(1000, 10000000),
      collectionId,
      createdAt: new Date(Date.now() - randomInt(0, 86400000 * 30)).toISOString()
    }));

    const { page = 1, limit = 20 } = pagination;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const items = mockFiles.slice(startIndex, endIndex);
    const total = mockFiles.length;
    
    return {
      items,
      total,
      page,
      limit
    };
  }
}
