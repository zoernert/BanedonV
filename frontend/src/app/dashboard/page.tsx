'use client';

import React, { useEffect, useState } from 'react';
import { PageContainer } from '@/components/layout/page-container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { apiClient } from '@/lib/api';
import { authService } from '@/lib/auth';
import { 
  FolderOpen, 
  FileText, 
  Users, 
  TrendingUp, 
  Plus, 
  Search,
  Activity,
  Clock,
  Star
} from '@/components/icons';

interface DashboardStats {
  totalCollections: number;
  totalFiles: number;
  totalUsers: number;
  storageUsed: number;
  recentActivity: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
  }>;
  recentFiles: Array<{
    id: string;
    name: string;
    type: string;
    updatedAt: string;
  }>;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const user = authService.getUser();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch collections, files, and other data
        const [collections, files, users] = await Promise.all([
          apiClient.getCollections(1, 5),
          apiClient.getFiles(1, 5),
          authService.isManager() ? apiClient.getUsers(1, 5) : Promise.resolve({ data: [] })
        ]);

        const mockStats: DashboardStats = {
          totalCollections: collections?.data?.length || 12,
          totalFiles: files?.data?.length || 48,
          totalUsers: users?.data?.length || 8,
          storageUsed: 2.3, // GB
          recentActivity: [
            {
              id: '1',
              type: 'file_upload',
              description: 'New document uploaded to Marketing Collection',
              timestamp: '2 hours ago'
            },
            {
              id: '2',
              type: 'collection_created',
              description: 'Product Roadmap collection created',
              timestamp: '4 hours ago'
            },
            {
              id: '3',
              type: 'user_joined',
              description: 'Sarah Johnson joined the team',
              timestamp: '1 day ago'
            }
          ],
          recentFiles: [
            {
              id: '1',
              name: 'Q4 Marketing Strategy.pdf',
              type: 'pdf',
              updatedAt: '2 hours ago'
            },
            {
              id: '2',
              name: 'Product Requirements.docx',
              type: 'docx',
              updatedAt: '4 hours ago'
            },
            {
              id: '3',
              name: 'Team Meeting Notes.md',
              type: 'md',
              updatedAt: '1 day ago'
            }
          ]
        };

        setStats(mockStats);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <PageContainer title="Dashboard" description="Welcome back to your knowledge hub">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-[60px] mb-1" />
                <Skeleton className="h-3 w-[120px]" />
              </CardContent>
            </Card>
          ))}
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer 
      title={`Welcome back, ${user?.name?.split(' ')[0] || 'User'}`}
      description="Here's what's happening in your knowledge hub"
      actions={
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Collection
        </Button>
      }
    >
      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collections</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalCollections}</div>
            <p className="text-xs text-muted-foreground">
              +2 from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Files</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalFiles}</div>
            <p className="text-xs text-muted-foreground">
              +12 from last week
            </p>
          </CardContent>
        </Card>

        {authService.isManager() && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                +1 this month
              </p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.storageUsed} GB</div>
            <p className="text-xs text-muted-foreground">
              23% of plan limit
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="mr-2 h-4 w-4" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest updates from your team
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {activity.description}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center">
                      <Clock className="mr-1 h-3 w-3" />
                      {activity.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Activity
            </Button>
          </CardContent>
        </Card>

        {/* Recent Files */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-4 w-4" />
              Recent Files
            </CardTitle>
            <CardDescription>
              Files you've worked on recently
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.recentFiles.map((file) => (
                <div key={file.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Updated {file.updatedAt}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Star className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              <Search className="mr-2 h-4 w-4" />
              Browse All Files
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks to get you started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Create Collection
            </Button>
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Upload File
            </Button>
            <Button variant="outline">
              <Search className="mr-2 h-4 w-4" />
              Search Content
            </Button>
            {authService.isManager() && (
              <Button variant="outline">
                <Users className="mr-2 h-4 w-4" />
                Invite Team Member
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
