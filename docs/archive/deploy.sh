#!/bin/bash
set -euo pipefail

# Deployment script for Hostinger VPS

echo "🚀 Starting deployment to Hostinger VPS..."

APP_DIR="${APP_DIR:-/root/burch-contracting}"
APP_NAME="${APP_NAME:-burch-contracting}"
BASE_URL="${BASE_URL:-https://burchcontracting.com}"

cd "$APP_DIR"

echo "📦 Pulling latest changes from GitHub..."
git fetch origin main
git checkout main
git pull origin main

echo "📦 Installing dependencies..."
npm ci

echo "🔨 Building the application..."
npm run build

echo "🔄 Restarting the application..."
if pm2 describe "$APP_NAME" >/dev/null 2>&1; then
	pm2 restart "$APP_NAME" --update-env
else
	pm2 start npm --name "$APP_NAME" -- start
fi
pm2 save

echo "🧪 Running post-deploy smoke checks..."
npm run verify:production -- --base-url="$BASE_URL"

echo "✅ Deployment complete!"
pm2 status "$APP_NAME"
