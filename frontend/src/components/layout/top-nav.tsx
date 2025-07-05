'use client';

import React from 'react';
import { Bell, Search, Settings, HelpCircle, Moon, Sun } from '@/components/icons';
import { useTheme } from '@/lib/theme';
import { cn } from '@/lib/utils';
import { authService } from '@/lib/auth';

interface TopNavProps {
  className?: string;
}

export function TopNav({ className }: TopNavProps) {
  const { theme, setTheme } = useTheme();
  const user = authService.getUser();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className={cn("sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60", className)}>
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search everything..."
              className="w-64 rounded-lg border border-input bg-background pl-10 pr-4 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="h-9 w-9 rounded-lg border border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center transition-colors"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </button>

          {/* Help */}
          <button className="h-9 w-9 rounded-lg border border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center transition-colors">
            <HelpCircle className="h-4 w-4" />
            <span className="sr-only">Help</span>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button className="h-9 w-9 rounded-lg border border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center transition-colors">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Notifications</span>
            </button>
            {/* Notification badge */}
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
              3
            </span>
          </div>

          {/* Settings */}
          <button className="h-9 w-9 rounded-lg border border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center transition-colors">
            <Settings className="h-4 w-4" />
            <span className="sr-only">Settings</span>
          </button>

          {/* User menu */}
          <div className="flex items-center space-x-3">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-medium">{user?.name}</span>
              <span className="text-xs text-muted-foreground capitalize">{user?.role}</span>
            </div>
            <button className="h-9 w-9 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
