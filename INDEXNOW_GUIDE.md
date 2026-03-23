# IndexNow Guide

## Current Setup

- Production site: `https://burchcontracting.com`
- IndexNow key env var: `INDEXNOW_KEY`
- Public key URL: `https://burchcontracting.com/indexnow-key.txt`
- Static key file path on server: `/root/burch-contracting/public/indexnow-key.txt`
- Deploy-time key sync script: `npm run indexnow:sync-key`
- Deploy-time ping script: `npm run indexnow:ping`

## How It Works

1. The production server stores the key in `.env.production` as `INDEXNOW_KEY`.
2. During deploy, `npm run indexnow:sync-key` writes the key into `public/indexnow-key.txt`.
3. After restart, `npm run indexnow:ping` submits the current URL list to IndexNow.

## Current Production Key

- `99b47b9f16ca4d8793a05ec70e35c5d0`

## Manual Re-Ping

Run this on the VPS:

```bash
cd /root/burch-contracting
npm run indexnow:ping
```

Expected result:

```text
IndexNow submitted 6 URL(s): HTTP 202
```

## Rotate The Key

Run this on the VPS:

```bash
cd /root/burch-contracting
NEW_KEY=$(cat /proc/sys/kernel/random/uuid | tr -d '-')
sed -i "s/^INDEXNOW_KEY=.*/INDEXNOW_KEY=$NEW_KEY/" .env.production
npm run indexnow:sync-key
pm2 restart burch-contracting --update-env
```

Then verify:

```bash
cat /root/burch-contracting/public/indexnow-key.txt
```

And confirm publicly:

```text
https://burchcontracting.com/indexnow-key.txt
```

## Files Involved

- `.github/workflows/deploy.yml`
- `package.json`
- `scripts/seo/indexnow-ping.mjs`
- `scripts/seo/write-indexnow-key.mjs`

## Notes

- If `INDEXNOW_KEY` is missing, key sync skips and ping skips without failing deploy.
- The site now uses a generated static file in `public/` for the key instead of a runtime route.