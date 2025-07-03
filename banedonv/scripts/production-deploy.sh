#!/bin/bash
set -e # Exit immediately if a command exits with a non-zero status.

# --- Configuration ---
DEV_SERVER="root@10.0.0.14"
PROD_SERVER="root@10.0.0.2"
APP_DIR="/opt/banedonv"
REPO_URL="https://github.com/your-repo/banedonv.git" # Replace with your actual repo URL

# --- Functions ---
show_usage() {
    echo "Usage: $0 {dev|prod}"
    echo "Deploys the application to the specified environment."
    exit 1
}

# --- Main Script ---
if [ "$#" -ne 1 ]; then
    show_usage
fi

ENVIRONMENT=$1
SERVER=""

case "$ENVIRONMENT" in
    dev)
        SERVER=$DEV_SERVER
        ;;
    prod)
        SERVER=$PROD_SERVER
        ;;
    *)
        show_usage
        ;;
esac

echo "🚀 Starting deployment to $ENVIRONMENT environment on $SERVER..."

# This script will execute the remote deploy.sh script via SSH.
# It assumes that the deploy.sh script exists on the target server in the APP_DIR.
ssh "$SERVER" "cd ${APP_DIR} && ./scripts/deploy.sh ${ENVIRONMENT}"

echo "✅ Deployment to $ENVIRONMENT completed successfully!"
