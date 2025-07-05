'use client';

import React, { useState, useEffect } from 'react';
import { PageContainer } from '@/components/layout/page-container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api';
import { 
  Search, 
  FolderOpen, 
  Users, 
  Star, 
  MoreVertical,
  User,
  Clock,
  Grid,
  List
} from '@/components/icons';
import Link from 'next/link';

interface SharedCollection {
  id: string;
  name: string;
  description: string;
  fileCount: number;
  size: string;
  updatedAt: string;
  sharedBy: string;
  sharedByAvatar?: string;
  permission: 'view' | 'edit' | 'admin';
  isStarred: boolean;
}

export default function SharedCollectionsPage() {
  const [collections, setCollections] = useState<SharedCollection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const fetchSharedCollections = async () => {
      try {
        // Mock data for demonstration
        const mockCollections: SharedCollection[] = [
          {
            id: '1',
            name: 'Design System',
            description: 'Complete design system components and guidelines',
            fileCount: 42,
            size: '2.8 GB',
            updatedAt: '1 day ago',
            sharedBy: 'Sarah Johnson',
            permission: 'edit',
            isStarred: true
          },
          {
            id: '2',
            name: 'Marketing Campaign Assets',
            description: 'Q4 campaign materials and brand assets',
            fileCount: 28,
            size: '1.5 GB',
            updatedAt: '3 days ago',
            sharedBy: 'Mike Chen',
            permission: 'view',
            isStarred: false
          },
          {
            id: '3',
            name: 'Engineering Documentation',
            description: 'Technical specifications and API documentation',
            fileCount: 67,
            size: '892 MB',
            updatedAt: '1 week ago',
            sharedBy: 'Alex Rodriguez',
            permission: 'edit',
            isStarred: true
          },
          {
            id: '4',
            name: 'Research Archive',
            description: 'User research findings and market analysis',
            fileCount: 15,
            size: '445 MB',
            updatedAt: '2 weeks ago',
            sharedBy: 'Emma Davis',
            permission: 'view',
            isStarred: false
          },
          {
            id: '5',
            name: 'Legal Documents',
            description: 'Contracts, agreements, and compliance materials',
            fileCount: 23,
            size: '124 MB',
            updatedAt: '1 month ago',
            sharedBy: 'Robert Wilson',
            permission: 'admin',
            isStarred: false
          }
        ];

        setCollections(mockCollections);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching shared collections:', error);
        setIsLoading(false);
      }
    };

    fetchSharedCollections();
  }, []);

  const filteredCollections = collections.filter(collection =>
    collection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    collection.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    collection.sharedBy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPermissionColor = (permission: string) => {
    switch (permission) {
      case 'admin':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'edit':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'view':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getPermissionIcon = (permission: string) => {
    switch (permission) {
      case 'admin':
        return <Users className="h-4 w-4" />;
      case 'edit':
        return <Users className="h-4 w-4" />;
      case 'view':
        return <User className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <PageContainer>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-96" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-lg" />
            ))}
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold">Shared with Me</h1>
            <p className="text-muted-foreground">
              Collections that others have shared with you
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search shared collections..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-64"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Collections Display */}
        {filteredCollections.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No shared collections found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? 'No collections match your search.' : 'No one has shared collections with you yet.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
            {filteredCollections.map((collection) => (
              <Card key={collection.id} className="group hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className={viewMode === 'grid' ? 'space-y-3' : 'flex items-center space-x-4'}>
                    <div className={viewMode === 'grid' ? 'flex items-center justify-between' : 'flex items-center space-x-3'}>
                      <div className="flex items-center space-x-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <FolderOpen className="h-5 w-5" />
                        </div>
                        {viewMode === 'list' && (
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold truncate">{collection.name}</h3>
                            <p className="text-sm text-muted-foreground truncate">{collection.description}</p>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-1">
                        {collection.isStarred && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {viewMode === 'grid' && (
                      <div className="space-y-2">
                        <h3 className="font-semibold">{collection.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{collection.description}</p>
                      </div>
                    )}
                    
                    <div className={viewMode === 'grid' ? 'space-y-2' : 'flex items-center space-x-4'}>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <User className="h-4 w-4" />
                        <span>Shared by {collection.sharedBy}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className={getPermissionColor(collection.permission)}>
                            {getPermissionIcon(collection.permission)}
                            <span className="ml-1 capitalize">{collection.permission}</span>
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {collection.updatedAt}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{collection.fileCount} files</span>
                        <span>{collection.size}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
}
