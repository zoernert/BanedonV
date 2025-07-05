'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  actions?: React.ReactNode;
}

export function PageContainer({ 
  children, 
  className, 
  title, 
  description, 
  actions 
}: PageContainerProps) {
  return (
    <div className={cn("flex-1 space-y-6 p-8", className)}>
      {(title || description || actions) && (
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            {title && (
              <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            )}
            {description && (
              <p className="text-muted-foreground">{description}</p>
            )}
          </div>
          {actions && (
            <div className="flex items-center space-x-2">
              {actions}
            </div>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
