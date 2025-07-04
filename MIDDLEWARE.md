# BanedonV Mock Middleware Setup Plan
## Dedicated GitHub Copilot Agent Instructions

## 🎯 MOCK MIDDLEWARE OVERVIEW
**Goal**: Create production-ready mock middleware that simulates complete backend
**Purpose**: Support frontend development with realistic API responses
**Future**: Easily refactorable to real backend implementation
**Timeline**: 1-2 weeks (before starting frontend phases)
**Architecture**: Express.js + TypeScript with comprehensive logging and testing

## 🏗️ MOCK MIDDLEWARE ARCHITECTURE

### Core Principles
- **Realistic API responses** with proper HTTP status codes
- **Comprehensive logging** for debugging and monitoring
- **Extensive test coverage** for all mock endpoints
- **Easy refactoring** to real backend services
- **Performance simulation** (delays, rate limiting)
- **Error scenario simulation** (network errors, timeouts)
- **Data persistence** in memory with JSON export/import

### Tech Stack
```yaml
Runtime: Node.js 18 + TypeScript 5
Framework: Express.js 4
Mock Data: Faker.js for realistic data
Logging: Winston + Morgan middleware
Testing: Jest + Supertest + MSW
Validation: Joi schema validation
Documentation: Swagger/OpenAPI
Rate Limiting: Express-rate-limit
CORS: CORS middleware
Authentication: JWT simulation
```

## 📋 MOCK MIDDLEWARE IMPLEMENTATION PLAN

### PHASE 1: Foundation Setup
**Copilot Agent Instructions:**
```
Create a comprehensive mock middleware server for BanedonV SaaS platform.

CRITICAL: This is a MOCK SERVER only. No real databases, no real external services.

Requirements:
- Express.js server with TypeScript
- Comprehensive logging with Winston
- Request/response logging with Morgan
- Error handling middleware
- CORS configuration
- Rate limiting simulation
- JWT authentication simulation
- Health check endpoints
- Environment configuration
- Hot reload for development

Project Structure:
src/
├── middleware/           # Express middleware
├── routes/              # API route handlers
├── services/            # Mock business logic
├── models/              # TypeScript interfaces
├── utils/               # Utilities and helpers
├── config/              # Configuration files
├── data/                # Mock data generators
├── tests/               # Test files
└── logs/                # Log files

Core Features:
- Request logging with unique request IDs
- Response time tracking
- Error logging with stack traces
- API endpoint documentation
- Mock data generation with Faker.js
- In-memory data persistence
- JSON export/import for data state
- Development vs production configurations

Middleware Stack:
- CORS handling
- Body parsing (JSON, form-data)
- Rate limiting simulation
- Authentication simulation
- Request logging
- Error handling
- Response formatting
- API versioning support

Mock Authentication:
- JWT token generation/validation
- User session simulation
- Role-based access control
- Mock user database
- Login/logout endpoints
- Token refresh simulation
- Password reset simulation

Logging Strategy:
- Structured logging (JSON format)
- Log levels (error, warn, info, debug)
- Request/response logging
- Performance metrics
- Error tracking
- User action logging
- API usage statistics

File Structure:
src/
├── app.ts               # Express app setup
├── server.ts            # Server startup
├── middleware/
│   ├── auth.ts          # Mock authentication
│   ├── logging.ts       # Request logging
│   ├── error.ts         # Error handling
│   ├── rate-limit.ts    # Rate limiting
│   └── validation.ts    # Request validation
├── routes/
│   ├── index.ts         # Route registration
│   ├── auth.ts          # Authentication routes
│   ├── users.ts         # User management
│   ├── collections.ts   # Collection management
│   ├── files.ts         # File operations
│   ├── search.ts        # Search operations
│   ├── billing.ts       # Billing operations
│   ├── admin.ts         # Admin operations
│   └── integrations.ts  # Integration endpoints
├── services/
│   ├── auth.service.ts  # Mock auth service
│   ├── user.service.ts  # Mock user service
│   ├── collection.service.ts # Mock collection service
│   ├── file.service.ts  # Mock file service
│   ├── search.service.ts # Mock search service
│   ├── billing.service.ts # Mock billing service
│   └── admin.service.ts # Mock admin service
├── models/
│   ├── user.ts          # User interfaces
│   ├── collection.ts    # Collection interfaces
│   ├── file.ts          # File interfaces
│   ├── search.ts        # Search interfaces
│   ├── billing.ts       # Billing interfaces
│   └── admin.ts         # Admin interfaces
├── data/
│   ├── generators/      # Mock data generators
│   ├── fixtures/        # Static test data
│   └── storage/         # In-memory storage
├── utils/
│   ├── logger.ts        # Winston logger setup
│   ├── response.ts      # Response formatting
│   ├── validation.ts    # Schema validation
│   └── helpers.ts       # General utilities
└── config/
    ├── database.ts      # Mock database config
    ├── auth.ts          # Auth configuration
    ├── logging.ts       # Logging configuration
    └── server.ts        # Server configuration

DO NOT CREATE:
- Real database connections
- Real external API calls
- Real file storage systems
- Real authentication services
- Real payment processing
```

