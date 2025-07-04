/**
 * User Routes
 * User management endpoints
 */

import { Router, Request, Response } from 'express';
import { AuthMiddleware } from '../middleware/auth';
import { ValidationMiddleware } from '../middleware/validation';
import ResponseUtil from '../utils/response';
import logger from '../utils/logger';

const router = Router();

/**
 * Get all users (Admin only)
 */
router.get('/',
  AuthMiddleware.authenticate,
  AuthMiddleware.adminOnly,
  ValidationMiddleware.common.validatePagination,
  async (req: Request, res: Response) => {
    try {
      // Add realistic delay
      await ResponseUtil.withDelay(async () => {
        const { page = 1, limit = 20 } = ResponseUtil.parsePagination(req.query);
        
        // Mock user data
        const mockUsers = Array.from({ length: 45 }, (_, i) => ({
          id: `user_${i + 1}`,
          email: `user${i + 1}@example.com`,
          name: `User ${i + 1}`,
          role: ['admin', 'manager', 'user'][i % 3],
          active: Math.random() > 0.1,
          lastLogin: Math.random() > 0.3 ? new Date(Date.now() - Math.random() * 86400000 * 7).toISOString() : null,
          createdAt: new Date(Date.now() - Math.random() * 86400000 * 365).toISOString()
        }));
        
        const { items, total } = ResponseUtil.paginateArray(mockUsers, page, limit);
        
        logger.info('Users retrieved', {
          total,
          page,
          limit,
          requestId: req.requestId,
          userId: req.user?.id
        });
        
        return ResponseUtil.success(res, items, 'Users retrieved successfully', 200, {
          page,
          limit,
          total
        });
      });
    } catch (error) {
      logger.error('Get users error', { error: (error as Error).message, requestId: req.requestId });
      ResponseUtil.internalServerError(res, 'Failed to retrieve users');
    }
  }
);

/**
 * Get user by ID
 */
router.get('/:id',
  AuthMiddleware.authenticate,
  AuthMiddleware.selfOrAdmin('id'),
  ValidationMiddleware.common.validateId,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      
      // Add realistic delay
      await ResponseUtil.withDelay(async () => {
        // Mock user data
        const mockUser = {
          id: id,
          email: `user${id}@example.com`,
          name: `User ${id}`,
          role: ['admin', 'manager', 'user'][Math.floor(Math.random() * 3)],
          active: true,
          lastLogin: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
          createdAt: new Date(Date.now() - Math.random() * 86400000 * 365).toISOString(),
          profile: {
            avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${id}`,
            bio: `Bio for user ${id}`,
            location: 'New York, NY',
            website: `https://user${id}.example.com`
          },
          preferences: {
            theme: 'light',
            notifications: true,
            language: 'en'
          },
          statistics: {
            collectionsCount: Math.floor(Math.random() * 50),
            filesCount: Math.floor(Math.random() * 500),
            searchesCount: Math.floor(Math.random() * 1000)
          }
        };
        
        logger.info('User retrieved', {
          userId: id,
          requestId: req.requestId,
          requestorId: req.user?.id
        });
        
        return ResponseUtil.success(res, mockUser, 'User retrieved successfully');
      });
    } catch (error) {
      logger.error('Get user error', { error: (error as Error).message, requestId: req.requestId });
      ResponseUtil.internalServerError(res, 'Failed to retrieve user');
    }
  }
);

/**
 * Update user
 */
router.put('/:id',
  AuthMiddleware.authenticate,
  AuthMiddleware.selfOrAdmin('id'),
  ValidationMiddleware.common.validateId,
  ValidationMiddleware.common.validateUserUpdate,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      // Add realistic delay
      await ResponseUtil.withDelay(async () => {
        // Mock user update
        const updatedUser = {
          id: id,
          email: updateData.email || `user${id}@example.com`,
          name: updateData.name || `User ${id}`,
          role: updateData.role || 'user',
          active: true,
          lastLogin: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
          createdAt: new Date(Date.now() - Math.random() * 86400000 * 365).toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        logger.info('User updated', {
          userId: id,
          updateData,
          requestId: req.requestId,
          requestorId: req.user?.id
        });
        
        return ResponseUtil.success(res, updatedUser, 'User updated successfully');
      });
    } catch (error) {
      logger.error('Update user error', { error: (error as Error).message, requestId: req.requestId });
      ResponseUtil.internalServerError(res, 'Failed to update user');
    }
  }
);

/**
 * Delete user
 */
