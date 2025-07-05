import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { AuthResponse, User } from './types';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: '/api/v1',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('token');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle errors
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token expired, try to refresh
          const refreshToken = localStorage.getItem('refreshToken');
          if (refreshToken) {
            try {
              const response = await this.client.post('/auth/refresh', {
                refreshToken,
              });
              const { token } = response.data.data;
              localStorage.setItem('token', token);
              
              // Retry the original request
              error.config.headers.Authorization = `Bearer ${token}`;
              return this.client.request(error.config);
            } catch (refreshError) {
              // Refresh failed, redirect to login
              this.clearAuth();
              if (typeof window !== 'undefined') {
                window.location.href = '/login';
              }
            }
          } else {
            // No refresh token, redirect to login
            this.clearAuth();
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
          }
        }
        return Promise.reject(error);
      }
    );
  }

  private clearAuth() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  }

  // Auth methods
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.client.post('/auth/login', { email, password });
    return response.data.data;
  }

  async register(email: string, password: string, name: string): Promise<AuthResponse> {
    const response = await this.client.post('/auth/register', { email, password, name });
    return response.data.data;
  }

  async logout(): Promise<void> {
    await this.client.post('/auth/logout');
    this.clearAuth();
  }

  async getMe(): Promise<User> {
    const response = await this.client.get('/auth/me');
    return response.data.data;
  }

  async refreshToken(): Promise<{ token: string }> {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await this.client.post('/auth/refresh', { refreshToken });
    return response.data.data;
  }

  // User methods
  async getUsers(page = 1, limit = 10) {
    const response = await this.client.get('/users', { params: { page, limit } });
    return response.data;
  }

  async getUserById(id: string) {
    const response = await this.client.get(`/users/${id}`);
    return response.data;
  }

  async updateUser(id: string, data: Partial<User>) {
    const response = await this.client.patch(`/users/${id}`, data);
    return response.data;
  }

  async deleteUser(id: string) {
    await this.client.delete(`/users/${id}`);
  }

  // Collection methods
  async getCollections(page = 1, limit = 10) {
    const response = await this.client.get('/collections', { params: { page, limit } });
    return response.data;
  }

  async getCollectionById(id: string) {
    const response = await this.client.get(`/collections/${id}`);
    return response.data;
  }

  async createCollection(data: any) {
    const response = await this.client.post('/collections', data);
    return response.data;
  }

  async updateCollection(id: string, data: any) {
    const response = await this.client.patch(`/collections/${id}`, data);
    return response.data;
  }

  async deleteCollection(id: string) {
    await this.client.delete(`/collections/${id}`);
  }

  // File methods
  async getFiles(page = 1, limit = 10) {
    const response = await this.client.get('/files', { params: { page, limit } });
    return response.data;
  }

  async getFileById(id: string) {
    const response = await this.client.get(`/files/${id}`);
    return response.data;
  }

  async uploadFile(file: File, collectionId: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('collectionId', collectionId);
    
    const response = await this.client.post('/files', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async deleteFile(id: string) {
    await this.client.delete(`/files/${id}`);
  }

  // Search methods
  async search(query: string, filters?: any) {
    const response = await this.client.get('/search', { 
      params: { q: query, ...filters } 
    });
    return response.data;
  }

  // Billing methods
  async getBillingInfo() {
    const response = await this.client.get('/billing');
    return response.data;
  }

  async getInvoices() {
    const response = await this.client.get('/billing/invoices');
    return response.data;
  }

  async createCheckoutSession(priceId: string) {
    const response = await this.client.post('/billing/checkout', { priceId });
    return response.data;
  }

  async createPortalSession() {
    const response = await this.client.post('/billing/portal');
    return response.data;
  }

  // Admin methods
  async getSystemMetrics() {
    const response = await this.client.get('/admin/metrics');
    return response.data;
  }

  async getActivityLogs(page = 1, limit = 10) {
    const response = await this.client.get('/admin/activity', { params: { page, limit } });
    return response.data;
  }

  async getAdminUsers() {
    const response = await this.client.get('/admin/users');
    return response.data;
  }

  async updateUserRole(userId: string, role: string) {
    const response = await this.client.patch(`/admin/users/${userId}/role`, { role });
    return response.data;
  }

  async deactivateUser(userId: string) {
    const response = await this.client.patch(`/admin/users/${userId}/deactivate`);
    return response.data;
  }

  async activateUser(userId: string) {
    const response = await this.client.patch(`/admin/users/${userId}/activate`);
    return response.data;
  }
}

export const apiClient = new ApiClient();
export default apiClient;
