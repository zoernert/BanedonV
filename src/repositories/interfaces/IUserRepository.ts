import { User } from '../../domain/models/User';
import { CreateUserDto } from '../../domain/dtos/CreateUser.dto';
import { PaginationOptions, PaginatedResult } from '../../domain/types';

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(user: CreateUserDto): Promise<User>;
  update(id: string, updates: Partial<User>): Promise<User | null>;
  delete(id: string): Promise<void>;
  findAll(pagination: PaginationOptions): Promise<PaginatedResult<User>>;
}
