/**
 * Search Routes
 * Search functionality endpoints
 */

import { Router, Request, Response } from 'express';
import { AuthMiddleware } from '../middleware/auth';
import { ValidationMiddleware } from '../middleware/validation';
import ResponseUtil from '../utils/response';
import logger from '../utils/logger';

const router = Router();

/**
 * Search across all content
 */
router.get('/', 
  AuthMiddleware.authenticate,
  ValidationMiddleware.common.validatePagination,
  async (req: Request, res: Response) => {
    try {
      const { q: query, type, owner, tags, fileType, dateRange } = req.query;
      const { page = 1, limit = 20 } = ResponseUtil.parsePagination(req.query);
      
      if (!query) {
        return ResponseUtil.error(res, 'QUERY_REQUIRED', 'Search query is required', 400);
      }
      
      await ResponseUtil.withDelay(async () => {
        // Mock search results
        const mockResults = [
          // File results
          ...Array.from({ length: 15 }, (_, i) => ({
            id: `file_${i + 1}`,
            title: `Document ${i + 1} - ${query}`,
            content: `This document contains relevant information about ${query}. It has been indexed and can be found through search.`,
            type: 'file' as const,
            score: Math.random() * 0.5 + 0.5, // Score between 0.5 and 1.0
            highlights: [`...contains ${query}...`, `...information about ${query}...`],
            metadata: {
              fileName: `document_${i + 1}.pdf`,
              fileType: 'pdf',
              size: Math.floor(Math.random() * 10000000),
              collectionId: `collection_${Math.floor(i / 3) + 1}`,
              collectionName: `Collection ${Math.floor(i / 3) + 1}`,
              owner: {
                id: `user_${Math.floor(i / 5) + 1}`,
                name: `User ${Math.floor(i / 5) + 1}`,
                email: `user${Math.floor(i / 5) + 1}@example.com`
              },
              createdAt: new Date(Date.now() - Math.random() * 86400000 * 30).toISOString(),
              tags: [`tag${i % 5 + 1}`]
            }
          })),
          // Collection results
          ...Array.from({ length: 5 }, (_, i) => ({
            id: `collection_${i + 1}`,
            title: `Collection ${i + 1} - ${query}`,
            content: `This collection contains documents related to ${query}. It has multiple files and is well organized.`,
            type: 'collection' as const,
            score: Math.random() * 0.3 + 0.7, // Score between 0.7 and 1.0
            highlights: [`...related to ${query}...`],
            metadata: {
              collectionType: 'private',
              fileCount: Math.floor(Math.random() * 50) + 1,
              size: Math.floor(Math.random() * 1000000000),
              owner: {
                id: `user_${Math.floor(i / 2) + 1}`,
                name: `User ${Math.floor(i / 2) + 1}`,
                email: `user${Math.floor(i / 2) + 1}@example.com`
              },
              createdAt: new Date(Date.now() - Math.random() * 86400000 * 90).toISOString(),
              tags: [`collection-tag${i + 1}`]
            }
          })),
          // User results (if admin)
          ...(req.user?.role === 'admin' ? Array.from({ length: 3 }, (_, i) => ({
            id: `user_${i + 1}`,
            title: `User ${i + 1} - ${query}`,
            content: `User profile that matches the search query ${query}. This user has been active recently.`,
            type: 'user' as const,
            score: Math.random() * 0.2 + 0.8, // Score between 0.8 and 1.0
            highlights: [`...matches ${query}...`],
            metadata: {
              email: `user${i + 1}@example.com`,
              role: ['admin', 'manager', 'user'][i % 3],
              lastLogin: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
              createdAt: new Date(Date.now() - Math.random() * 86400000 * 365).toISOString(),
              collectionsCount: Math.floor(Math.random() * 20),
              filesCount: Math.floor(Math.random() * 100)
            }
          })) : [])
        ];
        
        // Apply filters
        let filteredResults = mockResults;
        
        if (type) {
          filteredResults = filteredResults.filter(result => result.type === type);
        }
        
        if (owner) {
          filteredResults = filteredResults.filter(result => {
            const metadata = result.metadata as any;
            return metadata.owner?.id === owner || metadata.owner?.email === owner;
          });
        }
        
        if (tags) {
          const tagArray = Array.isArray(tags) ? tags : [tags];
          filteredResults = filteredResults.filter(result => {
            const metadata = result.metadata as any;
            return metadata.tags?.some((tag: string) => tagArray.includes(tag));
          });
        }
        
        if (fileType && type === 'file') {
          filteredResults = filteredResults.filter(result => {
            const metadata = result.metadata as any;
            return metadata.fileType === fileType;
          });
        }
        
        // Sort by score
        filteredResults.sort((a, b) => b.score - a.score);
        
        const { items, total } = ResponseUtil.paginateArray(filteredResults, page, limit);
        
        logger.info('Search completed', {
          query,
          type,
          owner,
          tags,
          fileType,
          total,
          page,
          limit,
          requestId: req.requestId,
          userId: req.user?.id
        });
        
        return ResponseUtil.success(res, items, 'Search completed successfully', 200, {
          page,
          limit,
          total
        });
      });
      });
    } catch (error) {
      logger.error('Search error', { error: (error as Error).message, requestId: req.requestId });
      ResponseUtil.internalServerError(res, 'Search failed');
    }
  }
);

export default router;
