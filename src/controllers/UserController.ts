import { Request, Response, NextFunction } from 'express';
import { BaseController } from './BaseController';
import { IUserService } from '../services/interfaces/IUserService';
import { UpdateUserDto } from '../domain/dtos/UpdateUser.dto';
import ResponseUtil from '../utils/response';

export class UserController extends BaseController {
  constructor(private userService: IUserService) {
    super();
  }

  async getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagination = ResponseUtil.parsePagination(req.query);
      await this.executeWithPagination(() => this.userService.getUsers(pagination), res, 'Users retrieved successfully');
    } catch (error) {
      this.handleError(error as Error, next);
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const user = await this.userService.getUserById(id);
      if (!user) {
        return ResponseUtil.notFound(res);
      }
      await this.executeWithDelay(async () => user, res, 'User retrieved successfully');
    } catch (error) {
      this.handleError(error as Error, next);
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const userDto: UpdateUserDto = req.body;
      await this.executeWithDelay(() => this.userService.updateUser(id, userDto), res, 'User updated successfully');
    } catch (error) {
      this.handleError(error as Error, next);
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await this.executeWithDelay(() => this.userService.deleteUser(id, req.user!), res, 'User deleted successfully');
    } catch (error)
 {
      this.handleError(error as Error, next);
    }
  }

  async inviteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, role } = req.body;
      await this.executeWithDelay(() => this.userService.inviteUser(email, role), res, 'User invited successfully');
    } catch (error) {
      this.handleError(error as Error, next);
    }
  }

  async updateUserRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { role } = req.body;
      await this.executeWithDelay(() => this.userService.updateUserRole(id, role, req.user!), res, 'User role updated successfully');
    } catch (error) {
      this.handleError(error as Error, next);
    }
  }

  async getUserActivity(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const pagination = ResponseUtil.parsePagination(req.query);
      await this.executeWithPagination(() => this.userService.getUserActivity(id, pagination), res, 'User activity retrieved successfully');
    } catch (error) {
      this.handleError(error as Error, next);
    }
  }
}
