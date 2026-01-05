#!/bin/bash
# Deployment script for Hostinger VPS

echo "🚀 Starting deployment to Hostinger VPS..."

# Navigate to the application directory
cd ~/domains/burchcontracting.com/public_html || cd ~/burch-contracting-fresh || cd /home/u239178742/burch-contracting-fresh || exit 1

echo "📦 Pulling latest changes from GitHub..."
git pull origin main

echo "📦 Installing dependencies..."
npm install

echo "🔨 Building the application..."
npm run build

echo "🔄 Restarting the application..."
# Find and kill existing Node.js process
pkill -f "next start" || true

# Start the application in the background
nohup npm start > ~/app.log 2>&1 &

echo "✅ Deployment complete!"
echo "Check logs at: ~/app.log"
