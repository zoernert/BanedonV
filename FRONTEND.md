# 🚀 GitHub Copilot Agent Prompt for BanedonV Frontend Development

## **FRONTEND ONLY - NO BACKEND IMPLEMENTATION**

Create a comprehensive Next.js 14 frontend application for "BanedonV" - a premium $250/month enterprise knowledge management SaaS platform.

**CRITICAL: This is FRONTEND ONLY. Use only mock data and existing backend API endpoints. Do not create any backend services.**

## 🎯 **Project Context**

**Platform**: BanedonV - Enterprise Knowledge Management SaaS  
**Value Proposition**: $250/month premium platform  
**Target Users**: Enterprise teams (simple for beginners, powerful for experts)  
**Backend Status**: ✅ COMPLETE - Mock middleware running on http://localhost:3002  
**Frontend Goal**: Production-ready UI that matches premium pricing  

## 🏗️ **Technical Requirements**

**Framework**: Next.js 14 with App Router  
**Language**: TypeScript (strict mode)  
**Styling**: Tailwind CSS + Shadcn/ui components  
**Design**: Modern glass morphism with dark/light mode  
**API Integration**: http://localhost:3002/api/v1 (existing mock backend)  

## 🌐 **Backend API Available**

The mock backend is already running with these endpoints:

**Authentication:**
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration  
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/logout` - User logout
- `POST /api/v1/auth/refresh` - Refresh JWT token

**Business APIs:**
- `GET /api/v1/users` - User management
- `GET /api/v1/collections` - Collection management
- `GET /api/v1/files` - File operations
- `GET /api/v1/search?q=query` - Search functionality
- `GET /api/v1/billing` - Billing operations
- `GET /api/v1/admin` - Admin operations

**Test Credentials:**
- Admin: `admin@banedonv.com` / `admin123`
- Manager: `manager@banedonv.com` / `manager123`
- User: `user@banedonv.com` / `user123`

## 🎨 **Design Requirements**

**Visual Standards (Premium $250/month Feel):**
- Modern glass morphism with subtle animations
- Dark/light mode with system preference detection
- Professional color palette (deep blues, elegant grays, accent colors)
- High-quality icons (Lucide React + custom illustrations)
- Responsive design (mobile-first approach)
- Loading states and micro-interactions throughout
- Empty states with helpful guidance

**UX Principles:**
- Progressive disclosure (simple for beginners, powerful for experts)
- Contextual help (tooltips, guided tours, inline explanations)
- Quick actions (keyboard shortcuts, bulk operations)
- Visual feedback (progress indicators, success/error states)
- Intuitive navigation (clear information architecture)

## 📋 **Phase 1: Foundation & Layout Implementation**

Create the foundational Next.js application with:

**Core Setup:**
- Next.js 14 app with TypeScript and Tailwind CSS
- Shadcn/ui component library integration
- Modern, professional design with glass morphism effects
- Dark/light mode toggle with system preference detection
- Responsive layout with sidebar navigation
- Premium color scheme (deep blues, elegant grays)

**Authentication System:**
- Login, signup, forgot password pages
- JWT token management with API integration
- Protected routes and authentication guards
- User session management
- Role-based access control (admin, manager, user)

**Layout Components:**
- Sidebar navigation with icons and active states
- Top navigation bar with user profile, notifications, settings
- Main content area with proper spacing
- Loading states and skeleton components
- Error boundaries and 404 pages

**API Integration:**
- Axios or fetch setup for API calls to http://localhost:3002/api/v1
- Request/response interceptors for JWT tokens
- Error handling for API failures
- Loading states for all API calls
- Proper TypeScript interfaces for API responses

**Key Components to Create:**
- Layout components (Sidebar, TopNav, PageContainer)
- Authentication forms with validation (using existing API)
- Theme provider with dark/light mode
- Navigation menu with icons and active states
- User profile dropdown with real user data from API
- Notification system
- Settings modal
- Loading spinners and skeleton screens

**API Service Layer:**
- `lib/api.ts` - API client configuration
- `lib/auth.ts` - Authentication service using existing endpoints
- `lib/hooks/` - React hooks for API calls
- `lib/types.ts` - TypeScript interfaces
- `lib/utils.ts` - Utility functions

**File Structure:**
```
app/
├── auth/
│   ├── login/page.tsx
│   ├── register/page.tsx
│   └── forgot-password/page.tsx
├── dashboard/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── collections/
│   │   ├── page.tsx
│   │   ├── [id]/page.tsx
│   │   ├── recent/page.tsx
│   │   ├── files/page.tsx
│   │   └── shared/page.tsx
│   ├── search/page.tsx
│   ├── billing/page.tsx
│   └── admin/page.tsx
├── layout.tsx
├── globals.css
├── not-found.tsx
└── error.tsx

components/
├── ui/ (shadcn/ui components)
├── layout/
│   ├── sidebar.tsx
│   ├── top-nav.tsx
│   └── page-container.tsx
├── auth/
│   ├── login-form.tsx
│   ├── register-form.tsx
│   └── auth-guard.tsx
└── common/
    ├── theme-toggle.tsx
    ├── user-menu.tsx
    └── loading.tsx

lib/
├── api.ts
├── auth.ts
├── hooks/
├── types.ts
└── utils.ts
```

**Design Standards:**
- Glass morphism with subtle backdrop blur
- Smooth transitions and hover effects
- Professional typography (Inter font)
- Consistent spacing and shadow system
- Premium feel with attention to detail
- Accessibility with proper contrast and semantic markup

**Integration Requirements:**
- Connect to existing mock backend at http://localhost:3002
- Use real authentication endpoints (no additional mocking needed)
- Handle JWT tokens properly
- Implement proper error handling for API failures
- Show loading states for all API operations
- Build to ./dist/frontend for Express server integration

**DO NOT CREATE:**
- Any backend services or APIs
- Database connections
- Server-side authentication
- Real file upload processing
- Payment processing systems

**SUCCESS CRITERIA:**
- Looks and feels like a $250/month premium product
- New users understand the concept in < 5 minutes
- All authentication flows work with existing backend
- Responsive design works perfectly on all devices
- Smooth animations and professional interactions
- Clear path for content addition and management

Generate complete, production-ready FRONTEND code that integrates seamlessly with the existing mock backend and provides the foundation for a premium enterprise knowledge management platform.