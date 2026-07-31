#!/usr/bin/env bash
# =============================================================
# deploy-httpd.sh — Deploy ACV Documentation behind Apache httpd
# (alternative to nginx). Same .p12 / cert handling as deploy.sh.
#
# Run as root from project root:
#   sudo bash deploy/deploy-httpd.sh
# =============================================================
set -euo pipefail

SRC_DIR="${SRC_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)}"
SITE_SRC="${SRC_DIR}"
WEB_ROOT="${WEB_ROOT:-/var/www/acv-docs}"
TLS_DIR="${TLS_DIR:-/etc/pki/acv-docs}"
CONF_SRC="${SRC_DIR}/deploy/httpd-acv-docs.conf"
CONF_DST="/etc/httpd/conf.d/acv-docs.conf"
CERT_DIR="${SRC_DIR}/cert"
INTERM_CERT="${CERT_DIR}/rc-load-pt-load-develop_test_fedex_com_interm.cer"
P12_FILE="${P12_FILE:-}"
P12_PASSWORD="${P12_PASSWORD:-}"
RPM_DIR="${SRC_DIR}/deploy/rpms"

log()  { printf '\033[1;34m[deploy-httpd]\033[0m %s\n' "$*"; }
fail() { printf '\033[1;31m[error]\033[0m %s\n' "$*" >&2; exit 1; }

[[ $EUID -eq 0 ]] || fail "Run as root."
command -v openssl >/dev/null || fail "openssl is required."

if [[ -z "${P12_FILE}" ]]; then
  P12_FILE="$(ls -1 "${CERT_DIR}"/*.p12 2>/dev/null | head -n1 || true)"
fi
[[ -n "${P12_FILE}" && -f "${P12_FILE}" ]] || fail "No .p12 in ${CERT_DIR}."

if [[ -z "${P12_PASSWORD}" ]]; then
  read -rs -p "Enter .p12 password: " P12_PASSWORD
  echo
fi

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
install_pkg httpd
install_pkg mod_ssl
install_pkg policycoreutils-python-utils
command -v rsync >/dev/null || install_pkg rsync

# 2. Convert .p12 to PEM (same logic as deploy.sh)
log "Converting ${P12_FILE} to PEM"
mkdir -p "${TLS_DIR}"
chmod 750 "${TLS_DIR}"
openssl pkcs12 -in "${P12_FILE}" -nocerts -nodes -password "pass:${P12_PASSWORD}" \
  | sed -n '/-----BEGIN PRIVATE KEY-----/,/-----END PRIVATE KEY-----/p' \
  > "${TLS_DIR}/privkey.pem"
openssl pkcs12 -in "${P12_FILE}" -clcerts -nokeys -password "pass:${P12_PASSWORD}" \
  | sed -n '/-----BEGIN CERTIFICATE-----/,/-----END CERTIFICATE-----/p' \
  > "${TLS_DIR}/leaf.pem"
cat "${TLS_DIR}/leaf.pem" > "${TLS_DIR}/fullchain.pem"
[[ -f "${INTERM_CERT}" ]] && cat "${INTERM_CERT}" >> "${TLS_DIR}/fullchain.pem"
chmod 640 "${TLS_DIR}"/*.pem
chown root:apache "${TLS_DIR}"/*.pem || chown root:root "${TLS_DIR}"/*.pem

# 3. Publish
log "Publishing to ${WEB_ROOT}"
mkdir -p "${WEB_ROOT}"
rsync -a --delete \
      --exclude='.git/' --exclude='node_modules/' \
      --exclude='cert/' --exclude='deploy/' \
      --exclude='*.md' --exclude='package*.json' \
      --exclude='build-site.js' \
      "${SITE_SRC}/" "${WEB_ROOT}/"

# 4. Disable Apache's default SSL config (it conflicts with ours)
if [[ -f /etc/httpd/conf.d/ssl.conf ]]; then
  mv /etc/httpd/conf.d/ssl.conf /etc/httpd/conf.d/ssl.conf.disabled
fi
install -m 0644 "${CONF_SRC}" "${CONF_DST}"

# 5. SELinux + firewall
if command -v getenforce >/dev/null && [[ "$(getenforce)" != "Disabled" ]]; then
  semanage fcontext -a -t httpd_sys_content_t "${WEB_ROOT}(/.*)?" 2>/dev/null || true
  semanage fcontext -a -t cert_t              "${TLS_DIR}(/.*)?"  2>/dev/null || true
  restorecon -R "${WEB_ROOT}" "${TLS_DIR}"
fi
if command -v firewall-cmd >/dev/null && systemctl is-active --quiet firewalld; then
  firewall-cmd --permanent --add-service=http  >/dev/null
  firewall-cmd --permanent --add-service=https >/dev/null
  firewall-cmd --reload >/dev/null
fi

# 6. Test + start
apachectl configtest
systemctl enable httpd >/dev/null
systemctl restart httpd
log "Done. https://<host>/site/"
