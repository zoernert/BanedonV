import { Router } from 'express';
import { AuthMiddleware } from '../middleware/auth';
import { ValidationMiddleware } from '../middleware/validation';
import { AuthService } from '../services/AuthService';
import { MockUserRepository } from '../repositories/mock/MockUserRepository';
import { UserController } from '../controllers/UserController';
import { UserService } from '../services/UserService';

const router = Router();

// Dependency Injection
const userRepository = new MockUserRepository();
const authService = new AuthService(userRepository);
const userService = new UserService(userRepository);
const userController = new UserController(userService);

const authenticate = AuthMiddleware.mockAuthenticate;

/**
 * Get all users (Admin only)
 */
router.get('/',
  authenticate,
  AuthMiddleware.adminOnly,
  ValidationMiddleware.common.validatePagination,
  (req, res, next) => userController.getUsers(req, res, next)
);

/**
 * Get user by ID
 */
router.get('/:id',
  authenticate,
  AuthMiddleware.selfOrAdmin('id'),
  ValidationMiddleware.common.validateId,
  (req, res, next) => userController.getUserById(req, res, next)
);

/**
 * Update user
 */
router.put('/:id',
  authenticate,
  AuthMiddleware.selfOrAdmin('id'),
  ValidationMiddleware.common.validateId,
  ValidationMiddleware.common.validateUserUpdate,
  (req, res, next) => userController.updateUser(req, res, next)
);

/**
 * Update user (PATCH)
 */
router.patch('/:id',
  authenticate,
  AuthMiddleware.selfOrAdmin('id'),
  ValidationMiddleware.common.validateId,
  ValidationMiddleware.common.validateUserUpdate,
  (req, res, next) => userController.updateUser(req, res, next)
);

/**
 * Delete user
 */
router.delete('/:id',
  authenticate,
  AuthMiddleware.adminOnly,
  ValidationMiddleware.common.validateId,
  (req, res, next) => userController.deleteUser(req, res, next)
);

/**
 * Invite user
 */
router.post('/invite',
  authenticate,
  AuthMiddleware.managerOrAdmin,
  (req, res, next) => userController.inviteUser(req, res, next)
);

/**
 * Update user role
 */
router.put('/:id/role',
  authenticate,
  AuthMiddleware.adminOnly,
  ValidationMiddleware.common.validateId,
  (req, res, next) => userController.updateUserRole(req, res, next)
);

/**
 * Get user activity
 */
router.get('/:id/activity',
  authenticate,
  AuthMiddleware.selfOrAdmin('id'),
  ValidationMiddleware.common.validateId,
  ValidationMiddleware.common.validatePagination,
  (req, res, next) => userController.getUserActivity(req, res, next)
);

export default router;
