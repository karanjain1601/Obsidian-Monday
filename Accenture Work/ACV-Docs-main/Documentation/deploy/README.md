# ACV Documentation — RHEL 8 deployment

This folder contains everything needed to publish the static
documentation site behind nginx on a RHEL 8 host using a
PKCS#12 (`.p12`) certificate bundle.

## Files

| File | Purpose |
|---|---|
| [nginx-acv-docs.conf](nginx-acv-docs.conf) | nginx server block (HTTP → HTTPS, TLS 1.2/1.3, gzip, security headers) |
| [deploy.sh](deploy.sh) | One-shot deploy script: extracts PEM from `.p12`, copies the site, configures SELinux + firewall, reloads nginx |
| [httpd-acv-docs.conf](httpd-acv-docs.conf) | Apache httpd alternative vhost |
| [deploy-httpd.sh](deploy-httpd.sh) | Apache httpd installer (drop-in replacement for `deploy.sh`) |
| [serve-https.py](serve-https.py) | Zero-dependency Python stdlib HTTPS server |
| [acv-docs.service](acv-docs.service) | systemd unit for the Python server |
| [deploy-python.sh](deploy-python.sh) | Installer for the Python + systemd option |
| [Containerfile](Containerfile) | podman / docker image (nginx-unprivileged base) |
| [nginx-acv-docs.container.conf](nginx-acv-docs.container.conf) | nginx config baked into the container |

## Choosing a deployment method

| Method | Use when | Notes |
|---|---|---|
| **nginx** (default — `deploy.sh`) | You already use nginx, or want best perf/footprint | Recommended |
| **Apache httpd** (`deploy-httpd.sh`) | Org policy mandates Apache, or it's already running on the host | Same TLS/headers/cache as nginx |
| **Python + systemd** (`deploy-python.sh`) | Air-gapped host with **no nginx/httpd RPMs** available — Python ships with RHEL | Stdlib only, single-process. Fine for an internal docs site. |
| **podman / docker** (`Containerfile`) | Host runs containers and you don't want to touch the OS | Mount certs as a read-only volume |

All four methods share the same `/etc/pki/acv-docs/{fullchain,privkey}.pem`
layout and the same `/var/www/acv-docs` document root, so you can switch
between them without re-extracting the `.p12`.

## Layout produced on the server

```
/var/www/acv-docs/                     ← document root
    site/index.html                    ← hub
    acv-commons/site/index.html        ← per-app site
    ...
/etc/pki/acv-docs/
    privkey.pem                        ← extracted from .p12
    leaf.pem
    fullchain.pem                      ← leaf + intermediate
/etc/nginx/conf.d/acv-docs.conf
```

## Prerequisites

- RHEL 8 host with `dnf` access
- Root/sudo on the host
- The `.p12` bundle (private key + leaf certificate) — drop it
  into [cert/](../cert/). Filename does not matter; the script
  picks the first `*.p12` it finds.
- The intermediate cert is already in this folder:
  `cert/rc-load-pt-load-develop_test_fedex_com_interm.cer`

## Deploy

1. Build the site locally (one-time, before copying to the server):

   ```powershell
   node build-site.js
   ```

2. Sync the project to the server (rsync, scp, or `git pull` from a
   checkout). For example:

   ```bash
   rsync -avz --delete ./Documentation/ \
     deploy@rhel8-host:/opt/acv-docs/
   ```

3. Drop the `.p12` into `cert/` on the server (do **not** commit it).

4. Run the deployer:

   ```bash
   sudo P12_PASSWORD='your-pfx-password' bash /opt/acv-docs/deploy/deploy.sh
   ```

   Or omit `P12_PASSWORD` and you'll be prompted interactively.

5. Verify:

   ```bash
   curl -kI https://localhost/site/
   openssl s_client -connect localhost:443 -servername <fqdn> </dev/null
   ```

## What if nginx (or other packages) are not installed?

`deploy.sh` installs everything it needs automatically. The script
tries each package in this order:

