/**
 * File Controller
 * Handles logic for file-related routes
 */

import { Request, Response } from 'express';
import ResponseUtil from '../utils/response';
import logger from '../utils/logger';
import { randomInt, randomFloat } from '../utils/number.util';

export class FileController {
  /**
   * Get all files (flat view)
   */
  public static async getAllFiles(req: Request, res: Response): Promise<void> {
    const { page = 1, limit = 20 } = ResponseUtil.parsePagination(req.query);
    
    await ResponseUtil.withDelay(async () => {
      // Mock file data with realistic business files
      const mockFiles = [
        // Marketing Resources files
        {
          id: 'file_1',
          name: 'Q4 Marketing Strategy.pdf',
          type: 'pdf',
          size: 2516582, // 2.4 MB
          mimeType: 'application/pdf',
          url: 'https://api.banedonv.com/files/file_1',
          thumbnailUrl: 'https://api.banedonv.com/files/file_1/thumbnail',
          collectionId: 'marketing-resources',
          collection: {
            id: 'marketing-resources',
            name: 'Marketing Resources',
            description: 'Brand guidelines, templates, and marketing materials',
            type: 'shared' as const,
            owner: {
              id: 'user_1',
              email: 'sarah.johnson@banedonv.com',
              name: 'Sarah Johnson',
              role: 'manager' as const,
              avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=SarahJohnson',
              createdAt: new Date(Date.now() - 86400000 * 180).toISOString(),
              updatedAt: new Date().toISOString(),
              isActive: true
            },
            createdAt: new Date(Date.now() - 86400000 * 45).toISOString(),
            updatedAt: new Date().toISOString(),
            fileCount: 24,
            size: 1288490188,
            tags: ['marketing', 'brand', 'templates']
          },
          owner: {
            id: 'user_1',
            email: 'sarah.johnson@banedonv.com',
            name: 'Sarah Johnson',
            role: 'manager' as const,
            avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=SarahJohnson',
            createdAt: new Date(Date.now() - 86400000 * 180).toISOString(),
            updatedAt: new Date().toISOString(),
            isActive: true
          },
          createdAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
          updatedAt: new Date(Date.now() - 7200000).toISOString(),
          tags: ['strategy', 'marketing', 'q4'],
          metadata: {
            author: 'Sarah Johnson',
            version: '1.0',
            category: 'document'
          }
        },
        {
          id: 'file_2',
          name: 'Brand Guidelines.figma',
          type: 'figma',
          size: 1887436, // 1.8 MB
          mimeType: 'application/figma',
          url: 'https://api.banedonv.com/files/file_2',
          collectionId: 'marketing-resources',
          collection: {
            id: 'marketing-resources',
            name: 'Marketing Resources',
            description: 'Brand guidelines, templates, and marketing materials',
            type: 'shared' as const,
            owner: {
              id: 'user_1',
              email: 'sarah.johnson@banedonv.com',
              name: 'Sarah Johnson',
              role: 'manager' as const,
              avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=SarahJohnson',
              createdAt: new Date(Date.now() - 86400000 * 180).toISOString(),
              updatedAt: new Date().toISOString(),
              isActive: true
            },
            createdAt: new Date(Date.now() - 86400000 * 45).toISOString(),
            updatedAt: new Date().toISOString(),
            fileCount: 24,
            size: 1288490188,
            tags: ['marketing', 'brand', 'templates']
          },
          owner: {
            id: 'user_6',
            email: 'lisa.kim@banedonv.com',
            name: 'Lisa Kim',
            role: 'user' as const,
            avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=LisaKim',
            createdAt: new Date(Date.now() - 86400000 * 100).toISOString(),
            updatedAt: new Date().toISOString(),
            isActive: true
          },
          createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          updatedAt: new Date(Date.now() - 86400000).toISOString(),
          tags: ['brand', 'design', 'guidelines'],
          metadata: {
            author: 'Lisa Kim',
            version: '2.1',
            category: 'design'
          }
        },
        // Product Documentation files
        {
          id: 'file_3',
          name: 'API Documentation.md',
          type: 'md',
          size: 913408, // 892 KB
          mimeType: 'text/markdown',
          url: 'https://api.banedonv.com/files/file_3',
          collectionId: 'product-documentation',
          collection: {
            id: 'product-documentation',
            name: 'Product Documentation',
            description: 'Technical docs, user guides, and API references',
            type: 'public' as const,
            owner: {
              id: 'user_2',
              email: 'alex.rodriguez@banedonv.com',
              name: 'Alex Rodriguez',
              role: 'admin' as const,
              avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=AlexRodriguez',
              createdAt: new Date(Date.now() - 86400000 * 200).toISOString(),
              updatedAt: new Date().toISOString(),
              isActive: true
            },
            createdAt: new Date(Date.now() - 86400000 * 60).toISOString(),
            updatedAt: new Date().toISOString(),
            fileCount: 18,
            size: 897581056,
            tags: ['documentation', 'technical', 'api']
          },
          owner: {
            id: 'user_2',
            email: 'alex.rodriguez@banedonv.com',
            name: 'Alex Rodriguez',
            role: 'admin' as const,
            avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=AlexRodriguez',
            createdAt: new Date(Date.now() - 86400000 * 200).toISOString(),
            updatedAt: new Date().toISOString(),
            isActive: true
          },
          createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          updatedAt: new Date(Date.now() - 86400000).toISOString(),
          tags: ['api', 'documentation', 'technical'],
          metadata: {
            author: 'Alex Rodriguez',
            version: '3.2',
            category: 'document'
          }
        },
        // Research files
        {
          id: 'file_4',
          name: 'User Research Report.docx',
          type: 'docx',
          size: 3355443, // 3.2 MB
          mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          url: 'https://api.banedonv.com/files/file_4',
          thumbnailUrl: 'https://api.banedonv.com/files/file_4/thumbnail',
          collectionId: 'research',
          collection: {
            id: 'research',
            name: 'Research',
            description: 'User research findings and market analysis',
            type: 'private' as const,
            owner: {
              id: 'user_3',
              email: 'emma.davis@banedonv.com',
              name: 'Emma Davis',
              role: 'user' as const,
              avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=EmmaDavis',
              createdAt: new Date(Date.now() - 86400000 * 150).toISOString(),
              updatedAt: new Date().toISOString(),
              isActive: true
            },
            createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
            updatedAt: new Date().toISOString(),
            fileCount: 15,
            size: 466616115,
            tags: ['research', 'analysis', 'insights']
          },
          owner: {
            id: 'user_3',
            email: 'emma.davis@banedonv.com',
            name: 'Emma Davis',
            role: 'user' as const,
            avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=EmmaDavis',
            createdAt: new Date(Date.now() - 86400000 * 150).toISOString(),
            updatedAt: new Date().toISOString(),
            isActive: true
          },
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
          updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
          tags: ['research', 'user', 'report'],
          metadata: {
            author: 'Emma Davis',
            version: '1.3',
            category: 'document'
          }
        },
        // Project Management files
        {
          id: 'file_5',
          name: 'Sprint Planning.xlsx',
          type: 'xlsx',
          size: 1153433, // 1.1 MB
          mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          url: 'https://api.banedonv.com/files/file_5',
          thumbnailUrl: 'https://api.banedonv.com/files/file_5/thumbnail',
          collectionId: 'project-management',
          collection: {
            id: 'project-management',
            name: 'Project Management',
            description: 'Sprint planning, roadmaps, and project documentation',
            type: 'shared' as const,
            owner: {
              id: 'user_4',
              email: 'mike.chen@banedonv.com',
              name: 'Mike Chen',
              role: 'manager' as const,
              avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=MikeChen',
              createdAt: new Date(Date.now() - 86400000 * 120).toISOString(),
              updatedAt: new Date().toISOString(),
              isActive: true
            },
            createdAt: new Date(Date.now() - 86400000 * 25).toISOString(),
            updatedAt: new Date().toISOString(),
            fileCount: 12,
            size: 134217728,
            tags: ['project', 'planning', 'agile']
          },
          owner: {
            id: 'user_4',
            email: 'mike.chen@banedonv.com',
            name: 'Mike Chen',
            role: 'manager' as const,
            avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=MikeChen',
            createdAt: new Date(Date.now() - 86400000 * 120).toISOString(),
            updatedAt: new Date().toISOString(),
            isActive: true
          },
          createdAt: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
          updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
          tags: ['sprint', 'planning', 'agile'],
          metadata: {
            author: 'Mike Chen',
            version: '1.0',
            category: 'spreadsheet'
          }
        }
      ];
      
      const { items, total } = ResponseUtil.paginateArray(mockFiles, page, limit);
      
      logger.info('All files retrieved', {
        total,
        page,
        limit,
        requestId: req.requestId,
        userId: req.user?.id
      });
      
      ResponseUtil.success(res, items, 'Files retrieved successfully', 200, {
        page,
        limit,
        total
      });
    });
  }

