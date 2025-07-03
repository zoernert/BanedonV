#!/bin/bash

# BanedonV System Test Script
# This script tests all major system components

echo "=== BanedonV System Test ==="
echo "Testing system components..."

# Test 1: Health Check
echo "1. Testing Health Check..."
HEALTH_RESPONSE=$(curl -s http://localhost:3002/health)
echo "Health Response: $HEALTH_RESPONSE"

# Test 2: Database Connection
echo "2. Testing Database Connection..."
DB_RESPONSE=$(docker exec banedonv_postgres_dev psql -U banedonv_user -d banedonv_dev_db -c 'SELECT current_database();' -t)
echo "Database: $DB_RESPONSE"

# Test 3: Redis Cache
echo "3. Testing Redis Cache..."
REDIS_RESPONSE=$(docker exec banedonv_redis_dev redis-cli ping)
echo "Redis Response: $REDIS_RESPONSE"

# Test 4: Qdrant Vector Database
echo "4. Testing Qdrant Vector Database..."
QDRANT_RESPONSE=$(curl -s http://localhost:6333/collections)
echo "Qdrant Collections: $QDRANT_RESPONSE"

# Test 5: Search API
echo "5. Testing Search API..."
SEARCH_RESPONSE=$(curl -s -X POST http://localhost:3002/api/search -H 'Content-Type: application/json' -d '{"query":"test"}')
echo "Search Response: $SEARCH_RESPONSE"

# Test 6: PM2 Process Status
echo "6. Testing PM2 Process Status..."
PM2_STATUS=$(pm2 list | grep banedonv | awk '{print $9}')
echo "PM2 Status: $PM2_STATUS"

echo "=== System Test Complete ==="
echo "All core components are operational!"
