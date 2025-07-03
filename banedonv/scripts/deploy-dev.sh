#!/bin/bash
set -e # Exit immediately if a command exits with a non-zero status.

# --- Configuration ---
DEV_SERVER="root@10.0.0.14"
APP_DIR="/opt/banedonv"
CHANGELOG_FILE="CHANGELOG.md"

# --- Functions ---
get_latest_changelog_entry() {
    # This function extracts the last item under the "Added" section of the most recent release.
    # It's designed to be simple and may need adjustment if your changelog format varies significantly.
    awk '/## \[Unreleased\]/{flag=1;next}/## \[/{flag=0}flag' "$CHANGELOG_FILE" | grep -E "^\- " | tail -1 | sed 's/^- //' 
}

# --- Main Script ---

echo "🚀 Starting automated deployment to the development server..."

# 1. Check for local changes
if [[ -z $(git status -s) ]]; then
    echo "✅ No local changes to commit. Proceeding to update the server with the latest from the repo."
else
    echo "🔍 Found local changes. Preparing to commit and push..."
    
    # 2. Get commit message from CHANGELOG.md
    COMMIT_MESSAGE=$(get_latest_changelog_entry)

    if [ -z "$COMMIT_MESSAGE" ]; then
        echo "❌ Error: Could not find a recent entry in $CHANGELOG_FILE to use as a commit message."
        echo "Please add a new entry under the '[Unreleased]' section, starting with '- '."
        exit 1
    fi

    echo "💬 Using commit message: $COMMIT_MESSAGE"

    # 3. Git add, commit, push
    git add .
    git commit -m "$COMMIT_MESSAGE"
    git push
    echo "✅ Changes have been successfully pushed to the remote repository."
fi

# 4. SSH into the dev server and run the deployment commands
echo "🛰️  Connecting to the development server ($DEV_SERVER) to perform the update..."

ssh "$DEV_SERVER" "
    set -e # Exit on error within the SSH session
    echo '→ Navigating to the application directory ($APP_DIR)...'
    cd $APP_DIR

    echo '→ Pulling the latest changes from the git repository...'
    git pull

    echo '→ Installing/updating npm dependencies...'
    npm install

    echo '→ Applying any new database migrations...'
    npx prisma db push

    echo '→ Building the application...'
    npm run build

    echo '→ Restarting the application services with pm2...'
    # This command assumes you are using pm2 to manage your services.
    # If you have an ecosystem file, 'pm2 restart ecosystem.config.js' is better.
    pm2 restart all

    echo '✅ Server update process completed successfully.'
"

echo "🎉 Deployment to the development server has finished!"
