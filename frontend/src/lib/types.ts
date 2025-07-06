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
  role: 'admin' | 'org_admin' | 'team_manager' | 'user';
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  permissions?: string[];
  // New team management fields
  managedTeams?: string[];
  departmentScope?: string;
  organizationPermissions?: string[];
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

// Team Management Types
export interface Team {
  id: string;
  name: string;
  description?: string;
  type: 'personal' | 'departmental' | 'organizational';
  visibility: 'private' | 'department' | 'organization';
  owner: User;
  managers: User[];
  members: TeamMember[];
  createdAt: string;
  updatedAt: string;
  maxMembers: number;
  settings: TeamSettings;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  approvedBy?: User;
  memberCount?: number;
  activityCount?: number;
}

export interface TeamMember {
  id: string;
  user: User;
  role: 'admin' | 'member' | 'viewer';
  joinedAt: string;
  invitedBy: User;
  status: 'active' | 'pending' | 'inactive';
}

export interface TeamSettings {
  allowInvitations: boolean;
  requireApprovalForJoin: boolean;
  allowFileSharing: boolean;
  allowCollectionSharing: boolean;
  isPublic: boolean;
  maxFileSize: number;
  allowedFileTypes: string[];
}

export interface TeamInvitation {
  id: string;
  team: Team;
  email: string;
  role: 'admin' | 'member' | 'viewer';
  invitedBy: User;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  message?: string;
  expiresAt: string;
  createdAt: string;
}

export interface CreateTeamRequest {
  name: string;
  description?: string;
  type: 'personal' | 'departmental' | 'organizational';
  visibility: 'private' | 'department' | 'organization';
  maxMembers?: number;
  settings?: Partial<TeamSettings>;
}

export interface UpdateTeamRequest {
  name?: string;
  description?: string;
  visibility?: 'private' | 'department' | 'organization';
  maxMembers?: number;
  settings?: Partial<TeamSettings>;
}

export interface InviteToTeamRequest {
  email: string;
  role: 'admin' | 'member' | 'viewer';
  message?: string;
}

export interface TeamActivity {
  id: string;
  team: Team;
  user: User;
  action: string;
  description: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface TeamStats {
  totalMembers: number;
  activeMembers: number;
  pendingInvitations: number;
  recentActivity: number;
  storageUsed: number;
  fileCount: number;
  collectionCount: number;
}

export interface TeamAnalytics {
  teamId: string;
  memberGrowth: Array<{ date: string; count: number }>;
  activityTrends: Array<{ date: string; count: number }>;
  fileUsage: Array<{ type: string; count: number; size: number }>;
  popularCollections: Array<{ collection: Collection; accessCount: number }>;
  topContributors: Array<{ user: User; contributionCount: number }>;
}
