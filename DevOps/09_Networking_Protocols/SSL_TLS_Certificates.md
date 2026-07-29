---
title: SSL/TLS Certificates
aliases:
  - TLS
  - SSL
  - X.509
  - PKI
  - mTLS
  - cert-manager
tags:
  - DevOps
domain: DevOps
difficulty: advanced
created: 2026-07-28
related:
  - HTTP_HTTPS_Deep_Dive
  - DNS_and_Resolution
  - Load_Balancers_and_Proxies
  - SSH_and_Remote_Access
status: complete
---

# 🔐 SSL/TLS Certificates

> [!abstract] TL;DR
> TLS (Transport Layer Security) provides encryption, authentication, and integrity for network connections. The handshake negotiates cipher suites and establishes session keys; TLS 1.3 reduces this to 1-RTT (vs 2-RTT in 1.2) and adds 0-RTT resumption. X.509 certificates bind a public key to an identity and are signed by a Certificate Authority (CA) forming a chain of trust. Let's Encrypt and cert-manager automate free certificate issuance and renewal; mTLS extends this to authenticate both client and server.

## Intuition

TLS is like a sealed diplomatic pouch. Before any message is sent, both parties agree on a lock type (cipher suite negotiation), the courier presents official credentials signed by a known government (certificate chain), and they privately exchange a secret that only they know (key exchange). From then on, every message is locked with that secret — eavesdroppers see nothing useful. mTLS requires the recipient to also present credentials, like a two-sided ID check at a border crossing.

## How It Works

```mermaid
sequenceDiagram
    classDef dark fill:#0f3460,stroke:#533483,color:#e8e8e8

    participant C as Client
    participant S as Server

    Note over C,S: TLS 1.3 Handshake (1-RTT)
    C->>S: ClientHello (TLS version, cipher suites, key_share)
    S->>C: ServerHello + Certificate + CertificateVerify + Finished
    Note over S: key_share → ECDHE key exchange
    Note over C: Verify cert chain → derive session keys
    C->>S: Finished (encrypted)
    Note over C,S: Application data flows (encrypted)

    Note over C,S: TLS 1.2 Handshake (2-RTT)
    C->>S: ClientHello
    S->>C: ServerHello + Certificate + ServerHelloDone
    C->>S: ClientKeyExchange + ChangeCipherSpec + Finished
    S->>C: ChangeCipherSpec + Finished
```

## Key Concepts / Details

### TLS 1.2 vs TLS 1.3 Comparison

| Feature | TLS 1.2 | TLS 1.3 |
|---------|---------|---------|
| Handshake round trips | 2-RTT | 1-RTT |
| 0-RTT resumption | No | Yes (with replay risk) |
| Key exchange | RSA or DHE/ECDHE | ECDHE only (forward secrecy always) |
| Cipher suites | Many (some weak) | 5 strong only |
| Record layer encryption | Optional | Always |
| Client cert auth (mTLS) | Yes | Yes |
| Vulnerable to downgrade | POODLE, BEAST | No |

### X.509 Certificate Structure

```
Certificate:
  Data:
    Version: 3
    Serial Number: 03:a7:...
    Signature Algorithm: sha256WithRSAEncryption
    Issuer: CN=Let's Encrypt R11, O=Let's Encrypt, C=US
    Validity:
      Not Before: Jan 1 00:00:00 2026 GMT
      Not After:  Apr 1 00:00:00 2026 GMT      ← 90-day LE certs
    Subject: CN=example.com
    Subject Alternative Names (SANs):
      DNS:example.com
      DNS:www.example.com
      DNS:api.example.com
    Subject Public Key Info:
      Public Key Algorithm: id-ecPublicKey (P-256)
      Public-Key: <65 bytes>
    X509v3 extensions:
      Basic Constraints: CA:FALSE
      Key Usage: Digital Signature
      Extended Key Usage: TLS Web Server Authentication
      Certificate Transparency: <SCT list>
  Signature: <CA's signature over Data>
```

### Certificate Chain (Chain of Trust)

```
Root CA (self-signed, in OS/browser trust store)
  └── Intermediate CA (signed by Root)
        └── Leaf Certificate (signed by Intermediate) ← your server cert

Why intermediates?
  Root CA private key is kept offline (HSM, air-gapped).
  Intermediate CA is the working key — if compromised, only revoke the intermediate.
  Browsers trust roots; verify the full chain to root on each connection.
```

### DER vs PEM Encoding

```bash
# PEM — Base64 encoded, human-readable, common in Linux
-----BEGIN CERTIFICATE-----
MIIFazCCBFOgAwIBAgIRAIIQz7DSQONZRGPgu2OCiwAwDQYJKoZIhvcNAQELBQAw...
-----END CERTIFICATE-----

# DER — binary, used in Java keystores (JKS/PKCS12), Windows
# Convert PEM → DER
openssl x509 -in cert.pem -outform DER -out cert.der

# Convert DER → PEM
openssl x509 -in cert.der -inform DER -out cert.pem
```

