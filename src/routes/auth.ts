/**
 * Authentication Routes
 * User authentication and session management
 */

import { Router, Request, Response } from 'express';
import { AuthMiddleware } from '../middleware/auth';
import { ValidationMiddleware } from '../middleware/validation';
import ResponseUtil from '../utils/response';
import logger from '../utils/logger';

const router = Router();

/**
 * User login
 */
router.post('/login', 
  ValidationMiddleware.common.validateUserLogin,
  async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      
      // Add realistic delay
      await ResponseUtil.withDelay(async () => {
        const user = await AuthMiddleware.authenticateUser(email, password);
        
        if (!user) {
          return ResponseUtil.unauthorized(res, 'Invalid credentials');
        }
        
        const token = AuthMiddleware.generateToken(user);
        const refreshToken = AuthMiddleware.generateRefreshToken(user);
        
        logger.info('User logged in successfully', {
          userId: user.id,
          email: user.email,
          requestId: req.requestId
        });
        
        return ResponseUtil.success(res, {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            lastLogin: user.lastLogin,
            createdAt: user.createdAt
          },
          token,
          refreshToken,
          expiresIn: '1h'
        }, 'Login successful');
      });
    } catch (error) {
      logger.error('Login error', { error: (error as Error).message, requestId: req.requestId });
      ResponseUtil.internalServerError(res, 'Login failed');
    }
  }
);

/**
 * User registration
 */
router.post('/register',
  ValidationMiddleware.common.validateUserRegistration,
  async (req: Request, res: Response) => {
    try {
      const { email, password, name, role = 'user' } = req.body;
      
      // Add realistic delay
      await ResponseUtil.withDelay(async () => {
        // Check if user already exists
        const existingUser = await AuthMiddleware.authenticateUser(email, 'dummy');
        if (existingUser) {
          return ResponseUtil.error(res, 'USER_EXISTS', 'User already exists', 400);
        }
        
        // Create new user (mock)
        const newUser = {
          id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          email,
          name,
          role: role as 'admin' | 'manager' | 'user',
          active: true,
          createdAt: new Date().toISOString()
        };
        
        const token = AuthMiddleware.generateToken(newUser);
        const refreshToken = AuthMiddleware.generateRefreshToken(newUser);
        
        logger.info('User registered successfully', {
          userId: newUser.id,
          email: newUser.email,
          requestId: req.requestId
        });
        
        return ResponseUtil.success(res, {
          user: {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            role: newUser.role,
            createdAt: newUser.createdAt
          },
          token,
          refreshToken,
          expiresIn: '1h'
        }, 'Registration successful', 201);
      });
    } catch (error) {
      logger.error('Registration error', { error: (error as Error).message, requestId: req.requestId });
      ResponseUtil.internalServerError(res, 'Registration failed');
    }
  }
);

/**
 * User logout
 */
router.post('/logout',
  AuthMiddleware.authenticate,
  async (req: Request, res: Response) => {
    try {
      // Add realistic delay
      await ResponseUtil.withDelay(async () => {
        logger.info('User logged out', {
          userId: req.user?.id,
          requestId: req.requestId
        });
        
        return ResponseUtil.success(res, null, 'Logout successful');
      });
    } catch (error) {
      logger.error('Logout error', { error: (error as Error).message, requestId: req.requestId });
      ResponseUtil.internalServerError(res, 'Logout failed');
    }
  }
);

/**
 * Refresh token
 */
router.post('/refresh',
  async (req: Request, res: Response) => {
    try {
      const { refreshToken } = req.body;
      
      if (!refreshToken) {
        return ResponseUtil.error(res, 'REFRESH_TOKEN_REQUIRED', 'Refresh token required', 400);
      }
      
      // Add realistic delay
      await ResponseUtil.withDelay(async () => {
        const user = AuthMiddleware.verifyToken(refreshToken);
        
        if (!user) {
          return ResponseUtil.unauthorized(res, 'Invalid refresh token');
        }
        
        const newToken = AuthMiddleware.generateToken(user);
        const newRefreshToken = AuthMiddleware.generateRefreshToken(user);
        
        logger.info('Token refreshed', {
          userId: user.id,
          requestId: req.requestId
        });
        
        return ResponseUtil.success(res, {
          token: newToken,
          refreshToken: newRefreshToken,
          expiresIn: '1h'
        }, 'Token refreshed successfully');
      });
    } catch (error) {
      logger.error('Token refresh error', { error: (error as Error).message, requestId: req.requestId });
      ResponseUtil.internalServerError(res, 'Token refresh failed');
    }
  }
);

/**
 * Get current user
 */
router.get('/me',
  AuthMiddleware.authenticate,
  async (req: Request, res: Response) => {
    try {
      // Add realistic delay
      await ResponseUtil.withDelay(async () => {
        const user = req.user;
        
        return ResponseUtil.success(res, {
          id: user?.id,
          email: user?.email,
          name: user?.name,
          role: user?.role,
          active: user?.active,
          lastLogin: user?.lastLogin,
          createdAt: user?.createdAt
        }, 'User profile retrieved');
      });
    } catch (error) {
      logger.error('Get profile error', { error: (error as Error).message, requestId: req.requestId });
      ResponseUtil.internalServerError(res, 'Failed to get user profile');
    }
  }
);

/**
 * Forgot password
 */
router.post('/forgot-password',
  async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return ResponseUtil.error(res, 'EMAIL_REQUIRED', 'Email is required', 400);
      }
      
      // Add realistic delay
      await ResponseUtil.withDelay(async () => {
        // Mock password reset process
        const resetToken = `reset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        logger.info('Password reset requested', {
          email,
          resetToken,
          requestId: req.requestId
        });
        
        return ResponseUtil.success(res, {
          message: 'Password reset instructions sent to your email',
          // In real implementation, don't return the token
          resetToken: resetToken
        }, 'Password reset initiated');
      });
    } catch (error) {
      logger.error('Forgot password error', { error: (error as Error).message, requestId: req.requestId });
      ResponseUtil.internalServerError(res, 'Password reset failed');
    }
  }
);

/**
 * Reset password
 */
router.post('/reset-password',
  async (req: Request, res: Response) => {
    try {
      const { resetToken, newPassword } = req.body;
      
      if (!resetToken || !newPassword) {
        return ResponseUtil.error(res, 'INVALID_REQUEST', 'Reset token and new password are required', 400);
      }
      
      // Add realistic delay
      await ResponseUtil.withDelay(async () => {
        // Mock password reset validation
        if (!resetToken.startsWith('reset_')) {
          return ResponseUtil.error(res, 'INVALID_TOKEN', 'Invalid reset token', 400);
        }
        
        logger.info('Password reset completed', {
          resetToken,
          requestId: req.requestId
        });
        
        return ResponseUtil.success(res, null, 'Password reset successful');
      });
    } catch (error) {
      logger.error('Reset password error', { error: (error as Error).message, requestId: req.requestId });
      ResponseUtil.internalServerError(res, 'Password reset failed');
    }
  }
);

export default router;
