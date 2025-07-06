import { PaginationOptions, PaginatedResult } from '../../domain/types';

export interface SearchQuery {
  query: string;
  type?: 'file' | 'collection' | 'user';
  collectionId?: string;
  owner?: string;
  tags?: string[];
  fileType?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface SearchResult {
  id: string;
  title: string;
  content: string;
  type: 'file' | 'collection' | 'user';
  score: number;
  highlights: string[];
  metadata: Record<string, any>;
}

export interface ISearchService {
  search(searchQuery: SearchQuery, pagination: PaginationOptions): Promise<PaginatedResult<SearchResult>>;
  getSearchSuggestions(query: string): Promise<string[]>;
  saveSearch(userId: string, query: string): Promise<void>;
  getSearchHistory(userId: string, pagination: PaginationOptions): Promise<PaginatedResult<any>>;
}
