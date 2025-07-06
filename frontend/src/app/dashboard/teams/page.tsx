'use client';

import { useState, useEffect } from 'react';
import { Plus, Users, Settings, TrendingUp, FileText } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Team } from '@/lib/types';
import { teamApiService } from '@/lib/team-api';
import { authService } from '@/lib/auth';
import Link from 'next/link';

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [pendingTeams, setPendingTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const user = authService.getUser();
  const canCreateTeam = authService.canCreateTeam('personal');
  const canViewPending = authService.isManager();

  useEffect(() => {
    loadTeams();
    if (canViewPending) {
      loadPendingTeams();
    }
  }, [canViewPending]);

  const loadTeams = async () => {
    try {
      setLoading(true);
      const myTeams = await teamApiService.getMyTeams();
      setTeams(myTeams);
    } catch (err) {
      setError('Failed to load teams');
      console.error('Error loading teams:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadPendingTeams = async () => {
    try {
      const pending = await teamApiService.getPendingTeams();
      setPendingTeams(pending);
    } catch (err) {
      console.error('Error loading pending teams:', err);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading teams...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <FileText className="h-8 w-8 text-destructive mx-auto mb-2" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Teams</h1>
          <p className="text-muted-foreground">
            Manage your teams and collaboration spaces
          </p>
        </div>
        {canCreateTeam && (
          <Button asChild>
            <Link href="/dashboard/teams/create">
              <Plus className="h-4 w-4 mr-2" />
              Create Team
            </Link>
          </Button>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Teams</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teams.length}</div>
            <p className="text-xs text-muted-foreground">
              Active teams you're part of
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {teams.reduce((acc, team) => acc + (team.memberCount || 0), 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all your teams
            </p>
          </CardContent>
        </Card>

        {canViewPending && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingTeams.length}</div>
              <p className="text-xs text-muted-foreground">
                Teams awaiting approval
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Teams Content */}
      <Tabs defaultValue="my-teams" className="space-y-4">
        <TabsList>
          <TabsTrigger value="my-teams">My Teams</TabsTrigger>
          <TabsTrigger value="browse">Browse Teams</TabsTrigger>
          {canViewPending && (
            <TabsTrigger value="pending">
              Pending ({pendingTeams.length})
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="my-teams" className="space-y-4">
          {teams.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-64">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No teams yet</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Create your first team to start collaborating with others
                </p>
                {canCreateTeam && (
                  <Button asChild>
                    <Link href="/dashboard/teams/create">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Team
                    </Link>
                  </Button>
                )}
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
                    <div className="flex items-center justify-between">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/dashboard/teams/${team.id}`}>
                          View Team
                        </Link>
                      </Button>
                      {authService.canManageTeam(team) && (
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/dashboard/teams/${team.id}/settings`}>
                            <Settings className="h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="browse">
          <Card>
            <CardHeader>
              <CardTitle>Browse Public Teams</CardTitle>
              <CardDescription>
                Discover and join public teams in your organization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Public team browsing functionality will be implemented here
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {canViewPending && (
          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>Pending Approvals</CardTitle>
                <CardDescription>
                  Teams awaiting your approval
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pendingTeams.length === 0 ? (
                  <p className="text-muted-foreground">
                    No teams pending approval
                  </p>
                ) : (
                  <div className="space-y-4">
                    {pendingTeams.map((team) => (
                      <div key={team.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-semibold">{team.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {team.description}
                          </p>
                          <div className="flex items-center mt-2 space-x-2">
                            <Badge className={getTeamTypeColor(team.type)}>
                              {team.type}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              by {team.owner.name}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                          <Button variant="destructive" size="sm">
                            Reject
                          </Button>
                          <Button size="sm">
                            Approve
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