1. `rpm -q <pkg>` — already installed ⇒ skip.
2. `dnf install -y <pkg>` — pull from the system's enabled repos.
3. **Local fallback** — if `dnf` can't reach a repo, it installs every
   `*.rpm` it finds in `deploy/rpms/`.

### Online host

Just run the script. RHEL 8 ships with AppStream enabled by default, and
`nginx` lives there. If your host is registered with a Satellite or
custom yum mirror, that works too.

If `dnf install nginx` fails with `No match for argument`, enable the
AppStream repo manually:

```bash
sudo subscription-manager repos --enable=rhel-8-for-x86_64-appstream-rpms
```

…or use EPEL:

```bash
sudo dnf install -y https://dl.fedoraproject.org/pub/epel/epel-release-latest-8.noarch.rpm
```

### Air-gapped host (no internet, no internal mirror)

Download the RPMs once on a connected RHEL 8 box (matching architecture)
and copy them into `deploy/rpms/` before running the script:

```bash
# On a connected machine of the same arch (x86_64):
mkdir -p deploy/rpms
sudo dnf install -y --downloadonly --downloaddir=./deploy/rpms \
    nginx policycoreutils-python-utils openssl rsync \
    nginx-filesystem nginx-mimetypes \
    nginx-core nginx-all-modules

# Then sync the project (including deploy/rpms/) to the air-gapped host
# and run:
sudo bash /opt/acv-docs/deploy/deploy.sh
```

## Updating the site

After regenerating the docs locally (`node build-site.js`) and syncing
the new files to the server, run:

```bash
sudo bash /opt/acv-docs/deploy/deploy.sh
```

The script is idempotent — it re-syncs the site, refreshes the PEMs
from the `.p12`, validates the nginx config, and reloads nginx.

## Notes

- **Private key safety.** `privkey.pem` is written `0640 root:nginx`
  in `/etc/pki/acv-docs/`. Never commit it.
- **SELinux.** The script labels the web root `httpd_sys_content_t`
  and the TLS dir `httpd_config_t` and runs `restorecon`.
- **Firewall.** If `firewalld` is active, ports 80 and 443 are opened.
- **HSTS.** The config emits `Strict-Transport-Security` with a
  1-year max-age. Remove that header until the cert is fully verified
  in production if you want to avoid sticky HSTS pinning.
- **Caching.** HTML is served with `no-cache`; static assets get a
  7-day cache. Bumping the build refreshes assets via filename hashes
  if you later add cache-busting; for now `Cache-Control` simply
  expires after 7 days.

## Troubleshooting

| Symptom | Likely cause / fix |
|---|---|
| `nginx: [emerg] cannot load certificate key` | Wrong `.p12` password — re-run with the correct one. |
| `403 Forbidden` on every URL | SELinux contexts not applied — re-run the script or `restorecon -R /var/www/acv-docs`. |
| Browser shows "Not secure" with valid cert | Server name in the URL doesn't match the cert SAN — check `openssl x509 -in /etc/pki/acv-docs/leaf.pem -noout -text \| grep DNS`. |
| Mixed-content warnings | Some absolute `http://` URLs in markdown — search and replace with `https://`. |

## Quick reference — alternative methods

### Apache httpd

```bash
sudo P12_PASSWORD='...' bash /opt/acv-docs/deploy/deploy-httpd.sh
```

### Python + systemd (no nginx/httpd needed)

```bash
sudo P12_PASSWORD='...' bash /opt/acv-docs/deploy/deploy-python.sh
sudo journalctl -u acv-docs -f      # logs
sudo systemctl restart acv-docs     # restart after a content sync
```

### podman

```bash
# Extract PEMs once (re-uses deploy.sh's logic without installing nginx):
sudo P12_PASSWORD='...' INSTALL_NGINX=no bash deploy/deploy.sh   # certs only
# or run any of the *.sh scripts above first to populate /etc/pki/acv-docs

podman build -t acv-docs:latest -f deploy/Containerfile .
podman run -d --name acv-docs \
  -p 443:8443 \
  -v /etc/pki/acv-docs:/certs:ro,Z \
  --restart=always \
  acv-docs:latest
```
