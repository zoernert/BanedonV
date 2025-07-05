import { Request, Response, NextFunction } from 'express';
import { BaseController } from './BaseController';
import { IAuthService, RegisterUserDto } from '../services/interfaces/IAuthService';
import ResponseUtil from '../utils/response';
import logger from '../utils/logger';

export class AuthController extends BaseController {
  constructor(private authService: IAuthService) {
    super();
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.executeWithDelay(
        () => this.authService.loginUser(req.body.email, req.body.password),
        res,
        'Login successful'
      );
    } catch (error) {
      this.handleError(error as Error, next);
    }
  }

  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userData: RegisterUserDto = req.body;
      await this.executeWithDelay(
        () => this.authService.registerUser(userData),
        res,
        'Registration successful',
        201
      );
    } catch (error) {
      this.handleError(error as Error, next);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.body;
      await this.executeWithDelay(
        () => this.authService.refreshToken(refreshToken),
        res,
        'Token refreshed successfully'
      );
    } catch (error) {
      this.handleError(error as Error, next);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await ResponseUtil.withDelay(async () => {
        logger.info('User logged out', {
          userId: req.user?.id,
          requestId: req.requestId
        });
        return ResponseUtil.success(res, null, 'Logged out successfully');
      });
    } catch (error) {
      this.handleError(error as Error, next);
    }
  }
  
  async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await ResponseUtil.withDelay(async () => {
        return ResponseUtil.success(res, req.user, 'User profile retrieved');
      });
    } catch (error) {
      this.handleError(error as Error, next);
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { email } = req.body;
        await this.executeWithDelay(
            () => this.authService.forgotPassword(email),
            res,
            'Password reset email sent'
        );
    } catch (error) {
        this.handleError(error as Error, next);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { resetToken, newPassword } = req.body;
        await this.executeWithDelay(
            () => this.authService.resetPassword(resetToken, newPassword),
            res,
            'Password reset successfully'
        );
    } catch (error) {
        this.handleError(error as Error, next);
    }
  }
}
