'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Team, PaginatedResponse } from '@/lib/types';
import { teamApiService } from '@/lib/team-api';
import { authService } from '@/lib/auth';
import { Search, Users, ArrowLeft, Globe, Building, User } from '@/components/icons';
import Link from 'next/link';

export default function BrowseTeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });

  const teamTypes = [
    { value: 'all', label: 'All Teams', icon: Users },
    { value: 'personal', label: 'Personal', icon: User },
    { value: 'departmental', label: 'Departmental', icon: Building },
    { value: 'organizational', label: 'Organizational', icon: Globe },
  ];

  useEffect(() => {
    loadPublicTeams();
  }, [pagination.page, selectedType]);

  const loadPublicTeams = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchQuery,
        type: selectedType === 'all' ? undefined : selectedType,
      };

      const response: PaginatedResponse<Team> = await teamApiService.getPublicTeams(params);
      setTeams(response.data);
      setPagination(response.pagination);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load teams');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearching(true);
    setPagination(prev => ({ ...prev, page: 1 }));
    
    try {
      const params = {
        page: 1,
        limit: pagination.limit,
        search: searchQuery,
        type: selectedType === 'all' ? undefined : selectedType,
      };

      const response: PaginatedResponse<Team> = await teamApiService.getPublicTeams(params);
      setTeams(response.data);
      setPagination(response.pagination);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to search teams');
    } finally {
      setSearching(false);
    }
  };

  const handleJoinTeam = async (teamId: string) => {
    try {
      await teamApiService.joinTeam(teamId);
      // Refresh the teams list
      await loadPublicTeams();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to join team');
    }
  };

  const handleRequestToJoin = async (teamId: string) => {
    try {
      await teamApiService.requestToJoinTeam(teamId);
      // Refresh the teams list
      await loadPublicTeams();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to request to join team');
    }
  };

  const getTeamTypeColor = (type: string) => {
    switch (type) {
      case 'personal':
        return 'bg-blue-100 text-blue-800';
      case 'departmental':
        return 'bg-green-100 text-green-800';
      case 'organizational':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case 'private':
        return '🔒';
      case 'department':
        return '🏢';
      case 'organization':
        return '🌐';
      default:
        return '👥';
    }
  };

  const canJoinTeam = (team: Team) => {
    const user = authService.getUser();
    if (!user) return false;
    
    // Check if user is already a member
    const isMember = team.members?.some(member => member.user.id === user.id);
    if (isMember) return false;
    
    // Check if team allows public joining
    return team.settings?.allowInvitations || team.visibility === 'organization';
  };

  const getJoinButtonText = (team: Team) => {
    if (team.settings?.requireApprovalForJoin) {
      return 'Request to Join';
    }
    return 'Join Team';
  };

  const handleJoinClick = (team: Team) => {
    if (team.settings?.requireApprovalForJoin) {
      handleRequestToJoin(team.id);
    } else {
      handleJoinTeam(team.id);
    }
  };

  if (loading && teams.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading teams...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" asChild>
            <Link href="/dashboard/teams">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Teams
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Browse Teams</h1>
            <p className="text-muted-foreground">
              Discover and join teams in your organization
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search Teams</CardTitle>
          <CardDescription>
            Find teams by name, description, or type
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSearch} className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search teams..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit" disabled={searching}>
              {searching ? 'Searching...' : 'Search'}
            </Button>
          </form>

          {/* Team Type Filter */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Filter by type:</span>
            <div className="flex items-center space-x-2">
              {teamTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <Button
                    key={type.value}
                    variant={selectedType === type.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedType(type.value)}
                  >
                    <Icon className="h-4 w-4 mr-1" />
                    {type.label}
                  </Button>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Teams Grid */}
      {teams.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No teams found</h3>
            <p className="text-muted-foreground text-center">
              Try adjusting your search criteria or explore different team types
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map((team) => (
            <Card key={team.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{team.name}</CardTitle>
                  <span className="text-lg">
                    {getVisibilityIcon(team.visibility)}
                  </span>
                </div>
                <CardDescription>{team.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <Badge className={getTeamTypeColor(team.type)}>
                    {team.type}
                  </Badge>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-1" />
                    {team.memberCount || 0} members
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-muted-foreground">
                    Created by {team.owner.name}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/teams/${team.id}`}>
                      View Details
                    </Link>
                  </Button>
                  
                  {canJoinTeam(team) && (
                    <Button 
                      size="sm" 
                      onClick={() => handleJoinClick(team)}
                    >
                      {getJoinButtonText(team)}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                {pagination.total} teams
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page === 1}
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                >
                  Previous
                </Button>
                <span className="text-sm">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page === pagination.totalPages}
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
