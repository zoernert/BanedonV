#!/bin/bash
set -e

# This script sets up the necessary directory structure for BanedonV local storage.

STORAGE_BASE="/opt/banedonv/banedonv/storage"

DIRECTORIES=(
  "$STORAGE_BASE/files"
  "$STORAGE_BASE/processed"
  "$STORAGE_BASE/thumbnails"
  "$STORAGE_BASE/temp"
  "/opt/banedonv/banedonv/logs"
  "/opt/banedonv/banedonv/backups"
  "/opt/banedonv/banedonv/config"
)

echo "Creating BanedonV directory structure..."

for dir in "${DIRECTORIES[@]}"; do
  if [ ! -d "$dir" ]; then
    echo "Creating directory: $dir"
    mkdir -p "$dir"
  else
    echo "Directory already exists: $dir"
  fi
done

# Set appropriate permissions (example: owned by www-data if running under a web server)
# chown -R www-data:www-data /opt/banedonv
# chmod -R 775 /opt/banedonv/storage

echo "✅ Storage setup complete."
