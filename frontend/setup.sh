#!/bin/bash

# BanedonV Frontend Setup Script
echo "🚀 Setting up BanedonV Frontend..."

# Navigate to frontend directory
cd /config/Development/BanedonV/frontend

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building the project..."
npm run build

# Copy build output to the correct location
echo "📁 Setting up build output..."
mkdir -p ../dist
cp -r .next/standalone/* ../dist/frontend/ 2>/dev/null || true

echo "✅ Frontend setup complete!"
echo ""
echo "To run the development server:"
echo "cd /config/Development/BanedonV/frontend"
echo "npm run dev"
echo ""
echo "The frontend will be available at: http://localhost:3003"
echo "Backend API should be running at: http://localhost:3002"
echo ""
echo "Demo credentials:"
echo "- Admin: admin@banedonv.com / admin123"
echo "- Manager: manager@banedonv.com / manager123"
echo "- User: user@banedonv.com / user123"
