import { IFileRepository } from '../interfaces/IFileRepository';
import { File } from '../../domain/models/File';
import { CreateFileDto, UpdateFileDto } from '../../services/interfaces/IFileService';
import { PaginationOptions, PaginatedResult } from '../../domain/types';
import { randomInt, randomFloat } from '../../utils/number.util';
import { generateId } from '../../utils/id.util';
import { AuthUser } from '../../domain/models/AuthUser';

export class MockFileRepository implements IFileRepository {
  private files: File[] = [];

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData(): void {
    // Create mock files with realistic data
    this.files = [
      {
        id: 'file_1',
        name: 'Project Requirements.pdf',
        type: 'pdf',
        size: 2457600,
        mimeType: 'application/pdf',
        url: '/files/project-requirements.pdf',
        thumbnailUrl: '/files/thumbnails/project-requirements.jpg',
        collectionId: 'marketing-resources',
        owner: {
          id: 'user_1',
          email: 'sarah.johnson@banedonv.com',
          name: 'Sarah Johnson',
          role: 'team_manager',
          active: true,
          createdAt: new Date().toISOString()
        },
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
        updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        tags: ['requirements', 'project', 'documentation'],
        metadata: {
          version: '1.2',
          author: 'Sarah Johnson',
          category: 'documentation'
        }
      },
      {
        id: 'file_2',
        name: 'Brand Guidelines.sketch',
        type: 'sketch',
        size: 15728640,
        mimeType: 'application/x-sketch',
        url: '/files/brand-guidelines.sketch',
        thumbnailUrl: '/files/thumbnails/brand-guidelines.jpg',
        collectionId: 'marketing-resources',
        owner: {
          id: 'user_2',
          email: 'alex.rodriguez@banedonv.com',
          name: 'Alex Rodriguez',
          role: 'admin',
          active: true,
          createdAt: new Date().toISOString()
        },
        createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
        updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
        tags: ['design', 'branding', 'guidelines'],
        metadata: {
          version: '2.0',
          author: 'Alex Rodriguez',
          category: 'design'
        }
      }
    ];
  }

  async findAll(pagination: PaginationOptions): Promise<PaginatedResult<File>> {
    const { page = 1, limit = 20 } = pagination;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const items = this.files.slice(startIndex, endIndex);
    const total = this.files.length;
    
    return {
      items,
      total,
      page,
      limit
    };
  }

  async findById(id: string): Promise<File | null> {
    return this.files.find(f => f.id === id) || null;
  }

  async findByCollectionId(collectionId: string, pagination: PaginationOptions): Promise<PaginatedResult<File>> {
    const filtered = this.files.filter(f => f.collectionId === collectionId);
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

  async findByOwnerId(ownerId: string, pagination: PaginationOptions): Promise<PaginatedResult<File>> {
    const filtered = this.files.filter(f => f.owner.id === ownerId);
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

  async findRecent(userId: string, limit: number = 10): Promise<File[]> {
    // Return user's recent files, sorted by updatedAt
    const userFiles = this.files.filter(f => f.owner.id === userId);
    return userFiles
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, limit);
  }

  async create(fileData: CreateFileDto & { id: string; ownerId: string }): Promise<File> {
    const mockOwner: AuthUser = {
      id: fileData.ownerId,
      email: 'user@example.com',
      name: 'Mock User',
      role: 'user',
      active: true,
      createdAt: new Date().toISOString()
    };

    const file: File = {
      id: fileData.id,
      name: fileData.name,
      type: fileData.type,
      size: fileData.size,
      mimeType: fileData.type === 'pdf' ? 'application/pdf' : 'application/octet-stream',
      url: `/files/${fileData.id}`,
      thumbnailUrl: `/files/thumbnails/${fileData.id}.jpg`,
      collectionId: fileData.collectionId || 'default',
      owner: mockOwner,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: [],
      metadata: fileData.metadata || {}
    };

    this.files.push(file);
    return file;
  }

  async update(id: string, updates: UpdateFileDto): Promise<File> {
    const fileIndex = this.files.findIndex(f => f.id === id);
    if (fileIndex === -1) {
      throw new Error('File not found');
    }

    const existingFile = this.files[fileIndex]!;
    const updatedFile: File = {
      id: existingFile.id,
      name: updates.name ?? existingFile.name,
      type: existingFile.type,
      size: existingFile.size,
      mimeType: existingFile.mimeType,
      url: existingFile.url,
      collectionId: existingFile.collectionId,
      owner: existingFile.owner,
      createdAt: existingFile.createdAt,
      updatedAt: new Date().toISOString(),
      tags: existingFile.tags,
      metadata: { ...existingFile.metadata, ...updates.metadata }
    };

    if (existingFile.thumbnailUrl) {
      updatedFile.thumbnailUrl = existingFile.thumbnailUrl;
    }
    
    this.files[fileIndex] = updatedFile;
    return updatedFile;
  }

  async delete(id: string): Promise<void> {
    const index = this.files.findIndex(f => f.id === id);
    if (index === -1) {
      throw new Error('File not found');
    }

    this.files.splice(index, 1);
  }

  async getHistory(id: string, pagination: PaginationOptions): Promise<PaginatedResult<any>> {
    // Mock file history data
    const mockHistory = Array.from({ length: 5 }, (_, i) => ({
      id: `history_${i + 1}`,
      action: ['created', 'updated', 'viewed', 'shared'][i % 4],
      timestamp: new Date(Date.now() - randomInt(0, 86400000 * 30)).toISOString(),
      user: {
        id: `user_${i + 1}`,
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`
      },
      details: `File ${['created', 'updated', 'viewed', 'shared'][i % 4]} by user`
    }));

    const { page = 1, limit = 20 } = pagination;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const items = mockHistory.slice(startIndex, endIndex);
    const total = mockHistory.length;
    
    return {
      items,
      total,
      page,
      limit
    };
  }
}
