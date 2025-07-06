/**
 * Search Routes
 * Search functionality endpoints
 */

import { Router, Request, Response, NextFunction } from 'express';
import { AuthMiddleware } from '../middleware/auth';
import { ErrorMiddleware } from '../middleware/error';
import { ValidationMiddleware } from '../middleware/validation';
import ResponseUtil from '../utils/response';
import logger from '../utils/logger';
import { randomFloat, randomInt } from '../utils/number.util';

const router = Router();

/**
 * Search across all content
 */
router.get('/', 
  AuthMiddleware.mockAuthenticate,
  ValidationMiddleware.common.validateSearchQuery,
  ErrorMiddleware.asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { q: query, type, owner, tags, fileType, dateRange, page, limit, collectionId } = req.query as any;
      
      await ResponseUtil.withDelay(async () => {
        // Mock search results
        const mockResults = [
          // File results
          ...Array.from({ length: 15 }, (_, i) => ({
            id: `file_${i + 1}`,
            title: `Document ${i + 1} - ${query}`,
            content: `This document contains relevant information about ${query}. It has been indexed and can be found through search.`,
            type: 'file' as const,
            score: randomFloat(0.5, 1.0), // Score between 0.5 and 1.0
            highlights: [`...contains ${query}...`, `...information about ${query}...`],
            metadata: {
              fileName: `document_${i + 1}.pdf`,
              fileType: 'pdf',
              size: randomInt(0, 9999999),
              collectionId: `collection_${Math.floor(i / 3) + 1}`,
              collectionName: `Collection ${Math.floor(i / 3) + 1}`,
              owner: {
                id: `user_${Math.floor(i / 5) + 1}`,
                name: `User ${Math.floor(i / 5) + 1}`,
                email: `user${Math.floor(i / 5) + 1}@example.com`
              },
              createdAt: new Date(Date.now() - randomFloat(0, 86400000 * 30)).toISOString(),
              tags: [`tag${i % 5 + 1}`]
            }
          })),
          // Collection results
          ...Array.from({ length: 5 }, (_, i) => ({
            id: `collection_${i + 1}`,
            title: `Collection ${i + 1} - ${query}`,
            content: `This collection contains documents related to ${query}. It has multiple files and is well organized.`,
            type: 'collection' as const,
            score: randomFloat(0.7, 1.0), // Score between 0.7 and 1.0
            highlights: [`...related to ${query}...`],
            metadata: {
              collectionType: 'private',
              fileCount: randomInt(1, 50),
              size: randomInt(0, 999999999),
              owner: {
                id: `user_${Math.floor(i / 2) + 1}`,
                name: `User ${Math.floor(i / 2) + 1}`,
                email: `user${Math.floor(i / 2) + 1}@example.com`
              },
              createdAt: new Date(Date.now() - randomFloat(0, 86400000 * 90)).toISOString(),
              tags: [`collection-tag${i + 1}`]
            }
          })),
          // User results (if admin)
          ...(req.user?.role === 'admin' ? Array.from({ length: 3 }, (_, i) => ({
            id: `user_${i + 1}`,
            title: `User ${i + 1} - ${query}`,
            content: `User profile that matches the search query ${query}. This user has been active recently.`,
            type: 'user' as const,
            score: randomFloat(0.8, 1.0), // Score between 0.8 and 1.0
            highlights: [`...matches ${query}...`],
            metadata: {
              email: `user${i + 1}@example.com`,
              role: ['admin', 'manager', 'user'][i % 3],
              lastLogin: new Date(Date.now() - randomFloat(0, 86400000 * 7)).toISOString(),
              createdAt: new Date(Date.now() - randomFloat(0, 86400000 * 365)).toISOString(),
              collectionsCount: randomInt(0, 19),
              filesCount: randomInt(0, 99)
            }
          })) : [])
        ];
        
        // Apply filters
        let filteredResults = mockResults;
        
        if (collectionId) {
          filteredResults = filteredResults.filter(result => 
            result.type === 'file' && (result.metadata as any).collectionId === collectionId
          );
        }
        
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
        
        if (dateRange) {
          const now = new Date();
          const daysMatch = (dateRange as string).match(/^(\d+)d$/);
          if (daysMatch && daysMatch[1]) {
            const days = parseInt(daysMatch[1], 10);
            const startDate = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000));
            const startDateISO = startDate.toISOString();

            filteredResults = filteredResults.filter(result => {
              const metadata = result.metadata as any;
              return metadata.createdAt && metadata.createdAt >= startDateISO;
            });
          }
        }
        
        // Sort by score
        filteredResults.sort((a, b) => b.score - a.score);
        
        const { items, total } = ResponseUtil.paginateArray(filteredResults, page, limit);
        
        logger.info('Search completed', {
          query,
          type,
          collectionId,
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
  })
);

/**
 * Get search filters
 */
router.get('/filters',
  AuthMiddleware.mockAuthenticate,
  ErrorMiddleware.asyncHandler(async (req: Request, res: Response) => {
    // In a real app, these would be aggregated from the database
    const mockFilters = {
      fileTypes: ['pdf', 'docx', 'xlsx', 'pptx', 'txt', 'md'],
      tags: ['important', 'project-x', 'research', 'draft', 'final', 'tech'],
      dateRanges: [
        { label: 'Past 24 hours', value: '1d' },
        { label: 'Past week', value: '7d' },
        { label: 'Past month', value: '30d' },
        { label: 'Past year', value: '365d' }
      ]
    };

    await ResponseUtil.withDelay(async () => {
      ResponseUtil.success(res, mockFilters, 'Filters retrieved successfully');
    });
  })
);

/**
 * Get search suggestions
 */
router.get('/suggestions',
  AuthMiddleware.mockAuthenticate,
  ValidationMiddleware.common.validateSearchSuggestions,
  ErrorMiddleware.asyncHandler(async (req: Request, res: Response) => {
    const { q } = req.query as { q: string };

    const mockSuggestions = [
      `${q} in documents`,
      `user profile for ${q}`,
      `collections tagged with ${q}`,
      `files uploaded by ${q}`,
      `recent items related to ${q}`
    ];

    await ResponseUtil.withDelay(async () => {
      ResponseUtil.success(res, mockSuggestions, 'Suggestions retrieved successfully');
    });
  })
);

export default router;
