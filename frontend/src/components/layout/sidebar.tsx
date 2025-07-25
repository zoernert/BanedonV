'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { authService } from '@/lib/auth';
import {
  Home,
  FolderOpen,
  FileText,
  Search,
  CreditCard,
  Settings,
  Users,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Menu,
  X,
} from '@/components/icons';

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
  badge?: string;
  adminOnly?: boolean;
  managerOnly?: boolean;
  children?: Omit<NavItem, 'children'>[];
}

const navigation: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    description: 'Overview and quick actions',
  },
  {
    title: 'Teams',
    href: '/dashboard/teams',
    icon: Users,
    description: 'Manage teams and collaboration',
    children: [
      { title: 'My Teams', href: '/dashboard/teams/my', icon: Users },
      { title: 'Browse Teams', href: '/dashboard/teams/browse', icon: Search },
      { title: 'Pending Requests', href: '/dashboard/teams/pending', icon: FileText, managerOnly: true },
      { title: 'Create Team', href: '/dashboard/teams/create', icon: Users }
    ]
  },
  {
    title: 'Collections',
    href: '/dashboard/collections',
    icon: FolderOpen,
    description: 'Manage files and collections',
  },
  {
    title: 'Search',
    href: '/dashboard/search',
    icon: Search,
    description: 'Search across all content',
  },
  {
    title: 'Billing',
    href: '/dashboard/billing',
    icon: CreditCard,
    description: 'Manage subscription',
  },
  {
    title: 'Admin',
    href: '/dashboard/admin',
    icon: Settings,
    description: 'System administration',
    adminOnly: true,
    children: [
      { title: 'Users', href: '/dashboard/admin/users', icon: Users },
      { title: 'Teams', href: '/dashboard/admin/teams', icon: Users },
      { title: 'Roles', href: '/dashboard/admin/roles', icon: Settings },
      { title: 'Analytics', href: '/dashboard/admin/analytics', icon: FileText }
    ]
  },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const user = authService.getUser();

  const handleLogout = async () => {
    await authService.logout();
    window.location.href = '/login';
  };

  const filteredNavigation = navigation.filter(item => {
    if (item.adminOnly && !authService.isAdmin()) {
      return false;
    }
    if (item.managerOnly && !authService.isManager()) {
      return false;
    }
    return true;
  }).map(item => ({
    ...item,
    children: item.children?.filter(child => {
      if (child.adminOnly && !authService.isAdmin()) {
        return false;
      }
      if (child.managerOnly && !authService.isManager()) {
        return false;
      }
      return true;
    })
  }));

  const NavContent = () => (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-border/40">
        <div className={cn("flex items-center space-x-2", isCollapsed && "justify-center")}>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-sm font-bold">B</span>
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-semibold">BanedonV</span>
              <span className="text-xs text-muted-foreground">Knowledge Hub</span>
            </div>
          )}
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex h-8 w-8 items-center justify-center rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
        <button
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden h-8 w-8 items-center justify-center rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 p-4">
        {filteredNavigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.children && item.children.some(child => pathname === child.href));
          const hasChildren = item.children && item.children.length > 0;
          
          return (
            <div key={item.href} className="space-y-1">
              <Link
                href={item.href}
                className={cn(
                  "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-accent hover:text-accent-foreground",
                  isActive && "bg-primary text-primary-foreground shadow-sm",
                  isCollapsed && "justify-center"
                )}
                onClick={() => setIsMobileOpen(false)}
              >
                <Icon className={cn("h-4 w-4", !isCollapsed && "mr-3")} />
                {!isCollapsed && (
                  <div className="flex flex-1 items-center justify-between">
                    <span>{item.title}</span>
                    {item.badge && (
                      <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </Link>
              
              {/* Render children if not collapsed and has children */}
              {!isCollapsed && hasChildren && item.children && (
                <div className="ml-4 space-y-1 border-l border-border/40 pl-4">
                  {item.children.map((child) => {
                    const ChildIcon = child.icon;
                    const isChildActive = pathname === child.href;
                    
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-accent hover:text-accent-foreground",
                          isChildActive && "bg-primary text-primary-foreground shadow-sm"
                        )}
                        onClick={() => setIsMobileOpen(false)}
                      >
                        <ChildIcon className="h-4 w-4 mr-3" />
                        <span>{child.title}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-border/40 p-4">
        <div className={cn("flex items-center space-x-3 mb-3", isCollapsed && "justify-center")}>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-medium">{user?.name}</span>
              <span className="text-xs text-muted-foreground">{authService.getRoleDisplayName()}</span>
            </div>
          )}
        </div>
        
        <button
          onClick={handleLogout}
          className={cn(
            "flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
            isCollapsed && "justify-center"
          )}
        >
          <LogOut className={cn("h-4 w-4", !isCollapsed && "mr-3")} />
          {!isCollapsed && 'Sign out'}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 h-10 w-10 rounded-lg bg-background border border-border shadow-md flex items-center justify-center"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Desktop sidebar */}
      <div
        className={cn(
          "hidden lg:flex flex-col fixed left-0 top-0 h-full bg-background border-r border-border/40 transition-all duration-300 ease-in-out",
          isCollapsed ? "w-16" : "w-64",
          className
        )}
      >
        <NavContent />
      </div>

      {/* Mobile sidebar */}
      <div
        className={cn(
          "lg:hidden fixed left-0 top-0 h-full w-64 bg-background border-r border-border/40 z-50 transition-transform duration-300 ease-in-out",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <NavContent />
      </div>
    </>
  );
}
