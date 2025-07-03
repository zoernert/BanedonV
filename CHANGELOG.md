# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial project setup.
- Implemented Phase 1: Foundation - Created project structure and core services.
- Implemented Phase 2: Search Foundation - Built unified search system.
- Implemented Phase 3: File Processing - Implemented file processing pipeline with local storage.
- Implemented Phase 4: SaaS Business Logic - Added billing and local email notifications.
- Implemented Phase 5: API & Frontend - Completed REST API and web interface.
- Implemented Phase 6: Infrastructure - Setup production infrastructure with local services.
- Implemented Phase 7: Testing & Security - Added security middleware, GDPR compliance service, audit logging, and initial tests.
- Implemented Phase 8: Production - Created production deployment scripts and initial Kubernetes manifests.
- Fixed folder structure - Consolidated duplicate banedonV/banedonv directories into single banedonv directory.
- Added missing foundational files - Created apps/api-gateway/src/app.ts, apps/auth-service/src/auth.service.ts, and libs/shared/src/config.ts to complete Phase 1 requirements.
- Fixed build configuration - Added tsconfig.build.json and corrected deployment script paths for proper directory structure.
- Fixed import paths and config references - Updated TypeScript imports to use relative paths and corrected config property names.
- Completed TypeScript build fixes - Fixed remaining import paths, added missing methods, and corrected all config property references.