  /**
   * Get recent files
   */
  public static async getRecentFiles(req: Request, res: Response): Promise<void> {
    await ResponseUtil.withDelay(async () => {
      // Mock recent file data with realistic files
      const mockFiles = [
        {
          id: 'file_1',
          name: 'Q4 Marketing Strategy.pdf',
          type: 'pdf',
          size: 2516582, // 2.4 MB
          collectionId: 'marketing-resources',
          collectionName: 'Marketing Resources',
          owner: { id: 'user_1', name: 'Sarah Johnson' },
          createdAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
          updatedAt: new Date(Date.now() - 7200000).toISOString(),
          action: 'updated'
        },
        {
          id: 'file_2',
          name: 'Brand Guidelines.figma',
          type: 'figma',
          size: 1887436, // 1.8 MB
          collectionId: 'marketing-resources',
          collectionName: 'Marketing Resources',
          owner: { id: 'user_6', name: 'Lisa Kim' },
          createdAt: new Date(Date.now() - 14400000).toISOString(), // 4 hours ago
          updatedAt: new Date(Date.now() - 14400000).toISOString(),
          action: 'created'
        },
        {
          id: 'file_3',
          name: 'API Documentation.md',
          type: 'md',
          size: 913408, // 892 KB
          collectionId: 'product-documentation',
          collectionName: 'Product Documentation',
          owner: { id: 'user_2', name: 'Alex Rodriguez' },
          createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          updatedAt: new Date(Date.now() - 86400000).toISOString(),
          action: 'viewed'
        },
        {
          id: 'file_4',
          name: 'User Research Report.docx',
          type: 'docx',
          size: 3355443, // 3.2 MB
          collectionId: 'research',
          collectionName: 'Research',
          owner: { id: 'user_3', name: 'Emma Davis' },
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
          updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
          action: 'shared'
        },
        {
          id: 'file_5',
          name: 'Sprint Planning.xlsx',
          type: 'xlsx',
          size: 1153433, // 1.1 MB
          collectionId: 'project-management',
          collectionName: 'Project Management',
          owner: { id: 'user_4', name: 'Mike Chen' },
          createdAt: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
          updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
          action: 'updated'
        }
      ];
      
      logger.info('Recent files retrieved', {
        count: mockFiles.length,
        requestId: req.requestId,
        userId: req.user?.id
      });
      
      ResponseUtil.success(res, mockFiles, 'Recent files retrieved successfully');
    });
  }

