import { Router } from 'express';
import { AuthMiddleware } from '../middleware/auth';
import { ValidationMiddleware } from '../middleware/validation';
import { AuthController } from '../controllers/AuthController';
import { AuthService } from '../services/AuthService';
import { MockUserRepository } from '../repositories/mock/MockUserRepository';

const router = Router();

// Dependency injection setup
const userRepository = new MockUserRepository();
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

/**
 * User login
 */
router.post('/login',
  ValidationMiddleware.common.validateUserLogin,
  (req, res, next) => authController.login(req, res, next)
);

/**
 * User registration
 */
router.post('/register',
  ValidationMiddleware.common.validateUserRegistration,
  (req, res, next) => authController.register(req, res, next)
);

/**
 * User logout
 */
router.post('/logout',
  AuthMiddleware.mockAuthenticate,
  (req, res, next) => authController.logout(req, res, next)
);

/**
 * Refresh token
 */
router.post('/refresh',
  (req, res, next) => authController.refreshToken(req, res, next)
);

/**
 * Get current user
 */
router.get('/me',
  AuthMiddleware.mockAuthenticate,
  (req, res, next) => authController.getMe(req, res, next)
);

/**
 * Forgot password
 */
router.post('/forgot-password',
  (req, res, next) => authController.forgotPassword(req, res, next)
);

/**
 * Reset password
 */
router.post('/reset-password',
  (req, res, next) => authController.resetPassword(req, res, next)
);

export default router;