**Key Files to Generate:**
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `src/app.ts` - Express app setup
- `src/server.ts` - Server startup
- `src/middleware/` - All middleware files
- `src/routes/` - All route handlers
- `src/services/` - All mock services
- `src/models/` - TypeScript interfaces
- `src/data/` - Mock data generators
- `src/utils/` - Utility functions
- `src/config/` - Configuration files

### PHASE 2: Mock Data Generation
**Copilot Agent Instructions:**
```
Create comprehensive mock data generation system for BanedonV mock middleware.

CRITICAL: Generate realistic, enterprise-grade mock data using Faker.js.

Requirements:
- Realistic user profiles with enterprise context
- Mock collections with proper hierarchies
- Mock files with metadata and content
- Mock search results with relevance scoring
- Mock billing data with usage patterns
- Mock analytics with time series data
- Mock system metrics and health data
- Mock integration examples and templates

Data Generation Strategy:
- Use Faker.js for realistic data
- Create data relationships and consistency
- Generate time-series data for analytics
- Include edge cases and error scenarios
- Support data export/import (JSON)
- Memory-efficient data structures
- Configurable data volumes
- Deterministic data for testing

Mock Data Categories:
1. User Data:
   - User profiles with roles and permissions
   - Team structures and hierarchies
   - Authentication tokens and sessions
   - User activity and behavior patterns
   - Usage statistics and quotas

2. Collection Data:
   - Collection hierarchies and structures
   - File metadata and content summaries
   - Tags, categories, and classifications
   - Sharing permissions and access control
   - Version history and change tracking

3. Search Data:
   - Search queries and results
   - Relevance scoring and ranking
   - Search analytics and insights
   - Saved searches and filters
   - Search performance metrics

4. Billing Data:
   - Subscription plans and pricing
   - Usage tracking and metering
   - Invoice history and payments
   - Billing cycles and renewals
   - Revenue analytics and forecasting

5. System Data:
   - Performance metrics and monitoring
   - System health and status
   - Error logs and diagnostics
   - API usage statistics
   - Security audit logs

Data Generators:
src/data/generators/
├── user.generator.ts      # User data generation
├── collection.generator.ts # Collection data
├── file.generator.ts      # File metadata
├── search.generator.ts    # Search results
├── billing.generator.ts   # Billing data
├── analytics.generator.ts # Analytics data
├── system.generator.ts    # System metrics
└── index.ts              # Generator orchestration

In-Memory Storage:
src/data/storage/
├── user.store.ts         # User data store
├── collection.store.ts   # Collection store
├── file.store.ts         # File store
├── search.store.ts       # Search store
├── billing.store.ts      # Billing store
├── analytics.store.ts    # Analytics store
├── system.store.ts       # System store
└── index.ts             # Storage orchestration

Data Relationships:
- Users belong to organizations/teams
- Collections have owners and permissions
- Files belong to collections and users
- Search results reference real collections/files
- Billing data connects to user usage
- Analytics aggregate user/system data

Mock Data Features:
- Realistic timestamps and sequences
- Proper data validation and constraints
- Configurable data volumes (small/medium/large)
- Data seeding for development/testing
- Data reset and cleanup utilities
- Export/import for data persistence
- Performance optimization for large datasets

DO NOT CREATE:
- Real database schemas
- Real data persistence layers
- Real external data sources
- Real data migration tools
```

**Key Files to Generate:**
- `src/data/generators/` - All data generators
- `src/data/storage/` - In-memory storage systems
- `src/data/fixtures/` - Static test data
- `src/data/seeders/` - Data seeding utilities
- `src/data/config/` - Data configuration
- `src/data/types/` - Data type definitions

