'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreateTeamRequest } from '@/lib/types';
import { teamApiService } from '@/lib/team-api';
import { authService } from '@/lib/auth';
import { ArrowLeft, Users, Building, Globe } from '@/components/icons';
import Link from 'next/link';

export default function CreateTeamPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<CreateTeamRequest>({
    name: '',
    description: '',
    type: 'personal',
    visibility: 'private',
    maxMembers: 10,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const user = authService.getUser();

  const teamTypes = [
    {
      type: 'personal' as const,
      title: 'Personal Team',
      description: 'Small team for personal projects and close collaboration',
      icon: Users,
      maxMembers: 10,
      canCreate: authService.canCreateTeam('personal'),
      requiresApproval: false,
    },
    {
      type: 'departmental' as const,
      title: 'Departmental Team',
      description: 'Team for department-wide collaboration and projects',
      icon: Building,
      maxMembers: 50,
      canCreate: authService.canCreateTeam('departmental'),
      requiresApproval: !authService.isOrgAdmin(),
    },
    {
      type: 'organizational' as const,
      title: 'Organizational Team',
      description: 'Organization-wide team for company-level initiatives',
      icon: Globe,
      maxMembers: 500,
      canCreate: authService.canCreateTeam('organizational'),
      requiresApproval: false,
    },
  ];

  const visibilityOptions = [
    {
      value: 'private' as const,
      label: 'Private',
      description: 'Only invited members can see and join',
      icon: '🔒',
    },
    {
      value: 'department' as const,
      label: 'Department',
      description: 'Visible to department members',
      icon: '🏢',
    },
    {
      value: 'organization' as const,
      label: 'Organization',
      description: 'Visible to entire organization',
      icon: '🌐',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const team = await teamApiService.createTeam(formData);
      router.push(`/dashboard/teams/${team.id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create team');
    } finally {
      setLoading(false);
    }
  };

  const selectedTeamType = teamTypes.find(t => t.type === formData.type);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" asChild>
          <Link href="/dashboard/teams">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Teams
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Create New Team</h1>
          <p className="text-muted-foreground">
            Set up a new team for collaboration and knowledge sharing
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Team Type Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Team Type</CardTitle>
            <CardDescription>
              Choose the type of team based on your collaboration needs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {teamTypes.map((type) => {
              const Icon = type.icon;
              const isSelected = formData.type === type.type;
              const isDisabled = !type.canCreate;

              return (
                <div
                  key={type.type}
                  className={`relative rounded-lg border p-4 cursor-pointer transition-all hover:border-primary ${
                    isSelected ? 'border-primary bg-primary/5' : ''
                  } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => {
                    if (!isDisabled) {
                      setFormData(prev => ({
                        ...prev,
                        type: type.type,
                        maxMembers: type.maxMembers,
                      }));
                    }
                  }}
                >
                  <div className="flex items-start space-x-3">
                    <Icon className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{type.title}</h3>
                        <div className="flex items-center space-x-2">
                          {type.requiresApproval && (
                            <Badge variant="outline" className="text-xs">
                              Requires Approval
                            </Badge>
                          )}
                          {!type.canCreate && (
                            <Badge variant="destructive" className="text-xs">
                              Not Available
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {type.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Max members: {type.maxMembers}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Team Details */}
        <Card>
          <CardHeader>
            <CardTitle>Team Details</CardTitle>
            <CardDescription>
              Provide basic information about your team
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Team Name</label>
              <Input
                type="text"
                placeholder="Enter team name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <textarea
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Describe the purpose and goals of your team"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Maximum Members</label>
              <Input
                type="number"
                min="1"
                max={selectedTeamType?.maxMembers || 10}
                value={formData.maxMembers}
                onChange={(e) => setFormData(prev => ({ ...prev, maxMembers: parseInt(e.target.value) }))}
                required
              />
              <p className="text-xs text-muted-foreground">
                Maximum allowed: {selectedTeamType?.maxMembers || 10}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Visibility Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Visibility</CardTitle>
            <CardDescription>
              Control who can see and discover your team
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {visibilityOptions.map((option) => (
              <div
                key={option.value}
                className={`rounded-lg border p-4 cursor-pointer transition-all hover:border-primary ${
                  formData.visibility === option.value ? 'border-primary bg-primary/5' : ''
                }`}
                onClick={() => setFormData(prev => ({ ...prev, visibility: option.value }))}
              >
                <div className="flex items-start space-x-3">
                  <span className="text-lg flex-shrink-0">{option.icon}</span>
                  <div>
                    <h3 className="font-semibold">{option.label}</h3>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex items-center justify-between">
          <Button type="button" variant="outline" asChild>
            <Link href="/dashboard/teams">Cancel</Link>
          </Button>
          <div className="flex items-center space-x-2">
            {selectedTeamType?.requiresApproval && (
              <p className="text-sm text-muted-foreground">
                This team will require approval before activation
              </p>
            )}
            <Button type="submit" disabled={loading || !formData.name.trim()}>
              {loading ? 'Creating...' : 'Create Team'}
            </Button>
          </div>
        </div>

        {error && (
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-destructive">{error}</p>
            </CardContent>
          </Card>
        )}
      </form>
    </div>
  );
}
