import { Request, Response, NextFunction } from 'express';
import { UserController } from '../../src/controllers/UserController';
import { IUserService } from '../../src/services/interfaces/IUserService';
import { AuthUser } from '../../src/domain/models/AuthUser';

describe('UserController', () => {
  let userController: UserController;
  let mockUserService: jest.Mocked<IUserService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockUserService = {
      getUsers: jest.fn(),
      getUserById: jest.fn(),
      updateUser: jest.fn(),
      deleteUser: jest.fn(),
      inviteUser: jest.fn(),
      updateUserRole: jest.fn(),
      getUserActivity: jest.fn()
    };

    userController = new UserController(mockUserService);

    // Mock Express request/response
    mockRequest = {
      params: {},
      query: {},
      body: {},
      user: {
        id: 'user_1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'admin',
        active: true,
        createdAt: '2023-01-01T00:00:00.000Z'
      } as AuthUser
    } as Partial<Request>;

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis()
    };

    mockNext = jest.fn();
  });

  describe('getUserById', () => {
    it('should return user by id', async () => {
      const mockUser = {
        id: 'user_2',
        email: 'user2@example.com',
        name: 'User 2',
        role: 'user'
      };

      mockRequest.params = { id: 'user_2' };
      mockUserService.getUserById.mockResolvedValue(mockUser as any);

      await userController.getUserById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockUserService.getUserById).toHaveBeenCalledWith('user_2');
    });

    it('should handle user not found', async () => {
      mockRequest.params = { id: 'nonexistent' };
      mockUserService.getUserById.mockResolvedValue(null);

      await userController.getUserById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockUserService.getUserById).toHaveBeenCalledWith('nonexistent');
    });

    it('should handle service errors', async () => {
      const error = new Error('Service error');
      mockRequest.params = { id: 'user_2' };
      mockUserService.getUserById.mockRejectedValue(error);

      await userController.getUserById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('updateUser', () => {
    it('should update user successfully', async () => {
      const mockUser = {
        id: 'user_2',
        email: 'user2@example.com',
        name: 'Updated User',
        role: 'user'
      };

      mockRequest.params = { id: 'user_2' };
      mockRequest.body = { name: 'Updated User' };
      mockUserService.updateUser.mockResolvedValue(mockUser as any);

      await userController.updateUser(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockUserService.updateUser).toHaveBeenCalledWith('user_2', { name: 'Updated User' });
    });

    it('should handle update errors', async () => {
      const error = new Error('Update failed');
      mockRequest.params = { id: 'user_2' };
      mockRequest.body = { name: 'Updated' };
      mockUserService.updateUser.mockRejectedValue(error);

      await userController.updateUser(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      mockRequest.params = { id: 'user_2' };
      mockUserService.deleteUser.mockResolvedValue();

      await userController.deleteUser(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockUserService.deleteUser).toHaveBeenCalledWith('user_2', (mockRequest as any).user);
    });

    it('should handle delete errors', async () => {
      const error = new Error('Delete failed');
      mockRequest.params = { id: 'user_2' };
      mockUserService.deleteUser.mockRejectedValue(error);

      await userController.deleteUser(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('inviteUser', () => {
    it('should invite user successfully', async () => {
      const mockInvite = {
        inviteToken: 'token_123',
        expiresAt: '2024-01-01T00:00:00.000Z'
      };

      mockRequest.body = { email: 'newuser@example.com', role: 'user' };
      mockUserService.inviteUser.mockResolvedValue(mockInvite as any);

      await userController.inviteUser(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockUserService.inviteUser).toHaveBeenCalledWith('newuser@example.com', 'user');
    });

    it('should handle invite errors', async () => {
      const error = new Error('Invite failed');
      mockRequest.body = { email: 'test@example.com' };
      mockUserService.inviteUser.mockRejectedValue(error);

      await userController.inviteUser(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
