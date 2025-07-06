/**
 * User Controller
 * Handles HTTP requests for user management operations
 * 
 * @author BanedonV Team
 * @since 1.0.0
 */

import { Request, Response, NextFunction } from 'express';
import { BaseController } from './BaseController';
import { IUserService } from '../services/interfaces/IUserService';
import { UpdateUserDto } from '../domain/dtos/UpdateUser.dto';
import ResponseUtil from '../utils/response';

/**
 * Controller for handling user-related HTTP requests
 * Extends BaseController to inherit common error handling and response utilities
 */
export class UserController extends BaseController {
  /**
   * Creates an instance of UserController
   * @param {IUserService} userService - The user service dependency
   */
  constructor(private userService: IUserService) {
    super();
  }

  /**
   * Retrieves a paginated list of users
   * @param {Request} req - Express request object containing pagination parameters
   * @param {Response} res - Express response object
   * @param {NextFunction} next - Express next function for error handling
   * @returns {Promise<void>}
   * @throws {Error} When user retrieval fails
   * @example
   * GET /users?page=1&limit=10
   */
  async getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagination = ResponseUtil.parsePagination(req.query);
      await this.executeWithPagination(() => this.userService.getUsers(pagination), res, 'Users retrieved successfully');
    } catch (error) {
      this.handleError(error as Error, next);
    }
  }

  /**
   * Retrieves a specific user by ID
   * @param {Request} req - Express request object containing user ID in params
   * @param {Response} res - Express response object
   * @param {NextFunction} next - Express next function for error handling
   * @returns {Promise<void>}
   * @throws {Error} When user retrieval fails
   * @example
   * GET /users/user123
   */
  async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const user = await this.userService.getUserById(id!);
      if (!user) {
        return ResponseUtil.notFound(res);
      }
      await this.executeWithDelay(async () => user, res, 'User retrieved successfully');
    } catch (error) {
      this.handleError(error as Error, next);
    }
  }

  /**
   * Updates an existing user with new data
   * @param {Request} req - Express request object containing user ID and update data
   * @param {Response} res - Express response object
   * @param {NextFunction} next - Express next function for error handling
   * @returns {Promise<void>}
   * @throws {Error} When user update fails
   * @example
   * PUT /users/user123
   * Body: { name: "Updated Name", email: "new@email.com" }
   */
  async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const userDto: UpdateUserDto = req.body;
      await this.executeWithDelay(() => this.userService.updateUser(id!, userDto), res, 'User updated successfully');
    } catch (error) {
      this.handleError(error as Error, next);
    }
  }

  /**
   * Deletes a user by ID (Admin only operation)
   * @param {Request} req - Express request object containing user ID and authenticated user
   * @param {Response} res - Express response object
   * @param {NextFunction} next - Express next function for error handling
   * @returns {Promise<void>}
   * @throws {Error} When user deletion fails
   * @example
   * DELETE /users/user123
   */
  async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await this.executeWithDelay(() => this.userService.deleteUser(id!, req.user!), res, 'User deleted successfully');
    } catch (error) {
      this.handleError(error as Error, next);
    }
  }

  /**
   * Invites a new user to the platform
   * @param {Request} req - Express request object containing email and role
   * @param {Response} res - Express response object
   * @param {NextFunction} next - Express next function for error handling
   * @returns {Promise<void>}
   * @throws {Error} When user invitation fails
   * @example
   * POST /users/invite
   * Body: { email: "user@example.com", role: "user" }
   */
  async inviteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, role } = req.body;
      await this.executeWithDelay(() => this.userService.inviteUser(email, role), res, 'User invited successfully');
    } catch (error) {
      this.handleError(error as Error, next);
    }
  }

  /**
   * Updates a user's role (Admin only operation)
   * @param {Request} req - Express request object containing user ID and new role
   * @param {Response} res - Express response object
   * @param {NextFunction} next - Express next function for error handling
   * @returns {Promise<void>}
   * @throws {Error} When role update fails
   * @example
   * PUT /users/user123/role
   * Body: { role: "admin" }
   */
  async updateUserRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { role } = req.body;
      await this.executeWithDelay(() => this.userService.updateUserRole(id!, role, req.user!), res, 'User role updated successfully');
    } catch (error) {
      this.handleError(error as Error, next);
    }
  }

  /**
   * Retrieves user activity history with pagination
   * @param {Request} req - Express request object containing user ID and pagination parameters
   * @param {Response} res - Express response object
   * @param {NextFunction} next - Express next function for error handling
   * @returns {Promise<void>}
   * @throws {Error} When activity retrieval fails
   * @example
   * GET /users/user123/activity?page=1&limit=10
   */
  async getUserActivity(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const pagination = ResponseUtil.parsePagination(req.query);
      await this.executeWithPagination(() => this.userService.getUserActivity(id!, pagination), res, 'User activity retrieved successfully');
    } catch (error) {
      this.handleError(error as Error, next);
    }
  }
}
