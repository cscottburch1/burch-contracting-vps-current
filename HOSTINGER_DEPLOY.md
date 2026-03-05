# 🚀 Deploy to Hostinger VPS - EXACT COMMANDS

## Step 1: Connect to Your VPS

```bash
ssh root@your-vps-ip
# OR
ssh username@your-vps-ip
```

## Step 2: Navigate to Your App Directory

```bash
# Usually something like:
cd /var/www/burchcontracting
# OR
cd ~/burchcontracting
# OR
cd /home/username/burchcontracting-fresh

# If you're not sure where it is:
find / -name "burch-contracting-fresh" 2>/dev/null
# OR
ls -la /var/www/
```

## Step 3: Pull Latest Changes

```bash
# Make sure you're on the main branch
git branch

# Pull the latest code
git pull origin main

# If it asks for credentials, you may need to set up SSH keys
# or use a personal access token
```

## Step 4: Install Dependencies & Build

```bash
# Install any new packages
npm install

# Build the production version
npm run build
```

## Step 5: Restart Your App

### If using PM2 (most common):
```bash
pm2 restart all
# OR restart specific app
pm2 restart burchcontracting

# Check if it's running
pm2 list
pm2 logs
```

### If using systemd:
```bash
sudo systemctl restart burchcontracting
# OR
sudo systemctl restart nodejs

# Check status
sudo systemctl status burchcontracting
```

### If using npm start directly:
```bash
# Find and kill the current process
pkill -f "node.*next"

# Start the app (in background)
nohup npm start > output.log 2>&1 &

# OR use screen
screen -S burchcontracting
npm start
# Press Ctrl+A then D to detach
```

## Step 6: Verify Deployment

```bash
# Check if process is running
ps aux | grep node

# Check the port (usually 3000)
lsof -i :3000

# Check recent logs
pm2 logs --lines 50
# OR
tail -f output.log
```

## Step 7: Test in Browser

Open these URLs:

1. **Health Check**: https://burchcontracting.com/api/health
   - Should return JSON with "status": "healthy"

2. **Homepage**: https://burchcontracting.com
   - Should load without errors

3. **Projects Page**: https://burchcontracting.com/admin/projects/5
   - Should work without crashes

## Quick All-in-One Command

Copy and paste this entire block (adjust the path):

```bash
# Navigate to app
cd /var/www/burchcontracting && \
# Pull changes
git pull origin main && \
# Install dependencies
npm install && \
# Build
npm run build && \
# Restart
pm2 restart all && \
# Show status
pm2 list && \
echo "✅ Deployment complete! Visit https://burchcontracting.com/api/health to verify"
```

## Troubleshooting

### Issue: Permission denied
```bash
# Check ownership
ls -la

# Fix ownership if needed
sudo chown -R $USER:$USER .
```

### Issue: Git pull fails
```bash
# Reset any local changes
git reset --hard origin/main

# Force pull
git fetch origin
git reset --hard origin/main
```

### Issue: Port already in use
```bash
# Find what's using the port
lsof -i :3000

# Kill the process (replace PID with actual number)
kill -9 PID
```

### Issue: npm build fails
```bash
# Clear cache
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

### Issue: Can't find app directory
```bash
# Search for it
find /home -name "burch-contracting-fresh" 2>/dev/null
find /var/www -name "burch*" 2>/dev/null

# Or check running processes
ps aux | grep node
# Then use: cd /proc/PID/cwd to go to that directory
```

## Check Your Current Setup

Run these to understand your setup:

```bash
# What's running?
pm2 list
# OR
systemctl list-units | grep node

# Where is the app?
pwd
ls -la

# What port?
lsof -i | grep node

# What branch?
git branch
git status

# Check logs
pm2 logs --lines 20
# OR
tail -f /var/log/nodejs/error.log
```

## Expected Output

After deployment, you should see:

```
✅ Git pull: Already up-to-date OR files updated
✅ npm install: added 0 packages (or some packages)
✅ npm run build: Compiled successfully
✅ pm2 restart: [PM2] Process successfully restarted
```

Then visiting `/api/health` should show:
```json
{
  "status": "healthy",
  "database": "connected",
  "tables": 25
}
```

---

## Need Help?

If you get stuck, run this diagnostic command and send me the output:

```bash
echo "=== System Info ===" && \
pwd && \
echo "=== Git Status ===" && \
git status && \
echo "=== PM2 List ===" && \
pm2 list && \
echo "=== Last 10 Log Lines ===" && \
pm2 logs --lines 10
```

This will tell me exactly what's happening on your server!
