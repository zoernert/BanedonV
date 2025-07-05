# BanedonV Frontend

A premium Next.js 14 frontend application for BanedonV - Enterprise Knowledge Management SaaS platform.

## 🚀 Features

- **Modern UI**: Glass morphism design with dark/light mode support
- **Premium Experience**: Designed for $250/month enterprise pricing
- **Authentication**: JWT-based auth with role-based access control
- **Responsive Design**: Mobile-first approach with perfect device support
- **Real-time Integration**: Connects to existing backend API
- **TypeScript**: Fully typed with strict mode enabled
- **Performance**: Optimized with Next.js 14 app router

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS with custom design system
- **Components**: Custom UI components with shadcn/ui inspiration
- **Icons**: Custom SVG icon library
- **Theme**: Dark/light mode with system preference detection
- **API**: Axios for API communication with interceptors
- **State Management**: React hooks with context for auth

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js 14 app directory
│   │   ├── auth/              # Authentication pages
│   │   ├── dashboard/         # Dashboard pages
│   │   ├── globals.css        # Global styles
│   │   └── layout.tsx         # Root layout
│   ├── components/            # Reusable components
│   │   ├── ui/               # Base UI components
│   │   ├── layout/           # Layout components
│   │   ├── auth/             # Authentication components
│   │   ├── common/           # Common components
│   │   └── icons.tsx         # Custom icon library
│   └── lib/                  # Utility libraries
│       ├── api.ts           # API client
│       ├── auth.ts          # Authentication service
│       ├── theme.tsx        # Theme provider
│       ├── types.ts         # TypeScript types
│       └── utils.ts         # Utility functions
├── public/                   # Static assets
├── package.json             # Dependencies
├── tsconfig.json           # TypeScript config
├── tailwind.config.js      # Tailwind CSS config
└── next.config.js          # Next.js config
```

## 🎨 Design System

### Colors
- **Primary**: Deep blue (#3b82f6)
- **Secondary**: Elegant gray (#6b7280)
- **Accent**: Professional blue variants
- **Success**: Green (#10b981)
- **Warning**: Yellow (#f59e0b)
- **Error**: Red (#ef4444)

### Typography
- **Font**: Inter (Google Fonts)
- **Scale**: Tailwind's default scale
- **Weight**: 300-700 range

### Components
- **Glass Morphism**: Subtle backdrop blur effects
- **Cards**: Rounded corners with shadows
- **Buttons**: Multiple variants (default, outline, ghost)
- **Inputs**: Consistent styling with icons
- **Navigation**: Collapsible sidebar with icons

## 📱 Pages

### Authentication
- **Login**: `/login` - User authentication
- **Register**: `/register` - User registration
- **Forgot Password**: `/forgot-password` - Password reset

### Dashboard
- **Overview**: `/dashboard` - System overview and stats
- **Collections**: `/dashboard/collections` - Manage collections
- **Files**: `/dashboard/files` - Browse and manage files
- **Search**: `/dashboard/search` - Search across content
- **Billing**: `/dashboard/billing` - Subscription management
- **Admin**: `/dashboard/admin` - System administration

## 🔐 Authentication

### Features
- JWT token-based authentication
- Automatic token refresh
- Protected routes with auth guards
- Role-based access control (admin, manager, user)
- Persistent login state

### API Integration
- Connects to backend at `http://localhost:3002/api/v1`
- Request/response interceptors
- Error handling with automatic retry
- Loading states for all operations

## 🎯 User Roles

### Admin
- Full system access
- User management
- System metrics and analytics
- Billing management

### Manager
- Team management
- Billing access
- Content oversight
- User invitations

### User
- Personal collections
- File management
- Search functionality
- Profile management

## 🔧 Development

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Backend API running on port 3002

### Installation
```bash
# Run the setup script
./setup.sh

# Or manually:
npm install
npm run dev
```

### Available Scripts
- `npm run dev` - Start development server (port 3003)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checks

### Environment Variables
```env
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3002/api/v1
```

## 🌐 API Integration

### Backend Endpoints
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/logout` - User logout
- `POST /api/v1/auth/refresh` - Refresh token
- `GET /api/v1/collections` - Get collections
- `GET /api/v1/files` - Get files
- `GET /api/v1/search` - Search content
- `GET /api/v1/billing` - Get billing info
- `GET /api/v1/admin/*` - Admin endpoints

### Demo Credentials
- **Admin**: admin@banedonv.com / admin123
- **Manager**: manager@banedonv.com / manager123
- **User**: user@banedonv.com / user123

## 🎨 Styling

### Tailwind Classes
- `glass-effect` - Glass morphism styling
- `nav-item` - Navigation item styling
- `nav-item-active` - Active navigation state
- `gradient-bg` - Gradient background
- `gradient-text` - Gradient text effect

### Theme Support
- System preference detection
- Manual theme switching
- Persistent theme storage
- CSS custom properties for colors

## 📊 Performance

### Optimizations
- Next.js 14 app router for optimal performance
- Tree shaking for minimal bundle size
- Image optimization with Next.js Image
- Lazy loading for components
- Efficient re-renders with React keys

### Bundle Analysis
```bash
npm run build
# Check .next/static for bundle sizes
```

## 🔍 Testing

### Test Credentials
Use the provided demo credentials to test different user roles and permissions.

### Manual Testing
1. Start backend server on port 3002
2. Start frontend with `npm run dev`
3. Navigate to `http://localhost:3001`
4. Test authentication flows
5. Verify role-based access control
6. Test responsive design

## 🚀 Deployment

### Build Process
```bash
npm run build
```

### Production Setup
1. Build the application
2. Copy `dist/frontend` to your web server
3. Configure reverse proxy to backend API
4. Set up SSL certificates
5. Configure environment variables

### Docker Support
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "start"]
```

## 📋 Features Checklist

- ✅ Modern Next.js 14 app with TypeScript
- ✅ Professional glass morphism design
- ✅ Dark/light mode with system detection
- ✅ JWT authentication with auto-refresh
- ✅ Role-based access control
- ✅ Responsive design (mobile-first)
- ✅ API integration with error handling
- ✅ Loading states and skeletons
- ✅ Premium UI components
- ✅ Search functionality
- ✅ File management interface
- ✅ Collection management
- ✅ Admin dashboard
- ✅ Billing management
- ✅ User management
- ✅ Professional typography
- ✅ Consistent spacing system
- ✅ Accessible design
- ✅ Performance optimizations

## 🎯 Success Criteria

- ✅ **Premium Feel**: Looks and feels like a $250/month product
- ✅ **User Experience**: New users understand concept in < 5 minutes
- ✅ **Integration**: Works seamlessly with existing backend
- ✅ **Responsive**: Perfect on all devices
- ✅ **Performance**: Smooth animations and interactions
- ✅ **Scalability**: Clear path for feature expansion

## 🤝 Contributing

1. Follow the established code style
2. Use TypeScript with strict mode
3. Add proper type definitions
4. Test on multiple devices
5. Ensure accessibility standards
6. Document new features

## 📞 Support

For issues or questions:
- Check the backend API is running on port 3002
- Verify demo credentials are working
- Review browser console for errors
- Check network requests in developer tools

## 🎉 Conclusion

This frontend application provides a premium, professional interface for the BanedonV knowledge management platform. It's designed to meet enterprise standards while remaining intuitive for all user types.

The application successfully integrates with the existing backend, provides role-based access control, and delivers a responsive, accessible experience that justifies the premium pricing model.
