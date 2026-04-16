#!/bin/bash
# Sync local wiki to deployment repo and rebuild static site
# Usage: ./scripts/sync.sh

set -e

LOCAL_WIKI="/home/aya/wiki"
DEPLOY_REPO="/home/aya/edu-wiki"
WIKI_DIR="$DEPLOY_REPO/wiki"

echo "Syncing wiki content..."

# Copy only the content directories (preserve prebuild'd version)
rsync -av --exclude='node_modules' --exclude='site' --exclude='server.js' \
  --exclude='package.json' --exclude='package-lock.json' --exclude='server.log' \
  --exclude='mkdocs.yml' --exclude='vercel.json' \
  "$LOCAL_WIKI/" "$WIKI_DIR/"

# Remove build artifacts
rm -rf "$WIKI_DIR/site"

echo "Running preprocessor..."
cd "$DEPLOY_REPO"
python3 scripts/prebuild.py

echo "Building static site..."
python3 -m mkdocs build

echo "Done. Output: $DEPLOY_REPO/site/"
