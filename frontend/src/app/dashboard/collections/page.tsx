'use client';

import React, { useState, useEffect } from 'react';
import { PageContainer } from '@/components/layout/page-container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api';
import { Plus, Search, FolderOpen, Users, Settings, Clock, FileText, Share } from '@/components/icons';
import Link from 'next/link';

interface Collection {
  id: string;
  name: string;
  description: string;
  fileCount: number;
  size: string;
  updatedAt: string;
  type: 'public' | 'private' | 'shared';
}

// Utility functions
const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = diff / (1000 * 60 * 60);
  const days = hours / 24;
  
  if (hours < 1) {
    return 'just now';
  } else if (hours < 24) {
    return `${Math.floor(hours)} hours ago`;
  } else if (days < 30) {
    return `${Math.floor(days)} days ago`;
  } else if (days < 365) {
    return `${Math.floor(days / 30)} months ago`;
  } else {
    return `${Math.floor(days / 365)} years ago`;
  }
};

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await apiClient.getCollections();
        
        // Transform the API response to match our interface
        const transformedCollections: Collection[] = response.data.map((collection: any) => ({
          id: collection.id,
          name: collection.name,
          description: collection.description,
          fileCount: collection.fileCount,
          size: formatBytes(collection.size),
          updatedAt: formatRelativeTime(collection.updatedAt),
          type: collection.type
        }));
        
        setCollections(transformedCollections);
      } catch (error) {
        console.error('Error fetching collections:', error);
        
        // Fallback to mock data if API fails
        const mockCollections: Collection[] = [
          {
            id: 'marketing-resources',
            name: 'Marketing Resources',
            description: 'Brand guidelines, templates, and marketing materials',
            fileCount: 24,
            size: '1.2 GB',
            updatedAt: '2 hours ago',
            type: 'shared'
          },
          {
            id: 'product-documentation',
            name: 'Product Documentation',
            description: 'Technical docs, user guides, and API references',
            fileCount: 18,
            size: '856 MB',
            updatedAt: '1 day ago',
            type: 'public'
          },
          {
            id: 'research',
            name: 'Research',
            description: 'User research findings and market analysis',
            fileCount: 15,
            size: '445 MB',
            updatedAt: '2 days ago',
            type: 'private'
          },
          {
            id: 'project-management',
            name: 'Project Management',
            description: 'Sprint planning, roadmaps, and project documentation',
            fileCount: 12,
            size: '128 MB',
            updatedAt: '3 days ago',
            type: 'shared'
          },
          {
            id: 'legal-documents',
            name: 'Legal Documents',
            description: 'Contracts, agreements, and compliance materials',
            fileCount: 23,
            size: '124 MB',
            updatedAt: '1 month ago',
            type: 'private'
          },
          {
            id: 'design-system',
            name: 'Design System',
            description: 'Complete design system components and guidelines',
            fileCount: 42,
            size: '2.8 GB',
            updatedAt: '1 week ago',
            type: 'public'
          }
        ];
        
        setCollections(mockCollections);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCollections();
  }, []);

  const filteredCollections = collections.filter(collection =>
    collection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    collection.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'public':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'private':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'shared':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <h1 className="text-2xl font-semibold">Collections</h1>
            <p className="text-muted-foreground">
              Organize your files into collections for better management
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Collection
          </Button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-1 border-b border-border">
          <Link href="/dashboard/collections">
            <Button variant="ghost" className="border-b-2 border-primary text-primary">
              <FolderOpen className="mr-2 h-4 w-4" />
              My Collections
            </Button>
          </Link>
          <Link href="/dashboard/collections/recent">
            <Button variant="ghost">
              <Clock className="mr-2 h-4 w-4" />
              Recent Files
            </Button>
          </Link>
          <Link href="/dashboard/collections/files">
            <Button variant="ghost">
              <FileText className="mr-2 h-4 w-4" />
              All Files
            </Button>
          </Link>
          <Link href="/dashboard/collections/shared">
            <Button variant="ghost">
              <Share className="mr-2 h-4 w-4" />
              Shared with Me
            </Button>
          </Link>
        </div>

        {/* Search */}
        <div className="flex items-center space-x-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search collections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Collections Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCollections.map((collection) => (
            <Link key={collection.id} href={`/dashboard/collections/${collection.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer group">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center group-hover:text-primary transition-colors">
                      <FolderOpen className="mr-2 h-4 w-4" />
                      {collection.name}
                    </CardTitle>
                    <Badge variant="outline" className={getTypeColor(collection.type)}>
                      {collection.type}
                    </Badge>
                  </div>
                  <CardDescription>{collection.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{collection.fileCount} files</span>
                    <span>{collection.size}</span>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    Updated {collection.updatedAt}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {filteredCollections.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <FolderOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <CardTitle className="mb-2">No collections found</CardTitle>
              <CardDescription className="mb-4">
                {searchTerm ? 'Try adjusting your search terms' : 'Create your first collection to get started'}
              </CardDescription>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Collection
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </PageContainer>
  );
}
