/**
 * Collection Controller
 * Handles logic for collection-related routes
 */

import { Request, Response, NextFunction } from 'express';
import ResponseUtil from '../utils/response';
import logger from '../utils/logger';
import { randomInt, randomFloat } from '../utils/number.util';
import { generateId } from '../utils/id.util';
import { ErrorMiddleware } from '../middleware/error';

export class CollectionController {
  /**
   * Get all collections
   */
  public static async getAllCollections(req: Request, res: Response): Promise<void> {
    const { page = 1, limit = 20 } = ResponseUtil.parsePagination(req.query);
    
    await ResponseUtil.withDelay(async () => {
      // Mock collection data with realistic business collections
      const mockCollections = [
        {
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
          updatedAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
          fileCount: 24,
          size: 1288490188, // 1.2 GB
          tags: ['marketing', 'brand', 'templates'],
          permissions: []
        },
        {
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
          updatedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          fileCount: 18,
          size: 897581056, // 856 MB
          tags: ['documentation', 'technical', 'api'],
          permissions: []
        },
        {
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
          updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
          fileCount: 15,
          size: 466616115, // 445 MB
          tags: ['research', 'analysis', 'insights'],
          permissions: []
        },
        {
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
          updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
          fileCount: 12,
          size: 134217728, // 128 MB
          tags: ['project', 'planning', 'agile'],
          permissions: []
        },
        {
          id: 'legal-documents',
          name: 'Legal Documents',
          description: 'Contracts, agreements, and compliance materials',
          type: 'private' as const,
          owner: {
            id: 'user_5',
            email: 'robert.wilson@banedonv.com',
            name: 'Robert Wilson',
            role: 'admin' as const,
            avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=RobertWilson',
            createdAt: new Date(Date.now() - 86400000 * 300).toISOString(),
            updatedAt: new Date().toISOString(),
            isActive: true
          },
          createdAt: new Date(Date.now() - 86400000 * 90).toISOString(),
          updatedAt: new Date(Date.now() - 86400000 * 30).toISOString(), // 1 month ago
          fileCount: 23,
          size: 130023424, // 124 MB
          tags: ['legal', 'compliance', 'contracts'],
          permissions: []
        },
        {
          id: 'design-system',
          name: 'Design System',
          description: 'Complete design system components and guidelines',
          type: 'public' as const,
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
          createdAt: new Date(Date.now() - 86400000 * 40).toISOString(),
          updatedAt: new Date(Date.now() - 86400000 * 7).toISOString(), // 1 week ago
          fileCount: 42,
          size: 3006477107, // 2.8 GB
          tags: ['design', 'ui', 'components'],
          permissions: []
        }
      ];
      
      const { items, total } = ResponseUtil.paginateArray(mockCollections, page, limit);
      
      logger.info('Collections retrieved', {
        total,
        page,
        limit,
        requestId: req.requestId,
        userId: req.user?.id
      });
      
      ResponseUtil.success(res, items, 'Collections retrieved successfully', 200, {
        page,
        limit,
        total
      });
    });
  }

