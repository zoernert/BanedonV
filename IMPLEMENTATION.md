# BanedonV - AI Agent Implementation Plan

## 🎯 PROJECT OVERVIEW
**Goal**: Build production-ready SaaS vector search platform
**Timeline**: 16 weeks
**Architecture**: Microservices with unified search (Qdrant + PostgreSQL)
**Target Servers**: Dev (10.0.0.14), Prod (10.0.0.2)

## 🏗️ TECH STACK
```yaml
Backend: Node.js 18 + TypeScript 5
Database: PostgreSQL 15 + Prisma ORM
Vector: Qdrant (primary search)
Cache: Redis + Bull queue
Auth: JWT + refresh tokens
Payment: Stripe integration
Email: Local SMTP service (Nodemailer)
Storage: Local filesystem
Monitor: Prometheus + Grafana
```

## 📁 PROJECT STRUCTURE
```
banedonv/
├── apps/
│   ├── api-gateway/          # Main API + routing
│   ├── auth-service/         # Authentication
│   ├── file-service/         # File processing
│   ├── vector-service/       # Qdrant + search
│   ├── billing-service/      # Stripe + subscriptions
│   ├── notification-service/ # Email + webhooks
│   └── web-interface/        # React frontend
├── libs/
│   ├── shared/              # Common utilities
│   ├── database/            # Prisma client
│   ├── search/              # Unified search logic
│   └── monitoring/          # Metrics + health
└── infrastructure/
    ├── docker/              # Containers
    ├── kubernetes/          # K8s manifests
    └── terraform/           # Infrastructure
```

## 🔍 SEARCH ARCHITECTURE
```typescript
// Unified Search Service (NO Elasticsearch)
class UnifiedSearchService {
  // Qdrant for semantic/vector search
  async semanticSearch(query: string): Promise<VectorResults>
  
  // PostgreSQL for full-text search
  async textSearch(query: string): Promise<TextResults>
  
  // Combined hybrid search
  async hybridSearch(query: string): Promise<MergedResults>
  
  // Redis caching for performance
  async cacheSearch(key: string, results: any): Promise<void>
}
```

## 🗄️ DATABASE SCHEMA
```prisma
// Core Models
model Tenant {
  id       String @id @default(uuid())
  name     String
  subdomain String @unique
  users    User[]
}

model User {
  id         String @id @default(uuid())
  tenantId   String
  email      String
  tier       UserTier @default(FREE)
  collections Collection[]
  files      File[]
}

model Collection {
  id     String @id @default(uuid())
  name   String
  userId String
  files  File[]
}

model File {
  id              String @id @default(uuid())
  originalName    String
  markdownContent String?
  filePath        String?  // Local filesystem path
  chunks          FileChunk[]
  status          FileStatus @default(PROCESSING)
}

model FileChunk {
  id       String @id @default(uuid())
  content  String
  embedding Float[]?
  metadata Json @default("{}")
}

enum UserTier { FREE PRO ULTRA UNLIMITED }
enum FileStatus { PROCESSING COMPLETED FAILED }
```

## 🎯 PHASE-BY-PHASE IMPLEMENTATION

### PHASE 1: Foundation (Weeks 1-2)
**AI Task**: Create project structure and core services
```bash
# Copilot Instructions:
"Create Node.js monorepo with TypeScript, Prisma, and microservices architecture.
Setup: API Gateway, Auth Service, Database schemas, Environment configs.
Include: Multi-tenant support, JWT auth, basic middleware."
```

**Key Files to Generate**:
- `package.json` with all dependencies
- `prisma/schema.prisma` with complete schema
- `apps/api-gateway/src/app.ts` 
- `apps/auth-service/src/auth.service.ts`
- `libs/shared/src/config.ts`

### PHASE 2: Search Foundation (Weeks 3-4)
**AI Task**: Build unified search system
```bash
# Copilot Instructions:
"Create UnifiedSearchService that combines Qdrant vector search with PostgreSQL full-text.
Include: Semantic search, text search, hybrid search, caching with Redis.
Setup: Qdrant client, embedding generation, result merging."
```

**Key Files to Generate**:
- `libs/search/src/unified-search.service.ts`
- `apps/vector-service/src/qdrant.service.ts`
- `apps/vector-service/src/embedding.service.ts`
- `libs/shared/src/cache.service.ts`

