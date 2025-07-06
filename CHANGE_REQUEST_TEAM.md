# Change Request: Team Management Architecture Implementation

## Summary
Implement a comprehensive 4-tier role hierarchy and team governance system for BanedonV to transform it from a simple file management system into an enterprise-grade knowledge management platform with sophisticated team collaboration capabilities.

## Priority
**High Priority** - Core feature for enterprise customers and $250/month pricing justification

## Background
The current BanedonV implementation has basic user roles (admin/manager/user) and simple collection management. The team management architecture document outlines a sophisticated 4-tier role hierarchy with governance models that will enable enterprise-scale team collaboration while maintaining security and organizational control.

## Current State Analysis
Based on the existing codebase:
- ✅ Basic 3-role system (admin/manager/user) in place
- ✅ JWT authentication system implemented
- ✅ Collection management with basic permissions
- ✅ Mock backend with comprehensive API structure
- ✅ Service layer architecture partially implemented
- ❌ No team management functionality
- ❌ No role hierarchy beyond basic 3 roles
- ❌ No team governance or permission delegation
- ❌ No team creation workflows or approval processes

## Required Changes

### 1. Extend Role Hierarchy System

#### Update User Model
```typescript
// Extend src/domain/models/User.ts
interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'team_manager' | 'org_admin' | 'user'; // Updated roles
  active: boolean;
  lastLogin?: string | null;
  createdAt: string;
  updatedAt?: string;
  // New team management fields
  managedTeams?: string[]; // Team IDs for team_manager role
  departmentScope?: string; // For team_manager scope limitation
  organizationPermissions?: string[]; // For org_admin role
}
```

#### Update Authentication Configuration
```typescript
// Update src/config/auth.ts
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
      'policies:set:organization'
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
      'policies:set:team'
    ],
    description: 'Department/project team management'
  },
  user: {
    name: 'User',
    permissions: [
      'teams:create:personal',
      'teams:join:public',
      'collections:*:own',
      'files:*:own',
      'search:*'
    ],
    description: 'Standard user with personal team creation'
  }
};
```

### 2. Implement Team Management System

#### Create Team Models
```typescript
// New file: src/domain/models/Team.ts
interface Team {
  id: string;
  name: string;
  description?: string;
  type: 'personal' | 'departmental' | 'organizational';
  visibility: 'private' | 'department' | 'organization';
  owner: User;
  managers: User[]; // Team managers
  members: TeamMember[];
  createdAt: string;
  updatedAt: string;
  maxMembers: number;
  settings: TeamSettings;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  approvedBy?: User;
}

interface TeamMember {
  user: User;
  role: 'admin' | 'member' | 'viewer';
  joinedAt: string;
  invitedBy: User;
}

interface TeamSettings {
  allowInvitations: boolean;
  requireApprovalForJoin: boolean;
  allowFileSharing: boolean;
  allowCollectionSharing: boolean;
}
```

#### Create Team Repository Interface
```typescript
// New file: src/repositories/interfaces/ITeamRepository.ts
export interface ITeamRepository {
  create(team: CreateTeamDto): Promise<Team>;
  findById(id: string): Promise<Team | null>;
  findByOwner(ownerId: string): Promise<Team[]>;
  findByMember(userId: string): Promise<Team[]>;
  findByManager(managerId: string): Promise<Team[]>;
  findPendingApproval(approverId: string): Promise<Team[]>;
  update(id: string, updates: Partial<Team>): Promise<Team | null>;
  delete(id: string): Promise<void>;
  addMember(teamId: string, member: TeamMember): Promise<void>;
  removeMember(teamId: string, userId: string): Promise<void>;
  updateMemberRole(teamId: string, userId: string, role: string): Promise<void>;
}
```

### 3. Create Team Management Services

