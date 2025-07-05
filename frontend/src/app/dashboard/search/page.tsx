'use client';

import React, { useState, useEffect } from 'react';
import { PageContainer } from '@/components/layout/page-container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { apiClient } from '@/lib/api';
import { Search, FileText, FolderOpen, Users, Clock } from '@/components/icons';

interface SearchResult {
  id: string;
  title: string;
  type: 'file' | 'collection' | 'user';
  content: string;
  collection?: string;
  updatedAt: string;
  score: number;
}

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      const response = await apiClient.search(query);
      
      // Mock search results for demonstration
      const mockResults: SearchResult[] = [
        {
          id: '1',
          title: 'Q4 Marketing Strategy.pdf',
          type: 'file' as const,
          content: 'Comprehensive marketing strategy for Q4 including budget allocation, campaign planning, and performance metrics...',
          collection: 'Marketing Resources',
          updatedAt: '2 hours ago',
          score: 0.95
        },
        {
          id: '2',
          title: 'Product Requirements.docx',
          type: 'file' as const,
          content: 'Detailed product requirements document outlining features, user stories, and technical specifications...',
          collection: 'Product Documentation',
          updatedAt: '1 day ago',
          score: 0.87
        },
        {
          id: '3',
          title: 'Marketing Resources',
          type: 'collection' as const,
          content: 'Collection containing brand guidelines, marketing templates, campaign assets, and promotional materials...',
          updatedAt: '3 days ago',
          score: 0.78
        }
      ].filter(result => 
        result.title.toLowerCase().includes(query.toLowerCase()) ||
        result.content.toLowerCase().includes(query.toLowerCase())
      );

      setResults(mockResults);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      handleSearch(searchTerm);
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'file':
        return <FileText className="h-4 w-4 text-blue-500" />;
      case 'collection':
        return <FolderOpen className="h-4 w-4 text-green-500" />;
      case 'user':
        return <Users className="h-4 w-4 text-purple-500" />;
      default:
        return <FileText className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'file':
        return 'File';
      case 'collection':
        return 'Collection';
      case 'user':
        return 'User';
      default:
        return 'Unknown';
    }
  };

  return (
    <PageContainer
      title="Search"
      description="Search across all your content"
    >
      <div className="space-y-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search for files, collections, or content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12 text-base"
          />
        </div>

        {isLoading && (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <Skeleton className="h-4 w-4 mt-1" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-[200px] mb-2" />
                      <Skeleton className="h-3 w-full mb-1" />
                      <Skeleton className="h-3 w-3/4 mb-2" />
                      <Skeleton className="h-3 w-[100px]" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && hasSearched && results.length > 0 && (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Found {results.length} result{results.length !== 1 ? 's' : ''} for "{searchTerm}"
            </div>
            
            {results.map((result) => (
              <Card key={result.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    {getIcon(result.type)}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-medium">{result.title}</h3>
                        <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                          {getTypeLabel(result.type)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {result.content}
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        {result.collection && (
                          <>
                            <FolderOpen className="h-3 w-3" />
                            <span>{result.collection}</span>
                            <span>•</span>
                          </>
                        )}
                        <Clock className="h-3 w-3" />
                        <span>{result.updatedAt}</span>
                        <span>•</span>
                        <span>Score: {(result.score * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && hasSearched && results.length === 0 && searchTerm && (
          <Card className="text-center py-12">
            <CardContent>
              <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <CardTitle className="mb-2">No results found</CardTitle>
              <CardDescription>
                Try adjusting your search terms or check the spelling
              </CardDescription>
            </CardContent>
          </Card>
        )}

        {!hasSearched && (
          <Card className="text-center py-12">
            <CardContent>
              <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <CardTitle className="mb-2">Search your knowledge base</CardTitle>
              <CardDescription>
                Enter keywords to find files, collections, and content across your workspace
              </CardDescription>
              <div className="mt-6 text-sm text-muted-foreground">
                <div className="mb-2">Try searching for:</div>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSearchTerm('marketing')}
                  >
                    marketing
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSearchTerm('product')}
                  >
                    product
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSearchTerm('documentation')}
                  >
                    documentation
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </PageContainer>
  );
}