  /**
   * Get file by ID
   */
  public static async getFileById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    
    await ResponseUtil.withDelay(async () => {
      // Mock file data
      const mockFile = {
        id: id,
        name: `document_${id}.pdf`,
        type: 'pdf',
        size: randomInt(0, 9999999),
        mimeType: 'application/pdf',
        url: `https://api.banedonv.com/files/${id}`,
        thumbnailUrl: `https://api.banedonv.com/files/${id}/thumbnail`,
        collectionId: 'collection_1',
        collection: {
          id: 'collection_1',
          name: 'Documents Collection',
          description: 'Important documents',
          type: 'private' as const,
          owner: {
            id: req.user?.id || 'user_1',
            email: req.user?.email || 'user@example.com',
            name: req.user?.name || 'User',
            role: req.user?.role || 'user' as const,
            avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${req.user?.id}`,
            createdAt: new Date(Date.now() - randomFloat(0, 86400000 * 365)).toISOString(),
            updatedAt: new Date().toISOString(),
            isActive: true
          },
          createdAt: new Date(Date.now() - randomFloat(0, 86400000 * 90)).toISOString(),
          updatedAt: new Date().toISOString(),
          fileCount: 25,
          size: 250000000,
          tags: ['documents', 'important']
        },
        owner: {
          id: req.user?.id || 'user_1',
          email: req.user?.email || 'user@example.com',
          name: req.user?.name || 'User',
          role: req.user?.role || 'user' as const,
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${req.user?.id}`,
          createdAt: new Date(Date.now() - randomFloat(0, 86400000 * 365)).toISOString(),
          updatedAt: new Date().toISOString(),
          isActive: true
        },
        createdAt: new Date(Date.now() - randomFloat(0, 86400000 * 30)).toISOString(),
        updatedAt: new Date(Date.now() - randomFloat(0, 86400000 * 10)).toISOString(),
        tags: ['important', 'work'],
        metadata: {
          author: 'Document Author',
          version: '1.0',
          category: 'document',
          pages: 10,
          lastModified: new Date().toISOString()
        }
      };
      
      logger.info('File retrieved', {
        fileId: id,
        requestId: req.requestId,
        userId: req.user?.id
      });
      
      ResponseUtil.success(res, mockFile, 'File retrieved successfully');
    });
  }

  /**
   * Delete file by ID
   */
  public static async deleteFileById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    
    await ResponseUtil.withDelay(async () => {
      logger.info('File deleted', {
        fileId: id,
        requestId: req.requestId,
        userId: req.user?.id
      });
      
      ResponseUtil.success(res, null, 'File deleted successfully');
    });
  }
}
