import { File } from '../../domain/models/File';
import { CreateFileDto, UpdateFileDto } from '../../services/interfaces/IFileService';
import { PaginationOptions, PaginatedResult } from '../../domain/types';

export interface IFileRepository {
  findAll(pagination: PaginationOptions): Promise<PaginatedResult<File>>;
  findById(id: string): Promise<File | null>;
  findByCollectionId(collectionId: string, pagination: PaginationOptions): Promise<PaginatedResult<File>>;
  findByOwnerId(ownerId: string, pagination: PaginationOptions): Promise<PaginatedResult<File>>;
  findRecent(userId: string, limit: number): Promise<File[]>;
  create(file: CreateFileDto & { id: string; ownerId: string }): Promise<File>;
  update(id: string, updates: UpdateFileDto): Promise<File>;
  delete(id: string): Promise<void>;
  getHistory(id: string, pagination: PaginationOptions): Promise<PaginatedResult<any>>;
}
