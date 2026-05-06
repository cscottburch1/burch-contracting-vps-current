# 🎣 Webhook Deployment Setup

## Why Use Webhooks Instead of Direct SSH?

GitHub Actions runners have dynamic IPs, which many VPS firewalls block by default. Instead of whitelisting hundreds of IP ranges, use a webhook approach where GitHub pings your server, and the server pulls the changes itself.

## Setup Instructions

### Step 1: Copy Webhook Script to Server

```bash
# SSH into your server
ssh root@72.60.166.68

# Create webhook script
cat > /root/deploy-webhook.js << 'EOF'
[paste contents of scripts/deploy-webhook.js]
EOF

# Make it executable
chmod +x /root/deploy-webhook.js
```

### Step 2: Generate Webhook Secret

```bash
# Generate a strong random secret
WEBHOOK_SECRET=$(openssl rand -hex 32)
echo "Save this secret: $WEBHOOK_SECRET"

# Add to your environment
echo "export DEPLOY_WEBHOOK_SECRET=$WEBHOOK_SECRET" >> ~/.bashrc
source ~/.bashrc
```

### Step 3: Start Webhook Server with PM2

```bash
# Start the webhook server
pm2 start /root/deploy-webhook.js --name deploy-webhook

# Save PM2 config
pm2 save

# Check status
pm2 status deploy-webhook
pm2 logs deploy-webhook
```

### Step 4: Configure Nginx Proxy

Add this to your nginx config (`/etc/nginx/sites-enabled/burch-contracting`):

```nginx
server {
    listen 443 ssl;
    server_name burchcontracting.com www.burchcontracting.com;
    
    # ... existing SSL config ...
    
    # Webhook endpoint (add this)
    location /webhook/ {
        proxy_pass http://127.0.0.1:3001/webhook/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Security headers
        proxy_set_header X-Deploy-Secret $http_x_deploy_secret;
        
        # Timeouts
        proxy_connect_timeout 5s;
        proxy_send_timeout 5s;
        proxy_read_timeout 5s;
    }
    
    # ... rest of config ...
}
```

Reload nginx:
```bash
nginx -t && systemctl reload nginx
```

### Step 5: Test Webhook Locally

```bash
# Test health check
curl https://burchcontracting.com/webhook/health

# Test deploy (use your actual secret)
curl -X POST https://burchcontracting.com/webhook/deploy \
  -H "Content-Type: application/json" \
  -H "X-Deploy-Secret: YOUR_WEBHOOK_SECRET_HERE" \
  -d '{"ref": "refs/heads/main", "sha": "test123"}'

# Check logs
pm2 logs deploy-webhook --lines 50
```

### Step 6: Add Secrets to GitHub

1. Go to: https://github.com/YOUR_USERNAME/burch-contracting-fresh/settings/secrets/actions

2. Add two secrets:
   - **DEPLOY_WEBHOOK_URL**: `https://burchcontracting.com/webhook/deploy`
   - **DEPLOY_WEBHOOK_SECRET**: `[the secret you generated in Step 2]`

### Step 7: Activate Webhook Workflow

```bash
# Rename the SSH workflow to disable it
git mv .github/workflows/deploy.yml .github/workflows/deploy-ssh.yml.disabled

# Activate webhook workflow
git mv .github/workflows/deploy-webhook.yml .github/workflows/deploy.yml

# Commit and push
git add .
git commit -m "Switch to webhook-based deployment"
git push origin main
```

## Testing

After setup, test by pushing to main:

```bash
git commit --allow-empty -m "Test webhook deployment"
git push origin main
```

Watch the deployment:
- GitHub Actions: https://github.com/YOUR_USERNAME/burch-contracting-fresh/actions
- Server logs: `pm2 logs deploy-webhook`
- App logs: `pm2 logs burch-contracting`

## Troubleshooting

### Webhook returns 401
- Check that DEPLOY_WEBHOOK_SECRET matches on both server and GitHub

### Webhook times out
- Verify nginx proxy is configured
- Check webhook server is running: `pm2 status deploy-webhook`
- Test direct: `curl http://127.0.0.1:3001/webhook/health`

### Deployment fails
- Check webhook logs: `pm2 logs deploy-webhook --lines 100`
- Verify git credentials: `cd /var/www/burch-contracting && git pull`
- Check permissions: `ls -la /var/www/burch-contracting`

## Security Notes

- Webhook secret should be 32+ random characters
- Never commit webhook secret to git
- Nginx should only accept HTTPS requests
- Consider IP whitelisting in nginx for extra security
- Webhook server only listens on 127.0.0.1 (localhost)

## Rollback to SSH Deployment

If you need to switch back:

```bash
git mv .github/workflows/deploy.yml .github/workflows/deploy-webhook.yml.disabled
git mv .github/workflows/deploy-ssh.yml.disabled .github/workflows/deploy.yml
git add .
git commit -m "Rollback to SSH deployment"
git push origin main
```
