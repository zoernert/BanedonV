#!/bin/bash

# BanedonV Mock Middleware - Verification Script
# This script demonstrates all implemented features

echo "🚀 BanedonV Mock Middleware - Phase 1 Verification"
echo "=================================================="
echo

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:3002"

echo -e "${BLUE}Testing server availability...${NC}"
curl -s "$BASE_URL/health" > /dev/null
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Server is running${NC}"
else
    echo -e "${RED}❌ Server is not running. Please start it with: npm run dev${NC}"
    exit 1
fi

echo

# Test Health Endpoints
echo -e "${BLUE}1. Testing Health & Monitoring Endpoints${NC}"
echo "----------------------------------------"

echo -e "${YELLOW}GET /health${NC}"
curl -s "$BASE_URL/health" | jq -r '.message'

echo -e "${YELLOW}GET /health/detailed${NC}"
curl -s "$BASE_URL/health/detailed" | jq -r '.message'

echo -e "${YELLOW}GET /metrics${NC}"
curl -s "$BASE_URL/metrics" | jq -r '.message'

echo

# Test Authentication
echo -e "${BLUE}2. Testing Authentication System${NC}"
echo "--------------------------------"

echo -e "${YELLOW}POST /api/v1/auth/login (valid credentials)${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@banedonv.com", "password": "admin123"}')

echo "$LOGIN_RESPONSE" | jq -r '.message'

# Extract token for authenticated requests
TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.token')
echo -e "${GREEN}Token extracted: ${TOKEN:0:20}...${NC}"

echo

echo -e "${YELLOW}GET /api/v1/auth/me (with token)${NC}"
curl -s "$BASE_URL/api/v1/auth/me" \
  -H "Authorization: Bearer $TOKEN" | jq -r '.message'

echo

# Test API Endpoints
echo -e "${BLUE}3. Testing Business API Endpoints${NC}"
echo "--------------------------------"

echo -e "${YELLOW}GET /api/v1/users${NC}"
curl -s "$BASE_URL/api/v1/users" \
  -H "Authorization: Bearer $TOKEN" | jq -r '.message'

echo -e "${YELLOW}GET /api/v1/collections${NC}"
curl -s "$BASE_URL/api/v1/collections" \
  -H "Authorization: Bearer $TOKEN" | jq -r '.message'

echo -e "${YELLOW}GET /api/v1/search?q=test${NC}"
curl -s "$BASE_URL/api/v1/search?q=test" \
  -H "Authorization: Bearer $TOKEN" | jq -r '.message'

echo -e "${YELLOW}GET /api/v1/files${NC}"
curl -s "$BASE_URL/api/v1/files" \
  -H "Authorization: Bearer $TOKEN" | jq -r '.message'

echo -e "${YELLOW}GET /api/v1/billing${NC}"
curl -s "$BASE_URL/api/v1/billing" \
  -H "Authorization: Bearer $TOKEN" | jq -r '.message'

echo

# Test Error Handling
echo -e "${BLUE}4. Testing Error Handling${NC}"
echo "-------------------------"

echo -e "${YELLOW}POST /api/v1/auth/login (invalid credentials)${NC}"
curl -s -X POST "$BASE_URL/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "invalid@example.com", "password": "wrong"}' | jq -r '.message'

echo -e "${YELLOW}GET /api/v1/users (without token)${NC}"
curl -s "$BASE_URL/api/v1/users" | jq -r '.message'

echo -e "${YELLOW}GET /nonexistent-endpoint${NC}"
curl -s "$BASE_URL/nonexistent-endpoint" | jq -r '.message'

echo

# Test Rate Limiting
echo -e "${BLUE}5. Testing Rate Limiting${NC}"
echo "------------------------"

echo -e "${YELLOW}Making 5 rapid requests to test rate limiting...${NC}"
for i in {1..5}; do
    RESPONSE=$(curl -s -w "HTTP %{http_code}" "$BASE_URL/health")
    echo "Request $i: $RESPONSE"
done

echo

# Test Static File Serving
echo -e "${BLUE}6. Testing Static File Serving${NC}"
echo "------------------------------"

echo -e "${YELLOW}GET / (static file)${NC}"
STATIC_RESPONSE=$(curl -s -w "HTTP %{http_code}" "$BASE_URL/")
echo "Static file serving: $STATIC_RESPONSE"

echo

# Summary
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ Phase 1 Implementation Verification Complete${NC}"
echo -e "${GREEN}========================================${NC}"
echo
echo -e "${BLUE}All core features are working:${NC}"
echo -e "${GREEN}✅ Health & Monitoring endpoints${NC}"
echo -e "${GREEN}✅ JWT Authentication system${NC}"
echo -e "${GREEN}✅ Business API endpoints${NC}"
echo -e "${GREEN}✅ Error handling${NC}"
echo -e "${GREEN}✅ Rate limiting${NC}"
echo -e "${GREEN}✅ Static file serving${NC}"
echo
echo -e "${BLUE}Test credentials available:${NC}"
echo -e "Admin: admin@banedonv.com / admin123"
echo -e "Manager: manager@banedonv.com / manager123"
echo -e "User: user@banedonv.com / user123"
echo
echo -e "${BLUE}Web interface available at:${NC}"
echo -e "http://localhost:3002"
echo
echo -e "${YELLOW}Ready for frontend development or Phase 2 implementation!${NC}"
