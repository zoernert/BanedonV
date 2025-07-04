#!/bin/bash

# BanedonV Production Deployment Script
# Single port deployment (3001)

set -e

# Configuration
PROD_SERVER="root@10.0.0.2"
DEPLOY_PATH="/opt/banedonv"
APP_NAME="banedonv"
PORT="3001"

echo "🚀 Starting deployment to production server (single port: $PORT)..."

# Check if we're in the correct directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Are you in the project root?"
    exit 1
fi

# Confirmation prompt for production
echo "⚠️  You are about to deploy to PRODUCTION server (10.0.0.2)!"
read -p "Are you sure you want to continue? (y/N): " confirm
if [[ $confirm != [yY] ]]; then
    echo "❌ Deployment cancelled."
    exit 1
fi

# Build frontend
echo "🎨 Building frontend..."
NODE_ENV=production npm run build:frontend

# Build backend
echo "⚙️ Building backend..."
NODE_ENV=production npm run build:backend

# Create deployment archive
echo "📁 Creating deployment archive..."
tar -czf deploy.tar.gz dist package.json package-lock.json ecosystem.config.js

# Upload to production server
echo "⬆️ Uploading to production server..."
scp deploy.tar.gz $PROD_SERVER:$DEPLOY_PATH/

# Deploy on remote server
echo "🔄 Deploying on production server..."
ssh $PROD_SERVER << EOF
cd $DEPLOY_PATH
tar -xzf deploy.tar.gz
npm install --production
pm2 restart $APP_NAME || pm2 start ecosystem.config.js
pm2 save
rm deploy.tar.gz
EOF

# Clean up local files
rm deploy.tar.gz

echo "✅ Deployment to production server completed!"
echo "🌐 Application available at: https://10.0.0.2:3001"
echo "📡 API available at: https://10.0.0.2:3001/api/v1"
echo "🔍 Health check: https://10.0.0.2:3001/health"
