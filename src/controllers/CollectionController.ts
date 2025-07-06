import { Request, Response, NextFunction } from 'express';
import { BaseController } from './BaseController';
import { ICollectionService, CreateCollectionDto, UpdateCollectionDto } from '../services/interfaces/ICollectionService';
import ResponseUtil from '../utils/response';

export class CollectionController extends BaseController {
  constructor(private collectionService: ICollectionService) {
    super();
  }

  async getAllCollections(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagination = ResponseUtil.parsePagination(req.query);
      await this.executeWithPagination(
        () => this.collectionService.getAllCollections(pagination),
        res,
        'Collections retrieved successfully'
      );
    } catch (error) {
      this.handleError(error as Error, next);
    }
  }

  async getSharedCollections(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagination = ResponseUtil.parsePagination(req.query);
      const userId = req.user!.id;
      await this.executeWithPagination(
        () => this.collectionService.getSharedCollections(userId, pagination),
        res,
        'Shared collections retrieved successfully'
      );
    } catch (error) {
      this.handleError(error as Error, next);
    }
  }

  async getCollectionById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const collection = await this.collectionService.getCollectionById(id!);
      if (!collection) {
        return ResponseUtil.notFound(res);
      }
      await this.executeWithDelay(async () => collection, res, 'Collection retrieved successfully');
    } catch (error) {
      this.handleError(error as Error, next);
    }
  }

  async createCollection(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const collectionData: CreateCollectionDto = req.body;
      await this.executeWithDelay(
        () => this.collectionService.createCollection(userId, collectionData),
        res,
        'Collection created successfully',
        201
      );
    } catch (error) {
      this.handleError(error as Error, next);
    }
  }

  async updateCollection(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      const updates: UpdateCollectionDto = req.body;
      await this.executeWithDelay(
        () => this.collectionService.updateCollection(id!, userId, updates),
        res,
        'Collection updated successfully'
      );
    } catch (error) {
      this.handleError(error as Error, next);
    }
  }

  async deleteCollection(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      await this.executeWithDelay(
        () => this.collectionService.deleteCollection(id!, userId),
        res,
        'Collection deleted successfully'
      );
    } catch (error) {
      this.handleError(error as Error, next);
    }
  }

  async getCollectionFiles(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const pagination = ResponseUtil.parsePagination(req.query);
      await this.executeWithPagination(
        () => this.collectionService.getCollectionFiles(id!, pagination),
        res,
        'Collection files retrieved successfully'
      );
    } catch (error) {
      this.handleError(error as Error, next);
    }
  }

  async uploadFileToCollection(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      const { fileId } = req.body;
      await this.executeWithDelay(
        () => this.collectionService.addFileToCollection(id!, fileId, userId),
        res,
        'File added to collection successfully'
      );
    } catch (error) {
      this.handleError(error as Error, next);
    }
  }
}
