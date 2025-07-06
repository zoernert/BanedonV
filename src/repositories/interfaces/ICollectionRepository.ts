import { Collection } from '../../domain/models/Collection';
import { CreateCollectionDto, UpdateCollectionDto } from '../../services/interfaces/ICollectionService';
import { PaginationOptions, PaginatedResult } from '../../domain/types';

export interface ICollectionRepository {
  findAll(pagination: PaginationOptions): Promise<PaginatedResult<Collection>>;
  findById(id: string): Promise<Collection | null>;
  findByOwnerId(ownerId: string, pagination: PaginationOptions): Promise<PaginatedResult<Collection>>;
  findSharedWithUser(userId: string, pagination: PaginationOptions): Promise<PaginatedResult<Collection>>;
  create(collection: CreateCollectionDto & { id: string; ownerId: string }): Promise<Collection>;
  update(id: string, updates: UpdateCollectionDto): Promise<Collection>;
  delete(id: string): Promise<void>;
  addFile(collectionId: string, fileId: string): Promise<void>;
  removeFile(collectionId: string, fileId: string): Promise<void>;
  getFiles(collectionId: string, pagination: PaginationOptions): Promise<PaginatedResult<any>>;
}
