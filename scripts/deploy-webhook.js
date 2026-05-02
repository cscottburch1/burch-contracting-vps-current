#!/usr/bin/env node
/**
 * Simple webhook server for deployment
 * 
 * Setup on VPS:
 * 1. Copy this file to /root/deploy-webhook.js
 * 2. npm install express
 * 3. Set DEPLOY_WEBHOOK_SECRET in environment
 * 4. pm2 start /root/deploy-webhook.js --name deploy-webhook
 * 5. Configure nginx to proxy /webhook to localhost:3001
 */

const express = require('express');
const { exec } = require('child_process');
const crypto = require('crypto');

const app = express();
app.use(express.json());

const PORT = process.env.WEBHOOK_PORT || 3001;
const SECRET = process.env.DEPLOY_WEBHOOK_SECRET;
const APP_PATH = '/var/www/burch-contracting';

if (!SECRET) {
  console.error('❌ DEPLOY_WEBHOOK_SECRET not set!');
  process.exit(1);
}

// Webhook endpoint
app.post('/webhook/deploy', (req, res) => {
  const providedSecret = req.headers['x-deploy-secret'];
  
  // Validate secret
  if (providedSecret !== SECRET) {
    console.log('❌ Invalid secret provided');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  console.log(`🚀 Deploy triggered at ${new Date().toISOString()}`);
  console.log(`   Ref: ${req.body.ref}`);
  console.log(`   SHA: ${req.body.sha}`);

  // Send immediate response
  res.json({ 
    status: 'deployment_started',
    timestamp: new Date().toISOString()
  });

  // Execute deployment asynchronously
  const deployScript = `
    cd ${APP_PATH} && \
    git fetch origin main && \
    git checkout main && \
    git reset --hard origin/main && \
    npm ci --production=false && \
    npm run build && \
    pm2 restart burch-contracting --update-env
  `;

  exec(deployScript, (error, stdout, stderr) => {
    if (error) {
      console.error(`❌ Deployment failed: ${error.message}`);
      console.error(stderr);
      return;
    }
    console.log('✅ Deployment successful');
    console.log(stdout);
  });
});

// Health check
app.get('/webhook/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`🎣 Webhook server listening on http://127.0.0.1:${PORT}`);
  console.log(`   Endpoint: POST /webhook/deploy`);
  console.log(`   Health: GET /webhook/health`);
});
