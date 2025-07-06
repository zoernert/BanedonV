import { Request, Response, NextFunction } from 'express';
import { BaseController } from './BaseController';
import { IFileService, CreateFileDto, UpdateFileDto } from '../services/interfaces/IFileService';
import ResponseUtil from '../utils/response';

export class FileController extends BaseController {
  constructor(private fileService: IFileService) {
    super();
  }

  async getAllFiles(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagination = ResponseUtil.parsePagination(req.query);
      await this.executeWithPagination(
        () => this.fileService.getAllFiles(pagination),
        res,
        'Files retrieved successfully'
      );
    } catch (error) {
      this.handleError(error as Error, next);
    }
  }

  async getRecentFiles(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      await this.executeWithDelay(
        () => this.fileService.getRecentFiles(userId, limit),
        res,
        'Recent files retrieved successfully'
      );
    } catch (error) {
      this.handleError(error as Error, next);
    }
  }

  async getFileById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const file = await this.fileService.getFileById(id!);
      if (!file) {
        return ResponseUtil.notFound(res);
      }
      await this.executeWithDelay(async () => file, res, 'File retrieved successfully');
    } catch (error) {
      this.handleError(error as Error, next);
    }
  }

  async uploadFile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const fileData: CreateFileDto = req.body;
      await this.executeWithDelay(
        () => this.fileService.uploadFile(userId, fileData),
        res,
        'File uploaded successfully',
        201
      );
    } catch (error) {
      this.handleError(error as Error, next);
    }
  }

  async updateFile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      const updates: UpdateFileDto = req.body;
      await this.executeWithDelay(
        () => this.fileService.updateFile(id!, userId, updates),
        res,
        'File updated successfully'
      );
    } catch (error) {
      this.handleError(error as Error, next);
    }
  }

  async deleteFile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      await this.executeWithDelay(
        () => this.fileService.deleteFile(id!, userId),
        res,
        'File deleted successfully'
      );
    } catch (error) {
      this.handleError(error as Error, next);
    }
  }

  async getFilePreview(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const previewUrl = await this.fileService.getFilePreview(id!);
      if (!previewUrl) {
        return ResponseUtil.notFound(res);
      }
      await this.executeWithDelay(async () => ({ previewUrl }), res, 'File preview retrieved successfully');
    } catch (error) {
      this.handleError(error as Error, next);
    }
  }

  async getFileHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const pagination = ResponseUtil.parsePagination(req.query);
      await this.executeWithPagination(
        () => this.fileService.getFileHistory(id!, pagination),
        res,
        'File history retrieved successfully'
      );
    } catch (error) {
      this.handleError(error as Error, next);
    }
  }
}
