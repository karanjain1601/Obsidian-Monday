#!/usr/bin/env bash
# =============================================================
# deploy.sh — Deploy the ACV Documentation site to a RHEL 8 host
#   • Installs / configures nginx
#   • Converts the .p12 bundle to PEM for nginx
#   • Publishes the static site to /var/www/acv-docs
#   • Sets correct SELinux file contexts
#
# Run as root (or via sudo) from the project root, e.g.:
#   sudo bash deploy/deploy.sh
#
# Required files in cert/:
#   *.p12                                          (private key + leaf cert)
#   rc-load-pt-load-develop_test_fedex_com_cert.cer    (leaf, optional)
#   rc-load-pt-load-develop_test_fedex_com_interm.cer  (intermediate)
# =============================================================
set -euo pipefail

# ---------- Configurable paths ----------
SRC_DIR="${SRC_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)}"
SITE_SRC="${SRC_DIR}"                           # everything under Documentation/
WEB_ROOT="${WEB_ROOT:-/var/www/acv-docs}"
TLS_DIR="${TLS_DIR:-/etc/pki/acv-docs}"
NGINX_CONF_SRC="${SRC_DIR}/deploy/nginx-acv-docs.conf"
NGINX_CONF_DST="/etc/nginx/conf.d/acv-docs.conf"
CERT_DIR="${SRC_DIR}/cert"
INTERM_CERT="${CERT_DIR}/rc-load-pt-load-develop_test_fedex_com_interm.cer"
LEAF_CERT="${CERT_DIR}/rc-load-pt-load-develop_test_fedex_com_cert.cer"
P12_FILE="${P12_FILE:-}"                        # set via env or auto-detect
P12_PASSWORD="${P12_PASSWORD:-}"                # set via env; will prompt if empty

log()  { printf '\033[1;34m[deploy]\033[0m %s\n' "$*"; }
fail() { printf '\033[1;31m[error]\033[0m %s\n' "$*" >&2; exit 1; }

# ---------- Pre-flight ----------
[[ $EUID -eq 0 ]] || fail "Run as root (use sudo)."
command -v openssl >/dev/null || fail "openssl is required."

# Auto-detect a .p12 file if not specified
if [[ -z "${P12_FILE}" ]]; then
  P12_FILE="$(ls -1 "${CERT_DIR}"/*.p12 2>/dev/null | head -n1 || true)"
fi
[[ -n "${P12_FILE}" && -f "${P12_FILE}" ]] || fail "No .p12 found in ${CERT_DIR}. Place it there or pass P12_FILE=/path/to/file.p12"

if [[ -z "${P12_PASSWORD}" ]]; then
  read -rs -p "Enter .p12 password: " P12_PASSWORD
  echo
fi

# ---------- 1. Install packages ----------
RPM_DIR="${SRC_DIR}/deploy/rpms"

