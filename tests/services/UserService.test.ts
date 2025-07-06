/**
 * UserService Tests
 * Comprehensive test suite for user service functionality
 */

import { UserService } from '../../src/services/UserService';
import { MockUserRepository } from '../../src/repositories/mock/MockUserRepository';
import { ValidationError } from '../../src/domain/errors/ValidationError';
import { UserError } from '../../src/domain/errors/UserError';
import { AuthUser } from '../../src/domain/models/AuthUser';
import { UpdateUserDto } from '../../src/domain/dtos/UpdateUser.dto';

describe('UserService', () => {
  let userService: UserService;
  let mockUserRepository: MockUserRepository;
  let mockActor: AuthUser;

  beforeEach(() => {
    mockUserRepository = new MockUserRepository();
    userService = new UserService(mockUserRepository);
    
    // Mock actor for operations requiring authentication
    mockActor = {
      id: 'admin_1',
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'admin',
      avatar: 'https://example.com/avatar.jpg',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      active: true
    };
  });

  describe('getUsers', () => {
    it('should return paginated users', async () => {
      const pagination = { page: 1, limit: 10 };
      
      const result = await userService.getUsers(pagination);
      
      expect(result).toHaveProperty('items');
      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('page');
      expect(result).toHaveProperty('limit');
      expect(result.items).toBeInstanceOf(Array);
      
      // Verify users don't have password field
      result.items.forEach(user => {
        expect(user).not.toHaveProperty('password');
        expect(user).toHaveProperty('id');
        expect(user).toHaveProperty('email');
        expect(user).toHaveProperty('name');
        expect(user).toHaveProperty('role');
      });
    });

    it('should handle pagination correctly', async () => {
      const pagination = { page: 2, limit: 5 };
      
      const result = await userService.getUsers(pagination);
      
      expect(result.page).toBe(2);
      expect(result.limit).toBe(5);
    });
  });

  describe('getUserById', () => {
    it('should return user by ID', async () => {
      const userId = 'user_1';
      
      const user = await userService.getUserById(userId);
      
      expect(user).toHaveProperty('id', userId);
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('name');
      expect(user).toHaveProperty('role');
      expect(user).not.toHaveProperty('password'); // Password should not be returned
      
      // Should include additional details
      expect(user).toHaveProperty('profile');
      expect(user).toHaveProperty('preferences');
      expect(user).toHaveProperty('statistics');
    });

    it('should return null for non-existent user', async () => {
      const nonExistentId = 'non_existent_user';
      
      const user = await userService.getUserById(nonExistentId);
      
      expect(user).toBeNull();
    });
  });

  describe('updateUser', () => {
    it('should update user successfully', async () => {
      const userId = 'user_1';
      const updateData: UpdateUserDto = {
        name: 'Updated Name',
        email: 'updated@example.com'
      };
      
      const updatedUser = await userService.updateUser(userId, updateData);
      
      expect(updatedUser).toHaveProperty('id', userId);
      expect(updatedUser).toHaveProperty('name', updateData.name);
      expect(updatedUser).toHaveProperty('email', updateData.email);
      expect(updatedUser).not.toHaveProperty('password');
    });

    it('should throw error for non-existent user', async () => {
      const nonExistentId = 'non_existent_user';
      const updateData: UpdateUserDto = { name: 'Updated Name' };
      
      await expect(userService.updateUser(nonExistentId, updateData))
        .rejects
        .toThrow(UserError);
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      const userId = 'user_1';
      
      await expect(userService.deleteUser(userId, mockActor))
        .resolves
        .not
        .toThrow();
      
      // Verify user is deleted
      const deletedUser = await userService.getUserById(userId);
      expect(deletedUser).toBeNull();
    });

    it('should throw error for non-existent user', async () => {
      const nonExistentId = 'non_existent_user';
      
      await expect(userService.deleteUser(nonExistentId, mockActor))
        .rejects
        .toThrow();
    });
  });

  describe('inviteUser', () => {
    it('should invite user successfully', async () => {
      const email = 'newuser@example.com';
      const role = 'user';
      
      const invitation = await userService.inviteUser(email, role);
      
      expect(invitation).toHaveProperty('inviteToken');
      expect(invitation).toHaveProperty('expiresAt');
      expect(typeof invitation.inviteToken).toBe('string');
      expect(invitation.inviteToken.length).toBeGreaterThan(0);
    });

    it('should create invite token for any email (validation handled at controller level)', async () => {
      const invalidEmail = 'invalid-email';
      const role = 'user';
      
      const result = await userService.inviteUser(invalidEmail, role);
      
      expect(result).toHaveProperty('inviteToken');
      expect(result).toHaveProperty('expiresAt');
    });

    it('should create invite token for any role (validation handled at controller level)', async () => {
      const email = 'newuser@example.com';
      const invalidRole = 'invalid_role' as any;
      
      const result = await userService.inviteUser(email, invalidRole);
      
      expect(result).toHaveProperty('inviteToken');
      expect(result).toHaveProperty('expiresAt');
    });
  });

  describe('updateUserRole', () => {
    it('should update user role successfully', async () => {
      const userId = 'user_1';
      const newRole = 'manager';
      
      const updatedUser = await userService.updateUserRole(userId, newRole, mockActor);
      
      expect(updatedUser).toHaveProperty('id', userId);
      expect(updatedUser).toHaveProperty('role', newRole);
    });

    it('should throw error for non-existent user', async () => {
      const nonExistentId = 'non_existent_user';
      const newRole = 'manager';
      
      await expect(userService.updateUserRole(nonExistentId, newRole, mockActor))
        .rejects
        .toThrow(UserError);
    });

    it('should throw error for invalid role', async () => {
      const userId = 'user_1';
      const invalidRole = 'invalid_role' as any;
      
      await expect(userService.updateUserRole(userId, invalidRole, mockActor))
        .rejects
        .toThrow(UserError);
    });
  });

  describe('getUserActivity', () => {
    it('should return user activity', async () => {
      const userId = 'user_1';
      const pagination = { page: 1, limit: 10 };
      
      const activity = await userService.getUserActivity(userId, pagination);
      
      expect(activity).toHaveProperty('items');
      expect(activity).toHaveProperty('total');
      expect(activity).toHaveProperty('page');
      expect(activity).toHaveProperty('limit');
      expect(activity.items).toBeInstanceOf(Array);
    });

    it('should handle pagination correctly', async () => {
      const userId = 'user_1';
      const pagination = { page: 2, limit: 5 };
      
      const activity = await userService.getUserActivity(userId, pagination);
      
      expect(activity.page).toBe(2);
      expect(activity.limit).toBe(5);
    });

    it('should return mock activity data (service returns mock data regardless of user existence)', async () => {
      const nonExistentId = 'non_existent_user';
      const pagination = { page: 1, limit: 10 };
      
      const activity = await userService.getUserActivity(nonExistentId, pagination);
      
      expect(activity).toHaveProperty('items');
      expect(activity.items).toBeInstanceOf(Array);
      expect(activity).toHaveProperty('total');
      expect(activity.total).toBeGreaterThan(0);
    });
  });

  describe('edge cases and error handling', () => {
    it('should handle empty pagination parameters', async () => {
      const pagination = { page: 1, limit: 0 };
      
      const result = await userService.getUsers(pagination);
      
      expect(result).toHaveProperty('items');
      expect(result).toHaveProperty('total');
    });

    it('should handle large pagination values', async () => {
      const pagination = { page: 1000, limit: 1000 };
      
      const result = await userService.getUsers(pagination);
      
      expect(result).toHaveProperty('items');
      expect(result).toHaveProperty('total');
    });

    it('should handle concurrent operations', async () => {
      const userId = 'user_1';
      const updateData1: UpdateUserDto = { name: 'Update 1' };
      const updateData2: UpdateUserDto = { name: 'Update 2' };
      
      const promises = [
        userService.updateUser(userId, updateData1),
        userService.updateUser(userId, updateData2)
      ];
      
      const results = await Promise.all(promises);
      
      expect(results).toHaveLength(2);
      results.forEach(result => {
        expect(result).toHaveProperty('id', userId);
      });
    });
  });
});
