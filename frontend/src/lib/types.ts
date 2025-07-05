// API Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'user';
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  permissions?: string[];
}

export interface AuthUser extends User {
  token: string;
  refreshToken: string;
}

// Authentication Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

// Collection Types
export interface Collection {
  id: string;
  name: string;
  description?: string;
  type: 'public' | 'private' | 'shared';
  owner: User;
  createdAt: string;
  updatedAt: string;
  fileCount: number;
  size: number;
  tags?: string[];
  permissions?: CollectionPermission[];
}

export interface CollectionPermission {
  userId: string;
  user: User;
  permission: 'read' | 'write' | 'admin';
}

// File Types
export interface FileItem {
  id: string;
  name: string;
  type: string;
  size: number;
  mimeType: string;
  url: string;
  thumbnailUrl?: string;
  collectionId: string;
  collection: Collection;
  owner: User;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  metadata?: Record<string, any>;
}

// Search Types
export interface SearchResult {
  id: string;
  title: string;
  content: string;
  type: 'file' | 'collection' | 'user';
  score: number;
  highlights?: string[];
  metadata?: Record<string, any>;
}

export interface SearchFilters {
  type?: 'file' | 'collection' | 'user';
  dateRange?: {
    start: string;
    end: string;
  };
  owner?: string;
  tags?: string[];
  fileType?: string;
}

// Billing Types
export interface BillingInfo {
  customerId: string;
  subscriptionId: string;
  planId: string;
  planName: string;
  status: 'active' | 'cancelled' | 'past_due' | 'unpaid';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  trialEnd?: string;
  usage: {
    storage: number;
    users: number;
    apiCalls: number;
  };
  limits: {
    storage: number;
    users: number;
    apiCalls: number;
  };
}

export interface Invoice {
  id: string;
  number: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'failed';
  createdAt: string;
  paidAt?: string;
  downloadUrl?: string;
}

// Admin Types
export interface SystemMetrics {
  totalUsers: number;
  activeUsers: number;
  totalCollections: number;
  totalFiles: number;
  totalStorage: number;
  apiCallsToday: number;
  revenueThisMonth: number;
  serverHealth: 'healthy' | 'warning' | 'error';
}

export interface ActivityLog {
  id: string;
  userId: string;
  user: User;
  action: string;
  resource: string;
  resourceId: string;
  details?: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
}

// Theme Types
export type Theme = 'light' | 'dark' | 'system';

// Navigation Types
export interface NavItem {
  title: string;
  href: string;
  icon: string;
  description?: string;
  disabled?: boolean;
  external?: boolean;
  badge?: string;
}

export interface SidebarNavItem extends NavItem {
  items?: SidebarNavItem[];
}

// Form Types
export interface FormFieldError {
  message: string;
  type: string;
}

export interface FormState {
  isSubmitting: boolean;
  errors: Record<string, FormFieldError>;
  isDirty: boolean;
  isValid: boolean;
}

// Notification Types
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  createdAt: string;
  read: boolean;
  actionUrl?: string;
  actionText?: string;
}