  /**
   * Get collections shared with the user
   */
  public static async getSharedCollections(req: Request, res: Response): Promise<void> {
    const { page = 1, limit = 20 } = ResponseUtil.parsePagination(req.query);
    
    await ResponseUtil.withDelay(async () => {
      // Mock shared collection data
      const mockCollections = [
        {
          id: 'design-system-shared',
          name: 'Design System',
          description: 'Complete design system components and guidelines',
          type: 'shared' as const,
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
          createdAt: new Date(Date.now() - 86400000 * 40).toISOString(),
          updatedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          fileCount: 42,
          size: 3006477107, // 2.8 GB
          tags: ['design', 'ui', 'components'],
          permissions: [
            {
              userId: req.user?.id || 'current_user',
              permission: 'edit' as const,
              grantedAt: new Date(Date.now() - 86400000 * 20).toISOString()
            }
          ],
          sharedBy: 'Lisa Kim',
          permission: 'edit'
        },
        {
          id: 'marketing-campaign-shared',
          name: 'Marketing Campaign Assets',
          description: 'Q4 campaign materials and brand assets',
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
          createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
          updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
          fileCount: 28,
          size: 1610612736, // 1.5 GB
          tags: ['marketing', 'campaign', 'q4'],
          permissions: [
            {
              userId: req.user?.id || 'current_user',
              permission: 'view' as const,
              grantedAt: new Date(Date.now() - 86400000 * 15).toISOString()
            }
          ],
          sharedBy: 'Mike Chen',
          permission: 'view'
        },
        {
          id: 'engineering-docs-shared',
          name: 'Engineering Documentation',
          description: 'Technical specifications and API documentation',
          type: 'shared' as const,
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
          createdAt: new Date(Date.now() - 86400000 * 50).toISOString(),
          updatedAt: new Date(Date.now() - 86400000 * 7).toISOString(), // 1 week ago
          fileCount: 67,
          size: 935329996, // 892 MB
          tags: ['engineering', 'documentation', 'technical'],
          permissions: [
            {
              userId: req.user?.id || 'current_user',
              permission: 'edit' as const,
              grantedAt: new Date(Date.now() - 86400000 * 25).toISOString()
            }
          ],
          sharedBy: 'Alex Rodriguez',
          permission: 'edit'
        },
        {
          id: 'research-archive-shared',
          name: 'Research Archive',
          description: 'User research findings and market analysis',
          type: 'shared' as const,
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
          createdAt: new Date(Date.now() - 86400000 * 60).toISOString(),
          updatedAt: new Date(Date.now() - 86400000 * 14).toISOString(), // 2 weeks ago
          fileCount: 15,
          size: 466616115, // 445 MB
          tags: ['research', 'archive', 'analysis'],
          permissions: [
            {
              userId: req.user?.id || 'current_user',
              permission: 'view' as const,
              grantedAt: new Date(Date.now() - 86400000 * 30).toISOString()
            }
          ],
          sharedBy: 'Emma Davis',
          permission: 'view'
        },
        {
          id: 'legal-documents-shared',
          name: 'Legal Documents',
          description: 'Contracts, agreements, and compliance materials',
          type: 'shared' as const,
          owner: {
            id: 'user_5',
            email: 'robert.wilson@banedonv.com',
            name: 'Robert Wilson',
            role: 'admin' as const,
            avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=RobertWilson',
            createdAt: new Date(Date.now() - 86400000 * 300).toISOString(),
            updatedAt: new Date().toISOString(),
            isActive: true
          },
          createdAt: new Date(Date.now() - 86400000 * 90).toISOString(),
          updatedAt: new Date(Date.now() - 86400000 * 30).toISOString(), // 1 month ago
          fileCount: 23,
          size: 130023424, // 124 MB
          tags: ['legal', 'compliance', 'contracts'],
          permissions: [
            {
              userId: req.user?.id || 'current_user',
              permission: 'admin' as const,
              grantedAt: new Date(Date.now() - 86400000 * 45).toISOString()
            }
          ],
          sharedBy: 'Robert Wilson',
          permission: 'admin'
        }
      ];
      
      const { items, total } = ResponseUtil.paginateArray(mockCollections, page, limit);
      
      logger.info('Shared collections retrieved', {
        total,
        page,
        limit,
        requestId: req.requestId,
        userId: req.user?.id
      });
      
      ResponseUtil.success(res, items, 'Shared collections retrieved successfully', 200, {
        page,
        limit,
        total
      });
    });
  }

