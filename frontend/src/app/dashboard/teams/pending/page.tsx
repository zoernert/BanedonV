'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Team } from '@/lib/types';
import { teamApiService } from '@/lib/team-api';
import { authService } from '@/lib/auth';
import { ArrowLeft, Users, CheckCircle, XCircle, Eye, FileText } from '@/components/icons';
import Link from 'next/link';

export default function PendingTeamsPage() {
  const [pendingTeams, setPendingTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingTeams, setProcessingTeams] = useState<Set<string>>(new Set());
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const [showRejectModal, setShowRejectModal] = useState<string | null>(null);

  useEffect(() => {
    // Check if user has permission to view pending teams
    if (!authService.isManager()) {
      setError('You do not have permission to view pending teams');
      setLoading(false);
      return;
    }

    loadPendingTeams();
  }, []);

  const loadPendingTeams = async () => {
    try {
      setLoading(true);
      setError(null);
      const teams = await teamApiService.getPendingTeams();
      setPendingTeams(teams);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load pending teams');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveTeam = async (teamId: string) => {
    try {
      setProcessingTeams(prev => new Set(prev).add(teamId));
      await teamApiService.approveTeam(teamId);
      await loadPendingTeams(); // Refresh the list
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to approve team');
    } finally {
      setProcessingTeams(prev => {
        const newSet = new Set(prev);
        newSet.delete(teamId);
        return newSet;
      });
    }
  };

  const handleRejectTeam = async (teamId: string) => {
    try {
      setProcessingTeams(prev => new Set(prev).add(teamId));
      await teamApiService.rejectTeam(teamId, rejectionReason);
      setShowRejectModal(null);
      setRejectionReason('');
      await loadPendingTeams(); // Refresh the list
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reject team');
    } finally {
      setProcessingTeams(prev => {
        const newSet = new Set(prev);
        newSet.delete(teamId);
        return newSet;
      });
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const canApprove = (team: Team) => {
    return authService.canApproveTeam(team);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading pending teams...</p>
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
            <h1 className="text-3xl font-bold">Pending Team Approvals</h1>
            <p className="text-muted-foreground">
              Teams awaiting approval from managers
            </p>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pending</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTeams.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departmental</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pendingTeams.filter(t => t.type === 'departmental').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Organizational</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pendingTeams.filter(t => t.type === 'organizational').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Teams List */}
      {pendingTeams.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <CheckCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No pending teams</h3>
            <p className="text-muted-foreground text-center">
              All team requests have been processed
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {pendingTeams.map((team) => (
            <Card key={team.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{getVisibilityIcon(team.visibility)}</span>
                    <div>
                      <CardTitle className="text-lg">{team.name}</CardTitle>
                      <CardDescription>{team.description}</CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-orange-600 border-orange-600">
                    Pending
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Type:</span>
                      <Badge className={getTeamTypeColor(team.type)}>
                        {team.type}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Visibility:</span>
                      <span className="text-sm text-muted-foreground capitalize">
                        {team.visibility}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Max Members:</span>
                      <span className="text-sm text-muted-foreground">
                        {team.maxMembers}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Created by:</span>
                      <span className="text-sm text-muted-foreground">
                        {team.owner.name}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Email:</span>
                      <span className="text-sm text-muted-foreground">
                        {team.owner.email}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Requested:</span>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(team.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/teams/${team.id}`}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Link>
                  </Button>
                  
                  {canApprove(team) && (
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowRejectModal(team.id)}
                        disabled={processingTeams.has(team.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleApproveTeam(team.id)}
                        disabled={processingTeams.has(team.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        {processingTeams.has(team.id) ? 'Approving...' : 'Approve'}
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Reject Team Request</CardTitle>
              <CardDescription>
                Please provide a reason for rejecting this team request
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <textarea
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Enter rejection reason..."
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
              <div className="flex items-center justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowRejectModal(null);
                    setRejectionReason('');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleRejectTeam(showRejectModal)}
                  disabled={!rejectionReason.trim() || processingTeams.has(showRejectModal)}
                >
                  {processingTeams.has(showRejectModal) ? 'Rejecting...' : 'Reject Team'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