install_pkg() {
  local pkg="$1"
  if rpm -q "${pkg}" >/dev/null 2>&1; then
    log "${pkg} already installed"
    return 0
  fi
  log "Installing ${pkg}"
  if dnf install -y "${pkg}" >/dev/null 2>&1; then
    return 0
  fi
  # Fallback: install from any RPMs bundled in deploy/rpms/
  if [[ -d "${RPM_DIR}" ]] && compgen -G "${RPM_DIR}/*.rpm" >/dev/null; then
    log "dnf could not reach a repo; falling back to local RPMs in ${RPM_DIR}"
    dnf install -y --disablerepo='*' "${RPM_DIR}"/*.rpm
    rpm -q "${pkg}" >/dev/null 2>&1 && return 0
  fi
  fail "Could not install ${pkg}. Either:
    1) Enable the RHEL AppStream repo:
       subscription-manager repos --enable=rhel-8-for-x86_64-appstream-rpms
    2) Or place the required RPMs in ${RPM_DIR} (see deploy/README.md)."
}

install_pkg nginx
install_pkg policycoreutils-python-utils
install_pkg openssl
command -v rsync >/dev/null || install_pkg rsync

# ---------- 2. Convert .p12 -> PEM ----------
log "Converting ${P12_FILE} to PEM"
mkdir -p "${TLS_DIR}"
chmod 750 "${TLS_DIR}"

# Private key (unencrypted, only readable by root/nginx)
openssl pkcs12 -in "${P12_FILE}" -nocerts -nodes -password "pass:${P12_PASSWORD}" \
  | sed -n '/-----BEGIN PRIVATE KEY-----/,/-----END PRIVATE KEY-----/p' \
  > "${TLS_DIR}/privkey.pem"

# Leaf certificate (extract from .p12)
openssl pkcs12 -in "${P12_FILE}" -clcerts -nokeys -password "pass:${P12_PASSWORD}" \
  | sed -n '/-----BEGIN CERTIFICATE-----/,/-----END CERTIFICATE-----/p' \
  > "${TLS_DIR}/leaf.pem"

# Build a fullchain: leaf + intermediate (preferred chain order for nginx)
cat "${TLS_DIR}/leaf.pem" > "${TLS_DIR}/fullchain.pem"
if [[ -f "${INTERM_CERT}" ]]; then
  # Intermediate is delivered as a .cer (PEM in this repo); append directly.
  if grep -q "BEGIN CERTIFICATE" "${INTERM_CERT}"; then
    cat "${INTERM_CERT}" >> "${TLS_DIR}/fullchain.pem"
  else
    # Convert DER -> PEM if necessary
    openssl x509 -inform DER -in "${INTERM_CERT}" -out /tmp/interm.pem
    cat /tmp/interm.pem >> "${TLS_DIR}/fullchain.pem"
    rm -f /tmp/interm.pem
  fi
fi

chmod 640 "${TLS_DIR}/privkey.pem" "${TLS_DIR}/fullchain.pem" "${TLS_DIR}/leaf.pem"
chown root:nginx "${TLS_DIR}"/*.pem

# Sanity check: key matches cert
KEY_MOD="$(openssl rsa  -in "${TLS_DIR}/privkey.pem"   -noout -modulus 2>/dev/null | openssl md5)"
CRT_MOD="$(openssl x509 -in "${TLS_DIR}/fullchain.pem" -noout -modulus | openssl md5)"
[[ "${KEY_MOD}" == "${CRT_MOD}" ]] || fail "Private key does not match leaf certificate."
log "Key and certificate modulus match."

# ---------- 3. Publish site ----------
log "Publishing site to ${WEB_ROOT}"
mkdir -p "${WEB_ROOT}"

# rsync if available, otherwise cp
if command -v rsync >/dev/null; then
  rsync -a --delete \
        --exclude='.git/' --exclude='node_modules/' \
        --exclude='cert/' --exclude='deploy/' \
        --exclude='*.md' --exclude='package*.json' \
        --exclude='build-site.js' \
        "${SITE_SRC}/" "${WEB_ROOT}/"
else
  rm -rf "${WEB_ROOT:?}/"*
  (cd "${SITE_SRC}" && find . \
      -path './.git' -prune -o \
      -path './node_modules' -prune -o \
      -path './cert' -prune -o \
      -path './deploy' -prune -o \
      -name '*.md' -prune -o \
      -name 'package*.json' -prune -o \
      -name 'build-site.js' -prune -o \
      -type f -print | xargs -I{} cp --parents {} "${WEB_ROOT}/")
fi

# ---------- 4. nginx config ----------
log "Installing nginx config"
install -m 0644 "${NGINX_CONF_SRC}" "${NGINX_CONF_DST}"

# Test config before reload
nginx -t

# ---------- 5. SELinux + firewall (RHEL 8 specifics) ----------
if command -v getenforce >/dev/null && [[ "$(getenforce)" != "Disabled" ]]; then
  log "Setting SELinux contexts"
  semanage fcontext -a -t httpd_sys_content_t "${WEB_ROOT}(/.*)?" 2>/dev/null || true
  semanage fcontext -a -t httpd_config_t      "${TLS_DIR}(/.*)?"  2>/dev/null || true
  restorecon -R "${WEB_ROOT}" "${TLS_DIR}"
  # Allow nginx to bind privileged ports / read certs
  setsebool -P httpd_can_network_connect 1
fi

if command -v firewall-cmd >/dev/null && systemctl is-active --quiet firewalld; then
  log "Opening firewall ports 80/443"
  firewall-cmd --permanent --add-service=http  >/dev/null
  firewall-cmd --permanent --add-service=https >/dev/null
  firewall-cmd --reload >/dev/null
fi

# ---------- 6. Start / reload nginx ----------
log "Enabling and (re)starting nginx"
systemctl enable nginx >/dev/null
systemctl reload nginx 2>/dev/null || systemctl restart nginx

log "Deployment complete."
log "Verify:  curl -k https://localhost/  |  https://<host>/site/index.html"
