#!/usr/bin/env bash
# =============================================================
# deploy-http.sh — Deploy ACV Documentation over plain HTTP.
# No certs, no .p12, no TLS. Simplest possible RHEL 8 deploy.
#
# Run as root from the project root:
#   sudo bash deploy/deploy-http.sh
#
# Override defaults via env vars:
#   PORT=8080 sudo bash deploy/deploy-http.sh
# =============================================================
set -euo pipefail

SRC_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WEB_ROOT="${WEB_ROOT:-/var/www/acv-docs}"
PORT="${PORT:-80}"
CONF_DST="/etc/nginx/conf.d/acv-docs.conf"
RPM_DIR="${SRC_DIR}/deploy/rpms"

log()  { printf '\033[1;34m[deploy-http]\033[0m %s\n' "$*"; }
fail() { printf '\033[1;31m[error]\033[0m %s\n' "$*" >&2; exit 1; }

[[ $EUID -eq 0 ]] || fail "Run as root (sudo)."

install_pkg() {
  local pkg="$1"
  rpm -q "${pkg}" >/dev/null 2>&1 && { log "${pkg} already installed"; return 0; }
  log "Installing ${pkg}"
  if dnf install -y "${pkg}" >/dev/null 2>&1; then return 0; fi
  if [[ -d "${RPM_DIR}" ]] && compgen -G "${RPM_DIR}/*.rpm" >/dev/null; then
    dnf install -y --disablerepo='*' "${RPM_DIR}"/*.rpm
    rpm -q "${pkg}" >/dev/null 2>&1 && return 0
  fi
  fail "Could not install ${pkg}."
}

# 1. Packages
install_pkg nginx
command -v rsync >/dev/null || install_pkg rsync

# 2. Publish site
log "Publishing site to ${WEB_ROOT}"
mkdir -p "${WEB_ROOT}"
rsync -a --delete \
      --exclude='.git/' --exclude='node_modules/' \
      --exclude='cert/' --exclude='deploy/' \
      --exclude='*.md'  --exclude='package*.json' \
      --exclude='build-site.js' \
      "${SRC_DIR}/" "${WEB_ROOT}/"

# 3. Write nginx config (HTTP only)
log "Writing ${CONF_DST}"
cat > "${CONF_DST}" <<EOF
server {
    listen       ${PORT} default_server;
    listen       [::]:${PORT} default_server;
    server_name  _;

    root  ${WEB_ROOT};
    index index.html;

    add_header X-Content-Type-Options "nosniff"    always;
    add_header X-Frame-Options        "SAMEORIGIN" always;
    add_header Referrer-Policy        "strict-origin-when-cross-origin" always;

    gzip on;
    gzip_types text/plain text/css application/javascript application/json image/svg+xml;
    gzip_min_length 1024;

    location / { try_files \$uri \$uri/ =404; }

    location ~* \.(?:css|js|svg|png|jpg|jpeg|gif|ico|woff2?)\$ {
        expires 7d;
        add_header Cache-Control "public, immutable";
    }
    location ~* \.html\$ { add_header Cache-Control "no-cache"; }
}
EOF

# 4. Disable any default server block on the same port
if [[ -f /etc/nginx/nginx.conf ]] && grep -qE '^\s*listen\s+'"${PORT}"'\s+default_server' /etc/nginx/nginx.conf; then
  sed -i -E 's/^(\s*listen\s+'"${PORT}"'\s+default_server)/# \1/' /etc/nginx/nginx.conf
  sed -i -E 's/^(\s*listen\s+\[::\]:'"${PORT}"'\s+default_server)/# \1/' /etc/nginx/nginx.conf
fi

# 5. SELinux + firewall
if command -v getenforce >/dev/null && [[ "$(getenforce)" != "Disabled" ]]; then
  command -v semanage >/dev/null || install_pkg policycoreutils-python-utils
  semanage fcontext -a -t httpd_sys_content_t "${WEB_ROOT}(/.*)?" 2>/dev/null || true
  restorecon -R "${WEB_ROOT}"
  if [[ "${PORT}" != "80" && "${PORT}" != "443" ]]; then
    semanage port -a -t http_port_t -p tcp "${PORT}" 2>/dev/null || \
    semanage port -m -t http_port_t -p tcp "${PORT}" 2>/dev/null || true
  fi
fi
if command -v firewall-cmd >/dev/null && systemctl is-active --quiet firewalld; then
  if [[ "${PORT}" == "80" ]]; then
    firewall-cmd --permanent --add-service=http >/dev/null
  else
    firewall-cmd --permanent --add-port="${PORT}/tcp" >/dev/null
  fi
  firewall-cmd --reload >/dev/null
fi

# 6. Test + start
nginx -t
systemctl enable nginx >/dev/null
systemctl restart nginx

log "Done."
log "Test:   curl -I http://localhost:${PORT}/site/"
log "Browse: http://<host>:${PORT}/site/"
