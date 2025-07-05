'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function LoadingSpinner({ className, size = 'md' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-muted border-t-primary',
        sizeClasses[size],
        className
      )}
    />
  );
}

interface LoadingProps {
  className?: string;
  text?: string;
}

export function Loading({ className, text = 'Loading...' }: LoadingProps) {
  return (
    <div className={cn('flex items-center justify-center space-x-2 p-8', className)}>
      <LoadingSpinner />
      <span className="text-sm text-muted-foreground">{text}</span>
    </div>
  );
}

interface FullPageLoadingProps {
  text?: string;
}

export function FullPageLoading({ text = 'Loading...' }: FullPageLoadingProps) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" className="mx-auto mb-4" />
        <p className="text-muted-foreground">{text}</p>
      </div>
    </div>
  );
}
