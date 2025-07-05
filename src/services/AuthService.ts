import jwt from 'jsonwebtoken';
import { IAuthService, LoginResult, RegisterResult, RegisterUserDto, TokenResult } from './interfaces/IAuthService';
import { IUserRepository } from '../repositories/interfaces/IUserRepository';
import { authConfig } from '../config/auth';
import { AuthError } from '../domain/errors/AuthError';
import { AuthUser } from '../domain/models/AuthUser';
import { User } from '../domain/models/User';
import { logAuth, default as logger } from '../utils/logger';
import { ValidationError } from '../domain/errors/ValidationError';
import { generateId } from '../utils/id.util';
import { ErrorCodes } from '../domain/errors/ErrorCodes';

export class AuthService implements IAuthService {
  constructor(private userRepository: IUserRepository) {}

  private toAuthUser(user: User): AuthUser {
    const { password, ...authUser } = user;
    return authUser;
  }

  private generateToken(user: AuthUser): string {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role
    };
    return jwt.sign(payload, authConfig.jwtSecret, { expiresIn: '1h' });
  }

  private generateRefreshToken(user: AuthUser): string {
    const payload = {
      id: user.id,
      type: 'refresh'
    };
    return jwt.sign(payload, authConfig.jwtSecret, { expiresIn: '7d' });
  }

  async verifyToken(token: string): Promise<AuthUser | null> {
    try {
      const decoded = jwt.verify(token, authConfig.jwtSecret) as any;
      const user = await this.userRepository.findById(decoded.id);

      if (!user || !user.active) {
        return null;
      }

      return this.toAuthUser(user);
    } catch (error) {
      logger.warn('Token verification failed', { error: (error as Error).message });
      return null;
    }
  }

  async loginUser(email: string, password: string): Promise<LoginResult> {
    const user = await this.userRepository.findByEmail(email);

    if (!user || !user.active) {
      logAuth('login_attempt', undefined, false, { email, reason: 'user_not_found' });
      throw AuthError.invalidCredentials();
    }

    // For mock purposes, we'll compare plain text
    if (password !== user.password) {
      logAuth('login_attempt', user.id, false, { email, reason: 'invalid_password' });
      throw AuthError.invalidCredentials();
    }

    await this.userRepository.update(user.id, { lastLogin: new Date().toISOString() });
    const updatedUser = (await this.userRepository.findById(user.id))!;
    const authUser = this.toAuthUser(updatedUser);

    const token = this.generateToken(authUser);
    const refreshToken = this.generateRefreshToken(authUser);

    logAuth('login_success', user.id, true, { email });

    return {
      user: authUser,
      token,
      refreshToken,
      expiresIn: '1h'
    };
  }

  async registerUser(userData: RegisterUserDto): Promise<RegisterResult> {
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw AuthError.userExists();
    }

    const newUser = await this.userRepository.create({
      ...userData,
      password: userData.password // In mock, store plain text
    });

    const authUser = this.toAuthUser(newUser);
    const token = this.generateToken(authUser);
    const refreshToken = this.generateRefreshToken(authUser);

    return {
      user: authUser,
      token,
      refreshToken,
      expiresIn: '1h'
    };
  }

  async refreshToken(token: string): Promise<TokenResult> {
    if (!token) {
      throw AuthError.refreshTokenRequired();
    }

    try {
      const decoded = jwt.verify(token, authConfig.jwtSecret) as any;
      if (decoded.type !== 'refresh') {
        throw AuthError.invalidRefreshToken();
      }

      const user = await this.userRepository.findById(decoded.id);
      if (!user || !user.active) {
        throw AuthError.invalidRefreshToken();
      }

      const authUser = this.toAuthUser(user);
      const newToken = this.generateToken(authUser);
      const newRefreshToken = this.generateRefreshToken(authUser);

      return {
        token: newToken,
        refreshToken: newRefreshToken,
        expiresIn: '1h'
      };
    } catch (error) {
      throw AuthError.invalidRefreshToken();
    }
  }

  async forgotPassword(email: string): Promise<{ message: string; resetToken: string; }> {
    if (!email) {
      throw new ValidationError(ErrorCodes.VALIDATION.REQUIRED_FIELD, 'Email is required');
    }

    const resetToken = generateId('reset');
    
    logger.info('Password reset requested', {
      email,
      resetToken
    });

    return {
      message: 'Password reset instructions sent to your email',
      resetToken: resetToken
    };
  }

  async resetPassword(resetToken: string, newPassword: string): Promise<void> {
    if (!resetToken || !newPassword) {
      throw new ValidationError(ErrorCodes.VALIDATION.INVALID_REQUEST, 'Reset token and new password are required');
    }

    if (!resetToken.startsWith('reset_')) {
      throw AuthError.invalidToken();
    }
    
    logger.info('Password reset completed', {
        resetToken,
    });

    return Promise.resolve();
  }
}
