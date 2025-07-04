#!/bin/bash

# BanedonV Environment Setup Verification Script
# Verify that all environment files and configurations are properly set up

set -e

echo "🔍 BanedonV Environment Setup Verification"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if file exists
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1 exists"
        return 0
    else
        echo -e "${RED}✗${NC} $1 missing"
        return 1
    fi
}

# Function to check if directory exists
check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $1 directory exists"
        return 0
    else
        echo -e "${RED}✗${NC} $1 directory missing"
        return 1
    fi
}

# Function to check if script is executable
check_executable() {
    if [ -x "$1" ]; then
        echo -e "${GREEN}✓${NC} $1 is executable"
        return 0
    else
        echo -e "${YELLOW}⚠${NC} $1 is not executable"
        return 1
    fi
}

echo ""
echo "📁 Checking Environment Files..."
echo "--------------------------------"

# Check environment files
check_file ".env.example"
check_file ".env.development"
check_file ".env.development.remote"
check_file ".env.production"

echo ""
echo "⚙️ Checking Configuration Files..."
echo "-----------------------------------"

# Check configuration files
check_file "config/environments.json"
check_file "config/deployment.json"
check_file "config/proxy.json"

echo ""
echo "📦 Checking Package Files..."
echo "----------------------------"

# Check package files
check_file "package.json"
check_file "tsconfig.json"
check_file "jest.config.json"
check_file "ecosystem.config.js"

echo ""
echo "📁 Checking Directories..."
echo "-------------------------"

# Check directories
check_dir "config"
check_dir "scripts"
check_dir "banedonv"

echo ""
echo "🔧 Checking Scripts..."
echo "---------------------"

# Check scripts
check_file "scripts/deploy-dev.sh"
check_file "scripts/deploy-prod.sh"
check_file "scripts/setup-nginx.sh"

echo ""
echo "🔐 Checking Script Permissions..."
echo "--------------------------------"

# Check script permissions
check_executable "scripts/deploy-dev.sh"
check_executable "scripts/deploy-prod.sh"
check_executable "scripts/setup-nginx.sh"

echo ""
echo "🔍 Environment Variables Check..."
echo "--------------------------------"

# Check for required environment variables in .env.development
if [ -f ".env.development" ]; then
    echo "Checking .env.development for required variables:"
    
    required_vars=("NODE_ENV" "PORT" "SERVER_PORT" "API_BASE_PATH" "FRONTEND_BUILD_PATH")
    
    for var in "${required_vars[@]}"; do
        if grep -q "^${var}=" .env.development; then
            echo -e "${GREEN}✓${NC} $var is set"
        else
            echo -e "${RED}✗${NC} $var is missing"
        fi
    done
else
    echo -e "${RED}✗${NC} .env.development file not found"
fi

echo ""
echo "🌐 Server Configuration Check..."
echo "-------------------------------"

# Check server configuration in environments.json
if [ -f "config/environments.json" ]; then
    echo "Checking server configurations:"
    
    # Check if jq is available for JSON parsing
    if command -v jq &> /dev/null; then
        dev_host=$(jq -r '.development.remote.host' config/environments.json)
        prod_host=$(jq -r '.production.host' config/environments.json)
        
        echo -e "${GREEN}✓${NC} Development server: $dev_host"
        echo -e "${GREEN}✓${NC} Production server: $prod_host"
    else
        echo -e "${YELLOW}⚠${NC} jq not installed, skipping JSON validation"
    fi
else
    echo -e "${RED}✗${NC} config/environments.json not found"
fi

echo ""
echo "📋 Summary"
echo "----------"

# Count files and provide summary
total_files=0
existing_files=0

files_to_check=(
    ".env.example"
    ".env.development"
    ".env.development.remote"
    ".env.production"
    "config/environments.json"
    "config/deployment.json"
    "config/proxy.json"
    "package.json"
    "tsconfig.json"
    "jest.config.json"
    "ecosystem.config.js"
    "scripts/deploy-dev.sh"
    "scripts/deploy-prod.sh"
    "scripts/setup-nginx.sh"
    "README.md"
)

for file in "${files_to_check[@]}"; do
    total_files=$((total_files + 1))
    if [ -f "$file" ]; then
        existing_files=$((existing_files + 1))
    fi
done

echo "Files: $existing_files/$total_files"

if [ $existing_files -eq $total_files ]; then
    echo -e "${GREEN}✅ Environment setup is complete!${NC}"
    echo ""
    echo "🚀 Next steps:"
    echo "1. Install dependencies: npm install"
    echo "2. Review and update .env.development"
    echo "3. Start development: npm run dev"
    echo "4. Access application: http://localhost:3001"
else
    echo -e "${RED}❌ Environment setup is incomplete${NC}"
    echo "Please create the missing files and run this script again."
fi

echo ""
echo "🔗 Important URLs:"
echo "- Development: http://10.0.0.14:3001"
echo "- Production: https://10.0.0.2:3001"
echo "- API Base: /api/v1"
echo "- Health Check: /health"
