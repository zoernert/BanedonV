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
  FolderOpen,
  Grid,
  List,
  Filter
} from '@/components/icons';
import Link from 'next/link';

interface FileItem {
  id: string;
  name: string;
  type: string;
  size: string;
  collection: string;
  collectionId: string;
  updatedAt: string;
  isStarred: boolean;
}

export default function AllFilesPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [selectedCollection, setSelectedCollection] = useState<string>('all');

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        // Mock data for demonstration
        const mockFiles: FileItem[] = [
          {
            id: '1',
            name: 'Q4 Marketing Strategy.pdf',
            type: 'pdf',
            size: '2.4 MB',
            collection: 'Marketing Resources',
            collectionId: '1',
            updatedAt: '2 hours ago',
            isStarred: true
          },
          {
            id: '2',
            name: 'Brand Guidelines.figma',
            type: 'figma',
            size: '1.8 MB',
            collection: 'Marketing Resources',
            collectionId: '1',
            updatedAt: '4 hours ago',
            isStarred: false
          },
          {
            id: '3',
            name: 'API Documentation.md',
            type: 'md',
            size: '892 KB',
            collection: 'Product Documentation',
            collectionId: '2',
            updatedAt: '1 day ago',
            isStarred: false
          },
          {
            id: '4',
            name: 'User Research Report.docx',
            type: 'docx',
            size: '3.2 MB',
            collection: 'Research',
            collectionId: '3',
            updatedAt: '2 days ago',
            isStarred: true
          },
          {
            id: '5',
            name: 'Sprint Planning.xlsx',
            type: 'xlsx',
            size: '1.1 MB',
            collection: 'Project Management',
            collectionId: '4',
            updatedAt: '3 days ago',
            isStarred: false
          },
          {
            id: '6',
            name: 'Meeting Notes.docx',
            type: 'docx',
            size: '234 KB',
            collection: 'Project Management',
            collectionId: '4',
            updatedAt: '1 week ago',
            isStarred: false
          },
          {
            id: '7',
            name: 'Design System.pdf',
            type: 'pdf',
            size: '5.8 MB',
            collection: 'Product Documentation',
            collectionId: '2',
            updatedAt: '1 week ago',
            isStarred: true
          },
          {
            id: '8',
            name: 'Customer Feedback.xlsx',
            type: 'xlsx',
            size: '678 KB',
            collection: 'Research',
            collectionId: '3',
            updatedAt: '2 weeks ago',
            isStarred: false
          }
        ];

        setFiles(mockFiles);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching files:', error);
        setIsLoading(false);
      }
    };

    fetchFiles();
  }, []);

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.collection.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCollection = selectedCollection === 'all' || file.collection === selectedCollection;
    return matchesSearch && matchesCollection;
  });

  const collections = Array.from(new Set(files.map(file => file.collection)));

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
            {[...Array(8)].map((_, i) => (
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
            <h1 className="text-2xl font-semibold">All Files</h1>
            <p className="text-muted-foreground">
              Browse all your files across collections
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
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
            <select
              value={selectedCollection}
              onChange={(e) => setSelectedCollection(e.target.value)}
              className="px-3 py-2 border border-input bg-background rounded-md text-sm"
            >
              <option value="all">All Collections</option>
              {collections.map(collection => (
                <option key={collection} value={collection}>{collection}</option>
              ))}
            </select>
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

        {/* Files Display */}
        {filteredFiles.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No files found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? 'No files match your search criteria.' : 'No files have been uploaded yet.'}
              </p>
              <Link href="/dashboard/collections">
                <Button>
                  <FolderOpen className="h-4 w-4 mr-2" />
                  Browse Collections
                </Button>
              </Link>
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
                        <Link 
                          href={`/dashboard/collections/${file.collectionId}`}
                          className="truncate hover:text-primary transition-colors"
                        >
                          {file.collection}
                        </Link>
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
