import { AuthService } from '../../src/services/AuthService';
import { IUserRepository } from '../../src/repositories/interfaces/IUserRepository';
import { User } from '../../src/domain/models/User';
import { AuthError, ValidationError } from '../../src/domain/errors';

describe('AuthService', () => {
  let authService: AuthService;
  let mockUserRepository: jest.Mocked<IUserRepository>;
  const testUser: User = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    role: 'user',
    active: true,
    password: 'test_password',
    createdAt: new Date().toISOString(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockUserRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
    };
    
    authService = new AuthService(mockUserRepository);
  });

  describe('loginUser', () => {
    it('should return user and tokens for valid credentials', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(testUser);
      mockUserRepository.update.mockResolvedValue({ ...testUser, lastLogin: new Date().toISOString() });
      mockUserRepository.findById.mockResolvedValue({ ...testUser, lastLogin: new Date().toISOString() });

      const result = await authService.loginUser(testUser.email, 'test_password');

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(testUser.email);
      expect(mockUserRepository.update).toHaveBeenCalledWith(testUser.id, expect.objectContaining({ lastLogin: expect.any(String) }));
      expect(result.token).toBeDefined();
      expect(result.user.email).toBe(testUser.email);
      expect(result.user.id).toBe(testUser.id);
    });

    it('should throw AuthError for a non-existent user', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);
      
      await expect(authService.loginUser('nouser@example.com', 'password')).rejects.toThrow(AuthError);
    });

    it('should throw AuthError for an incorrect password', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(testUser);

      await expect(authService.loginUser(testUser.email, 'wrong_password')).rejects.toThrow(AuthError);
    });

    it('should throw AuthError for an inactive user', async () => {
      const inactiveUser = { ...testUser, active: false };
      mockUserRepository.findByEmail.mockResolvedValue(inactiveUser);

      await expect(authService.loginUser(inactiveUser.email, 'test_password')).rejects.toThrow(AuthError);
    });
  });

  describe('registerUser', () => {
    const registerDto = { name: 'New User', email: 'new@example.com', password: 'password123' };

    it('should create a new user and return tokens', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);
      const newUser = { ...testUser, ...registerDto, id: '2' };
      mockUserRepository.create.mockResolvedValue(newUser);

      const result = await authService.registerUser(registerDto);

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(registerDto.email);
      expect(mockUserRepository.create).toHaveBeenCalledWith(expect.objectContaining({ 
        email: registerDto.email, 
        password: registerDto.password 
      }));
      expect(result.token).toBeDefined();
      expect(result.user.email).toBe(registerDto.email);
    });

    it('should throw AuthError if email already exists', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(testUser);

      await expect(authService.registerUser(registerDto)).rejects.toThrow(AuthError);
    });
  });

  describe('refreshToken', () => {
    it('should throw AuthError if token is missing', async () => {
      await expect(authService.refreshToken('')).rejects.toThrow(AuthError);
    });
  });

  describe('forgotPassword', () => {
    it('should return reset token for valid email', async () => {
      const result = await authService.forgotPassword('test@example.com');

      expect(result.message).toBe('Password reset instructions sent to your email');
      expect(result.resetToken).toBeDefined();
      expect(result.resetToken).toMatch(/^reset_/);
    });

    it('should throw ValidationError if email is missing', async () => {
      await expect(authService.forgotPassword('')).rejects.toThrow(ValidationError);
    });
  });

  describe('resetPassword', () => {
    it('should complete password reset with valid token', async () => {
      await expect(authService.resetPassword('reset_123', 'newpassword')).resolves.toBeUndefined();
    });

    it('should throw ValidationError if token is missing', async () => {
      await expect(authService.resetPassword('', 'newpassword')).rejects.toThrow(ValidationError);
    });

    it('should throw ValidationError if password is missing', async () => {
      await expect(authService.resetPassword('reset_123', '')).rejects.toThrow(ValidationError);
    });

    it('should throw AuthError if token is invalid', async () => {
      await expect(authService.resetPassword('invalid_token', 'newpassword')).rejects.toThrow(AuthError);
    });
  });
});
