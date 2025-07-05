import { IUserRepository } from '../interfaces/IUserRepository';
import { User } from '../../domain/models/User';
import { CreateUserDto } from '../../domain/dtos/CreateUser.dto';
import { mockUsers } from '../../config/auth';
import { generateId } from '../../utils/id.util';
import ResponseUtil from '../../utils/response';
import { PaginationOptions, PaginatedResult } from '../../domain/types';
import { deepClone } from '../../utils/object.util';

export class MockUserRepository implements IUserRepository {
  private users: User[];

  constructor() {
    this.users = deepClone(mockUsers.map(u => ({ ...u, lastLogin: u.lastLogin || null })));
  }

  async findById(id: string): Promise<User | null> {
    return this.users.find(u => u.id === id) || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find(u => u.email === email) || null;
  }

  async create(userData: CreateUserDto): Promise<User> {
    const newUser: User = {
      id: generateId('user'),
      email: userData.email,
      password: userData.password, // In real scenario, this would be hashed
      name: userData.name,
      role: userData.role || 'user',
      active: true,
      lastLogin: null,
      createdAt: new Date().toISOString()
    };
    this.users.push(newUser);
    return newUser;
  }

  async update(id: string, updates: Partial<User>): Promise<User | null> {
    const userIndex = this.users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      return null;
    }

    const updatedUser = { ...this.users[userIndex], ...updates } as User;
    if(!('lastLogin' in updates)) {
        (updatedUser as any).updatedAt = new Date().toISOString()
    }
    this.users[userIndex] = updatedUser;

    return updatedUser;
  }

  async delete(id: string): Promise<void> {
    this.users = this.users.filter(u => u.id !== id);
  }

  async findAll(pagination: PaginationOptions): Promise<PaginatedResult<User>> {
    const page = pagination.page || 1;
    const limit = pagination.limit || 20;

    const paginated = ResponseUtil.paginateArray(this.users, page, limit);

    return {
      items: paginated.items,
      total: paginated.total,
      page,
      limit
    };
  }
}