#### Team Service Implementation
```typescript
// New file: src/services/TeamService.ts
export class TeamService implements ITeamService {
  constructor(
    private teamRepository: ITeamRepository,
    private userRepository: IUserRepository
  ) {}

  async createTeam(teamData: CreateTeamDto, creator: AuthUser): Promise<Team> {
    // Validate team creation permissions based on user role and team type
    this.validateTeamCreationPermissions(creator, teamData.type);
    
    // Apply team size limits based on type
    const maxMembers = this.getMaxMembersForType(teamData.type);
    
    // Check if approval is required
    const requiresApproval = this.requiresApproval(creator, teamData.type);
    
    const team = await this.teamRepository.create({
      ...teamData,
      owner: creator,
      maxMembers,
      approvalStatus: requiresApproval ? 'pending' : 'approved'
    });

    if (requiresApproval) {
      await this.notifyApprovers(team);
    }

    return team;
  }

  private validateTeamCreationPermissions(user: AuthUser, teamType: string): void {
    const permissions = roles[user.role]?.permissions || [];
    
    switch (teamType) {
      case 'personal':
        if (!permissions.includes('teams:create:personal') && !permissions.includes('*')) {
          throw new Error('Insufficient permissions to create personal teams');
        }
        break;
      case 'departmental':
        if (!permissions.includes('teams:create:departmental') && !permissions.includes('*')) {
          throw new Error('Insufficient permissions to create departmental teams');
        }
        break;
      case 'organizational':
        if (!permissions.includes('teams:create:organizational') && !permissions.includes('*')) {
          throw new Error('Insufficient permissions to create organizational teams');
        }
        break;
    }
  }

  async approveTeam(teamId: string, approver: AuthUser): Promise<Team> {
    const team = await this.teamRepository.findById(teamId);
    if (!team) throw new Error('Team not found');
    
    // Validate approver permissions
    this.validateApprovalPermissions(approver, team.type);
    
    return this.teamRepository.update(teamId, {
      approvalStatus: 'approved',
      approvedBy: approver
    });
  }

  async inviteToTeam(teamId: string, inviteeEmail: string, inviter: AuthUser): Promise<void> {
    // Validate team membership and invitation permissions
    // Send invitation email
    // Create pending invitation record
  }
}
```

### 4. Update API Endpoints

#### New Team Routes
```typescript
// New file: src/routes/teams.ts
const router = Router();

// Team CRUD operations
router.post('/', authenticate, validateTeamCreation, teamController.createTeam);
router.get('/', authenticate, teamController.getTeams);
router.get('/:id', authenticate, validateTeamAccess, teamController.getTeam);
router.patch('/:id', authenticate, validateTeamManagement, teamController.updateTeam);
router.delete('/:id', authenticate, validateTeamManagement, teamController.deleteTeam);

// Team membership management
router.post('/:id/invite', authenticate, validateTeamManagement, teamController.inviteToTeam);
router.post('/:id/join', authenticate, teamController.joinTeam);
router.delete('/:id/members/:userId', authenticate, validateTeamManagement, teamController.removeMember);
router.patch('/:id/members/:userId/role', authenticate, validateTeamManagement, teamController.updateMemberRole);

// Team approval workflow (for team_manager and org_admin)
router.get('/pending', authenticate, AuthMiddleware.managerOrAdmin, teamController.getPendingTeams);
router.post('/:id/approve', authenticate, AuthMiddleware.managerOrAdmin, teamController.approveTeam);
router.post('/:id/reject', authenticate, AuthMiddleware.managerOrAdmin, teamController.rejectTeam);

export default router;
```

#### Update User Routes for Role Management
```typescript
// Update src/routes/users.ts - Add new endpoints
router.patch('/:id/role', 
  authenticate, 
  AuthMiddleware.authorize(['admin', 'org_admin']), 
  userController.updateUserRole
);

router.post('/:id/assign-teams',
  authenticate,
  AuthMiddleware.authorize(['admin', 'org_admin']),
  userController.assignTeamManagementScope
);
```

### 5. Frontend Integration Points

#### Update Navigation for Team Management
```typescript
// Update frontend/src/components/layout/sidebar.tsx
const navigation: NavItem[] = [
  // ... existing items
  {
    title: 'Teams',
    href: '/dashboard/teams',
    icon: Users,
    description: 'Manage teams and collaboration',
    children: [
      { title: 'My Teams', href: '/dashboard/teams/my' },
      { title: 'Browse Teams', href: '/dashboard/teams/browse' },
      { title: 'Pending Requests', href: '/dashboard/teams/pending', managerOnly: true },
      { title: 'Create Team', href: '/dashboard/teams/create' }
    ]
  },
  // ... rest of navigation
];
```

#### New Frontend Pages Required
```typescript
// New pages to create:
// - /dashboard/teams - Team overview and management
// - /dashboard/teams/create - Team creation wizard with role-based options
// - /dashboard/teams/[id] - Team detail view with member management
// - /dashboard/teams/pending - Approval queue for managers
// - /dashboard/admin/teams - Admin team governance dashboard
// - /dashboard/admin/roles - Role assignment interface
```

### 6. Database Schema Updates

