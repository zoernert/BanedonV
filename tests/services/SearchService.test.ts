/**
 * SearchService Tests
 * Comprehensive test suite for search service functionality
 */

import { SearchService } from '../../src/services/SearchService';
import { ValidationError } from '../../src/domain/errors/ValidationError';
import { SearchQuery } from '../../src/services/interfaces/ISearchService';

describe('SearchService', () => {
  let searchService: SearchService;

  beforeEach(() => {
    searchService = new SearchService();
  });

  describe('search', () => {
    it('should search with basic query', async () => {
      const searchQuery: SearchQuery = {
        query: 'test document'
      };
      const pagination = { page: 1, limit: 10 };
      
      const result = await searchService.search(searchQuery, pagination);
      
      expect(result).toHaveProperty('items');
      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('page');
      expect(result).toHaveProperty('limit');
      expect(result.items).toBeInstanceOf(Array);
      
      result.items.forEach(item => {
        expect(item).toHaveProperty('id');
        expect(item).toHaveProperty('title');
        expect(item).toHaveProperty('content');
        expect(item).toHaveProperty('type');
        expect(item).toHaveProperty('score');
        expect(item).toHaveProperty('highlights');
        expect(item).toHaveProperty('metadata');
      });
    });

    it('should throw error for empty query', async () => {
      const searchQuery: SearchQuery = {
        query: ''
      };
      const pagination = { page: 1, limit: 10 };
      
      await expect(searchService.search(searchQuery, pagination))
        .rejects
        .toThrow(ValidationError);
    });

    it('should handle pagination correctly', async () => {
      const searchQuery: SearchQuery = {
        query: 'test'
      };
      const pagination = { page: 2, limit: 5 };
      
      const result = await searchService.search(searchQuery, pagination);
      
      expect(result.page).toBe(2);
      expect(result.limit).toBe(5);
    });

    it('should search specific file type', async () => {
      const searchQuery: SearchQuery = {
        query: 'test',
        type: 'file',
        fileType: 'pdf'
      };
      const pagination = { page: 1, limit: 10 };
      
      const result = await searchService.search(searchQuery, pagination);
      
      expect(result).toHaveProperty('items');
      expect(result.items).toBeInstanceOf(Array);
    });

    it('should search within specific collection', async () => {
      const searchQuery: SearchQuery = {
        query: 'test',
        type: 'collection',
        collectionId: 'collection_1'
      };
      const pagination = { page: 1, limit: 10 };
      
      const result = await searchService.search(searchQuery, pagination);
      
      expect(result).toHaveProperty('items');
      expect(result.items).toBeInstanceOf(Array);
    });

    it('should search by owner', async () => {
      const searchQuery: SearchQuery = {
        query: 'test',
        owner: 'user_1'
      };
      const pagination = { page: 1, limit: 10 };
      
      const result = await searchService.search(searchQuery, pagination);
      
      expect(result).toHaveProperty('items');
      expect(result.items).toBeInstanceOf(Array);
    });

    it('should search by tags', async () => {
      const searchQuery: SearchQuery = {
        query: 'test',
        tags: ['important', 'document']
      };
      const pagination = { page: 1, limit: 10 };
      
      const result = await searchService.search(searchQuery, pagination);
      
      expect(result).toHaveProperty('items');
      expect(result.items).toBeInstanceOf(Array);
    });

    it('should search within date range', async () => {
      const searchQuery: SearchQuery = {
        query: 'test',
        dateRange: {
          start: '2024-01-01',
          end: '2024-12-31'
        }
      };
      const pagination = { page: 1, limit: 10 };
      
      const result = await searchService.search(searchQuery, pagination);
      
      expect(result).toHaveProperty('items');
      expect(result.items).toBeInstanceOf(Array);
    });

    it('should return results ordered by score', async () => {
      const searchQuery: SearchQuery = {
        query: 'test'
      };
      const pagination = { page: 1, limit: 10 };
      
      const result = await searchService.search(searchQuery, pagination);
      
      // Check that results are ordered by score (descending)
      if (result.items.length > 1) {
        for (let i = 1; i < result.items.length; i++) {
          expect(result.items[i]?.score).toBeLessThanOrEqual(result.items[i - 1]?.score || 1);
        }
      }
    });
  });

  describe('getSearchSuggestions', () => {
    it('should return search suggestions', async () => {
      const query = 'te';
      
      const suggestions = await searchService.getSearchSuggestions(query);
      
      expect(suggestions).toBeInstanceOf(Array);
      expect(suggestions.length).toBeGreaterThanOrEqual(0);
      
      suggestions.forEach(suggestion => {
        expect(typeof suggestion).toBe('string');
        expect(suggestion.toLowerCase()).toContain(query.toLowerCase());
      });
    });

    it('should handle empty query', async () => {
      const suggestions = await searchService.getSearchSuggestions('');
      
      expect(suggestions).toBeInstanceOf(Array);
      expect(suggestions.length).toBe(0);
    });

    it('should return limited suggestions', async () => {
      const query = 'test';
      
      const suggestions = await searchService.getSearchSuggestions(query);
      
      expect(suggestions.length).toBeLessThanOrEqual(10); // Assuming default limit
    });
  });

  describe('saveSearch', () => {
    it('should save search query', async () => {
      const userId = 'user_1';
      const query = 'test query';
      
      await expect(searchService.saveSearch(userId, query))
        .resolves
        .not
        .toThrow();
    });

    it('should throw error for empty user ID', async () => {
      const query = 'test query';
      
      await expect(searchService.saveSearch('', query))
        .rejects
        .toThrow(ValidationError);
    });

    it('should throw error for empty query', async () => {
      const userId = 'user_1';
      
      await expect(searchService.saveSearch(userId, ''))
        .rejects
        .toThrow(ValidationError);
    });
  });

  describe('getSearchHistory', () => {
    it('should return search history', async () => {
      const userId = 'user_1';
      const pagination = { page: 1, limit: 10 };
      
      // First save some searches
      await searchService.saveSearch(userId, 'query1');
      await searchService.saveSearch(userId, 'query2');
      
      const history = await searchService.getSearchHistory(userId, pagination);
      
      expect(history).toHaveProperty('items');
      expect(history).toHaveProperty('total');
      expect(history).toHaveProperty('page');
      expect(history).toHaveProperty('limit');
      expect(history.items).toBeInstanceOf(Array);
    });

    it('should handle pagination correctly', async () => {
      const userId = 'user_1';
      const pagination = { page: 2, limit: 5 };
      
      const history = await searchService.getSearchHistory(userId, pagination);
      
      expect(history.page).toBe(2);
      expect(history.limit).toBe(5);
    });

    it('should throw error for empty user ID', async () => {
      const pagination = { page: 1, limit: 10 };
      
      await expect(searchService.getSearchHistory('', pagination))
        .rejects
        .toThrow(ValidationError);
    });

    it('should handle user without search history', async () => {
      const userId = 'user_without_history';
      const pagination = { page: 1, limit: 10 };
      
      const history = await searchService.getSearchHistory(userId, pagination);
      
      expect(history).toHaveProperty('items');
      expect(history.items).toBeInstanceOf(Array);
      expect(history.total).toBeGreaterThanOrEqual(0);
    });
  });

  describe('complex search scenarios', () => {
    it('should handle complex search with multiple filters', async () => {
      const searchQuery: SearchQuery = {
        query: 'important document',
        type: 'file',
        fileType: 'pdf',
        tags: ['important', 'business'],
        owner: 'user_1',
        dateRange: {
          start: '2024-01-01',
          end: '2024-12-31'
        }
      };
      const pagination = { page: 1, limit: 10 };
      
      const result = await searchService.search(searchQuery, pagination);
      
      expect(result).toHaveProperty('items');
      expect(result.items).toBeInstanceOf(Array);
    });

    it('should return relevant results with highlights', async () => {
      const searchQuery: SearchQuery = {
        query: 'test document'
      };
      const pagination = { page: 1, limit: 10 };
      
      const result = await searchService.search(searchQuery, pagination);
      
      result.items.forEach(item => {
        expect(item.highlights).toBeInstanceOf(Array);
        expect(item.highlights.length).toBeGreaterThan(0);
        expect(item.score).toBeGreaterThan(0);
        expect(item.score).toBeLessThanOrEqual(1);
      });
    });
  });
});
