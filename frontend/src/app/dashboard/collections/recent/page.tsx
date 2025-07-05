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
  FileText, 
  Star, 
  MoreVertical, 
  Clock,
  FolderOpen,
  Grid,
  List
} from '@/components/icons';

interface RecentFile {
  id: string;
  name: string;
  type: string;
  size: string;
  collection: string;
  collectionId: string;
  updatedAt: string;
  isStarred: boolean;
  action: 'created' | 'updated' | 'viewed' | 'shared';
}

export default function RecentFilesPage() {
  const [recentFiles, setRecentFiles] = useState<RecentFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  useEffect(() => {
    const fetchRecentFiles = async () => {
      try {
        // Mock data for demonstration
        const mockRecentFiles: RecentFile[] = [
          {
            id: '1',
            name: 'Q4 Marketing Strategy.pdf',
            type: 'pdf',
            size: '2.4 MB',
            collection: 'Marketing Resources',
            collectionId: '1',
            updatedAt: '2 hours ago',
            isStarred: true,
            action: 'updated'
          },
          {
            id: '2',
            name: 'Brand Guidelines.figma',
            type: 'figma',
            size: '1.8 MB',
            collection: 'Marketing Resources',
            collectionId: '1',
            updatedAt: '4 hours ago',
            isStarred: false,
            action: 'created'
          },
          {
            id: '3',
            name: 'API Documentation.md',
            type: 'md',
            size: '892 KB',
            collection: 'Product Documentation',
            collectionId: '2',
            updatedAt: '1 day ago',
            isStarred: false,
            action: 'viewed'
          },
          {
            id: '4',
            name: 'User Research Report.docx',
            type: 'docx',
            size: '3.2 MB',
            collection: 'Research',
            collectionId: '3',
            updatedAt: '2 days ago',
            isStarred: true,
            action: 'shared'
          },
          {
            id: '5',
            name: 'Sprint Planning.xlsx',
            type: 'xlsx',
            size: '1.1 MB',
            collection: 'Project Management',
            collectionId: '4',
            updatedAt: '3 days ago',
            isStarred: false,
            action: 'updated'
          }
        ];

        setRecentFiles(mockRecentFiles);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching recent files:', error);
        setIsLoading(false);
      }
    };

    fetchRecentFiles();
  }, []);

  const filteredFiles = recentFiles.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.collection.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return <FileText className="h-8 w-8 text-red-500" />;
      case 'docx':
      case 'doc':
        return <FileText className="h-8 w-8 text-blue-500" />;
      case 'xlsx':
      case 'xls':
        return <FileText className="h-8 w-8 text-green-500" />;
      case 'md':
        return <FileText className="h-8 w-8 text-purple-500" />;
      case 'figma':
        return <FileText className="h-8 w-8 text-pink-500" />;
      default:
        return <FileText className="h-8 w-8 text-gray-500" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'created':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'updated':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'viewed':
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
      case 'shared':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
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
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-lg" />
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
            <h1 className="text-2xl font-semibold">Recent Files</h1>
            <p className="text-muted-foreground">
              Files you've recently created, updated, or viewed
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search recent files..."
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

        {/* Files List */}
        {filteredFiles.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No recent files found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? 'No files match your search.' : 'Start working with files to see them here.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' : 'space-y-2'}>
            {filteredFiles.map((file) => (
              <Card key={file.id} className="group hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className={viewMode === 'grid' ? 'p-4' : 'p-3'}>
                  <div className={viewMode === 'grid' ? 'space-y-3' : 'flex items-center space-x-3'}>
                    <div className={viewMode === 'grid' ? 'flex items-center justify-center py-2' : ''}>
                      {getFileIcon(file.type)}
                    </div>
                    <div className={viewMode === 'grid' ? 'space-y-2' : 'flex-1 min-w-0'}>
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium truncate">{file.name}</h3>
                        <div className="flex items-center space-x-1">
                          {file.isStarred && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                          <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <FolderOpen className="h-4 w-4" />
                        <span className="truncate">{file.collection}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className={getActionColor(file.action)}>
                            {file.action}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{file.size}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{file.updatedAt}</span>
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
