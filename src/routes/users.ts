/**
 * User Routes
 * User management endpoints
 */

import { Router, Request, Response, NextFunction } from 'express';
import { AuthMiddleware } from '../middleware/auth';
import { ValidationMiddleware } from '../middleware/validation';
import { ErrorMiddleware } from '../middleware/error';
import ResponseUtil from '../utils/response';
import logger from '../utils/logger';
import { randomFloat, randomInt } from '../utils/number.util';
import { generateId } from '../utils/id.util';

const router = Router();

/**
 * Get all users (Admin only)
 */
router.get('/',
  AuthMiddleware.authenticate,
  AuthMiddleware.adminOnly,
  ValidationMiddleware.common.validatePagination,
  ErrorMiddleware.asyncHandler(async (req: Request, res: Response) => {
    // Add realistic delay
    await ResponseUtil.withDelay(async () => {
      const { page = 1, limit = 20 } = ResponseUtil.parsePagination(req.query);
      
      // Mock user data
      const mockUsers = Array.from({ length: 45 }, (_, i) => ({
        id: `user_${i + 1}`,
        email: `user${i + 1}@example.com`,
        name: `User ${i + 1}`,
        role: ['admin', 'manager', 'user'][i % 3],
        active: randomFloat(0, 1) > 0.1,
        lastLogin: randomFloat(0, 1) > 0.3 ? new Date(Date.now() - randomFloat(0, 86400000 * 7)).toISOString() : null,
        createdAt: new Date(Date.now() - randomFloat(0, 86400000 * 365)).toISOString()
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
  })
);

/**
 * Get user by ID
 */
router.get('/:id',
  AuthMiddleware.authenticate,
  AuthMiddleware.selfOrAdmin('id'),
  ValidationMiddleware.common.validateId,
  ErrorMiddleware.asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    
    // Add realistic delay
    await ResponseUtil.withDelay(async () => {
      // Mock user data
      const mockUser = {
        id: id,
        email: `user${id}@example.com`,
        name: `User ${id}`,
        role: ['admin', 'manager', 'user'][randomInt(0, 2)],
        active: true,
        lastLogin: new Date(Date.now() - randomFloat(0, 86400000 * 7)).toISOString(),
        createdAt: new Date(Date.now() - randomFloat(0, 86400000 * 365)).toISOString(),
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
          collectionsCount: randomInt(0, 49),
          filesCount: randomInt(0, 499),
          searchesCount: randomInt(0, 999)
        }
      };
      
      logger.info('User retrieved', {
        userId: id,
        requestId: req.requestId,
        requestorId: req.user?.id
      });
      
      return ResponseUtil.success(res, mockUser, 'User retrieved successfully');
    });
  })
);

/**
 * Update user
 */
router.put('/:id',
  AuthMiddleware.authenticate,
  AuthMiddleware.selfOrAdmin('id'),
  ValidationMiddleware.common.validateId,
  ValidationMiddleware.common.validateUserUpdate,
  ErrorMiddleware.asyncHandler(async (req: Request, res: Response) => {
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
        lastLogin: new Date(Date.now() - randomFloat(0, 86400000 * 7)).toISOString(),
        createdAt: new Date(Date.now() - randomFloat(0, 86400000 * 365)).toISOString(),
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
  })
);

/**
 * Update user (PATCH)
 */
router.patch('/:id',
  AuthMiddleware.authenticate,
  AuthMiddleware.selfOrAdmin('id'),
  ValidationMiddleware.common.validateId,
  ErrorMiddleware.asyncHandler(async (req: Request, res: Response) => {
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
        avatar: updateData.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${id}`,
        isActive: updateData.isActive !== undefined ? updateData.isActive : true,
        createdAt: new Date(Date.now() - randomFloat(0, 86400000 * 365)).toISOString(),
        updatedAt: new Date().toISOString(),
        permissions: updateData.permissions || []
      };
      
      logger.info('User updated', {
        userId: id,
        updateData,
        requestId: req.requestId,
        requestorId: req.user?.id
      });
      
      return ResponseUtil.success(res, updatedUser, 'User updated successfully');
    });
  })
);

/**
 * Delete user
 */
router.delete('/:id',
  AuthMiddleware.authenticate,
  AuthMiddleware.adminOnly,
  ValidationMiddleware.common.validateId,
  ErrorMiddleware.asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    
    // Add realistic delay
    await ResponseUtil.withDelay(async () => {
      // Prevent deleting own account
      if (req.user?.id === id) {
        return next(ErrorMiddleware.createError('Cannot delete your own account', 400, 'CANNOT_DELETE_OWN_ACCOUNT'));
      }
      
      logger.info('User deleted', {
        userId: id,
        requestId: req.requestId,
        requestorId: req.user?.id
      });
      
      return ResponseUtil.success(res, null, 'User deleted successfully');
    });
  })
);

/**
 * Invite user
 */
router.post('/invite',
  AuthMiddleware.authenticate,
  AuthMiddleware.managerOrAdmin,
  ErrorMiddleware.asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email, role = 'user' } = req.body;
    
    if (!email) {
      return next(ErrorMiddleware.createError('Email is required', 400, 'EMAIL_REQUIRED'));
    }
    
    // Add realistic delay
    await ResponseUtil.withDelay(async () => {
      const inviteToken = generateId('invite');
      
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
  })
);

/**
 * Update user role
 */
router.put('/:id/role',
  AuthMiddleware.authenticate,
  AuthMiddleware.adminOnly,
  ValidationMiddleware.common.validateId,
  ErrorMiddleware.asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { role } = req.body;
    
    if (!role || !['admin', 'manager', 'user'].includes(role)) {
      return next(ErrorMiddleware.createError('Invalid role specified', 400, 'INVALID_ROLE'));
    }
    
    // Add realistic delay
    await ResponseUtil.withDelay(async () => {
      // Prevent changing own role
      if (req.user?.id === id) {
        return next(ErrorMiddleware.createError('Cannot change your own role', 400, 'CANNOT_CHANGE_OWN_ROLE'));
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
  })
);

/**
 * Get user activity
 */
router.get('/:id/activity',
  AuthMiddleware.authenticate,
  AuthMiddleware.selfOrAdmin('id'),
  ValidationMiddleware.common.validateId,
  ValidationMiddleware.common.validatePagination,
  ErrorMiddleware.asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { page = 1, limit = 20 } = ResponseUtil.parsePagination(req.query);
    
    // Add realistic delay
    await ResponseUtil.withDelay(async () => {
      // Mock activity data
      const mockActivities = Array.from({ length: 30 }, (_, i) => ({
        id: `activity_${i + 1}`,
        type: ['login', 'logout', 'file_upload', 'search', 'collection_create', 'file_download'][randomInt(0, 5)],
        description: `Activity ${i + 1} description`,
        timestamp: new Date(Date.now() - randomFloat(0, 86400000 * 30)).toISOString(),
        metadata: {
          ip: `192.168.1.${randomInt(0, 254)}`,
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
  })
);

export default router;
