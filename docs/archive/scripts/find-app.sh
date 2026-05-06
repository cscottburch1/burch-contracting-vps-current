# Commands to run in Hostinger VPS Terminal

# Step 1: Find your app
find /home -name "burch*" -type d 2>/dev/null
find /var -name "burch*" -type d 2>/dev/null
find /root -name "burch*" -type d 2>/dev/null

# If nothing shows up, try:
ls -la /home
ls -la /var/www
ls -la /root
ls -la ~

# Look for node processes
ps aux | grep node

# Check PM2 apps
pm2 list
