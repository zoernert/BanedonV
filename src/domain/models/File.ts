import { AuthUser } from './AuthUser';
import { Collection } from './Collection';

export interface File {
  id: string;
  name:string;
  type: string;
  size: number;
  mimeType: string;
  url: string;
  thumbnailUrl?: string;
  collectionId: string;
  collection?: Partial<Collection>;
  owner: AuthUser;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  metadata: Record<string, any>;
  // For recent files context
  action?: 'created' | 'updated' | 'viewed' | 'shared';
}
