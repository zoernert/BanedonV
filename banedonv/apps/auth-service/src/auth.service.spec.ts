import { AuthService } from './auth.service';
import jwt from 'jsonwebtoken';

// Mock the jsonwebtoken library
jest.mock('jsonwebtoken');
const mockedJwt = jwt as jest.Mocked<typeof jwt>;

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
    process.env.JWT_SECRET = 'test-secret';
  });

  afterEach(() => {
    jest.clearAllMocks();
    delete process.env.JWT_SECRET;
  });

  describe('generateToken', () => {
    it('should generate a JWT token', () => {
      const userId = '123';
      const email = 'test@example.com';
      const token = 'mocked-token';

      mockedJwt.sign.mockReturnValue(token as any);

      const result = authService.generateToken(userId, email);

      expect(result).toBe(token);
      expect(mockedJwt.sign).toHaveBeenCalledWith(
        { userId, email },
        'test-secret',
        { expiresIn: '1h' }
      );
    });
  });

  describe('verifyToken', () => {
    it('should verify a token and return the payload', () => {
      const token = 'valid-token';
      const payload = { userId: '123', email: 'test@example.com' };

      mockedJwt.verify.mockReturnValue(payload as any);

      const result = authService.verifyToken(token);

      expect(result).toEqual(payload);
      expect(mockedJwt.verify).toHaveBeenCalledWith(token, 'test-secret');
    });

    it('should return null for an invalid token', () => {
      const token = 'invalid-token';

      mockedJwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      const result = authService.verifyToken(token);

      expect(result).toBeNull();
      expect(mockedJwt.verify).toHaveBeenCalledWith(token, 'test-secret');
    });
  });
});
