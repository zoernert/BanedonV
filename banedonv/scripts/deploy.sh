#!/bin/bash
set -e

if [ "$1" == "dev" ]; then
  echo "Deploying to development server"
  # Add dev deployment steps here
elif [ "$1" == "prod" ]; then
  echo "Deploying to production server"
  # Add prod deployment steps here
else
  echo "Invalid environment specified"
  exit 1
fi

docker-compose -f docker-compose.prod.yml up -d --build
