#!/usr/bin/env bash
set -euo pipefail

DOMAIN="${DOMAIN:-upstatehomeservices.pro}"
APP_DIR="${APP_DIR:-/var/www/upstate-home-services}"
REPO_URL="${REPO_URL:-https://github.com/cscottburch1/upstate-home-services.git}"
BRANCH="${BRANCH:-main}"
APP_PORT="${APP_PORT:-3000}"
ADMIN_EMAIL="${ADMIN_EMAIL:-}"
ENABLE_SSL="${ENABLE_SSL:-true}"

if [[ "$(id -u)" -ne 0 ]]; then
  echo "This script must run as root." >&2
  exit 1
fi

echo "[1/8] Installing system packages..."
apt update
apt install -y curl git nginx ufw ca-certificates gnupg

echo "[2/8] Installing Node.js 20 and PM2..."
if ! command -v node >/dev/null 2>&1 || [[ "$(node -v | sed 's/v//;s/\..*//')" -lt 20 ]]; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt install -y nodejs
fi
npm install -g pm2

echo "[3/8] Pulling application code..."
mkdir -p "$(dirname "$APP_DIR")"
if [[ ! -d "$APP_DIR/.git" ]]; then
  git clone "$REPO_URL" "$APP_DIR"
fi
cd "$APP_DIR"
git fetch origin "$BRANCH"
git checkout "$BRANCH"
git pull origin "$BRANCH"

echo "[4/8] Installing dependencies and building app..."
npm ci
npm run build

if [[ ! -f ".env.production" && -f ".env.production.example" ]]; then
  cp .env.production.example .env.production
  echo "Created .env.production from template. Update secrets before go-live."
fi

echo "[5/8] Starting app with PM2..."
if pm2 describe upstate-home-services >/dev/null 2>&1; then
  pm2 restart upstate-home-services --update-env
else
  pm2 start npm --name upstate-home-services -- start
fi
pm2 save

if ! pm2 startup systemd -u root --hp /root >/dev/null 2>&1; then
  echo "PM2 startup command could not be auto-configured. Run: pm2 startup"
fi

echo "[6/8] Writing Nginx config for $DOMAIN..."
cat > "/etc/nginx/sites-available/$DOMAIN" <<NGINXCONF
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN www.$DOMAIN;

    client_max_body_size 25M;

    location / {
        proxy_pass http://127.0.0.1:$APP_PORT;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
NGINXCONF

ln -sfn "/etc/nginx/sites-available/$DOMAIN" "/etc/nginx/sites-enabled/$DOMAIN"
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx

echo "[7/8] Enabling firewall rules..."
ufw allow OpenSSH || true
ufw allow 'Nginx Full' || true
ufw --force enable || true

echo "[8/8] Configuring SSL..."
if [[ "$ENABLE_SSL" == "true" ]]; then
  apt install -y certbot python3-certbot-nginx
  if [[ -n "$ADMIN_EMAIL" ]]; then
    certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" --agree-tos -m "$ADMIN_EMAIL" --redirect --non-interactive
  else
    echo "ADMIN_EMAIL not set. Skipping non-interactive certbot run."
    echo "Run manually: certbot --nginx -d $DOMAIN -d www.$DOMAIN"
  fi
fi

echo "Bootstrap complete. App should be live after DNS points to this VPS."
