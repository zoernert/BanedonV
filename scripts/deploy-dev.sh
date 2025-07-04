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

# Check if we're in the correct directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Are you in the project root?"
    exit 1
fi

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