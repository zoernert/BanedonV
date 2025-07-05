export interface CreateUserDto {
  email: string;
  password: string;
  name: string;
  role?: 'admin' | 'manager' | 'user';
}
