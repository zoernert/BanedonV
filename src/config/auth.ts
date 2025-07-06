/**
 * Authentication Configuration
 * Mock authentication settings for JWT simulation
 * CRITICAL: This is a MOCK authentication system - no real security
 */

export interface AuthConfig {
  jwtSecret: string;
  jwtExpiresIn: string;
  refreshTokenExpiresIn: string;
  bcryptSaltRounds: number;
  sessionTimeout: number;
  maxLoginAttempts: number;
  lockoutDuration: number;
  passwordResetExpires: number;
}

export const authConfig: AuthConfig = {
  jwtSecret: 'mock-jwt-secret-key-for-development-only',
  jwtExpiresIn: '1h',
  refreshTokenExpiresIn: '7d',
  bcryptSaltRounds: 12,
  sessionTimeout: 3600000, // 1 hour in milliseconds
  maxLoginAttempts: 5,
  lockoutDuration: 900000, // 15 minutes in milliseconds
  passwordResetExpires: 3600000 // 1 hour in milliseconds
};


export const roles = {
  admin: {
    name: 'System Administrator',
    permissions: ['*'], // All permissions
    description: 'Full system access and control'
  },
  org_admin: {
    name: 'Organization Administrator', 
    permissions: [
      'teams:create:organizational',
      'teams:manage:all',
      'users:manage:roles',
      'users:create:team_manager',
      'analytics:view:organization',
      'policies:set:organization',
      'collections:*',
      'files:*',
      'search:*',
      'billing:read',
      'integrations:*'
    ],
    description: 'Organization-wide team and user management'
  },
  team_manager: {
    name: 'Team Manager',
    permissions: [
      'teams:create:departmental',
      'teams:manage:assigned',
      'users:invite:team',
      'users:manage:team_members',
      'analytics:view:team',
      'policies:set:team',
      'collections:*',
      'files:*',
      'search:*'
    ],
    description: 'Department/project team management'
  },
  user: {
    name: 'User',
    permissions: [
      'teams:create:personal',
      'teams:join:public',
      'collections:read',
      'collections:create',
      'collections:update',
      'files:read',
      'files:create',
      'files:update',
      'search:read',
      'billing:read'
    ],
    description: 'Standard user with personal team creation'
  }
};

export default authConfig;

// Mock users for development (includes new role hierarchy)
export const mockUsers = [
  {
    id: 'user_1',
    email: 'admin@banedonv.com',
    password: 'admin123',
    role: 'admin' as const,
    name: 'System Administrator',
    avatar: null,
    active: true,
    lastLogin: '2025-01-10T10:00:00Z',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-10T10:00:00Z'
  },
  {
    id: 'user_2', 
    email: 'orgadmin@banedonv.com',
    password: 'orgadmin123',
    role: 'org_admin' as const,
    name: 'Organization Admin',
    avatar: null,
    active: true,
    lastLogin: '2025-01-10T09:00:00Z',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-10T09:00:00Z',
    organizationPermissions: ['*']
  },
  {
    id: 'user_3',
    email: 'teammanager@banedonv.com', 
    password: 'manager123',
    role: 'team_manager' as const,
    name: 'Team Manager',
    avatar: null,
    active: true,
    lastLogin: '2025-01-10T08:00:00Z',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-10T08:00:00Z',
    departmentScope: 'Engineering',
    managedTeams: ['team_1', 'team_2']
  },
  {
    id: 'user_4',
    email: 'john@example.com',
    password: 'password123',
    role: 'user' as const,
    name: 'John Doe',
    avatar: null,
    active: true,
    lastLogin: '2025-01-10T07:00:00Z',
    createdAt: '2025-01-05T00:00:00Z',
    updatedAt: '2025-01-10T07:00:00Z'
  },
  {
    id: 'user_5',
    email: 'jane@example.com',
    password: 'password123',
    role: 'user' as const,
    name: 'Jane Smith',
    avatar: null,
    active: true,
    lastLogin: '2025-01-09T15:00:00Z',
    createdAt: '2025-01-03T00:00:00Z',
    updatedAt: '2025-01-09T15:00:00Z'
  },
  {
    id: 'user_6',
    email: 'teamlead@banedonv.com',
    password: 'teamlead123',
    role: 'team_manager' as const,
    name: 'Sarah Team Lead',
    avatar: null,
    active: true,
    lastLogin: '2025-01-10T06:00:00Z',
    createdAt: '2025-01-02T00:00:00Z',
    updatedAt: '2025-01-10T06:00:00Z',
    departmentScope: 'Marketing',
    managedTeams: ['team_3']
  }
];