### openssl Commands

```bash
# Inspect a certificate
openssl x509 -in cert.pem -text -noout

# Check cert expiry
openssl x509 -in cert.pem -noout -dates

# View cert from live server
openssl s_client -connect example.com:443 -servername example.com </dev/null \
  | openssl x509 -noout -text

# Check certificate chain
openssl s_client -connect example.com:443 -showcerts </dev/null

# Verify cert against CA bundle
openssl verify -CAfile /etc/ssl/certs/ca-certificates.crt cert.pem

# Generate self-signed cert (dev only)
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem \
  -days 365 -nodes -subj "/CN=localhost"

# Generate CSR (Certificate Signing Request)
openssl req -newkey rsa:2048 -keyout private.key -out request.csr \
  -nodes -subj "/CN=example.com"

# Test TLS version and cipher
openssl s_client -connect example.com:443 -tls1_3
```

### Let's Encrypt / ACME Protocol

Let's Encrypt issues free DV (Domain Validated) certificates via the ACME protocol. The CA verifies domain control — not organization identity.

```bash
# HTTP-01 challenge: serve a token at /.well-known/acme-challenge/<token>
# Requires port 80 accessible from internet

# Install certbot
apt install certbot python3-certbot-nginx

# Issue cert with HTTP-01 (Nginx plugin handles challenge automatically)
certbot --nginx -d example.com -d www.example.com

# Issue cert with DNS-01 challenge (works for wildcard, behind firewall)
certbot certonly --manual --preferred-challenges dns \
  -d "*.example.com" -d example.com

# Renew all certs (run via cron / systemd timer)
certbot renew --quiet

# Test renewal without issuing
certbot renew --dry-run

# Certs stored at:
# /etc/letsencrypt/live/example.com/fullchain.pem  (cert + intermediates)
# /etc/letsencrypt/live/example.com/privkey.pem    (private key)
```

### cert-manager in Kubernetes

```yaml
# ClusterIssuer — cluster-wide ACME issuer (Let's Encrypt)
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: ops@example.com
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx
    - dns01:                          # for wildcard certs
        route53:
          region: us-east-1
          hostedZoneID: Z1234567890
---
# Certificate resource
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: example-tls
  namespace: default
spec:
  secretName: example-tls-secret     # stores cert + key as k8s Secret
  issuerRef:
    name: letsencrypt-prod
    kind: ClusterIssuer
  dnsNames:
  - example.com
  - www.example.com
  renewBefore: 360h                   # renew 15 days before expiry
```

```bash
# Check certificate status
kubectl get certificate -A
kubectl describe certificate example-tls

# Inspect the TLS secret
kubectl get secret example-tls-secret -o jsonpath='{.data.tls\.crt}' \
  | base64 -d | openssl x509 -noout -dates
```

### mTLS (Mutual TLS)

In standard TLS, only the server presents a certificate. In mTLS, both parties authenticate:

```
Standard TLS:  Client verifies Server cert
mTLS:          Client verifies Server cert AND Server verifies Client cert

Use cases:
  - Service mesh (Istio/Linkerd: automatic mTLS between pods)
  - Zero-trust networking (every service must present a cert)
  - API gateways (client certs for partner API access)
  - Internal microservice auth (no shared secrets needed)
```

```nginx
# Nginx mTLS config
server {
    listen 443 ssl;
    ssl_certificate     /etc/ssl/server.crt;
    ssl_certificate_key /etc/ssl/server.key;
    ssl_client_certificate /etc/ssl/ca.crt;    # CA that signed client certs
    ssl_verify_client on;                       # require client cert
    ssl_verify_depth 2;
}
```

### SNI (Server Name Indication)

Without SNI, a server at one IP can only present one TLS certificate (the IP must map to one domain). SNI (TLS extension) lets the client include the hostname in the ClientHello — before TLS negotiation completes — so the server can choose the correct certificate.

```
SNI passthrough in HAProxy/Nginx:
  LB reads the SNI extension (not the encrypted payload)
  Routes to correct backend based on hostname
  Backend handles its own TLS termination
```

### Certificate Transparency (CT Logs)

Every publicly trusted CA must submit issued certificates to public CT logs (RFC 6962). Browsers reject certs without a Signed Certificate Timestamp (SCT). This allows domain owners to detect unauthorized certificate issuance for their domains.

```bash
# Monitor CT logs for your domain
curl "https://crt.sh/?q=%.example.com&output=json" | jq '.[].name_value'
```

### OCSP Stapling

