# Required API Endpoints for BanedonV Frontend

This document lists all the API endpoints required by the existing frontend implementation, categorized by their current status in the mock backend.

## ✅ Already Implemented

### Authentication Endpoints
- `POST /api/v1/auth/login` - User login ✅
- `POST /api/v1/auth/register` - User registration ✅
- `POST /api/v1/auth/logout` - User logout ✅
- `POST /api/v1/auth/refresh` - Token refresh ✅
- `GET /api/v1/auth/me` - Get current user ✅
- `POST /api/v1/auth/forgot-password` - Password reset initiation ✅
- `POST /api/v1/auth/reset-password` - Password reset completion ✅

### Basic Endpoints (Minimal Implementation)
- `GET /api/v1/users` - Get users (basic) ✅
- `GET /api/v1/users/:id` - Get user by ID (basic) ✅
- `GET /api/v1/collections` - Get collections (basic) ✅
- `GET /api/v1/files` - Get files (basic) ✅
- `GET /api/v1/billing/subscription` - Get subscription (basic) ✅
- `GET /api/v1/admin/dashboard` - Get admin dashboard (basic) ✅

## ❌ Missing or Incomplete Endpoints

### User Management
- `PATCH /api/v1/users/:id` - Update user ❌
- `DELETE /api/v1/users/:id` - Delete user ❌

### Collection Management
- `GET /api/v1/collections/:id` - Get collection by ID ❌
- `POST /api/v1/collections` - Create collection ❌
- `PATCH /api/v1/collections/:id` - Update collection ❌
- `DELETE /api/v1/collections/:id` - Delete collection ❌

### File Management
- `GET /api/v1/files/:id` - Get file by ID ❌
- `POST /api/v1/files` - Upload file ❌
- `DELETE /api/v1/files/:id` - Delete file ❌

### Search
- `GET /api/v1/search` - Search with filters ❌

### Billing
- `GET /api/v1/billing` - Get billing info ❌
- `GET /api/v1/billing/invoices` - Get invoices ❌
- `POST /api/v1/billing/checkout` - Create checkout session ❌
- `POST /api/v1/billing/portal` - Create portal session ❌

### Admin
- `GET /api/v1/admin/metrics` - Get system metrics ❌
- `GET /api/v1/admin/activity` - Get activity logs ❌
- `GET /api/v1/admin/users` - Get admin users ❌
- `PATCH /api/v1/admin/users/:id/role` - Update user role ❌
- `PATCH /api/v1/admin/users/:id/deactivate` - Deactivate user ❌
- `PATCH /api/v1/admin/users/:id/activate` - Activate user ❌

## Implementation Priority

### High Priority (Core Functionality)
1. Collection CRUD operations
2. File CRUD operations
3. Search functionality
4. User management operations

### Medium Priority (Admin Features)
1. Admin metrics and activity logs
2. User role management
3. Billing information display

### Low Priority (Advanced Features)
1. Billing checkout and portal
2. Advanced search filters

## Expected Response Formats

All endpoints should return responses in the following format:

```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Operation successful",
  "timestamp": "2025-07-05T00:00:00.000Z",
  "requestId": "req_1234567890_abcdef"
}
```

For paginated responses:
```json
{
  "success": true,
  "data": [/* array of items */],
  "message": "Items retrieved successfully",
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

## Data Types Required

Based on the frontend types, the following data structures are expected:

### User
```typescript
{
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'user';
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  permissions?: string[];
}
```

### Collection
```typescript
{
  id: string;
  name: string;
  description?: string;
  type: 'public' | 'private' | 'shared';
  owner: User;
  createdAt: string;
  updatedAt: string;
  fileCount: number;
  size: number;
  tags?: string[];
  permissions?: CollectionPermission[];
}
```

### File
```typescript
{
  id: string;
  name: string;
  type: string;
  size: number;
  mimeType: string;
  url: string;
  thumbnailUrl?: string;
  collectionId: string;
  collection: Collection;
  owner: User;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  metadata?: Record<string, any>;
}
```

### BillingInfo
```typescript
{
  customerId: string;
  subscriptionId: string;
  planId: string;
  planName: string;
  status: 'active' | 'cancelled' | 'past_due' | 'unpaid';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  trialEnd?: string;
  usage: {
    storage: number;
    users: number;
    apiCalls: number;
  };
  limits: {
    storage: number;
    users: number;
    apiCalls: number;
  };
}
```

### SystemMetrics
```typescript
{
  totalUsers: number;
  activeUsers: number;
  totalCollections: number;
  totalFiles: number;
  totalStorage: number;
  apiCallsToday: number;
  revenueThisMonth: number;
  serverHealth: 'healthy' | 'warning' | 'error';
}
```
