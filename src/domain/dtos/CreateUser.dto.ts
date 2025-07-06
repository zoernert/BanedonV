export interface CreateUserDto {
  email: string;
  password: string;
  name: string;
  role?: 'admin' | 'org_admin' | 'team_manager' | 'user';
}
