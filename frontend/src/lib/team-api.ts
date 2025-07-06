import { apiClient } from './api';
import {
  Team,
  CreateTeamRequest,
  UpdateTeamRequest,
  InviteToTeamRequest,
  TeamInvitation,
  TeamActivity,
  TeamStats,
  TeamAnalytics,
  PaginatedResponse,
  ApiResponse,
} from './types';

class TeamApiService {
  // Team CRUD operations
  async createTeam(teamData: CreateTeamRequest): Promise<Team> {
    const response = await apiClient.createTeam(teamData);
    return response.data;
  }

  async getTeams(params?: {
    page?: number;
    limit?: number;
    type?: string;
    visibility?: string;
    search?: string;
  }): Promise<PaginatedResponse<Team>> {
    return await apiClient.getTeams(params);
  }

  async getMyTeams(): Promise<Team[]> {
    const response = await apiClient.getMyTeams();
    return response.data;
  }

  async getTeamById(id: string): Promise<Team> {
    const response = await apiClient.getTeamById(id);
    return response.data;
  }

  async updateTeam(id: string, updates: UpdateTeamRequest): Promise<Team> {
    const response = await apiClient.updateTeam(id, updates);
    return response.data;
  }

  async deleteTeam(id: string): Promise<void> {
    await apiClient.deleteTeam(id);
  }

  // Team membership management
  async inviteToTeam(teamId: string, invitation: InviteToTeamRequest): Promise<TeamInvitation> {
    const response = await apiClient.inviteToTeam(teamId, invitation);
    return response.data;
  }

  async getTeamInvitations(teamId: string): Promise<TeamInvitation[]> {
    const response = await apiClient.getTeamInvitations(teamId);
    return response.data;
  }

  async respondToInvitation(invitationId: string, response: 'accept' | 'reject'): Promise<void> {
    // This would need to be implemented in the main API client
    // For now, we'll use a direct call
    throw new Error('Method not implemented');
  }

  async joinTeam(teamId: string): Promise<void> {
    await apiClient.joinTeam(teamId);
  }

  async leaveTeam(teamId: string): Promise<void> {
    await apiClient.leaveTeam(teamId);
  }

  async removeMember(teamId: string, userId: string): Promise<void> {
    await apiClient.removeMember(teamId, userId);
  }

  async updateMemberRole(teamId: string, userId: string, role: string): Promise<void> {
    await apiClient.updateMemberRole(teamId, userId, role);
  }

  async getTeamMembers(teamId: string): Promise<any[]> {
    const response = await apiClient.getTeamMembers(teamId);
    return response.data;
  }

  // Team approval workflow
  async getPendingTeams(): Promise<Team[]> {
    const response = await apiClient.getPendingTeams();
    return response.data;
  }

  async approveTeam(teamId: string): Promise<Team> {
    const response = await apiClient.approveTeam(teamId);
    return response.data;
  }

  async rejectTeam(teamId: string, reason?: string): Promise<void> {
    await apiClient.rejectTeam(teamId, reason);
  }

  // Team analytics and stats
  async getTeamStats(teamId: string): Promise<TeamStats> {
    const response = await apiClient.getTeamStats(teamId);
    return response.data;
  }

  async getTeamAnalytics(teamId: string, period: '7d' | '30d' | '90d' = '30d'): Promise<TeamAnalytics> {
    // This would need to be implemented in the main API client
    // For now, we'll return mock data
    return {
      teamId,
      memberGrowth: [],
      activityTrends: [],
      fileUsage: [],
      popularCollections: [],
      topContributors: [],
    };
  }

  async getTeamActivity(teamId: string, params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<TeamActivity>> {
    // This would need to be implemented in the main API client
    // For now, we'll return mock data
    return {
      data: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      },
    };
  }

  // Public team discovery
  async getPublicTeams(params?: {
    page?: number;
    limit?: number;
    search?: string;
    type?: string;
  }): Promise<PaginatedResponse<Team>> {
    return await apiClient.getPublicTeams(params);
  }

  async requestToJoinTeam(teamId: string, message?: string): Promise<void> {
    await apiClient.requestToJoinTeam(teamId, message);
  }

  // Team templates and governance
  async getTeamTemplates(): Promise<any[]> {
    // This would need to be implemented in the main API client
    // For now, we'll return empty array
    return [];
  }

  async createTeamFromTemplate(templateId: string, teamData: Partial<CreateTeamRequest>): Promise<Team> {
    // This would need to be implemented in the main API client
    // For now, we'll throw an error
    throw new Error('Method not implemented');
  }

  // Bulk operations
  async bulkInvite(teamId: string, invitations: InviteToTeamRequest[]): Promise<TeamInvitation[]> {
    // This would need to be implemented in the main API client
    // For now, we'll throw an error
    throw new Error('Method not implemented');
  }

  async exportTeamData(teamId: string, format: 'csv' | 'json' = 'csv'): Promise<Blob> {
    // This would need to be implemented in the main API client
    // For now, we'll throw an error
    throw new Error('Method not implemented');
  }
}

export const teamApiService = new TeamApiService();
export default teamApiService;