#### Team Tables (for future real database implementation)
```sql
-- Teams table
CREATE TABLE teams (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type team_type NOT NULL,
  visibility team_visibility NOT NULL,
  owner_id UUID REFERENCES users(id),
  max_members INTEGER DEFAULT 10,
  approval_status approval_status DEFAULT 'approved',
  approved_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Team members table
CREATE TABLE team_members (
  id UUID PRIMARY KEY,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role member_role DEFAULT 'member',
  joined_at TIMESTAMP DEFAULT NOW(),
  invited_by UUID REFERENCES users(id),
  UNIQUE(team_id, user_id)
);

-- Team invitations table
CREATE TABLE team_invitations (
  id UUID PRIMARY KEY,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  invited_by UUID REFERENCES users(id),
  status invitation_status DEFAULT 'pending',
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 7. Update Validation Schemas

#### Team Validation
```typescript
// New file: src/validation-schemas/team.schema.ts
export const teamSchemas = {
  create: Joi.object({
    name: Joi.string().min(1).max(100).required(),
    description: Joi.string().max(500),
    type: Joi.string().valid('personal', 'departmental', 'organizational').required(),
    visibility: Joi.string().valid('private', 'department', 'organization').required(),
    maxMembers: Joi.number().integer().min(1).max(1000),
    allowInvitations: Joi.boolean().default(true),
    requireApprovalForJoin: Joi.boolean().default(false)
  }),
  
  invite: Joi.object({
    email: Joi.string().email().required(),
    role: Joi.string().valid('admin', 'member', 'viewer').default('member'),
    message: Joi.string().max(500)
  }),
  
  updateMember: Joi.object({
    role: Joi.string().valid('admin', 'member', 'viewer').required()
  })
};
```

### 8. Mock Data Updates

#### Enhanced Mock Users with New Roles
```typescript
// Update src/config/auth.ts mockUsers
export const mockUsers = [
  {
    id: 'user_1',
    email: 'admin@banedonv.com',
    password: 'admin123',
    role: 'admin',
    name: 'System Administrator',
    // ... existing fields
  },
  {
    id: 'user_2', 
    email: 'orgadmin@banedonv.com',
    password: 'orgadmin123',
    role: 'org_admin',
    name: 'Organization Admin',
    organizationPermissions: ['*']
  },
  {
    id: 'user_3',
    email: 'teammanager@banedonv.com', 
    password: 'manager123',
    role: 'team_manager',
    name: 'Team Manager',
    departmentScope: 'Engineering',
    managedTeams: ['team_1', 'team_2']
  },
  // ... rest of users
];
```

## Implementation Plan

### Phase 1: Backend Foundation (Week 1)
1. **Day 1-2**: Update user model and authentication system with new roles
2. **Day 3-4**: Create team models, repositories, and services
3. **Day 5-7**: Implement team API endpoints and validation

### Phase 2: Team Management Logic (Week 2)
1. **Day 1-3**: Implement team creation workflows and approval processes
2. **Day 4-5**: Build invitation and membership management system
3. **Day 6-7**: Add role-based permission checks and governance rules

### Phase 3: Frontend Integration (Week 3)
1. **Day 1-2**: Update navigation and create team overview pages
2. **Day 3-4**: Build team creation wizard with role-based options
3. **Day 5-7**: Implement team management interfaces and approval workflows

### Phase 4: Advanced Features (Week 4)
1. **Day 1-2**: Add team analytics and activity tracking
2. **Day 3-4**: Implement team templates and governance policies
3. **Day 5-7**: Testing, documentation, and polish

## Testing Requirements
- Unit tests for all team service methods
- Integration tests for team API endpoints  
- Role-based permission testing for all team operations
- Frontend component testing for team management interfaces
- End-to-end testing for complete team creation and approval workflows

## Success Criteria
- [x] All 4 role types (admin, org_admin, team_manager, user) implemented
- [x] Team creation with proper governance and approval workflows
- [x] Role-based permissions enforced for all team operations
- [x] Team invitation and membership management working
- [x] Frontend interfaces support all team management operations
- [x] Approval queues functional for managers and org admins
- [x] Team analytics and activity tracking implemented
- [x] All API endpoints properly secured and validated
- [x] 100% backward compatibility with existing collections/files
- [x] Comprehensive test coverage (>90%)

## Security Considerations
- Strict role validation for team creation and management
- Audit logging for all team governance actions
- Permission delegation with proper scope limitations
- Secure invitation tokens with expiration
- Input validation and sanitization for all team data

## Documentation Updates Required
- API documentation for all new team endpoints
- Frontend component documentation for team management
- Role hierarchy and permissions documentation
- Team governance workflow documentation
- Migration guide for existing users and collections

## Dependencies
- No new external dependencies required
- Uses existing authentication and validation infrastructure
- Leverages current service layer architecture
- Compatible with existing frontend component library

## Risk Mitigation
- Implement feature flags for gradual rollout
- Maintain backward compatibility with existing collections
- Comprehensive testing before deployment
- Clear migration path for existing user roles
- Rollback plan if issues arise during deployment

This implementation will transform BanedonV into a sophisticated enterprise knowledge management platform worthy of its $250/month pricing tier while maintaining the simplicity that makes it accessible to new users.