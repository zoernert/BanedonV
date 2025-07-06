import { IFileService, CreateFileDto, UpdateFileDto } from './interfaces/IFileService';
import { IFileRepository } from '../repositories/interfaces/IFileRepository';
import { File } from '../domain/models/File';
import { ValidationError } from '../domain/errors/ValidationError';
import { ErrorCodes } from '../domain/errors/ErrorCodes';
import { generateId } from '../utils/id.util';
import { PaginationOptions, PaginatedResult } from '../domain/types';
import logger from '../utils/logger';

export class FileService implements IFileService {
  constructor(private fileRepository: IFileRepository) {}

  async getAllFiles(pagination: PaginationOptions): Promise<PaginatedResult<File>> {
    try {
      return await this.fileRepository.findAll(pagination);
    } catch (error) {
      logger.error('Error getting files', { error });
      throw error;
    }
  }

  async getFileById(id: string): Promise<File | null> {
    if (!id) {
      throw new ValidationError(ErrorCodes.VALIDATION.REQUIRED_FIELD, 'File ID is required');
    }

    try {
      return await this.fileRepository.findById(id);
    } catch (error) {
      logger.error('Error getting file by ID', { id, error });
      throw error;
    }
  }

  async getRecentFiles(userId: string, limit: number = 10): Promise<File[]> {
    if (!userId) {
      throw new ValidationError(ErrorCodes.VALIDATION.REQUIRED_FIELD, 'User ID is required');
    }

    try {
      return await this.fileRepository.findRecent(userId, limit);
    } catch (error) {
      logger.error('Error getting recent files', { userId, error });
      throw error;
    }
  }

  async uploadFile(userId: string, fileData: CreateFileDto): Promise<File> {
    if (!userId) {
      throw new ValidationError(ErrorCodes.VALIDATION.REQUIRED_FIELD, 'User ID is required');
    }

    if (!fileData.name || !fileData.type) {
      throw new ValidationError(ErrorCodes.VALIDATION.REQUIRED_FIELD, 'File name and type are required');
    }

    try {
      const file = await this.fileRepository.create({
        ...fileData,
        id: generateId('file'),
        ownerId: userId
      });

      logger.info('File uploaded', { fileId: file.id, userId, fileName: file.name });
      return file;
    } catch (error) {
      logger.error('Error uploading file', { userId, fileData, error });
      throw error;
    }
  }

  async updateFile(id: string, userId: string, updates: UpdateFileDto): Promise<File> {
    if (!id) {
      throw new ValidationError(ErrorCodes.VALIDATION.REQUIRED_FIELD, 'File ID is required');
    }

    if (!userId) {
      throw new ValidationError(ErrorCodes.VALIDATION.REQUIRED_FIELD, 'User ID is required');
    }

    try {
      const existingFile = await this.fileRepository.findById(id);
      if (!existingFile) {
        throw new ValidationError(ErrorCodes.VALIDATION.REQUIRED_FIELD, 'File not found');
      }

      // Check if user owns the file or is admin
      if (existingFile.owner.id !== userId && existingFile.owner.role !== 'admin') {
        throw new ValidationError(ErrorCodes.AUTH.FORBIDDEN, 'You do not have permission to update this file');
      }

      const updatedFile = await this.fileRepository.update(id, updates);
      logger.info('File updated', { fileId: id, userId });
      return updatedFile;
    } catch (error) {
      logger.error('Error updating file', { id, userId, updates, error });
      throw error;
    }
  }

  async deleteFile(id: string, userId: string): Promise<void> {
    if (!id) {
      throw new ValidationError(ErrorCodes.VALIDATION.REQUIRED_FIELD, 'File ID is required');
    }

    if (!userId) {
      throw new ValidationError(ErrorCodes.VALIDATION.REQUIRED_FIELD, 'User ID is required');
    }

    try {
      const existingFile = await this.fileRepository.findById(id);
      if (!existingFile) {
        throw new ValidationError(ErrorCodes.VALIDATION.REQUIRED_FIELD, 'File not found');
      }

      // Check if user owns the file or is admin
      if (existingFile.owner.id !== userId && existingFile.owner.role !== 'admin') {
        throw new ValidationError(ErrorCodes.AUTH.FORBIDDEN, 'You do not have permission to delete this file');
      }

      await this.fileRepository.delete(id);
      logger.info('File deleted', { fileId: id, userId });
    } catch (error) {
      logger.error('Error deleting file', { id, userId, error });
      throw error;
    }
  }

  async getFilePreview(id: string): Promise<string | null> {
    if (!id) {
      throw new ValidationError(ErrorCodes.VALIDATION.REQUIRED_FIELD, 'File ID is required');
    }

    try {
      const file = await this.fileRepository.findById(id);
      if (!file) {
        return null;
      }

      // Return preview URL or thumbnail
      return file.thumbnailUrl || file.url;
    } catch (error) {
      logger.error('Error getting file preview', { id, error });
      throw error;
    }
  }

  async getFileHistory(id: string, pagination: PaginationOptions): Promise<PaginatedResult<any>> {
    if (!id) {
      throw new ValidationError(ErrorCodes.VALIDATION.REQUIRED_FIELD, 'File ID is required');
    }

    try {
      return await this.fileRepository.getHistory(id, pagination);
    } catch (error) {
      logger.error('Error getting file history', { id, error });
      throw error;
    }
  }
}