### PHASE 3: File Processing (Weeks 5-6)
**AI Task**: Implement file processing pipeline with local storage
```bash
# Copilot Instructions:
"Build file processing service that stores files locally, converts to markdown, chunks text.
Include: Local filesystem storage, PDF/Office/Image converters, AI image description.
Setup: File path management, directory structure, cleanup procedures."
```

**Key Files to Generate**:
- `apps/file-service/src/file-processor.service.ts`
- `apps/file-service/src/storage/local-storage.service.ts`
- `apps/file-service/src/converters/` (pdf, docx, image)
- `apps/file-service/src/chunking.service.ts`

### PHASE 4: SaaS Business Logic (Weeks 7-8)
**AI Task**: Add billing and local email notifications
```bash
# Copilot Instructions:
"Implement SaaS billing with Stripe, usage tracking, local SMTP email service.
Include: Stripe integration, webhook handling, Nodemailer SMTP, email templates.
Setup: Local mail server, email queuing, notification templates."
```

**Key Files to Generate**:
- `apps/billing-service/src/billing.service.ts`
- `apps/billing-service/src/stripe.service.ts`
- `apps/notification-service/src/local-mail.service.ts`
- `apps/notification-service/src/email-templates/`
- `libs/shared/src/usage-tracker.ts`

### PHASE 5: API & Frontend (Weeks 9-10)
**AI Task**: Complete REST API and web interface
```bash
# Copilot Instructions:
"Create comprehensive REST API with all endpoints, OpenAPI docs, React frontend.
Include: Search endpoints, file upload, user management, admin panel.
Setup: API validation, error handling, real-time updates."
```

**Key Files to Generate**:
- `apps/api-gateway/src/controllers/` (all controllers)
- `apps/api-gateway/src/docs/openapi.yaml`
- `apps/web-interface/src/components/` (React components)
- `apps/web-interface/src/pages/` (Dashboard, Search, Admin)

### PHASE 6: Infrastructure (Weeks 11-12)
**AI Task**: Setup production infrastructure with local services
```bash
# Copilot Instructions:
"Create Docker containers, CI/CD pipeline, monitoring, local SMTP setup.
Include: Multi-stage Dockerfiles, GitHub Actions, Prometheus/Grafana, Postfix.
Setup: Health checks, logging, deployment scripts, SSH deployment to root@servers."
```

**Key Files to Generate**:
- `docker-compose.prod.yml`
- `.github/workflows/ci-cd.yml`
- `scripts/deploy.sh` (SSH deployment to root@10.0.0.14 and root@10.0.0.2)
- `scripts/setup-smtp.sh`
- `monitoring/prometheus.yml`
- `infrastructure/postfix/main.cf`

### PHASE 7: Testing & Security (Weeks 13-14)
**AI Task**: Comprehensive testing and security
```bash
# Copilot Instructions:
"Create full test suite, security hardening, GDPR compliance.
Include: Unit tests, integration tests, security middleware.
Setup: Performance testing, compliance features, audit logging."
```

**Key Files to Generate**:
- `tests/` (all test files)
- `libs/shared/src/security.middleware.ts`
- `apps/compliance-service/src/gdpr.service.ts`

### PHASE 8: Production (Weeks 15-16)
**AI Task**: Production deployment via SSH to root user
```bash
# Copilot Instructions:
"Setup production deployment with SSH to root@10.0.0.14 (dev) and root@10.0.0.2 (prod).
Include: SSH deployment scripts, local storage setup, SMTP configuration.
Setup: Directory permissions, file storage paths, email server, monitoring."
```

**Key Files to Generate**:
- `scripts/production-deploy.sh` (SSH to root@servers)
- `scripts/setup-storage.sh` (create /opt/banedonv/storage)
- `scripts/setup-mail-server.sh` (Postfix configuration)
- `scripts/health-check.sh`
- `infrastructure/kubernetes/` (K8s manifests)

## 🚀 AI EXECUTION STRATEGY

### For GitHub Copilot Agent Mode:
1. **Start with Phase 1** - Generate complete project structure
2. **Follow sequence** - Each phase builds on previous
3. **Use specific prompts** - Include exact requirements
4. **Test incrementally** - Validate each component
5. **Deploy via SSH** - Direct deployment to root@servers

