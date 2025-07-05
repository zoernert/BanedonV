'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { PageContainer } from '@/components/layout/page-container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api';
import { 
  ArrowLeft, 
  Upload, 
  Search, 
  FileText, 
  Download, 
  Star, 
  MoreVertical, 
  Grid, 
  List,
  FolderOpen,
  Clock,
  Share
} from '@/components/icons';
import Link from 'next/link';

interface FileItem {
  id: string;
  name: string;
  type: string;
  size: string;
  updatedAt: string;
  isStarred: boolean;
  downloadUrl?: string;
}

interface Collection {
  id: string;
  name: string;
  description: string;
  fileCount: number;
  size: string;
  updatedAt: string;
  type: 'public' | 'private' | 'shared';
}

export default function CollectionDetailPage() {
  const { id } = useParams();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const fetchCollectionData = async () => {
      try {
        // Mock data for demonstration
        const mockCollection: Collection = {
          id: id as string,
          name: 'Marketing Resources',
          description: 'Brand guidelines, templates, and marketing materials',
          fileCount: 24,
          size: '1.2 GB',
          updatedAt: '2 hours ago',
          type: 'shared'
        };

        const mockFiles: FileItem[] = [
          {
            id: '1',
            name: 'Q4 Marketing Strategy.pdf',
            type: 'pdf',
            size: '2.4 MB',
            updatedAt: '2 hours ago',
            isStarred: true
          },
          {
            id: '2',
            name: 'Brand Guidelines.figma',
            type: 'figma',
            size: '1.8 MB',
            updatedAt: '1 day ago',
            isStarred: false
          },
          {
            id: '3',
            name: 'Social Media Templates.zip',
            type: 'zip',
            size: '45.2 MB',
            updatedAt: '3 days ago',
            isStarred: false
          },
          {
            id: '4',
            name: 'Campaign Performance Report.xlsx',
            type: 'xlsx',
            size: '892 KB',
            updatedAt: '1 week ago',
            isStarred: true
          }
        ];

        setCollection(mockCollection);
        setFiles(mockFiles);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching collection data:', error);
        setIsLoading(false);
      }
    };

    fetchCollectionData();
  }, [id]);

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
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
      case 'zip':
        return <FolderOpen className="h-8 w-8 text-yellow-500" />;
      default:
        return <FileText className="h-8 w-8 text-gray-500" />;
    }
  };

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
          <div className="flex items-center space-x-4">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-96" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-lg" />
            ))}
          </div>
        </div>
      </PageContainer>
    );
  }

  if (!collection) {
    return (
      <PageContainer>
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-2">Collection not found</h2>
          <p className="text-muted-foreground mb-4">The collection you're looking for doesn't exist.</p>
          <Link href="/dashboard/collections">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Collections
            </Button>
          </Link>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard/collections">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex items-center space-x-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FolderOpen className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold">{collection.name}</h1>
                <p className="text-muted-foreground">{collection.description}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className={getTypeColor(collection.type)}>
              {collection.type}
            </Badge>
            <Button variant="outline" size="sm">
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Upload Files
            </Button>
          </div>
        </div>

        {/* Collection Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Files</p>
                  <p className="text-2xl font-semibold">{collection.fileCount}</p>
                </div>
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Size</p>
                  <p className="text-2xl font-semibold">{collection.size}</p>
                </div>
                <FolderOpen className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="text-2xl font-semibold">{collection.updatedAt}</p>
                </div>
                <Clock className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search files..."
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

        {/* Files Grid/List */}
        {filteredFiles.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No files found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? 'No files match your search.' : 'This collection is empty.'}
              </p>
              <Button>
                <Upload className="h-4 w-4 mr-2" />
                Upload First File
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' : 'space-y-2'}>
            {filteredFiles.map((file) => (
              <Card key={file.id} className="group hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className={viewMode === 'grid' ? 'p-4' : 'p-3'}>
                  <div className={viewMode === 'grid' ? 'space-y-3' : 'flex items-center space-x-3'}>
                    <div className={viewMode === 'grid' ? 'flex items-center justify-center py-4' : ''}>
                      {getFileIcon(file.type)}
                    </div>
                    <div className={viewMode === 'grid' ? 'space-y-1' : 'flex-1 min-w-0'}>
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium truncate">{file.name}</h3>
                        <div className="flex items-center space-x-1">
                          {file.isStarred && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                          <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{file.size}</span>
                        <span>{file.updatedAt}</span>
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
