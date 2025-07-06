import { File } from '../../domain/models/File';
import { PaginationOptions, PaginatedResult } from '../../domain/types';

export interface CreateFileDto {
  name: string;
  type: string;
  size: number;
  collectionId?: string;
  content?: string;
  metadata?: Record<string, any>;
}

export interface UpdateFileDto {
  name?: string;
  content?: string;
  metadata?: Record<string, any>;
}

export interface FileResult {
  file: File;
  message?: string;
}

export interface IFileService {
  getAllFiles(pagination: PaginationOptions): Promise<PaginatedResult<File>>;
  getFileById(id: string): Promise<File | null>;
  getRecentFiles(userId: string, limit?: number): Promise<File[]>;
  uploadFile(userId: string, fileData: CreateFileDto): Promise<File>;
  updateFile(id: string, userId: string, updates: UpdateFileDto): Promise<File>;
  deleteFile(id: string, userId: string): Promise<void>;
  getFilePreview(id: string): Promise<string | null>;
  getFileHistory(id: string, pagination: PaginationOptions): Promise<PaginatedResult<any>>;
}
