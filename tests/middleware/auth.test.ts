import { Request, Response, NextFunction } from 'express';
import { AuthMiddleware } from '../../src/middleware/auth';
import { IAuthService } from '../../src/services/interfaces/IAuthService';
import { AuthUser } from '../../src/domain/models/AuthUser';
import { ErrorMiddleware } from '../../src/middleware/error';

// Mock logger
jest.mock('../../src/utils/logger', () => ({
  logAuth: jest.fn(),
}));

// Mock error middleware
jest.mock('../../src/middleware/error', () => ({
  ErrorMiddleware: {
    createError: jest.fn((message, status, code) => ({
      message,
      status,
      code,
      name: 'TestError'
    }))
  }
}));

describe('AuthMiddleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    mockRequest = {
      headers: {},
      originalUrl: '/test',
      params: {}
    };
    mockResponse = {};
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe('mockAuthenticate', () => {
    it('should reject requests without authorization header', () => {
      AuthMiddleware.mockAuthenticate(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Authentication token required',
        status: 401
      }));
    });

    it('should reject requests without Bearer token', () => {
      mockRequest.headers!.authorization = 'Basic token';

      AuthMiddleware.mockAuthenticate(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Authentication token required',
        status: 401
      }));
    });

    it('should create mock user when Bearer token is present', () => {
      mockRequest.headers!.authorization = 'Bearer mock-token';

      AuthMiddleware.mockAuthenticate(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRequest.user).toBeDefined();
      expect(mockRequest.user!.id).toBe('user_1');
      expect(mockRequest.user!.email).toBe('admin@banedonv.com');
      expect(mockRequest.user!.role).toBe('admin');
      expect(mockNext).toHaveBeenCalledWith();
    });
  });

  describe('authenticateWithService', () => {
    let mockAuthService: jest.Mocked<IAuthService>;
    let mockUser: AuthUser;

    beforeEach(() => {
      mockUser = {
        id: 'user_1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
        active: true,
        lastLogin: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      mockAuthService = {
        verifyToken: jest.fn(),
        loginUser: jest.fn(),
        registerUser: jest.fn(),
        refreshToken: jest.fn(),
        forgotPassword: jest.fn(),
        resetPassword: jest.fn()
      };
    });

    it('should reject requests without authorization header', async () => {
      const middleware = AuthMiddleware.authenticateWithService(mockAuthService);
      await middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Authentication token required',
        status: 401
      }));
    });

    it('should reject requests with invalid token', async () => {
      mockRequest.headers!.authorization = 'Bearer invalid-token';
      mockAuthService.verifyToken.mockResolvedValue(null);

      const middleware = AuthMiddleware.authenticateWithService(mockAuthService);
      await middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Invalid authentication token',
        status: 401
      }));
    });

    it('should set user and continue with valid token', async () => {
      mockRequest.headers!.authorization = 'Bearer valid-token';
      mockAuthService.verifyToken.mockResolvedValue(mockUser);

      const middleware = AuthMiddleware.authenticateWithService(mockAuthService);
      await middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRequest.user).toBe(mockUser);
      expect(mockNext).toHaveBeenCalledWith();
    });
  });

  describe('optionalAuthenticate', () => {
    let mockAuthService: jest.Mocked<IAuthService>;
    let mockUser: AuthUser;

    beforeEach(() => {
      mockUser = {
        id: 'user_1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
        active: true,
        lastLogin: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      mockAuthService = {
        verifyToken: jest.fn(),
        loginUser: jest.fn(),
        registerUser: jest.fn(),
        refreshToken: jest.fn(),
        forgotPassword: jest.fn(),
        resetPassword: jest.fn()
      };
    });

    it('should continue without user when no authorization header', async () => {
      const middleware = AuthMiddleware.optionalAuthenticate(mockAuthService);
      await middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRequest.user).toBeUndefined();
      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should continue without user when token is invalid', async () => {
      mockRequest.headers!.authorization = 'Bearer invalid-token';
      mockAuthService.verifyToken.mockResolvedValue(null);

      const middleware = AuthMiddleware.optionalAuthenticate(mockAuthService);
      await middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRequest.user).toBeUndefined();
      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should set user when token is valid', async () => {
      mockRequest.headers!.authorization = 'Bearer valid-token';
      mockAuthService.verifyToken.mockResolvedValue(mockUser);

      const middleware = AuthMiddleware.optionalAuthenticate(mockAuthService);
      await middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRequest.user).toBe(mockUser);
      expect(mockNext).toHaveBeenCalledWith();
    });
  });

  describe('authorize', () => {
    it('should reject requests without authenticated user', () => {
      const middleware = AuthMiddleware.authorize('admin');
      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Authentication required',
        status: 401
      }));
    });

    it('should reject users without required role', () => {
      mockRequest.user = {
        id: 'user_1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
        active: true,
        lastLogin: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const middleware = AuthMiddleware.authorize('admin');
      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Insufficient permissions',
        status: 403
      }));
    });

    it('should allow users with required role', () => {
      mockRequest.user = {
        id: 'user_1',
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'admin',
        active: true,
        lastLogin: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const middleware = AuthMiddleware.authorize('admin');
      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should allow users with any of multiple required roles', () => {
      mockRequest.user = {
        id: 'user_1',
        email: 'manager@example.com',
        name: 'Manager User',
        role: 'manager',
        active: true,
        lastLogin: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const middleware = AuthMiddleware.authorize(['admin', 'manager']);
      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
    });
  });

  describe('adminOnly', () => {
    it('should call authorize with admin role', () => {
      const authorizeSpy = jest.spyOn(AuthMiddleware, 'authorize');
      authorizeSpy.mockReturnValue(jest.fn());

      AuthMiddleware.adminOnly(mockRequest as Request, mockResponse as Response, mockNext);

      expect(authorizeSpy).toHaveBeenCalledWith('admin');
      authorizeSpy.mockRestore();
    });
  });

  describe('managerOrAdmin', () => {
    it('should call authorize with manager and admin roles', () => {
      const authorizeSpy = jest.spyOn(AuthMiddleware, 'authorize');
      authorizeSpy.mockReturnValue(jest.fn());

      AuthMiddleware.managerOrAdmin(mockRequest as Request, mockResponse as Response, mockNext);

      expect(authorizeSpy).toHaveBeenCalledWith(['admin', 'manager']);
      authorizeSpy.mockRestore();
    });
  });

  describe('selfOrAdmin', () => {
    it('should reject requests without authenticated user', () => {
      const middleware = AuthMiddleware.selfOrAdmin();
      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Authentication required',
        status: 401
      }));
    });

    it('should allow admin access to any user', () => {
      mockRequest.user = {
        id: 'admin_1',
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'admin',
        active: true,
        lastLogin: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      mockRequest.params!.id = 'user_2';

      const middleware = AuthMiddleware.selfOrAdmin();
      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should allow users to access their own resources', () => {
      mockRequest.user = {
        id: 'user_1',
        email: 'user@example.com',
        name: 'User',
        role: 'user',
        active: true,
        lastLogin: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      mockRequest.params!.id = 'user_1';

      const middleware = AuthMiddleware.selfOrAdmin();
      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should reject users accessing other users resources', () => {
      mockRequest.user = {
        id: 'user_1',
        email: 'user@example.com',
        name: 'User',
        role: 'user',
        active: true,
        lastLogin: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      mockRequest.params!.id = 'user_2';

      const middleware = AuthMiddleware.selfOrAdmin();
      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Access denied',
        status: 403
      }));
    });

    it('should use custom user ID parameter', () => {
      mockRequest.user = {
        id: 'user_1',
        email: 'user@example.com',
        name: 'User',
        role: 'user',
        active: true,
        lastLogin: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      mockRequest.params!.userId = 'user_1';

      const middleware = AuthMiddleware.selfOrAdmin('userId');
      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
    });
  });

  describe('checkPermission', () => {
    it('should reject requests without authenticated user', () => {
      const middleware = AuthMiddleware.checkPermission('read:users');
      middleware(mockRequest as Request, mockResponse as Response, mockNext);
      expect(mockNext).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Authentication required',
        status: 401
      }));
    });

    it('should reject requests with invalid user role', () => {
      mockRequest.user = {
        id: 'user_1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'invalid_role' as any,
        active: true,
        lastLogin: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      const middleware = AuthMiddleware.checkPermission('read:users');
      middleware(mockRequest as Request, mockResponse as Response, mockNext);
      expect(mockNext).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Invalid user role',
        status: 403
      }));
    });

    it('should reject requests without required permission', () => {
      mockRequest.user = {
        id: 'user_1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
        active: true,
        lastLogin: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      const middleware = AuthMiddleware.checkPermission('admin:only');
      middleware(mockRequest as Request, mockResponse as Response, mockNext);
      expect(mockNext).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Permission denied',
        status: 403
      }));
    });

    it('should allow requests with required permission', () => {
      mockRequest.user = {
        id: 'admin_1',
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'admin',
        active: true,
        lastLogin: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      const middleware = AuthMiddleware.checkPermission('read:users');
      middleware(mockRequest as Request, mockResponse as Response, mockNext);
      expect(mockNext).toHaveBeenCalledWith();
    });
  });
});