### PHASE 3: API Route Implementation
**Copilot Agent Instructions:**
```
Create comprehensive API routes for BanedonV mock middleware with realistic responses.

CRITICAL: Implement complete REST API with proper HTTP methods, status codes, and responses.

Requirements:
- RESTful API design following best practices
- Proper HTTP status codes and responses
- Request validation with Joi schemas
- Response formatting and consistency
- Error handling with detailed messages
- Authentication and authorization checks
- Rate limiting and throttling
- API versioning support
- Comprehensive OpenAPI documentation

API Endpoints Structure:
Authentication:
POST /api/v1/auth/login
POST /api/v1/auth/register
POST /api/v1/auth/logout
POST /api/v1/auth/refresh
POST /api/v1/auth/forgot-password
POST /api/v1/auth/reset-password
GET  /api/v1/auth/me

User Management:
GET    /api/v1/users
GET    /api/v1/users/:id
PUT    /api/v1/users/:id
DELETE /api/v1/users/:id
POST   /api/v1/users/invite
PUT    /api/v1/users/:id/role
GET    /api/v1/users/:id/activity

Collections:
GET    /api/v1/collections
POST   /api/v1/collections
GET    /api/v1/collections/:id
PUT    /api/v1/collections/:id
DELETE /api/v1/collections/:id
POST   /api/v1/collections/:id/files
GET    /api/v1/collections/:id/files
PUT    /api/v1/collections/:id/share
GET    /api/v1/collections/:id/analytics

Files:
GET    /api/v1/files
POST   /api/v1/files/upload
GET    /api/v1/files/:id
PUT    /api/v1/files/:id
DELETE /api/v1/files/:id
GET    /api/v1/files/:id/preview
POST   /api/v1/files/:id/process
GET    /api/v1/files/:id/history

Search:
GET    /api/v1/search
POST   /api/v1/search/semantic
POST   /api/v1/search/hybrid
GET    /api/v1/search/suggestions
POST   /api/v1/search/save
GET    /api/v1/search/history
GET    /api/v1/search/analytics

Billing:
GET    /api/v1/billing/subscription
POST   /api/v1/billing/subscribe
PUT    /api/v1/billing/upgrade
DELETE /api/v1/billing/cancel
GET    /api/v1/billing/invoices
GET    /api/v1/billing/usage
POST   /api/v1/billing/payment-method
GET    /api/v1/billing/analytics

Admin:
GET    /api/v1/admin/dashboard
GET    /api/v1/admin/users
GET    /api/v1/admin/collections
GET    /api/v1/admin/system
GET    /api/v1/admin/analytics
POST   /api/v1/admin/maintenance
GET    /api/v1/admin/logs

Integrations:
GET    /api/v1/integrations
GET    /api/v1/integrations/templates
POST   /api/v1/integrations/webhook
GET    /api/v1/integrations/api-keys
POST   /api/v1/integrations/test
GET    /api/v1/integrations/docs

Route Features:
- Request validation with Joi schemas
- Response formatting with standard structure
- Error handling with proper HTTP codes
- Authentication middleware integration
- Rate limiting per endpoint
- Request logging and monitoring
- Response caching where appropriate
- API versioning support

Response Structure:
{
  "success": true,
  "data": {},
  "message": "Operation successful",
  "timestamp": "2024-01-01T00:00:00Z",
  "requestId": "req_123456",
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}

Error Response Structure:
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data",
    "details": {
      "field": "email",
      "message": "Invalid email format"
    }
  },
  "timestamp": "2024-01-01T00:00:00Z",
  "requestId": "req_123456"
}

Mock Response Features:
- Realistic response times (100ms - 2s)
- Proper HTTP status codes
- Consistent data structures
- Pagination support
- Filtering and sorting
- Error scenarios simulation
- Rate limiting responses
- Authentication errors

DO NOT CREATE:
- Real database operations
- Real external API calls
- Real file processing
- Real payment processing
- Real email sending
```

**Key Files to Generate:**
- `src/routes/` - All API route handlers
- `src/schemas/` - Joi validation schemas
- `src/responses/` - Response formatting utilities
- `src/middleware/validation.ts` - Request validation
- `docs/api.yml` - OpenAPI specification
- `src/utils/response.ts` - Response utilities

