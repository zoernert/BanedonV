import { ICollectionService, CollectionResult, CreateCollectionDto, UpdateCollectionDto } from './interfaces/ICollectionService';
import { ICollectionRepository } from '../repositories/interfaces/ICollectionRepository';
import { Collection } from '../domain/models/Collection';
import { ValidationError } from '../domain/errors/ValidationError';
import { ErrorCodes } from '../domain/errors/ErrorCodes';
import { generateId } from '../utils/id.util';
import { PaginationOptions, PaginatedResult } from '../domain/types';
import logger from '../utils/logger';

export class CollectionService implements ICollectionService {
  constructor(private collectionRepository: ICollectionRepository) {}

  async getAllCollections(pagination: PaginationOptions): Promise<PaginatedResult<Collection>> {
    try {
      return await this.collectionRepository.findAll(pagination);
    } catch (error) {
      logger.error('Error getting collections', { error });
      throw error;
    }
  }

  async getCollectionById(id: string): Promise<Collection | null> {
    if (!id) {
      throw new ValidationError(ErrorCodes.VALIDATION.REQUIRED_FIELD, 'Collection ID is required');
    }

    try {
      return await this.collectionRepository.findById(id);
    } catch (error) {
      logger.error('Error getting collection by ID', { id, error });
      throw error;
    }
  }

  async createCollection(userId: string, collectionData: CreateCollectionDto): Promise<Collection> {
    if (!userId) {
      throw new ValidationError(ErrorCodes.VALIDATION.REQUIRED_FIELD, 'User ID is required');
    }

    try {
      const collection = await this.collectionRepository.create({
        ...collectionData,
        ownerId: userId,
        id: generateId('collection')
      });

      logger.info('Collection created', { collectionId: collection.id, userId });
      return collection;
    } catch (error) {
      logger.error('Error creating collection', { userId, error });
      throw error;
    }
  }

  async updateCollection(id: string, userId: string, updates: UpdateCollectionDto): Promise<Collection> {
    if (!id || !userId) {
      throw new ValidationError(ErrorCodes.VALIDATION.REQUIRED_FIELD, 'Collection ID and User ID are required');
    }

    try {
      const collection = await this.collectionRepository.findById(id);
      if (!collection) {
        throw new ValidationError(ErrorCodes.VALIDATION.NOT_FOUND, 'Collection not found');
      }

      // Check if user owns the collection or has permission
      if (collection.owner.id !== userId) {
        throw new ValidationError(ErrorCodes.VALIDATION.FORBIDDEN, 'You do not have permission to update this collection');
      }

      const updatedCollection = await this.collectionRepository.update(id, updates);
      logger.info('Collection updated', { collectionId: id, userId });
      return updatedCollection;
    } catch (error) {
      logger.error('Error updating collection', { id, userId, error });
      throw error;
    }
  }

  async deleteCollection(id: string, userId: string): Promise<void> {
    if (!id || !userId) {
      throw new ValidationError(ErrorCodes.VALIDATION.REQUIRED_FIELD, 'Collection ID and User ID are required');
    }

    try {
      const collection = await this.collectionRepository.findById(id);
      if (!collection) {
        throw new ValidationError(ErrorCodes.VALIDATION.NOT_FOUND, 'Collection not found');
      }

      // Check if user owns the collection or has permission
      if (collection.owner.id !== userId) {
        throw new ValidationError(ErrorCodes.VALIDATION.FORBIDDEN, 'You do not have permission to delete this collection');
      }

      await this.collectionRepository.delete(id);
      logger.info('Collection deleted', { collectionId: id, userId });
    } catch (error) {
      logger.error('Error deleting collection', { id, userId, error });
      throw error;
    }
  }

  async getSharedCollections(userId: string, pagination: PaginationOptions): Promise<PaginatedResult<Collection>> {
    if (!userId) {
      throw new ValidationError(ErrorCodes.VALIDATION.REQUIRED_FIELD, 'User ID is required');
    }

    try {
      return await this.collectionRepository.findSharedWithUser(userId, pagination);
    } catch (error) {
      logger.error('Error getting shared collections', { userId, error });
      throw error;
    }
  }

  async getCollectionFiles(id: string, pagination: PaginationOptions): Promise<PaginatedResult<any>> {
    if (!id) {
      throw new ValidationError(ErrorCodes.VALIDATION.REQUIRED_FIELD, 'Collection ID is required');
    }

    try {
      const collection = await this.collectionRepository.findById(id);
      if (!collection) {
        throw new ValidationError(ErrorCodes.VALIDATION.REQUIRED_FIELD, 'Collection not found');
      }

      return await this.collectionRepository.getFiles(id, pagination);
    } catch (error) {
      logger.error('Error getting collection files', { id, error });
      throw error;
    }
  }

  async addFileToCollection(collectionId: string, fileId: string, userId: string): Promise<void> {
    if (!collectionId || !fileId || !userId) {
      throw new ValidationError(ErrorCodes.VALIDATION.REQUIRED_FIELD, 'Collection ID, File ID, and User ID are required');
    }

    try {
      const collection = await this.collectionRepository.findById(collectionId);
      if (!collection) {
        throw new ValidationError(ErrorCodes.VALIDATION.REQUIRED_FIELD, 'Collection not found');
      }

      // Check if user has permission to add files to this collection
      if (collection.owner.id !== userId && collection.owner.role !== 'admin') {
        throw new ValidationError(ErrorCodes.AUTH.FORBIDDEN, 'You do not have permission to add files to this collection');
      }

      await this.collectionRepository.addFile(collectionId, fileId);
      logger.info('File added to collection', { collectionId, fileId, userId });
    } catch (error) {
      logger.error('Error adding file to collection', { collectionId, fileId, userId, error });
      throw error;
    }
  }

  async removeFileFromCollection(collectionId: string, fileId: string, userId: string): Promise<void> {
    if (!collectionId || !fileId || !userId) {
      throw new ValidationError(ErrorCodes.VALIDATION.REQUIRED_FIELD, 'Collection ID, File ID, and User ID are required');
    }

    try {
      const collection = await this.collectionRepository.findById(collectionId);
      if (!collection) {
        throw new ValidationError(ErrorCodes.VALIDATION.REQUIRED_FIELD, 'Collection not found');
      }

      // Check if user has permission to remove files from this collection
      if (collection.owner.id !== userId && collection.owner.role !== 'admin') {
        throw new ValidationError(ErrorCodes.AUTH.FORBIDDEN, 'You do not have permission to remove files from this collection');
      }

      await this.collectionRepository.removeFile(collectionId, fileId);
      logger.info('File removed from collection', { collectionId, fileId, userId });
    } catch (error) {
      logger.error('Error removing file from collection', { collectionId, fileId, userId, error });
      throw error;
    }
  }
}
