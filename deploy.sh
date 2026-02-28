#!/usr/bin/env bash
# ==========================================================
# Pragya VPS Deployment Script
# Target: Hostinger KVM 1 (Ubuntu), IP: 72.60.237.208
# Domain: pragyacareer.com
# ==========================================================
set -euo pipefail

DOMAIN="pragyacareer.com"
REPO_URL="https://github.com/visioncircuitlabs-coder/pragya2.git"
APP_DIR="/opt/pragya"
COMPOSE_FILE="docker-compose.prod.yml"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log()  { echo -e "${GREEN}[DEPLOY]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
err()  { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

# ----------------------------------------------------------
# 1. System Setup
# ----------------------------------------------------------
setup_system() {
    log "Updating system packages..."
    apt-get update && apt-get upgrade -y
    apt-get install -y curl git ufw fail2ban wget

    # 2GB swap (KVM 1 has 4GB RAM)
    if [ ! -f /swapfile ]; then
        log "Creating 2GB swap..."
        fallocate -l 2G /swapfile
        chmod 600 /swapfile
        mkswap /swapfile
        swapon /swapfile
        echo '/swapfile none swap sw 0 0' >> /etc/fstab
        # Tune swappiness for server workload
        sysctl vm.swappiness=10
        echo 'vm.swappiness=10' >> /etc/sysctl.conf
    else
        log "Swap already exists, skipping."
    fi
}

# ----------------------------------------------------------
# 2. Firewall
# ----------------------------------------------------------
setup_firewall() {
    log "Configuring UFW firewall..."
    ufw default deny incoming
    ufw default allow outgoing
    ufw allow OpenSSH
    ufw allow 80/tcp
    ufw allow 443/tcp
    ufw --force enable
    log "Firewall enabled: SSH, HTTP, HTTPS only."
}

# ----------------------------------------------------------
# 3. Fail2ban
# ----------------------------------------------------------
setup_fail2ban() {
    log "Configuring fail2ban..."
    cat > /etc/fail2ban/jail.local <<'JAIL'
[DEFAULT]
bantime  = 3600
findtime = 600
maxretry = 5

[sshd]
enabled = true
port    = ssh
filter  = sshd
logpath = /var/log/auth.log
maxretry = 3
JAIL
    systemctl enable fail2ban
    systemctl restart fail2ban
    log "Fail2ban configured."
}

# ----------------------------------------------------------
# 4. SSH Hardening (keep password auth enabled)
# ----------------------------------------------------------
setup_ssh() {
    log "Hardening SSH (password auth stays enabled)..."
    sed -i 's/^#\?PermitRootLogin.*/PermitRootLogin yes/' /etc/ssh/sshd_config
    sed -i 's/^#\?PasswordAuthentication.*/PasswordAuthentication yes/' /etc/ssh/sshd_config
    sed -i 's/^#\?MaxAuthTries.*/MaxAuthTries 5/' /etc/ssh/sshd_config
    sed -i 's/^#\?ClientAliveInterval.*/ClientAliveInterval 300/' /etc/ssh/sshd_config
    sed -i 's/^#\?ClientAliveCountMax.*/ClientAliveCountMax 2/' /etc/ssh/sshd_config
    systemctl restart ssh || systemctl restart sshd
}

# ----------------------------------------------------------
# 5. Docker Installation
# ----------------------------------------------------------
install_docker() {
    if command -v docker &> /dev/null; then
        log "Docker already installed: $(docker --version)"
        return
    fi

    log "Installing Docker..."
    curl -fsSL https://get.docker.com | sh
    systemctl enable docker
    systemctl start docker
    log "Docker installed: $(docker --version)"

    # Docker log rotation
    mkdir -p /etc/docker
    cat > /etc/docker/daemon.json <<'DJSON'
{
    "log-driver": "json-file",
    "log-opts": {
        "max-size": "10m",
        "max-file": "3"
    }
}
DJSON
    systemctl restart docker
}

# ----------------------------------------------------------
# 6. Clone / Update Repository
# ----------------------------------------------------------
setup_repo() {
    if [ -d "$APP_DIR/.git" ]; then
        log "Repository exists. Pulling latest changes..."
        cd "$APP_DIR"
        git pull origin main
    else
        log "Cloning repository..."
        git clone "$REPO_URL" "$APP_DIR"
        cd "$APP_DIR"
    fi
}

# ----------------------------------------------------------
# 7. Environment File
# ----------------------------------------------------------
setup_env() {
    cd "$APP_DIR"

    if [ ! -f .env.production ]; then
        log "Creating .env.production from template..."
        cp .env.production.template .env.production
        warn "==> EDIT .env.production with real values, then re-run this script!"
        warn "==> File location: $APP_DIR/.env.production"
        exit 0
    fi

    # Validate no placeholder values remain
    if grep -q 'CHANGE_ME' .env.production; then
        err ".env.production still has CHANGE_ME placeholders. Edit it first!"
    fi
    if grep -q 'your-' .env.production; then
        err ".env.production still has placeholder values (your-*). Edit it first!"
    fi

    log ".env.production validated."
}

# ----------------------------------------------------------
# 8. SSL Bootstrap (self-signed → real cert later)
# ----------------------------------------------------------
setup_ssl() {
    CERT_DIR="/etc/letsencrypt/live/$DOMAIN"

    if [ -f "$CERT_DIR/fullchain.pem" ]; then
        log "SSL certificate already exists."
        return
    fi

    log "Creating self-signed certificate for initial startup..."
    mkdir -p "$CERT_DIR"
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout "$CERT_DIR/privkey.pem" \
        -out "$CERT_DIR/fullchain.pem" \
        -subj "/CN=$DOMAIN"
    log "Self-signed cert created. Replace with Certbot after DNS propagation."
}

# ----------------------------------------------------------
# 9. Build and Deploy
# ----------------------------------------------------------
deploy() {
    cd "$APP_DIR"

    log "Building Docker images..."
    docker compose -f "$COMPOSE_FILE" build

    log "Running database migrations..."
    docker compose -f "$COMPOSE_FILE" run --rm server \
        npx prisma migrate deploy --schema=./server/prisma/schema.prisma

    log "Starting services..."
    docker compose -f "$COMPOSE_FILE" up -d

    log "Waiting for services to start..."
    sleep 10

    # Health check
    if curl -sf http://localhost:4000/health > /dev/null 2>&1; then
        log "Backend health check: OK"
    else
        warn "Backend health check failed — check logs: docker compose -f $COMPOSE_FILE logs server"
    fi

    docker compose -f "$COMPOSE_FILE" ps
}

# ----------------------------------------------------------
# 10. SSL Renewal Cron
# ----------------------------------------------------------
setup_cron() {
    CRON_JOB="0 3 * * * cd $APP_DIR && docker compose -f $COMPOSE_FILE exec -T certbot certbot renew --quiet && docker compose -f $COMPOSE_FILE exec -T nginx nginx -s reload"

    if crontab -l 2>/dev/null | grep -q "certbot renew"; then
        log "SSL renewal cron already exists."
    else
        (crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -
        log "SSL renewal cron added (daily at 3 AM)."
    fi
}

# ----------------------------------------------------------
# Main
# ----------------------------------------------------------
main() {
    log "=========================================="
    log "Pragya Deployment — $DOMAIN"
    log "=========================================="

    # Must run as root
    if [ "$(id -u)" -ne 0 ]; then
        err "This script must be run as root. Use: sudo bash deploy.sh"
    fi

    setup_system
    setup_firewall
    setup_fail2ban
    setup_ssh
    install_docker
    setup_repo
    setup_env
    setup_ssl
    deploy
    setup_cron

    log "=========================================="
    log "Deployment complete!"
    log "=========================================="
    echo ""
    log "Next steps:"
    echo "  1. Verify: curl -k https://$DOMAIN"
    echo "  2. Once DNS propagates, get real SSL cert:"
    echo "     docker compose -f $COMPOSE_FILE run --rm certbot certbot certonly \\"
    echo "       --webroot -w /var/www/certbot \\"
    echo "       -d $DOMAIN -d www.$DOMAIN \\"
    echo "       --email your-email@example.com --agree-tos --no-eff-email"
    echo "  3. After getting real cert, reload nginx:"
    echo "     docker compose -f $COMPOSE_FILE exec nginx nginx -s reload"
    echo "  4. Check logs: docker compose -f $COMPOSE_FILE logs -f"
    echo ""
}

main "$@"