### PHASE 4: Comprehensive Testing
**Copilot Agent Instructions:**
```
Create comprehensive test suite for BanedonV mock middleware with high coverage.

CRITICAL: Test all API endpoints, middleware, and mock services with realistic scenarios.

Requirements:
- Unit tests for all services and utilities
- Integration tests for API endpoints
- Mock data testing and validation
- Error scenario testing
- Performance testing for response times
- Authentication and authorization testing
- Rate limiting testing
- Test coverage reporting
- Continuous integration setup

Testing Strategy:
- Jest for unit and integration testing
- Supertest for API endpoint testing
- Mock data validation testing
- Error handling testing
- Performance benchmarking
- Security testing
- Load testing simulation
- End-to-end API testing

Test Categories:
1. Unit Tests:
   - Mock service functions
   - Data generators
   - Utility functions
   - Middleware components
   - Response formatters

2. Integration Tests:
   - API endpoint functionality
   - Authentication flows
   - Data persistence
   - Error handling
   - Request/response cycles

3. Performance Tests:
   - Response time benchmarks
   - Memory usage monitoring
   - Concurrent request handling
   - Rate limiting effectiveness
   - Data generation performance

4. Security Tests:
   - Authentication bypass attempts
   - Authorization checks
   - Input validation
   - SQL injection prevention
   - XSS protection

Test Structure:
tests/
├── unit/
│   ├── services/        # Service unit tests
│   ├── utils/           # Utility function tests
│   ├── middleware/      # Middleware tests
│   └── data/            # Data generator tests
├── integration/
│   ├── auth.test.ts     # Authentication tests
│   ├── users.test.ts    # User management tests
│   ├── collections.test.ts # Collection tests
│   ├── files.test.ts    # File operation tests
│   ├── search.test.ts   # Search functionality tests
│   ├── billing.test.ts  # Billing tests
│   └── admin.test.ts    # Admin tests
├── performance/
│   ├── load.test.ts     # Load testing
│   ├── stress.test.ts   # Stress testing
│   └── memory.test.ts   # Memory usage tests
├── security/
│   ├── auth.test.ts     # Authentication security
│   ├── validation.test.ts # Input validation
│   └── injection.test.ts # Injection prevention
├── fixtures/
│   ├── users.json       # Test user data
│   ├── collections.json # Test collection data
│   └── responses.json   # Expected responses
└── helpers/
    ├── setup.ts         # Test setup utilities
    ├── teardown.ts      # Test cleanup
    └── assertions.ts    # Custom assertions

Test Features:
- Test data factories
- Test database setup/teardown
- Custom assertion helpers
- Test coverage reporting
- Performance benchmarking
- Memory leak detection
- Error scenario simulation
- Mock external dependencies

Test Configuration:
- Jest configuration with TypeScript
- Test environment setup
- Code coverage thresholds
- Performance benchmarks
- CI/CD integration
- Test reporting formats
- Parallel test execution
- Test data management

API Testing Scenarios:
- Valid request/response cycles
- Invalid input handling
- Authentication failures
- Authorization denials
- Rate limiting triggers
- Server error simulation
- Network timeout simulation
- Large payload handling

Mock Service Testing:
- Data generation accuracy
- Data relationship integrity
- Performance under load
- Memory usage optimization
- Error handling robustness
- Configuration validation
- State management
- Concurrent access handling

DO NOT CREATE:
- Real database testing
- Real external service testing
- Real file system testing
- Real payment processing testing
```

**Key Files to Generate:**
- `tests/` - Complete test suite
- `jest.config.js` - Jest configuration
- `tests/setup.ts` - Test environment setup
- `tests/helpers/` - Test utilities
- `tests/fixtures/` - Test data
- `package.json` - Test scripts and dependencies

