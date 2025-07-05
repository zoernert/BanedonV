/**
 * Authentication Routes
 * User authentication and session management
 */

import { Router, Request, Response, NextFunction } from 'express';
import { AuthMiddleware } from '../middleware/auth';
import { ValidationMiddleware } from '../middleware/validation';
import ResponseUtil from '../utils/response';
import logger from '../utils/logger';
import { ErrorMiddleware } from '../middleware/error';

const router = Router();

/**
 * User login
 */
router.post('/login', 
  ValidationMiddleware.common.validateUserLogin,
  ErrorMiddleware.asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    
    // Add realistic delay
    await ResponseUtil.withDelay(async () => {
      const user = await AuthMiddleware.authenticateUser(email, password);
      
      if (!user) {
        return next(ErrorMiddleware.createError('Invalid credentials', 401, 'INVALID_CREDENTIALS'));
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
  })
);

/**
 * User registration
 */
router.post('/register',
  ValidationMiddleware.common.validateUserRegistration,
  ErrorMiddleware.asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, name, role = 'user' } = req.body;
    
    // Add realistic delay
    await ResponseUtil.withDelay(async () => {
      // Check if user already exists
      const existingUser = AuthMiddleware.findUserByEmail(email);
      if (existingUser) {
        return next(ErrorMiddleware.createError('Email already exists', 409, 'USER_EXISTS'));
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
  })
);

/**
 * User logout
 */
router.post('/logout',
  AuthMiddleware.authenticate,
  ErrorMiddleware.asyncHandler(async (req: Request, res: Response) => {
    // Add realistic delay
    await ResponseUtil.withDelay(async () => {
      logger.info('User logged out', {
        userId: req.user?.id,
        requestId: req.requestId
      });
      
      return ResponseUtil.success(res, null, 'Logged out successfully');
    });
  })
);

/**
 * Refresh token
 */
router.post('/refresh',
  ErrorMiddleware.asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return next(ErrorMiddleware.createError('Refresh token required', 400, 'REFRESH_TOKEN_REQUIRED'));
    }
    
    // Add realistic delay
    await ResponseUtil.withDelay(async () => {
      const user = AuthMiddleware.verifyToken(refreshToken);
      
      if (!user) {
        return next(ErrorMiddleware.createError('Invalid refresh token', 401, 'INVALID_REFRESH_TOKEN'));
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
  })
);

/**
 * Get current user
 */
router.get('/me',
  AuthMiddleware.authenticate,
  ErrorMiddleware.asyncHandler(async (req: Request, res: Response) => {
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
  })
);

/**
 * Forgot password
 */
router.post('/forgot-password',
  ErrorMiddleware.asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    
    if (!email) {
      return next(ErrorMiddleware.createError('Email is required', 400, 'EMAIL_REQUIRED'));
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
      }, 'Password reset email sent');
    });
  })
);

/**
 * Reset password
 */
router.post('/reset-password',
  ErrorMiddleware.asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { resetToken, newPassword } = req.body;
    
    if (!resetToken || !newPassword) {
      return next(ErrorMiddleware.createError('Reset token and new password are required', 400, 'INVALID_REQUEST'));
    }
    
    // Add realistic delay
    await ResponseUtil.withDelay(async () => {
      // Mock password reset validation
      if (!resetToken.startsWith('reset_')) {
        return next(ErrorMiddleware.createError('Invalid or expired reset token', 400, 'INVALID_TOKEN'));
      }
      
      logger.info('Password reset completed', {
        resetToken,
        requestId: req.requestId
      });
      
      return ResponseUtil.success(res, null, 'Password reset successfully');
    });
  })
);

export default router;