OCSP (Online Certificate Status Protocol) lets clients check if a cert is revoked. Without stapling, clients make a real-time OCSP request to the CA — adding latency and leaking user activity. With stapling:

```
Server periodically fetches OCSP response from CA
Server includes (staples) OCSP response in TLS handshake
Client verifies the stapled response — no CA roundtrip needed
```

```nginx
ssl_stapling on;
ssl_stapling_verify on;
ssl_trusted_certificate /etc/ssl/chain.pem;
```

## Real-World Notes

- **Certificate expiry is the #1 TLS outage cause** — always automate renewal (certbot/cert-manager), set expiry alerts at 30 and 14 days, and test renewal in staging. The Let's Encrypt 90-day default is intentional: short TTL forces automation.
- **TLS termination at the load balancer** is common — the LB holds the private key, decrypts, and forwards plain HTTP internally. This simplifies cert management (one place) but means internal traffic is unencrypted unless you re-encrypt upstream (`proxy_ssl_verify on` in Nginx).
- **SANs have replaced CN for hostname verification** since RFC 2818 (2000) and all major browsers since 2017. Never put just the hostname in CN — always use Subject Alternative Names, including the CN value as a SAN.
- **Wildcard certs (`*.example.com`) only cover one level** — `sub.example.com` is covered but `a.b.example.com` is not. For multi-level subdomain coverage, use individual SANs or per-subdomain certs.

## Common Pitfalls

1. **Serving only the leaf cert without the chain** — browsers can fetch intermediate CAs but curl and other tools often cannot. Always serve `fullchain.pem` (leaf + intermediates). Verify with `openssl s_client -showcerts`.
2. **Private key and cert mismatch** — after renewing a cert, if the private key and certificate files don't match, TLS handshakes fail immediately. Verify: `openssl x509 -noout -modulus -in cert.pem | md5sum` and `openssl rsa -noout -modulus -in key.pem | md5sum` — they must match.
3. **0-RTT replay attacks** — TLS 1.3 0-RTT data can be replayed by a network attacker. Never accept 0-RTT data for non-idempotent requests (POST, DELETE). Use session tickets selectively and validate `Early-Data` header at the application layer.
4. **Forgetting to reload the server after cert renewal** — certbot/cert-manager renews the file, but Nginx/Apache must be reloaded (`nginx -s reload`) to pick up the new cert. Use certbot's `--deploy-hook` or cert-manager's `CertificateRequest` controller which handles this automatically via Ingress controller reload.
5. **mTLS without certificate revocation** — in a zero-trust setup, if a service's mTLS cert is compromised, you need a way to revoke it. Short-lived certs (1–24h, reissued by an internal CA like Vault PKI) are more practical than long-lived certs with OCSP/CRL.

## Related Concepts

- [[HTTP_HTTPS_Deep_Dive]] — HTTPS is HTTP over TLS; HSTS depends on TLS being available
- [[DNS_and_Resolution]] — DNS-01 ACME challenge writes TXT records; cert transparency monitors via DNS
- [[Load_Balancers_and_Proxies]] — SSL termination at the LB is the most common deployment pattern
- [[SSH_and_Remote_Access]] — SSH uses similar asymmetric cryptography but its own certificate format
- [[Firewall_and_Network_Security]] — TLS on port 443; SNI used by L4 firewalls for hostname-based rules
- [[_MOC_Networking_Protocols]] — Section MOC

## Review Questions

1. What is the difference between TLS 1.2 and TLS 1.3 in terms of handshake round trips and forward secrecy guarantees? Why does TLS 1.3 always provide forward secrecy while TLS 1.2 did not always?
2. Explain the certificate chain of trust. Why do CAs use intermediate certificates instead of signing leaf certs directly with the root CA key?
3. A cert-manager `Certificate` resource stays in `False/Not Ready` state. Walk through the debugging steps — what resources do you inspect and what are the most common causes?
4. What is the security risk of TLS 1.3 0-RTT resumption, and what types of HTTP requests should never be served from 0-RTT data?

## Sources

- [RFC 8446 — TLS 1.3](https://datatracker.ietf.org/doc/html/rfc8446)
- [Let's Encrypt documentation](https://letsencrypt.org/docs/)
- [cert-manager documentation](https://cert-manager.io/docs/)
- [OpenSSL Cookbook](https://www.feistyduck.com/library/openssl-cookbook/)
- [Cloudflare — How TLS Works](https://www.cloudflare.com/learning/ssl/what-happens-in-a-tls-handshake/)
- [Certificate Transparency — RFC 6962](https://datatracker.ietf.org/doc/html/rfc6962)

#DevOps #Networking #TLS #SSL #PKI #Certificates #LetsEncrypt #mTLS #Kubernetes
