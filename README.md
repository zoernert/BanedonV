# BanedonV - Advanced File Management System

## 🚀 Environment Setup

BanedonV uses a **single-port strategy** to avoid CORS issues by serving both frontend and API from the same port (3001).

### 📋 Architecture Overview

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

### 🔧 Environment Configuration

#### 1. Environment Files

- `.env.example` - Template for environment variables
- `.env.development` - Local development configuration
- `.env.development.remote` - Remote development server configuration
- `.env.production` - Production environment configuration

#### 2. Server Configuration

- **Development Server**: `root@10.0.0.14:3001`
- **Production Server**: `root@10.0.0.2:3001`
- **Deploy Path**: `/opt/banedonv`

### 🛠️ Installation & Setup

#### Prerequisites

- Node.js 18+
- npm 8+
- PM2 (for production)

#### 1. Install Dependencies

```bash
npm install
```

#### 2. Environment Setup

```bash
# Copy environment template
cp .env.example .env.development

# Edit environment variables
nano .env.development
```

#### 3. Development

```bash
# Start development server (backend only)
npm run dev

# Start frontend development (separate terminal)
npm run dev:frontend

# Build for production
npm run build
```

### 🚀 Deployment

#### Development Server

```bash
# Deploy to development server (10.0.0.14)
npm run deploy:dev
```

#### Production Server

```bash
# Deploy to production server (10.0.0.2)
npm run deploy:prod
```

### 📱 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run deploy:dev` - Deploy to development server
- `npm run deploy:prod` - Deploy to production server
- `npm run test` - Run tests
- `npm run lint` - Run linting
- `npm run typecheck` - Run TypeScript checks

### 🔗 Endpoints

#### Development
- **Application**: http://10.0.0.14:3001
- **API**: http://10.0.0.14:3001/api/v1
- **Health Check**: http://10.0.0.14:3001/health

#### Production
- **Application**: https://10.0.0.2:3001
- **API**: https://10.0.0.2:3001/api/v1
- **Health Check**: https://10.0.0.2:3001/health

### 📁 Project Structure

```
banedonv/
├── .env.example                    # Environment template
├── .env.development                # Local development
├── .env.development.remote         # Remote development
├── .env.production                 # Production
├── package.json                    # Dependencies & scripts
├── tsconfig.json                   # TypeScript configuration
├── ecosystem.config.js             # PM2 configuration
├── jest.config.json                # Jest configuration
├── config/
│   ├── environments.json           # Server configuration
│   ├── deployment.json             # Deployment settings
│   └── proxy.json                  # Routing configuration
├── scripts/
│   ├── deploy-dev.sh              # Development deployment
│   ├── deploy-prod.sh             # Production deployment
│   └── setup-nginx.sh             # Nginx setup (optional)
├── src/
│   ├── server.ts                   # Main server file
│   ├── controllers/                # API controllers
│   ├── middleware/                 # Express middleware
│   ├── routes/                     # API routes
│   └── types/                      # TypeScript types
├── dist/
│   ├── frontend/                   # Built frontend files
│   └── server.js                   # Built server
└── logs/                           # Application logs
```

### 🔧 Configuration Files

#### environments.json
Server configuration for different environments with single-port strategy.

#### deployment.json
Deployment settings including build commands, file transfers, and process management.

#### proxy.json
Routing configuration for serving both frontend and API from the same port.

### 🚨 Benefits of Single-Port Strategy

- ✅ **No CORS issues** - same origin for frontend and API
- ✅ **Simplified deployment** - single port, single process
- ✅ **Production ready** - standard pattern for SaaS applications
- ✅ **Development friendly** - easier local testing
- ✅ **SSL termination** - single certificate needed

### 📊 Process Management

The application uses PM2 for process management:

```bash
# Start with PM2
npm run pm2:start

# Restart application
npm run pm2:restart

# Stop application
npm run pm2:stop

# Delete from PM2
npm run pm2:delete
```

### 🔐 Security

- Environment variables are used for sensitive configuration
- JWT tokens for authentication
- Rate limiting on API endpoints
- Helmet.js for security headers
- Input validation and sanitization

### 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### 📝 Logging

Application logs are written to:
- `./logs/app.log` - Combined logs
- `./logs/out.log` - Standard output
- `./logs/error.log` - Error logs

### 🚀 Quick Start

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy environment: `cp .env.example .env.development`
4. Start development: `npm run dev`
5. Access application: http://localhost:3001

### 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes and test
4. Submit a pull request

### 📄 License

MIT License - see LICENSE file for details.