  /**
   * Get collection by ID
   */
  public static async getCollectionById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    
    await ResponseUtil.withDelay(async () => {
      // Mock collection data with realistic business collections
      const mockCollections = {
        'marketing-resources': {
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
          updatedAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
          fileCount: 24,
          size: 1288490188, // 1.2 GB
          tags: ['marketing', 'brand', 'templates'],
          permissions: []
        },
        'product-documentation': {
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
          updatedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          fileCount: 18,
          size: 897581056, // 856 MB
          tags: ['documentation', 'technical', 'api'],
          permissions: []
        },
        'research': {
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
          updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
          fileCount: 15,
          size: 466616115, // 445 MB
          tags: ['research', 'analysis', 'insights'],
          permissions: []
        },
        'project-management': {
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
          updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
          fileCount: 12,
          size: 134217728, // 128 MB
          tags: ['project', 'planning', 'agile'],
          permissions: []
        },
        'legal-documents': {
          id: 'legal-documents',
          name: 'Legal Documents',
          description: 'Contracts, agreements, and compliance materials',
          type: 'private' as const,
          owner: {
            id: 'user_5',
            email: 'robert.wilson@banedonv.com',
            name: 'Robert Wilson',
            role: 'admin' as const,
            avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=RobertWilson',
            createdAt: new Date(Date.now() - 86400000 * 300).toISOString(),
            updatedAt: new Date().toISOString(),
            isActive: true
          },
          createdAt: new Date(Date.now() - 86400000 * 90).toISOString(),
          updatedAt: new Date(Date.now() - 86400000 * 30).toISOString(), // 1 month ago
          fileCount: 23,
          size: 130023424, // 124 MB
          tags: ['legal', 'compliance', 'contracts'],
          permissions: []
        },
        'design-system': {
          id: 'design-system',
          name: 'Design System',
          description: 'Complete design system components and guidelines',
          type: 'public' as const,
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
          createdAt: new Date(Date.now() - 86400000 * 40).toISOString(),
          updatedAt: new Date(Date.now() - 86400000 * 7).toISOString(), // 1 week ago
          fileCount: 42,
          size: 3006477107, // 2.8 GB
          tags: ['design', 'ui', 'components'],
          permissions: []
        }
      };
      
      const mockCollection = mockCollections[id as keyof typeof mockCollections] || {
        id: id,
        name: `Collection ${id}`,
        description: `Detailed description for collection ${id}`,
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
        updatedAt: new Date(Date.now() - randomFloat(0, 86400000 * 30)).toISOString(),
        fileCount: randomInt(0, 99),
        size: randomInt(0, 999999999),
        tags: ['important', 'work', 'documents'],
        permissions: []
      };
      
      logger.info('Collection retrieved', {
        collectionId: id,
        requestId: req.requestId,
        userId: req.user?.id
      });
      
      ResponseUtil.success(res, mockCollection, 'Collection retrieved successfully');
    });
  }

  /**
   * Create collection
   */
  public static async createCollection(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { name, description, type = 'private', tags = [] } = req.body;
    
    if (!name) {
      return next(ErrorMiddleware.createError('Collection name is required', 400, 'NAME_REQUIRED'));
    }
    
    await ResponseUtil.withDelay(async () => {
      const newCollection = {
        id: generateId('collection'),
        name,
        description,
        type: type as 'public' | 'private' | 'shared',
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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        fileCount: 0,
        size: 0,
        tags: tags,
        permissions: []
      };
      
      logger.info('Collection created', {
        collectionId: newCollection.id,
        name,
        requestId: req.requestId,
        userId: req.user?.id
      });
      
      ResponseUtil.success(res, newCollection, 'Collection created successfully', 201);
    });
  }

  /**
   * Update collection
   */
  public static async updateCollection(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const updateData = req.body;
    
    await ResponseUtil.withDelay(async () => {
      const updatedCollection = {
        id: id,
        name: updateData.name || `Collection ${id}`,
        description: updateData.description || `Updated description for collection ${id}`,
        type: (updateData.type || 'private') as 'public' | 'private' | 'shared',
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
        fileCount: randomInt(0, 99),
        size: randomInt(0, 999999999),
        tags: updateData.tags || ['updated'],
        permissions: updateData.permissions || []
      };
      
      logger.info('Collection updated', {
        collectionId: id,
        updateData,
        requestId: req.requestId,
        userId: req.user?.id
      });
      
      ResponseUtil.success(res, updatedCollection, 'Collection updated successfully');
    });
  }

  /**
   * Delete collection
   */
  public static async deleteCollection(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    
    await ResponseUtil.withDelay(async () => {
      logger.info('Collection deleted', {
        collectionId: id,
        requestId: req.requestId,
        userId: req.user?.id
      });
      
      ResponseUtil.success(res, null, 'Collection deleted successfully');
    });
  }

  /**
   * Get all files in a collection
   */
  public static async getCollectionFiles(req: Request, res: Response): Promise<void> {
    const { id: collectionId } = req.params;
    const { page = 1, limit = 20 } = ResponseUtil.parsePagination(req.query);

    await ResponseUtil.withDelay(async () => {
      // Mock file data for specific collections
      const collectionFiles = {
        'marketing-resources': [
          {
            id: 'file_1',
            name: 'Q4 Marketing Strategy.pdf',
            type: 'pdf',
            size: 2516582, // 2.4 MB
            mimeType: 'application/pdf',
            url: 'https://api.banedonv.com/files/file_1',
            thumbnailUrl: 'https://api.banedonv.com/files/file_1/thumbnail',
            collectionId: 'marketing-resources',
            owner: { id: 'user_1', name: 'Sarah Johnson', email: 'sarah.johnson@banedonv.com' },
            createdAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
            updatedAt: new Date(Date.now() - 7200000).toISOString(),
            tags: ['strategy', 'marketing', 'q4'],
            metadata: { author: 'Sarah Johnson', version: '1.0', category: 'document' }
          },
          {
            id: 'file_2',
            name: 'Brand Guidelines.figma',
            type: 'figma',
            size: 1887436, // 1.8 MB
            mimeType: 'application/figma',
            url: 'https://api.banedonv.com/files/file_2',
            collectionId: 'marketing-resources',
            owner: { id: 'user_6', name: 'Lisa Kim', email: 'lisa.kim@banedonv.com' },
            createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            updatedAt: new Date(Date.now() - 86400000).toISOString(),
            tags: ['brand', 'design', 'guidelines'],
            metadata: { author: 'Lisa Kim', version: '2.1', category: 'design' }
          },
          {
            id: 'file_marketing_3',
            name: 'Product Launch Template.pptx',
            type: 'pptx',
            size: 5242880, // 5 MB
            mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            url: 'https://api.banedonv.com/files/file_marketing_3',
            thumbnailUrl: 'https://api.banedonv.com/files/file_marketing_3/thumbnail',
            collectionId: 'marketing-resources',
            owner: { id: 'user_1', name: 'Sarah Johnson', email: 'sarah.johnson@banedonv.com' },
            createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
            updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
            tags: ['template', 'launch', 'presentation'],
            metadata: { author: 'Sarah Johnson', version: '1.2', category: 'presentation' }
          }
        ],
        'product-documentation': [
          {
            id: 'file_3',
            name: 'API Documentation.md',
            type: 'md',
            size: 913408, // 892 KB
            mimeType: 'text/markdown',
            url: 'https://api.banedonv.com/files/file_3',
            collectionId: 'product-documentation',
            owner: { id: 'user_2', name: 'Alex Rodriguez', email: 'alex.rodriguez@banedonv.com' },
            createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            updatedAt: new Date(Date.now() - 86400000).toISOString(),
            tags: ['api', 'documentation', 'technical'],
            metadata: { author: 'Alex Rodriguez', version: '3.2', category: 'document' }
          },
          {
            id: 'file_docs_2',
            name: 'User Guide.pdf',
            type: 'pdf',
            size: 3145728, // 3 MB
            mimeType: 'application/pdf',
            url: 'https://api.banedonv.com/files/file_docs_2',
            thumbnailUrl: 'https://api.banedonv.com/files/file_docs_2/thumbnail',
            collectionId: 'product-documentation',
            owner: { id: 'user_2', name: 'Alex Rodriguez', email: 'alex.rodriguez@banedonv.com' },
            createdAt: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
            updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
            tags: ['user-guide', 'help', 'documentation'],
            metadata: { author: 'Alex Rodriguez', version: '2.0', category: 'document' }
          }
        ],
        'research': [
          {
            id: 'file_4',
            name: 'User Research Report.docx',
            type: 'docx',
            size: 3355443, // 3.2 MB
            mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            url: 'https://api.banedonv.com/files/file_4',
            thumbnailUrl: 'https://api.banedonv.com/files/file_4/thumbnail',
            collectionId: 'research',
            owner: { id: 'user_3', name: 'Emma Davis', email: 'emma.davis@banedonv.com' },
            createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
            updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
            tags: ['research', 'user', 'report'],
            metadata: { author: 'Emma Davis', version: '1.3', category: 'document' }
          },
          {
            id: 'file_research_2',
            name: 'Market Analysis.xlsx',
            type: 'xlsx',
            size: 2097152, // 2 MB
            mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            url: 'https://api.banedonv.com/files/file_research_2',
            thumbnailUrl: 'https://api.banedonv.com/files/file_research_2/thumbnail',
            collectionId: 'research',
            owner: { id: 'user_3', name: 'Emma Davis', email: 'emma.davis@banedonv.com' },
            createdAt: new Date(Date.now() - 86400000 * 7).toISOString(), // 1 week ago
            updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
            tags: ['analysis', 'market', 'data'],
            metadata: { author: 'Emma Davis', version: '1.1', category: 'spreadsheet' }
          }
        ],
        'project-management': [
          {
            id: 'file_5',
            name: 'Sprint Planning.xlsx',
            type: 'xlsx',
            size: 1153433, // 1.1 MB
            mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            url: 'https://api.banedonv.com/files/file_5',
            thumbnailUrl: 'https://api.banedonv.com/files/file_5/thumbnail',
            collectionId: 'project-management',
            owner: { id: 'user_4', name: 'Mike Chen', email: 'mike.chen@banedonv.com' },
            createdAt: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
            updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
            tags: ['sprint', 'planning', 'agile'],
            metadata: { author: 'Mike Chen', version: '1.0', category: 'spreadsheet' }
          },
          {
            id: 'file_pm_2',
            name: 'Project Roadmap.pdf',
            type: 'pdf',
            size: 1572864, // 1.5 MB
            mimeType: 'application/pdf',
            url: 'https://api.banedonv.com/files/file_pm_2',
            thumbnailUrl: 'https://api.banedonv.com/files/file_pm_2/thumbnail',
            collectionId: 'project-management',
            owner: { id: 'user_4', name: 'Mike Chen', email: 'mike.chen@banedonv.com' },
            createdAt: new Date(Date.now() - 86400000 * 10).toISOString(), // 10 days ago
            updatedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
            tags: ['roadmap', 'project', 'timeline'],
            metadata: { author: 'Mike Chen', version: '2.0', category: 'document' }
          }
        ],
        'legal-documents': [
          {
            id: 'file_legal_1',
            name: 'Service Agreement.pdf',
            type: 'pdf',
            size: 1048576, // 1 MB
            mimeType: 'application/pdf',
            url: 'https://api.banedonv.com/files/file_legal_1',
            thumbnailUrl: 'https://api.banedonv.com/files/file_legal_1/thumbnail',
            collectionId: 'legal-documents',
            owner: { id: 'user_5', name: 'Robert Wilson', email: 'robert.wilson@banedonv.com' },
            createdAt: new Date(Date.now() - 86400000 * 30).toISOString(), // 1 month ago
            updatedAt: new Date(Date.now() - 86400000 * 30).toISOString(),
            tags: ['contract', 'service', 'agreement'],
            metadata: { author: 'Robert Wilson', version: '1.0', category: 'document' }
          },
          {
            id: 'file_legal_2',
            name: 'Privacy Policy.docx',
            type: 'docx',
            size: 524288, // 512 KB
            mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            url: 'https://api.banedonv.com/files/file_legal_2',
            thumbnailUrl: 'https://api.banedonv.com/files/file_legal_2/thumbnail',
            collectionId: 'legal-documents',
            owner: { id: 'user_5', name: 'Robert Wilson', email: 'robert.wilson@banedonv.com' },
            createdAt: new Date(Date.now() - 86400000 * 45).toISOString(), // 45 days ago
            updatedAt: new Date(Date.now() - 86400000 * 20).toISOString(),
            tags: ['privacy', 'policy', 'legal'],
            metadata: { author: 'Robert Wilson', version: '2.1', category: 'document' }
          }
        ],
        'design-system': [
          {
            id: 'file_design_1',
            name: 'Component Library.sketch',
            type: 'sketch',
            size: 10485760, // 10 MB
            mimeType: 'application/sketch',
            url: 'https://api.banedonv.com/files/file_design_1',
            thumbnailUrl: 'https://api.banedonv.com/files/file_design_1/thumbnail',
            collectionId: 'design-system',
            owner: { id: 'user_6', name: 'Lisa Kim', email: 'lisa.kim@banedonv.com' },
            createdAt: new Date(Date.now() - 86400000 * 7).toISOString(), // 1 week ago
            updatedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
            tags: ['components', 'library', 'design'],
            metadata: { author: 'Lisa Kim', version: '3.0', category: 'design' }
          },
          {
            id: 'file_design_2',
            name: 'Design Tokens.json',
            type: 'json',
            size: 65536, // 64 KB
            mimeType: 'application/json',
            url: 'https://api.banedonv.com/files/file_design_2',
            collectionId: 'design-system',
            owner: { id: 'user_6', name: 'Lisa Kim', email: 'lisa.kim@banedonv.com' },
            createdAt: new Date(Date.now() - 86400000 * 14).toISOString(), // 2 weeks ago
            updatedAt: new Date(Date.now() - 86400000 * 10).toISOString(),
            tags: ['tokens', 'design', 'variables'],
            metadata: { author: 'Lisa Kim', version: '1.5', category: 'data' }
          }
        ]
      };

      // Get files for the specific collection, or generate generic ones
      const mockFiles = collectionFiles[collectionId as keyof typeof collectionFiles] || 
        Array.from({ length: 8 }, (_, i) => ({
          id: `file_coll_${collectionId}_${i + 1}`,
          name: `document_${i + 1}.pdf`,
          type: ['pdf', 'docx', 'txt', 'xlsx', 'pptx'][i % 5],
          size: randomInt(100000, 9999999),
          mimeType: 'application/pdf',
          url: `https://api.banedonv.com/files/file_coll_${collectionId}_${i + 1}`,
          thumbnailUrl: `https://api.banedonv.com/files/file_coll_${collectionId}_${i + 1}/thumbnail`,
          collectionId: collectionId,
          owner: { id: req.user?.id || 'user_1', name: req.user?.name || 'User', email: req.user?.email || 'user@example.com' },
          createdAt: new Date(Date.now() - randomFloat(0, 86400000 * 30)).toISOString(),
          updatedAt: new Date(Date.now() - randomFloat(0, 86400000 * 10)).toISOString(),
          tags: ['document', 'file'],
          metadata: { author: 'User', version: '1.0', category: 'document' }
        }));

      const { items, total } = ResponseUtil.paginateArray(mockFiles, page, limit);

      logger.info('Files for collection retrieved', {
        collectionId,
        total,
        page,
        limit,
        requestId: req.requestId,
        userId: req.user?.id
      });
      
      ResponseUtil.success(res, items, 'Files for collection retrieved successfully', 200, {
        page,
        limit,
        total
      });
    });
  }

  /**
   * Upload file to a collection
   */
  public static async uploadFileToCollection(req: Request, res: Response): Promise<void> {
    const { id: collectionId } = req.params;
    
    await ResponseUtil.withDelay(async () => {
      // Mock file upload
      const fileId = generateId('file');
      const uploadedFile = {
        id: fileId,
        name: 'uploaded_file.pdf',
        type: 'pdf',
        size: randomInt(0, 9999999),
        mimeType: 'application/pdf',
        url: `https://api.banedonv.com/files/${fileId}`,
        thumbnailUrl: `https://api.banedonv.com/files/${fileId}/thumbnail`,
        collectionId: collectionId,
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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: ['uploaded'],
        metadata: {
          uploadSource: 'web',
          originalName: 'uploaded_file.pdf',
          uploadedAt: new Date().toISOString()
        }
      };
      
      logger.info('File uploaded to collection', {
        fileId: uploadedFile.id,
        collectionId,
        requestId: req.requestId,
        userId: req.user?.id
      });
      
      ResponseUtil.success(res, uploadedFile, 'File uploaded successfully', 201);
    });
  }
}
