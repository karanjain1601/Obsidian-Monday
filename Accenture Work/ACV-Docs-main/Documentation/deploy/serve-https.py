#!/usr/bin/env python3
"""
serve-https.py — Zero-dependency HTTPS static file server using only the
Python 3 standard library (ships with RHEL 8 / 9). Use when you cannot
install nginx or Apache httpd.

Run via the bundled systemd unit (deploy/acv-docs.service) or directly:
    sudo python3 /opt/acv-docs/serve-https.py \
         --root /var/www/acv-docs \
         --cert /etc/pki/acv-docs/fullchain.pem \
         --key  /etc/pki/acv-docs/privkey.pem \
         --port 443
"""
from __future__ import annotations
import argparse
import http.server
import os
import ssl
import sys
from functools import partial


SECURITY_HEADERS = {
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN",
    "Referrer-Policy": "strict-origin-when-cross-origin",
}


class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):  # type: ignore[override]
        for k, v in SECURITY_HEADERS.items():
            self.send_header(k, v)
        path = self.path.split("?", 1)[0]
        if path.endswith((".css", ".js", ".svg", ".png", ".jpg", ".woff2")):
            self.send_header("Cache-Control", "public, max-age=604800, immutable")
        elif path.endswith((".html", "/")) or "." not in path.rsplit("/", 1)[-1]:
            self.send_header("Cache-Control", "no-cache")
        super().end_headers()

    def log_message(self, fmt, *args):  # quieter logs to journald
        sys.stderr.write("%s - %s\n" % (self.address_string(), fmt % args))


def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("--root", required=True)
    p.add_argument("--cert", required=True)
    p.add_argument("--key", required=True)
    p.add_argument("--bind", default="0.0.0.0")
    p.add_argument("--port", type=int, default=443)
    args = p.parse_args()

    os.chdir(args.root)
    handler = partial(Handler, directory=args.root)
    httpd = http.server.ThreadingHTTPServer((args.bind, args.port), handler)

    ctx = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
    ctx.minimum_version = ssl.TLSVersion.TLSv1_2
    ctx.load_cert_chain(certfile=args.cert, keyfile=args.key)
    httpd.socket = ctx.wrap_socket(httpd.socket, server_side=True)

    sys.stderr.write(f"Serving {args.root} on https://{args.bind}:{args.port}\n")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        return 0
    return 0


if __name__ == "__main__":
    sys.exit(main())
