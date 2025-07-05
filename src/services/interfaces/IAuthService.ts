import { AuthUser } from '../../domain/models/AuthUser';
import { CreateUserDto } from '../../domain/dtos/CreateUser.dto';

export type RegisterUserDto = CreateUserDto;

export interface LoginResult {
  user: AuthUser;
  token: string;
  refreshToken: string;
  expiresIn: string;
}

export interface RegisterResult {
  user: AuthUser;
  token: string;
  refreshToken: string;
  expiresIn: string;
}

export interface TokenResult {
  token: string;
  refreshToken: string;
  expiresIn: string;
}

export interface IAuthService {
  loginUser(email: string, password: string): Promise<LoginResult>;
  registerUser(userData: RegisterUserDto): Promise<RegisterResult>;
  refreshToken(refreshToken: string): Promise<TokenResult>;
  forgotPassword(email: string): Promise<{ message: string; resetToken: string }>;
  resetPassword(resetToken: string, newPassword: string): Promise<void>;
  verifyToken(token: string): Promise<AuthUser | null>;
}
