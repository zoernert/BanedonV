export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

// Team Management Types
export enum TeamRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  MEMBER = 'member',
  VIEWER = 'viewer'
}

export enum TeamStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended'
}

export enum InvitationStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  EXPIRED = 'expired'
}

export enum JoinRequestStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export interface TeamSettings {
  requireApproval: boolean;
  allowMemberInvites: boolean;
  maxMembers: number;
  isPublic: boolean;
  allowSelfJoin: boolean;
}

export interface TeamMember {
  id: string;
  userId: string;
  teamId: string;
  role: TeamRole;
  joinedAt: Date;
  invitedBy?: string;
  permissions?: string[];
}

export interface TeamInvitation {
  id: string;
  teamId: string;
  email: string;
  role: TeamRole;
  status: InvitationStatus;
  invitedBy: string;
  invitedAt: Date;
  expiresAt: Date;
  acceptedAt?: Date;
  rejectedAt?: Date;
  message?: string;
}

export interface TeamJoinRequest {
  id: string;
  teamId: string;
  userId: string;
  status: JoinRequestStatus;
  requestedAt: Date;
  approvedAt?: Date;
  rejectedAt?: Date;
  approvedBy?: string;
  rejectedBy?: string;
  message?: string;
  rejectionReason?: string;
}

export interface Team {
  id: string;
  name: string;
  description?: string;
  avatar?: string;
  ownerId: string;
  status: TeamStatus;
  isPrivate: boolean;
  settings: TeamSettings;
  memberCount: number;
  createdAt: Date;
  updatedAt: Date;
  members?: TeamMember[];
  invitations?: TeamInvitation[];
  joinRequests?: TeamJoinRequest[];
}

export interface TeamAnalytics {
  teamId: string;
  memberCount: number;
  activeMembers: number;
  newMembersThisMonth: number;
  membersByRole: Record<TeamRole, number>;
  activityStats: {
    totalActivities: number;
    activitiesThisWeek: number;
    activitiesThisMonth: number;
    topActivities: Array<{
      type: string;
      count: number;
    }>;
  };
  growthTrends: Array<{
    date: string;
    memberCount: number;
    newMembers: number;
    activities: number;
  }>;
  engagement: {
    averageActivitiesPerMember: number;
    mostActiveMembers: Array<{
      userId: string;
      activityCount: number;
    }>;
  };
}

export interface TeamStats {
  totalTeams: number;
  ownedTeams: number;
  memberTeams: number;
  adminTeams: number;
  totalMembers: number;
  recentActivity: number;
  pendingInvitations: number;
  pendingJoinRequests: number;
}
