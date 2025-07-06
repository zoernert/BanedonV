import { AuthUser } from '../../domain/models/AuthUser';
import { UpdateUserDto } from '../../domain/dtos/UpdateUser.dto';
import { PaginationOptions, PaginatedResult } from '../../domain/types';

export interface IUserService {
  getUsers(pagination: PaginationOptions): Promise<PaginatedResult<AuthUser>>;
  getUserById(id: string): Promise<AuthUser | null>;
  updateUser(id: string, userDto: UpdateUserDto): Promise<AuthUser | null>;
  deleteUser(id: string, actor: AuthUser): Promise<void>;
  inviteUser(email: string, role: 'admin' | 'org_admin' | 'team_manager' | 'user'): Promise<{ inviteToken: string, expiresAt: string }>;
  updateUserRole(id: string, role: 'admin' | 'org_admin' | 'team_manager' | 'user', actor: AuthUser): Promise<AuthUser | null>;
  getUserActivity(userId: string, pagination: PaginationOptions): Promise<PaginatedResult<any>>;
}
