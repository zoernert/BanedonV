/**
 * Represents a user object safe for client exposure.
 */
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'org_admin' | 'team_manager' | 'user';
  avatar?: string;
  active: boolean;
  lastLogin?: string | null;
  createdAt: string;
  updatedAt?: string;
  // New team management fields
  managedTeams?: string[]; // Team IDs for team_manager role
  departmentScope?: string; // For team_manager scope limitation
  organizationPermissions?: string[]; // For org_admin role
}
