/**
 * Authentication Middleware
 * Mock JWT authentication for development
 * CRITICAL: This is a MOCK authentication system - no real security
 */

import { Request, Response, NextFunction } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { authConfig, mockUsers, roles } from '../config/auth';
import logger, { logAuth } from '../utils/logger';
import { ErrorMiddleware } from './error';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'user';
  active: boolean;
  lastLogin?: string | undefined;
  createdAt: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
      requestId?: string;
    }
  }
}

export class AuthMiddleware {
  /**
   * Generate JWT token
   */
  static generateToken(user: AuthUser): string {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role
    };
    
    return jwt.sign(payload, authConfig.jwtSecret, { expiresIn: '1h' });
  }

  /**
   * Generate refresh token
   */
  static generateRefreshToken(user: AuthUser): string {
    const payload = {
      id: user.id,
      type: 'refresh'
    };
    
    return jwt.sign(payload, authConfig.jwtSecret, { expiresIn: '7d' });
  }

  /**
   * Hash password
   */
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, authConfig.bcryptSaltRounds);
  }

  /**
   * Compare password
   */
  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Mock user authentication
   */
  static async authenticateUser(email: string, password: string): Promise<AuthUser | null> {
    const user = mockUsers.find(u => u.email === email);
    
    if (!user || !user.active) {
      logAuth('login_attempt', undefined, false, { email, reason: 'user_not_found' });
      return null;
    }

    // In a real system, you would compare hashed passwords
    // For mock purposes, we'll compare plain text
    if (password !== user.password) {
      logAuth('login_attempt', user.id, false, { email, reason: 'invalid_password' });
      return null;
    }

    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as 'admin' | 'manager' | 'user',
      active: user.active,
      createdAt: user.createdAt
    };

    if (user.lastLogin) {
      authUser.lastLogin = user.lastLogin;
    }

    logAuth('login_success', user.id, true, { email });
    return authUser;
  }

  /**
   * Verify JWT token
   */
  static verifyToken(token: string): AuthUser | null {
    try {
      const decoded = jwt.verify(token, authConfig.jwtSecret) as any;
      const user = mockUsers.find(u => u.id === decoded.id);
      
      if (!user || !user.active) {
        return null;
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role as 'admin' | 'manager' | 'user',
        active: user.active,
        lastLogin: user.lastLogin || undefined,
        createdAt: user.createdAt
      };
    } catch (error) {
      logger.warn('Token verification failed', { error: (error as Error).message });
      return null;
    }
  }

  /**
   * Authentication middleware
   */
  static authenticate(req: Request, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logAuth('auth_missing', undefined, false, { url: req.originalUrl });
      return next(ErrorMiddleware.createError('Authentication token required', 401, 'AUTHENTICATION_TOKEN_REQUIRED'));
    }

    const token = authHeader.substring(7);
    const user = AuthMiddleware.verifyToken(token);

    if (!user) {
      logAuth('auth_invalid', undefined, false, { url: req.originalUrl });
      return next(ErrorMiddleware.createError('Invalid authentication token', 401, 'INVALID_TOKEN'));
    }

    req.user = user;
    logAuth('auth_success', user.id, true, { url: req.originalUrl });
    next();
  }

  /**
   * Optional authentication middleware
   */
  static optionalAuthenticate(req: Request, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const user = AuthMiddleware.verifyToken(token);
      
      if (user) {
        req.user = user;
        logAuth('optional_auth_success', user.id, true, { url: req.originalUrl });
      }
    }

    next();
  }

  /**
   * Role-based authorization middleware
   */
  static authorize(requiredRoles: string[] | string) {
    return (req: Request, res: Response, next: NextFunction): void => {
      if (!req.user) {
        logAuth('auth_required', undefined, false, { url: req.originalUrl });
        return next(ErrorMiddleware.createError('Authentication required', 401, 'AUTHENTICATION_REQUIRED'));
      }

      const allowedRoles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
      
      if (!allowedRoles.includes(req.user.role)) {
        logAuth('auth_insufficient', req.user.id, false, { 
          url: req.originalUrl, 
          userRole: req.user.role,
          requiredRoles: allowedRoles
        });
        return next(ErrorMiddleware.createError('Insufficient permissions', 403, 'FORBIDDEN'));
      }

      logAuth('auth_authorized', req.user.id, true, { 
        url: req.originalUrl, 
        userRole: req.user.role 
      });
      next();
    };
  }

  /**
   * Permission-based authorization middleware
   */
  static checkPermission(permission: string) {
    return (req: Request, res: Response, next: NextFunction): void => {
      if (!req.user) {
        return next(ErrorMiddleware.createError('Authentication required', 401, 'AUTHENTICATION_REQUIRED'));
      }

      const userRole = roles[req.user.role];
      if (!userRole) {
        return next(ErrorMiddleware.createError('Invalid user role', 403, 'FORBIDDEN'));
      }

      // Check if user has permission
      const hasPermission = userRole.permissions.includes('*') || 
                          userRole.permissions.includes(permission) ||
                          userRole.permissions.some(p => p.endsWith('*') && permission.startsWith(p.slice(0, -1)));

      if (!hasPermission) {
        logAuth('permission_denied', req.user.id, false, { 
          url: req.originalUrl, 
          permission,
          userRole: req.user.role
        });
        return next(ErrorMiddleware.createError('Permission denied', 403, 'FORBIDDEN'));
      }

      logAuth('permission_granted', req.user.id, true, { 
        url: req.originalUrl, 
        permission,
        userRole: req.user.role
      });
      next();
    };
  }

  /**
   * Admin only middleware
   */
  static adminOnly(req: Request, res: Response, next: NextFunction): void {
    AuthMiddleware.authorize('admin')(req, res, next);
  }

  /**
   * Manager or admin middleware
   */
  static managerOrAdmin(req: Request, res: Response, next: NextFunction): void {
    AuthMiddleware.authorize(['admin', 'manager'])(req, res, next);
  }

  /**
   * Self or admin middleware - allows users to access their own resources
   */
  static selfOrAdmin(userIdParam: string = 'id') {
    return (req: Request, res: Response, next: NextFunction): void => {
      if (!req.user) {
        return next(ErrorMiddleware.createError('Authentication required', 401, 'AUTHENTICATION_REQUIRED'));
      }

      const targetUserId = req.params[userIdParam];
      const isAdmin = req.user.role === 'admin';
      const isSelf = req.user.id === targetUserId;

      if (!isAdmin && !isSelf) {
        logAuth('self_access_denied', req.user.id, false, { 
          url: req.originalUrl, 
          targetUserId,
          userRole: req.user.role
        });
        return next(ErrorMiddleware.createError('Access denied', 403, 'FORBIDDEN'));
      }

      next();
    };
  }
}

export default AuthMiddleware;
