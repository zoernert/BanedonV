#!/bin/bash

# This script checks the health of the BanedonV services.

SERVICES=(
  "api-gateway:http://localhost:3000/health"
  "auth-service:http://localhost:3001/health"
  "file-service:http://localhost:3002/health"
  "vector-service:http://localhost:3003/health"
  "billing-service:http://localhost:3004/health"
  "notification-service:http://localhost:3005/health"
)

ALL_OK=true

for service in "${SERVICES[@]}"; do
  NAME=$(echo $service | cut -d: -f1)
  URL=$(echo $service | cut -d: -f2-)
  
  echo -n "Checking $NAME... "
  
  if curl -s --head --request GET "$URL" | grep "200 OK" > /dev/null; then
    echo "✅ OK"
  else
    echo "❌ FAILED"
    ALL_OK=false
  fi
done

if [ "$ALL_OK" = true ]; then
  echo "
All services are healthy."
  exit 0
else
  echo "
Some services are not healthy. Please check the logs."
  exit 1
fi
