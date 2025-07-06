import { Request, Response, NextFunction } from 'express';
import { BaseController } from './BaseController';
import { ISearchService, SearchQuery } from '../services/interfaces/ISearchService';
import ResponseUtil from '../utils/response';

export class SearchController extends BaseController {
  constructor(private searchService: ISearchService) {
    super();
  }

  async search(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {
        q: query,
        type,
        owner,
        tags,
        fileType,
        dateRange,
        collectionId
      } = req.query as any;

      const searchQuery: SearchQuery = {
        query,
        type,
        owner,
        fileType,
        dateRange: dateRange ? JSON.parse(dateRange) : undefined,
        collectionId
      };

      if (tags) {
        searchQuery.tags = Array.isArray(tags) ? tags : [tags];
      }

      const pagination = ResponseUtil.parsePagination(req.query);
      await this.executeWithPagination(
        () => this.searchService.search(searchQuery, pagination),
        res,
        'Search completed successfully'
      );
    } catch (error) {
      this.handleError(error as Error, next);
    }
  }

  async getSearchSuggestions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { q: query } = req.query as any;
      await this.executeWithDelay(
        () => this.searchService.getSearchSuggestions(query),
        res,
        'Search suggestions retrieved successfully'
      );
    } catch (error) {
      this.handleError(error as Error, next);
    }
  }

  async saveSearch(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { query } = req.body;
      await this.executeWithDelay(
        () => this.searchService.saveSearch(userId, query),
        res,
        'Search saved successfully'
      );
    } catch (error) {
      this.handleError(error as Error, next);
    }
  }

  async getSearchHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const pagination = ResponseUtil.parsePagination(req.query);
      await this.executeWithPagination(
        () => this.searchService.getSearchHistory(userId, pagination),
        res,
        'Search history retrieved successfully'
      );
    } catch (error) {
      this.handleError(error as Error, next);
    }
  }
}
