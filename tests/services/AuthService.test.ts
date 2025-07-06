import { AuthService } from '../../src/services/AuthService';
import { IUserRepository } from '../../src/repositories/interfaces/IUserRepository';
import { User } from '../../src/domain/models/User';
import { AuthError, UserError, ValidationError } from '../../src/domain/errors';
import * as cryptoUtil from '../../src/utils/crypto.util';
import { validatePasswordStrength } from '../../src/validation-helpers/password.validator';

// Mock the entire crypto utility module and the password validator
jest.mock('../../src/utils/crypto.util');
jest.mock('../../src/validation-helpers/password.validator');

// Create typed mocks for the mocked modules
const mockCrypto = cryptoUtil as jest.Mocked<typeof cryptoUtil>;
const mockValidatePassword = validatePasswordStrength as jest.Mock;

describe('AuthService', () => {
  let authService: AuthService;
  let mockUserRepository: jest.Mocked<IUserRepository>;
  const testUser: User = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    role: 'user',
    active: true,
    password: 'hashed_password_from_db',
    createdAt: new Date().toISOString(),
  };

  beforeEach(() => {
    // Reset all mocks before each test to ensure test isolation
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

    // Provide default successful implementations for our mocked functions
    mockCrypto.comparePassword.mockResolvedValue(true);
    mockCrypto.hashPassword.mockResolvedValue('new_hashed_password');
    mockCrypto.generateAuthTokens.mockReturnValue({ token: 'test_token', refreshToken: 'test_refresh_token' });
    mockValidatePassword.mockReturnValue({ isValid: true, errors: [] });
  });

  describe('loginUser', () => {
    it('should return user and tokens for valid credentials', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(testUser);

      const result = await authService.loginUser(testUser.email, 'correct_password');

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(testUser.email);
      expect(mockCrypto.comparePassword).toHaveBeenCalledWith('correct_password', testUser.password);
      expect(mockUserRepository.update).toHaveBeenCalledWith(testUser.id, expect.any(Object));
      expect(mockCrypto.generateAuthTokens).toHaveBeenCalledWith(testUser);
      expect(result.token).toBe('test_token');
      expect(result.user.email).toBe(testUser.email);
    });

    it('should throw AuthError for a non-existent user', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);
      
      await expect(authService.loginUser('nouser@example.com', 'password')).rejects.toThrow(AuthError.invalidCredentials());
    });

    it('should throw AuthError for an incorrect password', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(testUser);
      mockCrypto.comparePassword.mockResolvedValue(false); // Simulate incorrect password

      await expect(authService.loginUser(testUser.email, 'wrong_password')).rejects.toThrow(AuthError.invalidCredentials());
    });

    it('should throw AuthError for an inactive user', async () => {
      const inactiveUser = { ...testUser, active: false };
      mockUserRepository.findByEmail.mockResolvedValue(inactiveUser);

      await expect(authService.loginUser(inactiveUser.email, 'password')).rejects.toThrow('User account is inactive');
    });
  });

  describe('registerUser', () => {
    const registerDto = { name: 'New User', email: 'new@example.com', password: 'password123' };

    it('should create a new user and return tokens', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);
      // Ensure the create mock returns the user with the hashed password
      mockUserRepository.create.mockImplementation(dto => Promise.resolve({ ...testUser, ...dto, password: dto.password as string }));

      const result = await authService.registerUser(registerDto);

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(registerDto.email);
      expect(mockValidatePassword).toHaveBeenCalledWith(registerDto.password);
      expect(mockCrypto.hashPassword).toHaveBeenCalledWith(registerDto.password);
      expect(mockUserRepository.create).toHaveBeenCalledWith(expect.objectContaining({ email: registerDto.email, password: 'new_hashed_password' }));
      expect(result.token).toBe('test_token');
      expect(result.user.email).toBe(registerDto.email);
    });

    it('should throw UserError if email already exists', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(testUser);

      await expect(authService.registerUser(registerDto)).rejects.toThrow(UserError.emailExists());
    });

    it('should throw ValidationError if password is too weak', async () => {
      mockValidatePassword.mockReturnValue({ isValid: false, errors: ['too short'] });

      await expect(authService.registerUser(registerDto)).rejects.toThrow(ValidationError);
      await expect(authService.registerUser(registerDto)).rejects.toThrow('too short');
    });
  });
});
