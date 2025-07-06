import { AuthUser } from './AuthUser';

export type CollectionType = 'public' | 'private' | 'shared';
export type CollectionPermissionLevel = 'view' | 'edit' | 'admin';

export interface CollectionPermission {
  userId: string;
  permission: CollectionPermissionLevel;
  grantedAt: string;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  type: CollectionType;
  owner: AuthUser;
  createdAt: string;
  updatedAt: string;
  fileCount: number;
  size: number;
  tags: string[];
  permissions: CollectionPermission[];
  // For shared collections context
  sharedBy?: string;
  permission?: CollectionPermissionLevel;
}
