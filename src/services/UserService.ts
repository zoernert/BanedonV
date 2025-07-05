import { IUserRepository } from '../repositories/interfaces/IUserRepository';
import { IUserService } from './interfaces/IUserService';
import { AuthUser } from '../domain/models/AuthUser';
import { User } from '../domain/models/User';
import { UpdateUserDto } from '../domain/dtos/UpdateUser.dto';
import { PaginationOptions, PaginatedResult } from '../domain/types';
import { UserError } from '../domain/errors/UserError';
import { generateId } from '../utils/id.util';
import { randomFloat, randomInt } from '../utils/number.util';
import ResponseUtil from '../utils/response';

export class UserService implements IUserService {
  constructor(private userRepository: IUserRepository) {}

  private toAuthUser(user: User): AuthUser {
    const { password, ...authUser } = user;
    return authUser;
  }

  async getUsers(pagination: PaginationOptions): Promise<PaginatedResult<AuthUser>> {
    const result = await this.userRepository.findAll(pagination);
    return {
      ...result,
      items: result.items.map(u => this.toAuthUser(u)),
    };
  }

  async getUserById(id: string): Promise<AuthUser | null> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      return null;
    }

    // The extra details in the original route are mock. Let's add them here for compatibility.
    const userWithDetails = {
      ...this.toAuthUser(user),
      profile: {
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${id}`,
        bio: `Bio for user ${id}`,
        location: 'New York, NY',
        website: `https://user${id}.example.com`,
      },
      preferences: {
        theme: 'light',
        notifications: true,
        language: 'en',
      },
      statistics: {
        collectionsCount: randomInt(0, 49),
        filesCount: randomInt(0, 499),
        searchesCount: randomInt(0, 999),
      },
    };

    return userWithDetails;
  }

  async updateUser(id: string, userDto: UpdateUserDto): Promise<AuthUser | null> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw UserError.notFound();
    }
    const updatedUser = await this.userRepository.update(id, userDto);
    return updatedUser ? this.toAuthUser(updatedUser) : null;
  }

  async deleteUser(id: string, actor: AuthUser): Promise<void> {
    if (actor.id === id) {
      throw UserError.cannotDeleteSelf();
    }
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw UserError.notFound();
    }
    await this.userRepository.delete(id);
  }

  async inviteUser(email: string, role: 'admin' | 'manager' | 'user' = 'user'): Promise<{ inviteToken: string, expiresAt: string }> {
    const inviteToken = generateId('invite');
    return {
      inviteToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
    };
  }

  async updateUserRole(id: string, role: 'admin' | 'manager' | 'user', actor: AuthUser): Promise<AuthUser | null> {
    if (actor.id === id) {
      throw UserError.cannotChangeOwnRole();
    }
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw UserError.notFound();
    }
    if (!['admin', 'manager', 'user'].includes(role)) {
      throw UserError.invalidRole();
    }
    const updatedUser = await this.userRepository.update(id, { role });
    return updatedUser ? this.toAuthUser(updatedUser) : null;
  }

  async getUserActivity(userId: string, pagination: PaginationOptions): Promise<PaginatedResult<any>> {
    const page = pagination.page || 1;
    const limit = pagination.limit || 20;

    // Mock activity data
    const mockActivities = Array.from({ length: 30 }, (_, i) => ({
      id: `activity_${i + 1}`,
      type: ['login', 'logout', 'file_upload', 'search', 'collection_create', 'file_download'][randomInt(0, 5)],
      description: `Activity ${i + 1} description`,
      timestamp: new Date(Date.now() - randomFloat(0, 86400000 * 30)).toISOString(),
      metadata: {
        ip: `192.168.1.${randomInt(0, 254)}`,
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    }));

    const paginated = ResponseUtil.paginateArray(mockActivities, page, limit);

    return {
      items: paginated.items,
      total: paginated.total,
      page,
      limit,
    };
  }
}