// Mock teams for development
export const mockTeams = [
  {
    id: 'team_1',
    name: 'Engineering Team',
    description: 'Main engineering collaboration space',
    type: 'departmental' as const,
    visibility: 'department' as const,
    owner: mockUsers[2], // team manager
    managers: [mockUsers[2]],
    members: [
      {
        id: 'member_1',
        user: mockUsers[2],
        role: 'admin' as const,
        joinedAt: '2025-01-01T00:00:00Z',
        invitedBy: mockUsers[2],
        status: 'active' as const
      },
      {
        id: 'member_2',
        user: mockUsers[3],
        role: 'member' as const,
        joinedAt: '2025-01-05T00:00:00Z',
        invitedBy: mockUsers[2],
        status: 'active' as const
      },
      {
        id: 'member_3',
        user: mockUsers[4],
        role: 'member' as const,
        joinedAt: '2025-01-06T00:00:00Z',
        invitedBy: mockUsers[2],
        status: 'active' as const
      }
    ],
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-06T00:00:00Z',
    maxMembers: 50,
    settings: {
      allowInvitations: true,
      requireApprovalForJoin: false,
      allowFileSharing: true,
      allowCollectionSharing: true,
      isPublic: false,
      maxFileSize: 100,
      allowedFileTypes: ['*']
    },
    approvalStatus: 'approved' as const,
    approvedBy: mockUsers[1],
    memberCount: 3,
    activityCount: 15
  },
  {
    id: 'team_2',
    name: 'Project Alpha',
    description: 'Special project team for new product development',
    type: 'organizational' as const,
    visibility: 'organization' as const,
    owner: mockUsers[1], // org admin
    managers: [mockUsers[1], mockUsers[2]],
    members: [
      {
        id: 'member_4',
        user: mockUsers[1],
        role: 'admin' as const,
        joinedAt: '2025-01-02T00:00:00Z',
        invitedBy: mockUsers[1],
        status: 'active' as const
      },
      {
        id: 'member_5',
        user: mockUsers[2],
        role: 'admin' as const,
        joinedAt: '2025-01-02T00:00:00Z',
        invitedBy: mockUsers[1],
        status: 'active' as const
      }
    ],
    createdAt: '2025-01-02T00:00:00Z',
    updatedAt: '2025-01-02T00:00:00Z',
    maxMembers: 500,
    settings: {
      allowInvitations: true,
      requireApprovalForJoin: true,
      allowFileSharing: true,
      allowCollectionSharing: true,
      isPublic: true,
      maxFileSize: 500,
      allowedFileTypes: ['*']
    },
    approvalStatus: 'approved' as const,
    memberCount: 2,
    activityCount: 8
  },
  {
    id: 'team_3',
    name: 'Marketing Team',
    description: 'Marketing and communications team',
    type: 'departmental' as const,
    visibility: 'department' as const,
    owner: mockUsers[5], // team manager
    managers: [mockUsers[5]],
    members: [
      {
        id: 'member_6',
        user: mockUsers[5],
        role: 'admin' as const,
        joinedAt: '2025-01-02T00:00:00Z',
        invitedBy: mockUsers[5],
        status: 'active' as const
      }
    ],
    createdAt: '2025-01-02T00:00:00Z',
    updatedAt: '2025-01-02T00:00:00Z',
    maxMembers: 50,
    settings: {
      allowInvitations: true,
      requireApprovalForJoin: false,
      allowFileSharing: true,
      allowCollectionSharing: true,
      isPublic: false,
      maxFileSize: 200,
      allowedFileTypes: ['*']
    },
    approvalStatus: 'approved' as const,
    approvedBy: mockUsers[1],
    memberCount: 1,
    activityCount: 3
  },
  {
    id: 'team_4',
    name: 'John\'s Personal Workspace',
    description: 'Personal productivity and project space',
    type: 'personal' as const,
    visibility: 'private' as const,
    owner: mockUsers[3], // regular user
    managers: [],
    members: [
      {
        id: 'member_7',
        user: mockUsers[3],
        role: 'admin' as const,
        joinedAt: '2025-01-05T00:00:00Z',
        invitedBy: mockUsers[3],
        status: 'active' as const
      }
    ],
    createdAt: '2025-01-05T00:00:00Z',
    updatedAt: '2025-01-05T00:00:00Z',
    maxMembers: 10,
    settings: {
      allowInvitations: true,
      requireApprovalForJoin: false,
      allowFileSharing: false,
      allowCollectionSharing: false,
      isPublic: false,
      maxFileSize: 50,
      allowedFileTypes: ['*']
    },
    approvalStatus: 'approved' as const,
    memberCount: 1,
    activityCount: 5
  },
  {
    id: 'team_5',
    name: 'New Product Research',
    description: 'Research team for upcoming product line',
    type: 'departmental' as const,
    visibility: 'department' as const,
    owner: mockUsers[4], // regular user (pending approval)
    managers: [],
    members: [
      {
        id: 'member_8',
        user: mockUsers[4],
        role: 'admin' as const,
        joinedAt: '2025-01-08T00:00:00Z',
        invitedBy: mockUsers[4],
        status: 'active' as const
      }
    ],
    createdAt: '2025-01-08T00:00:00Z',
    updatedAt: '2025-01-08T00:00:00Z',
    maxMembers: 50,
    settings: {
      allowInvitations: true,
      requireApprovalForJoin: false,
      allowFileSharing: true,
      allowCollectionSharing: true,
      isPublic: false,
      maxFileSize: 100,
      allowedFileTypes: ['*']
    },
    approvalStatus: 'pending' as const,
    memberCount: 1,
    activityCount: 0
  }
];

// Mock team invitations
export const mockTeamInvitations = [
  {
    id: 'invite_1',
    team: mockTeams[0],
    email: 'newuser@example.com',
    role: 'member' as const,
    invitedBy: mockUsers[2],
    status: 'pending' as const,
    message: 'Join our engineering team!',
    expiresAt: '2025-01-17T00:00:00Z',
    createdAt: '2025-01-10T00:00:00Z'
  },
  {
    id: 'invite_2',
    team: mockTeams[1],
    email: 'contractor@example.com',
    role: 'viewer' as const,
    invitedBy: mockUsers[1],
    status: 'pending' as const,
    message: 'Project Alpha collaboration',
    expiresAt: '2025-01-17T00:00:00Z',
    createdAt: '2025-01-10T00:00:00Z'
  }
];