### SSH Deployment Pattern:
```bash
# Development deployment
ssh root@10.0.0.14 "cd /opt/banedonv && ./deploy.sh dev"

# Production deployment  
ssh root@10.0.0.2 "cd /opt/banedonv && ./deploy.sh prod"
```

### Local Storage Structure:
```
/opt/banedonv/
├── storage/
│   ├── files/           # Original uploaded files
│   ├── processed/       # Processed markdown files
│   ├── thumbnails/      # Generated thumbnails
│   └── temp/           # Temporary processing files
├── logs/               # Application logs
├── backups/            # Database backups
└── config/             # Configuration files
```

### Local Mail Service Setup:
```bash
# Install and configure Postfix
apt-get update && apt-get install postfix
# Configure as local delivery only
# Setup mail queuing and delivery
# Create mail templates and processing
```

### Optimal Prompting Pattern:
```
"Create [specific component] for BanedonV SaaS platform with:
- [Technical requirements]
- [Business logic needed]
- [Integration points]
- [Performance requirements]
- [Security considerations]
Include full implementation with error handling and tests."
```

## 🔧 CRITICAL IMPLEMENTATION DETAILS

### File Storage Configuration:
```typescript
// Local filesystem storage
const STORAGE_CONFIG = {
  basePath: '/opt/banedonv/storage',
  maxFileSize: '100MB',
  allowedTypes: ['pdf', 'docx', 'txt', 'jpg', 'png'],
  uploadPath: '/opt/banedonv/storage/files',
  processedPath: '/opt/banedonv/storage/processed',
  tempPath: '/opt/banedonv/storage/temp'
};
```

### Local Mail Service Configuration:
```typescript
// Nodemailer with local SMTP
const MAIL_CONFIG = {
  host: 'localhost',
  port: 587,
  secure: false,
  auth: {
    user: 'banedonv@localhost',
    pass: process.env.SMTP_PASS
  },
  templates: {
    welcome: '/opt/banedonv/templates/welcome.html',
    verification: '/opt/banedonv/templates/verify.html',
    notification: '/opt/banedonv/templates/notification.html'
  }
};
```

### Server Access Configuration:
```bash
# SSH Access
DEV_SERVER=root@10.0.0.14
PROD_SERVER=root@10.0.0.2

# Deployment commands
ssh $DEV_SERVER "mkdir -p /opt/banedonv/storage"
ssh $PROD_SERVER "mkdir -p /opt/banedonv/storage"
```

### Search Performance Targets:
- Semantic search: < 2 seconds
- Full-text search: < 500ms
- Cache hit rate: > 70%
- Concurrent users: 1000+

### SaaS Tier Limits:
```typescript
const TIER_LIMITS = {
  FREE: { apiCalls: 100, storage: '100MB', collections: 1 },
  PRO: { apiCalls: 10000, storage: '1GB', collections: 5 },
  ULTRA: { apiCalls: 100000, storage: '10GB', collections: 20 },
  UNLIMITED: { apiCalls: -1, storage: 'unlimited', collections: -1 }
};
```

### Environment Configuration:
```typescript
// Required Environment Variables
DATABASE_URL=postgresql://user:pass@host:5432/db
QDRANT_URL=http://host:6333
REDIS_URL=redis://host:6379
JWT_SECRET=your-secret
STRIPE_SECRET_KEY=sk_...
GEMINI_API_KEY=your-key
FILE_STORAGE_PATH=/opt/banedonv/storage
SMTP_HOST=localhost
SMTP_PORT=587
SMTP_USER=banedonv@localhost
SMTP_PASS=your-smtp-password
```

## 📊 SUCCESS METRICS

### Technical KPIs:
- Search response time: < 2s average
- System uptime: 99.9%
- Error rate: < 0.1%
- Cache hit rate: > 70%

### Business KPIs:
- User conversion: > 15%
- Monthly revenue growth: > 20%
- Customer satisfaction: > 4.5/5
- Churn rate: < 5%

## 🎉 READY FOR AI IMPLEMENTATION

This condensed plan provides:
✅ Clear phase-by-phase structure
✅ Specific AI prompts for each phase
✅ Complete technical specifications
✅ Production-ready architecture
✅ Performance and business targets

**Execute with**: GitHub Copilot Agent Mode following phases 1-8 sequentially.