router.delete('/:id',
  AuthMiddleware.authenticate,
  AuthMiddleware.adminOnly,
  ValidationMiddleware.common.validateId,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      
      // Add realistic delay
      await ResponseUtil.withDelay(async () => {
        // Prevent self-deletion
        if (req.user?.id === id) {
          return ResponseUtil.error(res, 'CANNOT_DELETE_SELF', 'Cannot delete your own account', 400);
        }
        
        logger.info('User deleted', {
          userId: id,
          requestId: req.requestId,
          requestorId: req.user?.id
        });
        
        return ResponseUtil.success(res, null, 'User deleted successfully');
      });
    } catch (error) {
      logger.error('Delete user error', { error: (error as Error).message, requestId: req.requestId });
      ResponseUtil.internalServerError(res, 'Failed to delete user');
    }
  }
);

/**
 * Invite user
 */
router.post('/invite',
  AuthMiddleware.authenticate,
  AuthMiddleware.managerOrAdmin,
  async (req: Request, res: Response) => {
    try {
      const { email, role = 'user' } = req.body;
      
      if (!email) {
        return ResponseUtil.error(res, 'EMAIL_REQUIRED', 'Email is required', 400);
      }
      
      // Add realistic delay
      await ResponseUtil.withDelay(async () => {
        const inviteToken = `invite_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        logger.info('User invited', {
          email,
          role,
          inviteToken,
          requestId: req.requestId,
          invitedBy: req.user?.id
        });
        
        return ResponseUtil.success(res, {
          email,
          role,
          inviteToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
        }, 'User invited successfully');
      });
    } catch (error) {
      logger.error('Invite user error', { error: (error as Error).message, requestId: req.requestId });
      ResponseUtil.internalServerError(res, 'Failed to invite user');
    }
  }
);

/**
 * Update user role
 */
router.put('/:id/role',
  AuthMiddleware.authenticate,
  AuthMiddleware.adminOnly,
  ValidationMiddleware.common.validateId,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { role } = req.body;
      
      if (!role || !['admin', 'manager', 'user'].includes(role)) {
        return ResponseUtil.error(res, 'INVALID_ROLE', 'Invalid role specified', 400);
      }
      
      // Add realistic delay
      await ResponseUtil.withDelay(async () => {
        // Prevent changing own role
        if (req.user?.id === id) {
          return ResponseUtil.error(res, 'CANNOT_CHANGE_OWN_ROLE', 'Cannot change your own role', 400);
        }
        
        logger.info('User role updated', {
          userId: id,
          newRole: role,
          requestId: req.requestId,
          requestorId: req.user?.id
        });
        
        return ResponseUtil.success(res, {
          userId: id,
          role: role,
          updatedAt: new Date().toISOString()
        }, 'User role updated successfully');
      });
    } catch (error) {
      logger.error('Update user role error', { error: (error as Error).message, requestId: req.requestId });
      ResponseUtil.internalServerError(res, 'Failed to update user role');
    }
  }
);

/**
 * Get user activity
 */
router.get('/:id/activity',
  AuthMiddleware.authenticate,
  AuthMiddleware.selfOrAdmin('id'),
  ValidationMiddleware.common.validateId,
  ValidationMiddleware.common.validatePagination,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { page = 1, limit = 20 } = ResponseUtil.parsePagination(req.query);
      
      // Add realistic delay
      await ResponseUtil.withDelay(async () => {
        // Mock activity data
        const mockActivities = Array.from({ length: 30 }, (_, i) => ({
          id: `activity_${i + 1}`,
          type: ['login', 'logout', 'file_upload', 'search', 'collection_create', 'file_download'][Math.floor(Math.random() * 6)],
          description: `Activity ${i + 1} description`,
          timestamp: new Date(Date.now() - Math.random() * 86400000 * 30).toISOString(),
          metadata: {
            ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        }));
        
        const { items, total } = ResponseUtil.paginateArray(mockActivities, page, limit);
        
        logger.info('User activity retrieved', {
          userId: id,
          total,
          page,
          limit,
          requestId: req.requestId,
          requestorId: req.user?.id
        });
        
        return ResponseUtil.success(res, items, 'User activity retrieved successfully', 200, {
          page,
          limit,
          total
        });
      });
    } catch (error) {
      logger.error('Get user activity error', { error: (error as Error).message, requestId: req.requestId });
      ResponseUtil.internalServerError(res, 'Failed to retrieve user activity');
    }
  }
);

export default router;