### PHASE 5: Logging & Monitoring
**Copilot Agent Instructions:**
```
Create comprehensive logging and monitoring system for BanedonV mock middleware.

CRITICAL: Implement production-ready logging with structured format and comprehensive monitoring.

Requirements:
- Structured logging with Winston
- Request/response logging with Morgan
- Error tracking and alerting
- Performance monitoring
- API usage analytics
- Health check endpoints
- Log rotation and management
- Metrics collection and reporting
- Development vs production logging

Logging Strategy:
- Structured JSON logging
- Log levels (error, warn, info, debug)
- Contextual logging with request IDs
- Performance metrics logging
- User action tracking
- API endpoint usage
- Error stack traces
- Security event logging

Monitoring Components:
1. Request Monitoring:
   - Request/response times
   - HTTP status code distribution
   - API endpoint usage patterns
   - User activity tracking
   - Error rate monitoring

2. Performance Monitoring:
   - Memory usage tracking
   - CPU utilization
   - Response time percentiles
   - Throughput metrics
   - Concurrent connection counts

3. Health Monitoring:
   - Service health checks
   - Dependency health
   - System resource monitoring
   - Application state tracking
   - Uptime monitoring

4. Security Monitoring:
   - Authentication failures
   - Authorization violations
   - Rate limiting triggers
   - Suspicious activity detection
   - Security event alerts

Logging Configuration:
src/config/logging.ts:
- Log levels per environment
- Log format configuration
- Log rotation settings
- Log destination configuration
- Performance logging settings

Winston Logger Setup:
src/utils/logger.ts:
- Multiple log transports (file, console)
- Log formatting and structure
- Log level filtering
- Context injection
- Performance logging helpers

Request Logging:
src/middleware/logging.ts:
- Request ID generation
- Request/response logging
- Performance timing
- User context injection
- Error request logging

Health Checks:
src/routes/health.ts:
- Application health endpoint
- Service dependency checks
- System resource checks
- Database connectivity (mock)
- External service status (mock)

Monitoring Endpoints:
GET  /health              # Basic health check
GET  /health/detailed     # Detailed health info
GET  /metrics            # Application metrics
GET  /metrics/performance # Performance metrics
GET  /logs               # Log viewing (dev only)

Log Structure:
{
  "timestamp": "2024-01-01T00:00:00Z",
  "level": "info",
  "message": "API request processed",
  "requestId": "req_123456",
  "userId": "user_789",
  "method": "GET",
  "url": "/api/v1/collections",
  "statusCode": 200,
  "responseTime": 150,
  "userAgent": "Mozilla/5.0...",
  "ip": "192.168.1.1",
  "context": {
    "service": "collections",
    "action": "list",
    "params": {}
  }
}

Performance Metrics:
- Request count per endpoint
- Average response times
- Error rates by endpoint
- Memory usage patterns
- CPU utilization
- Concurrent user counts
- Peak usage times
- Resource utilization

Monitoring Features:
- Real-time metrics collection
- Historical data tracking
- Alert thresholds configuration
- Performance trend analysis
- Error pattern detection
- Usage analytics
- Resource optimization insights
- Capacity planning metrics

Development Tools:
- Log viewing interface
- Real-time monitoring dashboard
- Performance profiling tools
- Error tracking interface
- Metrics visualization
- Log filtering and searching
- Performance benchmarking
- Resource usage tracking

DO NOT CREATE:
- Real external monitoring services
- Real alerting systems
- Real log aggregation services
- Real performance monitoring backends
```

**Key Files to Generate:**
- `src/utils/logger.ts` - Winston logger setup
- `src/middleware/logging.ts` - Request logging
- `src/routes/health.ts` - Health check endpoints
- `src/routes/metrics.ts` - Metrics endpoints
- `src/config/logging.ts` - Logging configuration
- `src/monitoring/` - Monitoring utilities
- `logs/` - Log file directory

## 🎯 EXECUTION STRATEGY

### Single Copilot Agent Session:
**Execute all phases in sequence:**

```bash
# Phase 1: Foundation
"Create mock middleware foundation for BanedonV with Express.js, TypeScript, logging, and authentication simulation"

# Phase 2: Mock Data
"Add comprehensive mock data generation system with Faker.js and in-memory storage"

# Phase 3: API Routes
"Implement complete REST API with all endpoints, validation, and proper responses"

# Phase 4: Testing
"Create comprehensive test suite with unit, integration, and performance tests"

# Phase 5: Logging & Monitoring
"Add production-ready logging and monitoring with Winston and health checks"
```

### Development Workflow:
1. **Start mock server**: `npm run dev`
2. **Run tests**: `npm test`
3. **Check coverage**: `npm run test:coverage`
4. **View logs**: `npm run logs`
5. **Monitor health**: `GET /health`

### Integration with Frontend:
- **Frontend API base URL**: `http://localhost:3001`
- **CORS configured** for frontend domain
- **Realistic response delays** (100ms - 2s)
- **Proper error simulation** for testing
- **Hot reload** for development changes

## 🚀 EXPECTED DELIVERABLES

### Complete Mock Middleware Package:
✅ **Express.js server** with TypeScript
✅ **Comprehensive API endpoints** for all features
✅ **Realistic mock data** with Faker.js
✅ **Complete test suite** with high coverage
✅ **Production-ready logging** with Winston
✅ **Health monitoring** and metrics
✅ **API documentation** with OpenAPI
✅ **Development tools** and utilities

### Ready for Frontend Integration:
✅ **CORS configured** for frontend domain
✅ **Realistic response times** and delays
✅ **Proper error scenarios** for testing
✅ **Consistent API responses** and formats
✅ **Authentication simulation** with JWT
✅ **Rate limiting** and throttling
✅ **Comprehensive logging** for debugging

### Ready for Backend Refactoring:
✅ **Clean service architecture** for easy replacement
✅ **Proper TypeScript interfaces** for data models
✅ **Comprehensive test coverage** for validation
✅ **Clear separation of concerns** between layers
✅ **Documented API contracts** with OpenAPI
✅ **Performance benchmarks** for comparison
✅ **Monitoring infrastructure** for production

This mock middleware will provide a solid foundation for your frontend development and serve as a blueprint for your actual backend implementation.