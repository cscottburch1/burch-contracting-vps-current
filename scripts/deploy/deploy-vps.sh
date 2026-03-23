#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/var/www/upstate-home-services}"
BRANCH="${BRANCH:-main}"
APP_NAME="${APP_NAME:-upstate-home-services}"

cd "$APP_DIR"

echo "Updating code from origin/$BRANCH..."
git fetch origin "$BRANCH"
git checkout "$BRANCH"
git pull origin "$BRANCH"

echo "Installing dependencies and building..."
npm ci
npm run build

echo "Restarting PM2 process: $APP_NAME"
if pm2 describe "$APP_NAME" >/dev/null 2>&1; then
  pm2 restart "$APP_NAME" --update-env
else
  pm2 start npm --name "$APP_NAME" -- start
fi
pm2 save

echo "Deployment complete."
