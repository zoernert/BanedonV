import { Request, Response, NextFunction } from 'express';
import { SearchController } from '../../src/controllers/SearchController';
import { ISearchService } from '../../src/services/interfaces/ISearchService';
import { AuthUser } from '../../src/domain/models/AuthUser';

describe('SearchController', () => {
  let searchController: SearchController;
  let mockSearchService: jest.Mocked<ISearchService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockSearchService = {
      search: jest.fn(),
      getSearchSuggestions: jest.fn(),
      saveSearch: jest.fn(),
      getSearchHistory: jest.fn()
    };

    searchController = new SearchController(mockSearchService);

    // Mock Express request/response
    mockRequest = {
      params: {},
      query: {},
      body: {},
      user: {
        id: 'user_1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
        active: true,
        createdAt: '2023-01-01T00:00:00.000Z'
      } as AuthUser
    } as Partial<Request>;

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis()
    };

    mockNext = jest.fn();
  });

  describe('search', () => {
    it('should perform search successfully', async () => {
      const mockResults = {
        items: [
          { id: 'result_1', title: 'Test Result' }
        ],
        total: 1,
        page: 1,
        limit: 10
      };

      mockRequest.query = { q: 'test query', page: '1', limit: '10' };
      mockSearchService.search.mockResolvedValue(mockResults as any);

      await searchController.search(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockSearchService.search).toHaveBeenCalledWith(
        { query: 'test query' },
        { page: 1, limit: 10 }
      );
    });

    it('should handle search errors', async () => {
      const error = new Error('Search failed');
      mockRequest.query = { q: 'test' };
      mockSearchService.search.mockRejectedValue(error);

      await searchController.search(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('saveSearch', () => {
    it('should save search successfully', async () => {
      mockRequest.body = { query: 'test query' };
      mockSearchService.saveSearch.mockResolvedValue();

      await searchController.saveSearch(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockSearchService.saveSearch).toHaveBeenCalledWith('user_1', 'test query');
    });

    it('should handle save errors', async () => {
      const error = new Error('Save failed');
      mockRequest.body = { query: 'test' };
      mockSearchService.saveSearch.mockRejectedValue(error);

      await searchController.saveSearch(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getSearchHistory', () => {
    it('should return search history', async () => {
      const mockHistory = {
        items: [
          { id: 'search_1', query: 'test' }
        ],
        total: 1,
        page: 1,
        limit: 10
      };

      mockRequest.query = { page: '1', limit: '10' };
      mockSearchService.getSearchHistory.mockResolvedValue(mockHistory as any);

      await searchController.getSearchHistory(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockSearchService.getSearchHistory).toHaveBeenCalledWith('user_1', { page: 1, limit: 10 });
    });

    it('should handle history errors', async () => {
      const error = new Error('History failed');
      mockSearchService.getSearchHistory.mockRejectedValue(error);

      await searchController.getSearchHistory(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
