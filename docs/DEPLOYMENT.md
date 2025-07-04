# BanedonV Deployment Guide

## Server Configuration

### Development Server (10.0.0.14)
- **Access**: SSH as root
- **Path**: `/opt/banedonv`
- **Purpose**: Development and testing
- **Features**: Hot reload, verbose logging, mock data

### Production Server (10.0.0.2)
- **Access**: SSH as root
- **Path**: `/opt/banedonv`
- **Purpose**: Production deployment
- **Features**: SSL, monitoring, backups

## Deployment Commands

### Development Deployment
```bash
# Deploy to development server
npm run deploy:dev

# Or manually
./scripts/deploy-dev.sh