You're absolutely right! Using different ports will cause CORS issues. Let me fix the configuration to use the same port with proper routing.

# Updated Environment Configuration for BanedonV
## Single Port Strategy (Port 3001)

## 📁 Updated File Structure

```
banedonv/
├── .env.example                    # Updated template
├── .env.development                # Local development
├── .env.development.remote         # Remote development server
├── .env.production                 # Production environment
├── config/
│   ├── environments.json           # Updated server configuration
│   ├── deployment.json             # Deployment configuration
│   └── proxy.json                  # Proxy configuration
├── scripts/
│   ├── deploy-dev.sh              # Development deployment
│   ├── deploy-prod.sh             # Production deployment
│   └── setup-nginx.sh             # Nginx setup for routing
├── FRONTEND.md                    # Your frontend plan
├── MIDDLEWARE.md                  # Your middleware plan
└── README.md                      # Main project documentation
```

## 🔧 Updated Configuration Files

### 1. `.env.example` (Updated Template)
```bash
# BanedonV Environment Configuration Template
# Single port strategy to avoid CORS issues

# Application
NODE_ENV=development
PORT=3001
APP_NAME=BanedonV
APP_VERSION=1.0.0

# Single Port Configuration (Frontend + API)
SERVER_PORT=3001
FRONTEND_BUILD_PATH=./dist/frontend
API_BASE_PATH=/api

# Database (Mock for now)
DATABASE_URL=mock://localhost:5432/banedonv
REDIS_URL=mock://localhost:6379

# Authentication (Mock JWT)
JWT_SECRET=your-jwt-secret-here
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# API Configuration
API_VERSION=v1
API_RATE_LIMIT=100

# NO CORS NEEDED - Same port serving both frontend and API
# Frontend served from root: http://localhost:3001/
# API served from: http://localhost:3001/api/v1/

# Logging
LOG_LEVEL=info
LOG_FORMAT=json
LOG_MAX_SIZE=10m
LOG_MAX_FILES=5

# Mock Services
MOCK_RESPONSE_DELAY=500
MOCK_ERROR_RATE=0.05
MOCK_DATA_SIZE=large

# Development Server (Remote)
DEV_SERVER_HOST=10.0.0.14
DEV_SERVER_PORT=3001
DEV_SERVER_USER=root
DEV_SERVER_PATH=/opt/banedonv

# Production Server
PROD_SERVER_HOST=10.0.0.2
PROD_SERVER_PORT=3001
PROD_SERVER_USER=root
PROD_SERVER_PATH=/opt/banedonv

# SSH Configuration
SSH_KEY_PATH=~/.ssh/id_rsa
SSH_TIMEOUT=10000
SSH_KEEPALIVE=true
```

### 2. `config/environments.json` (Updated Server Details)
```json
{
  "development": {
    "local": {
      "host": "localhost",
      "port": 3001,
      "protocol": "http",
      "baseUrl": "http://localhost:3001",
      "apiPath": "/api/v1",
      "frontendPath": "/",
      "description": "Local development environment - single port"
    },
    "remote": {
      "host": "10.0.0.14",
      "port": 3001,
      "protocol": "http",
      "baseUrl": "http://10.0.0.14:3001",
      "apiPath": "/api/v1",
      "frontendPath": "/",
      "user": "root",
      "deployPath": "/opt/banedonv",
      "description": "Remote development server - single port",
      "features": {
        "hotReload": true,
        "debugging": true,
        "logging": "verbose",
        "mockData": true,
        "corsRequired": false
      }
    }
  },
  "production": {
    "host": "10.0.0.2",
    "port": 3001,
    "protocol": "https",
    "baseUrl": "https://10.0.0.2:3001",
    "apiPath": "/api/v1",
    "frontendPath": "/",
    "user": "root",
    "deployPath": "/opt/banedonv",
    "description": "Production server - single port",
    "features": {
      "hotReload": false,
      "debugging": false,
      "logging": "error",
      "mockData": false,
      "ssl": true,
      "monitoring": true,
      "corsRequired": false
    }
  }
}
```

### 3. `config/proxy.json` (Routing Configuration)
```json
{
  "routing": {
    "strategy": "single-port",
    "port": 3001,
    "routes": {
      "api": {
        "path": "/api/*",
        "handler": "express-api",
        "description": "API routes handled by Express middleware"
      },
      "health": {
        "path": "/health",
        "handler": "express-api",
        "description": "Health check endpoint"
      },
      "metrics": {
        "path": "/metrics",
        "handler": "express-api",
        "description": "Metrics endpoint"
      },
      "frontend": {
        "path": "/*",
        "handler": "static-files",
        "fallback": "index.html",
        "directory": "./dist/frontend",
        "description": "Frontend static files with SPA fallback"
      }
    }
  },
  "middleware": {
    "order": [
      "logging",
      "cors-disabled",
      "body-parser",
      "api-routes",
      "static-files"
    ]
  }
}
```

## 🔧 Updated Architecture

### Single Port Strategy:
```
Port 3001 serves both:
├── Frontend (React/Next.js) - served from root "/"
│   ├── / (homepage)
│   ├── /dashboard
│   ├── /collections
│   ├── /search
│   └── /admin
└── API (Express.js) - served from "/api/v1/"
    ├── /api/v1/auth
    ├── /api/v1/users
    ├── /api/v1/collections
    ├── /api/v1/files
    ├── /api/v1/search
    └── /api/v1/admin
```

