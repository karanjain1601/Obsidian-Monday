#!/usr/bin/env bash
# deploy-python.sh — Zero-dependency deploy. No nginx, no Apache.
# Uses Python 3 stdlib (already on RHEL 8/9) behind a systemd unit.
set -euo pipefail

SRC_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WEB_ROOT="${WEB_ROOT:-/var/www/acv-docs}"
APP_DIR="${APP_DIR:-/opt/acv-docs}"
TLS_DIR="${TLS_DIR:-/etc/pki/acv-docs}"
CERT_DIR="${SRC_DIR}/cert"
INTERM_CERT="${CERT_DIR}/rc-load-pt-load-develop_test_fedex_com_interm.cer"
P12_FILE="${P12_FILE:-}"
P12_PASSWORD="${P12_PASSWORD:-}"

log()  { printf '\033[1;34m[deploy-py]\033[0m %s\n' "$*"; }
fail() { printf '\033[1;31m[error]\033[0m %s\n' "$*" >&2; exit 1; }

[[ $EUID -eq 0 ]] || fail "Run as root."
command -v python3 >/dev/null || fail "python3 missing (RHEL 8+ ships it)."
command -v openssl >/dev/null || fail "openssl is required."

[[ -n "${P12_FILE}" ]] || P12_FILE="$(ls -1 "${CERT_DIR}"/*.p12 2>/dev/null | head -n1 || true)"
[[ -n "${P12_FILE}" && -f "${P12_FILE}" ]] || fail "No .p12 in ${CERT_DIR}."
[[ -n "${P12_PASSWORD}" ]] || { read -rs -p "Enter .p12 password: " P12_PASSWORD; echo; }

# user
id acvdocs >/dev/null 2>&1 || useradd --system --home-dir "${APP_DIR}" --shell /sbin/nologin acvdocs

# tls
log "Extracting PEM"
mkdir -p "${TLS_DIR}"; chmod 750 "${TLS_DIR}"
openssl pkcs12 -in "${P12_FILE}" -nocerts -nodes -password "pass:${P12_PASSWORD}" \
  | sed -n '/-----BEGIN PRIVATE KEY-----/,/-----END PRIVATE KEY-----/p' > "${TLS_DIR}/privkey.pem"
openssl pkcs12 -in "${P12_FILE}" -clcerts -nokeys -password "pass:${P12_PASSWORD}" \
  | sed -n '/-----BEGIN CERTIFICATE-----/,/-----END CERTIFICATE-----/p' > "${TLS_DIR}/leaf.pem"
cat "${TLS_DIR}/leaf.pem" > "${TLS_DIR}/fullchain.pem"
[[ -f "${INTERM_CERT}" ]] && cat "${INTERM_CERT}" >> "${TLS_DIR}/fullchain.pem"
chmod 640 "${TLS_DIR}"/*.pem
chown -R root:acvdocs "${TLS_DIR}"

# files
log "Publishing site to ${WEB_ROOT}"
mkdir -p "${WEB_ROOT}" "${APP_DIR}"
rsync -a --delete \
  --exclude='.git/' --exclude='node_modules/' \
  --exclude='cert/' --exclude='deploy/' \
  --exclude='*.md' --exclude='package*.json' \
  --exclude='build-site.js' \
  "${SRC_DIR}/" "${WEB_ROOT}/"
install -m 0755 "${SRC_DIR}/deploy/serve-https.py" "${APP_DIR}/serve-https.py"
chown -R acvdocs:acvdocs "${WEB_ROOT}" "${APP_DIR}"

# unit
install -m 0644 "${SRC_DIR}/deploy/acv-docs.service" /etc/systemd/system/acv-docs.service
systemctl daemon-reload

# firewall
if command -v firewall-cmd >/dev/null && systemctl is-active --quiet firewalld; then
  firewall-cmd --permanent --add-service=https >/dev/null
  firewall-cmd --reload >/dev/null
fi

systemctl enable --now acv-docs.service
sleep 1
systemctl --no-pager status acv-docs.service | head -n 12
log "Done. https://<host>/site/"
