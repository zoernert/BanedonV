import { apiClient } from './api';
import { AuthResponse, User } from './types';

class AuthService {
  private user: User | null = null;
  private token: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token');
      this.refreshToken = localStorage.getItem('refreshToken');
      const userStr = localStorage.getItem('user');
      if (userStr && userStr !== 'undefined' && userStr !== 'null') {
        try {
          this.user = JSON.parse(userStr);
        } catch (error) {
          console.error('Error parsing user from localStorage:', error);
          localStorage.removeItem('user');
        }
      }
    }
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await apiClient.login(email, password);
    
    this.setAuth(response.user, response.token, response.refreshToken);
    
    return response;
  }

  async register(email: string, password: string, name: string): Promise<AuthResponse> {
    const response = await apiClient.register(email, password, name);
    
    this.setAuth(response.user, response.token, response.refreshToken);
    
    return response;
  }

  async logout(): Promise<void> {
    try {
      await apiClient.logout();
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      this.clearAuth();
    }
  }

  async refreshAuthToken(): Promise<boolean> {
    if (!this.refreshToken) {
      return false;
    }

    try {
      const response = await apiClient.refreshToken();
      this.setToken(response.token);
      return true;
    } catch (error) {
      console.error('Error refreshing token:', error);
      this.clearAuth();
      return false;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    if (!this.token) {
      return null;
    }

    // If we already have user data, return it
    if (this.user) {
      return this.user;
    }

    try {
      const user = await apiClient.getMe();
      this.setUser(user);
      return user;
    } catch (error) {
      console.error('Error fetching current user:', error);
      this.clearAuth();
      return null;
    }
  }

  private setAuth(user: User, token: string, refreshToken: string) {
    this.user = user;
    this.token = token;
    this.refreshToken = refreshToken;
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
    }
  }

  private setUser(user: User) {
    this.user = user;
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }

  private setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  }

  private clearAuth() {
    this.user = null;
    this.token = null;
    this.refreshToken = null;
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    }
  }

  getUser(): User | null {
    return this.user;
  }

  getToken(): string | null {
    return this.token;
  }

  isAuthenticated(): boolean {
    return !!this.token && !!this.user;
  }

  hasRole(role: string): boolean {
    return this.user?.role === role;
  }

  hasPermission(permission: string): boolean {
    return this.user?.permissions?.includes(permission) || false;
  }

  isAdmin(): boolean {
    return this.hasRole('admin');
  }

  isManager(): boolean {
    return this.hasRole('manager') || this.isAdmin();
  }

  canAccess(resource: string, action: string): boolean {
    if (this.isAdmin()) {
      return true;
    }

    // Add more granular permission checks here
    switch (resource) {
      case 'users':
        return this.isManager();
      case 'admin':
        return this.isAdmin();
      case 'billing':
        return this.isManager();
      default:
        return true;
    }
  }
}

export const authService = new AuthService();
export default authService;