### Benefits:
- ✅ **No CORS issues** - same origin for frontend and API
- ✅ **Simplified deployment** - single port, single process
- ✅ **Production ready** - standard pattern for SaaS applications
- ✅ **Development friendly** - easier local testing
- ✅ **SSL termination** - single certificate needed

## 📝 Updated Instructions for GitHub Copilot Agent

### For Mock Middleware Implementation:
```
ENVIRONMENT CONTEXT:
- Single Port Strategy: Port 3001 serves both frontend and API
- Development Server: root@10.0.0.14:3001
- Production Server: root@10.0.0.2:3001
- API Routes: /api/v1/* (Express.js)
- Frontend Routes: /* (Static files with SPA fallback)
- Deploy Path: /opt/banedonv
- NO CORS NEEDED - Same port serves both frontend and API

Create mock middleware using Express.js that:
1. Serves API routes from /api/v1/*
2. Serves static frontend files from /*
3. Handles SPA routing with fallback to index.html
4. Includes health checks at /health
5. Includes metrics at /metrics
```

### For Frontend Implementation:
```
ENVIRONMENT CONTEXT:
- Frontend API calls: /api/v1/* (same origin, no CORS)
- Development: http://10.0.0.14:3001
- Production: http://10.0.0.2:3001
- Build output: ./dist/frontend (served by Express as static files)
- SPA routing: Client-side routing with server fallback

Create frontend that:
1. Makes API calls to /api/v1/* (relative paths)
2. Builds to ./dist/frontend directory
3. Supports client-side routing
4. Works with Express static file serving
5. Includes proper error handling for API calls
```

## 🎯 Updated Copilot Agent Prompts

### Starting Mock Middleware Development:
```
ENVIRONMENT CONTEXT for BanedonV Mock Middleware:
- Single Port Strategy: Port 3001 serves both frontend and API
- Development Server: root@10.0.0.14:3001
- Production Server: root@10.0.0.2:3001
- API Routes: /api/v1/* handled by Express
- Frontend Routes: /* served as static files
- Static Files Directory: ./dist/frontend
- SPA Fallback: index.html for client-side routing
- NO CORS CONFIGURATION NEEDED

Following the MIDDLEWARE.md plan, create Express.js mock middleware that:

1. Serves API routes from /api/v1/*
2. Serves static frontend files from /*
3. Handles SPA routing with fallback to index.html
4. Includes middleware order: logging → body-parser → api-routes → static-files
5. Includes health checks and metrics endpoints
6. Configured for deployment to development server (10.0.0.14)

The server should handle both API requests and frontend delivery from the same port to avoid CORS issues.
```

### Starting Frontend Development:
```
ENVIRONMENT CONTEXT for BanedonV Frontend:
- Single Port Strategy: Same origin API calls (no CORS)
- API Base Path: /api/v1 (relative paths)
- Development Server: http://10.0.0.14:3001
- Production Server: http://10.0.0.2:3001
- Build Output: ./dist/frontend
- Client-side routing with server fallback support

Following the FRONTEND.md plan, create Next.js/React frontend that:

1. Makes API calls to /api/v1/* using relative paths
2. Builds production files to ./dist/frontend
3. Supports client-side routing
4. Includes proper error handling for API calls
5. Works with Express static file serving
6. Includes environment-specific configurations

Configure the frontend to work seamlessly with the Express middleware serving both API and static files from the same port.
```

## 🔧 Updated Deployment Scripts

### `scripts/deploy-dev.sh` (Updated)
```bash
#!/bin/bash

# BanedonV Development Deployment Script
# Single port deployment (3001)

set -e

# Configuration
DEV_SERVER="root@10.0.0.14"
DEPLOY_PATH="/opt/banedonv"
APP_NAME="banedonv"
PORT="3001"

echo "🚀 Starting deployment to development server (single port: $PORT)..."

# Build frontend
echo "🎨 Building frontend..."
npm run build:frontend

# Build backend
echo "⚙️ Building backend..."
npm run build:backend

# Create deployment archive
echo "📁 Creating deployment archive..."
tar -czf deploy.tar.gz dist package.json package-lock.json ecosystem.config.js

# Upload to development server
echo "⬆️ Uploading to development server..."
scp deploy.tar.gz $DEV_SERVER:$DEPLOY_PATH/

# Deploy on remote server
echo "🔄 Deploying on remote server..."
ssh $DEV_SERVER << EOF
cd $DEPLOY_PATH
tar -xzf deploy.tar.gz
npm install --production
pm2 restart $APP_NAME || pm2 start ecosystem.config.js
pm2 save
rm deploy.tar.gz
EOF

# Clean up local files
rm deploy.tar.gz

echo "✅ Deployment to development server completed!"
echo "🌐 Application available at: http://10.0.0.14:3001"
echo "📡 API available at: http://10.0.0.14:3001/api/v1"
echo "🔍 Health check: http://10.0.0.14:3001/health"
```

## 📋 Updated Package.json Scripts

```json
{
  "scripts": {
    "dev": "npm run dev:backend",
    "dev:backend": "nodemon src/server.ts",
    "dev:frontend": "next dev --port 3000",
    "build": "npm run build:backend && npm run build:frontend",
    "build:backend": "tsc && cp -r src/public dist/",
    "build:frontend": "next build && next export -o dist/frontend",
    "start": "node dist/server.js",
    "deploy:dev": "./scripts/deploy-dev.sh",
    "deploy:prod": "./scripts/deploy-prod.sh",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

This single-port strategy eliminates CORS issues entirely and provides a cleaner, more production-ready architecture that's easier to deploy and maintain.