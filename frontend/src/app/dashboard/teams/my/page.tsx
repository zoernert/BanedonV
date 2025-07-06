'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Team } from '@/lib/types';
import { teamApiService } from '@/lib/team-api';
import { authService } from '@/lib/auth';
import { ArrowLeft, Users, Plus, Settings, Crown, FileText } from '@/components/icons';
import Link from 'next/link';

export default function MyTeamsPage() {
  const [allTeams, setAllTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const user = authService.getUser();

  useEffect(() => {
    loadMyTeams();
  }, []);

  const loadMyTeams = async () => {
    try {
      setLoading(true);
      setError(null);
      const teams = await teamApiService.getMyTeams();
      setAllTeams(teams);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load teams');
    } finally {
      setLoading(false);
    }
  };

  const ownedTeams = allTeams.filter(team => team.owner.id === user?.id);
  const memberTeams = allTeams.filter(team => 
    team.owner.id !== user?.id && 
    team.members?.some(member => member.user.id === user?.id)
  );
  const managedTeams = allTeams.filter(team => 
    team.owner.id !== user?.id && 
    team.managers?.some(manager => manager.id === user?.id)
  );

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

  const getUserRole = (team: Team) => {
    if (team.owner.id === user?.id) return 'Owner';
    if (team.managers?.some(manager => manager.id === user?.id)) return 'Manager';
    
    const member = team.members?.find(member => member.user.id === user?.id);
    if (member) {
      return member.role === 'admin' ? 'Admin' : 
             member.role === 'viewer' ? 'Viewer' : 'Member';
    }
    
    return 'Member';
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Owner':
        return 'bg-purple-100 text-purple-800';
      case 'Manager':
        return 'bg-red-100 text-red-800';
      case 'Admin':
        return 'bg-orange-100 text-orange-800';
      case 'Member':
        return 'bg-blue-100 text-blue-800';
      case 'Viewer':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const TeamCard = ({ team }: { team: Team }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-lg">{getVisibilityIcon(team.visibility)}</span>
            <div>
              <CardTitle className="text-lg">{team.name}</CardTitle>
              <CardDescription>{team.description}</CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={getRoleColor(getUserRole(team))}>
              {getUserRole(team)}
            </Badge>
            {team.owner.id === user?.id && (
              <Crown className="h-4 w-4 text-yellow-500" />
            )}
          </div>
        </div>
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
            Created {new Date(team.createdAt).toLocaleDateString()}
          </div>
          <div className="text-sm text-muted-foreground">
            {team.activityCount || 0} activities
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
  );

  const EmptyState = ({ title, description, showCreateButton = false }: {
    title: string;
    description: string;
    showCreateButton?: boolean;
  }) => (
    <Card>
      <CardContent className="flex flex-col items-center justify-center h-64">
        <Users className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground text-center mb-4">{description}</p>
        {showCreateButton && authService.canCreateTeam('personal') && (
          <Button asChild>
            <Link href="/dashboard/teams/create">
              <Plus className="h-4 w-4 mr-2" />
              Create Team
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading your teams...</p>
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
        <div className="flex items-center space-x-4">
          <Button variant="ghost" asChild>
            <Link href="/dashboard/teams">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Teams
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">My Teams</h1>
            <p className="text-muted-foreground">
              Teams you own, manage, or are a member of
            </p>
          </div>
        </div>
        {authService.canCreateTeam('personal') && (
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
            <CardTitle className="text-sm font-medium">Teams Owned</CardTitle>
            <Crown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ownedTeams.length}</div>
            <p className="text-xs text-muted-foreground">
              Teams you created
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Teams Managed</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{managedTeams.length}</div>
            <p className="text-xs text-muted-foreground">
              Teams you manage
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Member Of</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{memberTeams.length}</div>
            <p className="text-xs text-muted-foreground">
              Teams you're a member of
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Teams Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Teams ({allTeams.length})</TabsTrigger>
          <TabsTrigger value="owned">Owned ({ownedTeams.length})</TabsTrigger>
          <TabsTrigger value="managed">Managed ({managedTeams.length})</TabsTrigger>
          <TabsTrigger value="member">Member ({memberTeams.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {allTeams.length === 0 ? (
            <EmptyState
              title="No teams yet"
              description="You haven't joined any teams yet. Create your first team or join an existing one to start collaborating."
              showCreateButton
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allTeams.map((team) => (
                <TeamCard key={team.id} team={team} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="owned" className="space-y-4">
          {ownedTeams.length === 0 ? (
            <EmptyState
              title="No teams owned"
              description="You haven't created any teams yet. Create your first team to start building your collaboration space."
              showCreateButton
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ownedTeams.map((team) => (
                <TeamCard key={team.id} team={team} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="managed" className="space-y-4">
          {managedTeams.length === 0 ? (
            <EmptyState
              title="No teams managed"
              description="You don't manage any teams yet. Team managers are assigned by team owners or organization administrators."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {managedTeams.map((team) => (
                <TeamCard key={team.id} team={team} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="member" className="space-y-4">
          {memberTeams.length === 0 ? (
            <EmptyState
              title="No team memberships"
              description="You're not a member of any teams yet. Browse and join teams to start collaborating with others."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {memberTeams.map((team) => (
                <TeamCard key={team.id} team={team} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
