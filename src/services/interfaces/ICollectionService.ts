import { Collection } from '../../domain/models/Collection';
import { PaginationOptions, PaginatedResult } from '../../domain/types';

export interface CreateCollectionDto {
  name: string;
  description?: string;
  type: 'private' | 'shared' | 'public';
  tags?: string[];
}

export interface UpdateCollectionDto {
  name?: string;
  description?: string;
  type?: 'private' | 'shared' | 'public';
  tags?: string[];
}

export interface CollectionResult {
  collection: Collection;
  message?: string;
}

export interface ICollectionService {
  getAllCollections(pagination: PaginationOptions): Promise<PaginatedResult<Collection>>;
  getCollectionById(id: string): Promise<Collection | null>;
  getSharedCollections(userId: string, pagination: PaginationOptions): Promise<PaginatedResult<Collection>>;
  createCollection(userId: string, collectionData: CreateCollectionDto): Promise<Collection>;
  updateCollection(id: string, userId: string, updates: UpdateCollectionDto): Promise<Collection>;
  deleteCollection(id: string, userId: string): Promise<void>;
  getCollectionFiles(id: string, pagination: PaginationOptions): Promise<PaginatedResult<any>>;
  addFileToCollection(collectionId: string, fileId: string, userId: string): Promise<void>;
  removeFileFromCollection(collectionId: string, fileId: string, userId: string): Promise<void>;
}
