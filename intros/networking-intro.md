# Computer Networking: Introduction to All Topics

This document is a guided tour of the 6 sections in the Computer Networking knowledge base — a production-focused reference for engineers debugging outages, designing addressing and routing, securing data in transit, and scaling networked systems from the wire up to the service mesh. The content targets staff-level engineers and covers the full stack: physical signaling and Ethernet framing, IP addressing and TCP congestion control, application protocols, transport security, wireless and cellular, and software-defined and cloud networking.

**Suggested learning path:** OSI Model → TCP/IP Suite → Application Protocols → Network Security → Wireless Networks → SDN & Cloud Networking

---

## 01. OSI Model

The seven-layer model is the shared vocabulary of networking and the first question in any outage: "which layer is this failing at?" Each layer serves the one above and is served by the one below, a clean abstraction that lets each tier innovate independently.

**What's covered:**
- **Physical & Data-Link Layers (L1–L2)** — signal encoding (NRZ, Manchester, 4B5B), media types (copper/fiber/wireless) and the bandwidth vs throughput vs goodput distinction; collision vs broadcast domains; the Ethernet II frame layout (preamble 7B + SFD 1B + dst/src MAC 6B each + optional 802.1Q tag 4B + EtherType 2B + payload 46–1500B + FCS/CRC-32 4B); 48-bit MAC addressing (OUI = first 3 bytes, ff:ff:ff:ff:ff:ff = broadcast); CSMA/CD with binary exponential backoff; hubs vs switches (CAM/MAC table); VLANs and 802.1Q tagging (TPID 0x8100 + PCP + DEI + 12-bit VID → 4096 VLANs); Spanning Tree (STP/RSTP) loop prevention; ARP request-reply.
- **Network & Transport Layers (L3–L4)** — IPv4 header (TTL, ToS/DSCP, fragmentation with the DF bit); IPv6 (128-bit addressing, no router fragmentation, ICMPv6 NDP replacing ARP); CIDR and longest-prefix-match routing; NAT/PAT; the TCP segment (sequence/ACK numbers, flags, window field), UDP datagrams, ports, and the 4-tuple socket pair as the connection identifier.
- **Session, Presentation & Application Layers (L5–L7)** — L5 session management (RPC sessions, NetBIOS, SOCKS proxy, TLS session resumption); L6 data translation (character encoding, MIME types, serialization, compression) with SSL/TLS acting as a presentation-layer concern; L7 protocols (HTTP, DNS, SMTP, FTP, SSH).
- **Encapsulation & PDUs** — PDU names per layer (data → segment → packet → frame → bits); each layer prepends a header (Ethernet also appends a trailer); de-encapsulation on receive; MTU and fragmentation (DF bit, Path MTU Discovery), jumbo frames (9000B), and the MSS = MTU − 20 (IP) − 20 (TCP) = 1460B relationship.
- **Protocol Mapping & Troubleshooting** — mapping the TCP/IP suite onto OSI (TCP/IP Application ≈ OSI 5+6+7; Transport = L4; Internet = L3; Link = L1+L2), why SSL/TLS spans L5–L6, and layer-by-layer isolation as a systematic debugging method.

**Key mental models:** Every problem lives at a layer — isolate it top-down or bottom-up; OSI and TCP/IP do not map 1:1 (TCP/IP collapses 5–7 into "application"); L2 switches forward on MAC and never see IP; each layer's payload shrinks from the one below it by exactly that layer's header overhead.

---

## 02. TCP/IP Suite

IP delivers best-effort, globally addressed packets; TCP layers reliability, ordering, and flow/congestion control on top; UDP strips everything back to a minimal datagram for latency-sensitive traffic. This is the load-bearing core of the internet.

**What's covered:**
- **IP Addressing & Subnetting** — IPv4 classes (historical), CIDR notation, subnet-mask arithmetic (bitwise AND of address and mask → network address), the usable-host formula 2^(32−prefix) − 2, VLSM for zero-waste allocation, RFC 1918 private ranges (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16); IPv6 address types (global unicast 2000::/3, link-local fe80::/10, loopback ::1, multicast), abbreviation rules, and dual-stack/tunneling (6in4/Teredo).
- **TCP Reliability & Congestion Control** — three-way handshake (SYN → SYN-ACK → ACK), four-way close (FIN/ACK twice), sequence/ACK numbers, the sliding window, and flow control via the advertised rwnd; the congestion-control state machine (slow start → congestion avoidance → fast retransmit → fast recovery) built on AIMD (+1 MSS/RTT additive increase, ×½ multiplicative decrease on loss); CUBIC (loss-based, Linux default, cubic growth W(t) = C(t−K)³ + W_max) vs BBR (model-based, paces at BtlBw and sizes cwnd to BtlBw × RTprop); Nagle, delayed ACK, and why TIME_WAIT exists.
- **UDP & Multicast** — the 8-byte UDP header (src/dst port, length, checksum); why DNS/DHCP/gaming/streaming/QUIC prefer it; IP multicast (224.0.0.0/4), IGMP group membership, PIM-SM routing; broadcast vs multicast.
- **ICMP & Diagnostics** — ICMPv4 types (echo request/reply = ping, destination unreachable, time exceeded = the traceroute engine, redirect) and ICMPv6 NDP; the ping/traceroute/tracert/mtr toolchain, PMTU discovery, and why ICMP rate-limiting or filtering creates silent black holes.
- **Routing Protocols** — static vs dynamic; distance-vector RIP (Bellman-Ford, count-to-infinity, split horizon, hop count ≤ 15) vs link-state OSPF (Dijkstra SPF, areas, LSA flooding, DR/BDR election, cost = 10⁸/bw) vs path-vector BGP (AS_PATH, next-hop, policy); EIGRP; OSPF area design with ABR/ASBR roles.

**Key mental models:** The effective send window is min(rwnd, cwnd) — flow control and congestion control are two independent throttles; loss-based CUBIC backs off on loss while model-based BBR estimates the BDP directly, so BBR wins on long-fat networks where CUBIC under-utilizes; longest-prefix match decides the next hop; TIME_WAIT protects correctness but exhausts ephemeral ports at high connection rates.

---

## 03. Application Protocols

These are the contracts applications actually speak. HTTP has reinvented its wire format three times, DNS is the distributed directory that fronts everything, and gRPC is displacing REST for service-to-service calls.

**What's covered:**
- **HTTP/1.1 → HTTP/2 → HTTP/3** — HTTP/1.1 (text headers, keep-alive, broken pipelining, ~6 parallel TCP connections per origin to hide head-of-line blocking); HTTP/2 (binary framing, stream multiplexing over one TCP connection, HPACK header compression — 61-entry static table + dynamic table + Huffman, server push, stream prioritization); HTTP/3 over QUIC (UDP, 0-RTT resumption, per-stream loss isolation that removes transport-layer HoL blocking, connection migration via connection ID, QPACK, advertised via alt-svc h3).
- **DNS Resolution** — the hierarchy (13 logical root servers → TLD → authoritative), recursive vs iterative resolution, record types (A/AAAA/CNAME/MX/NS/TXT/SRV/PTR/SOA/CAA), TTL and negative caching, propagation delay; the DNSSEC chain of trust (DS record in the parent validates the child KSK → ZSK → RRSIG); DNS-over-HTTPS (port 443, RFC 8484) and DNS-over-TLS (port 853, RFC 7858); split-horizon DNS.
- **SMTP & Email Authentication** — the SMTP conversation (EHLO → MAIL FROM → RCPT TO → DATA → QUIT), MIME multipart encoding, MTA vs MDA; the anti-spoofing trio SPF (authorized-IP TXT record), DKIM (RSA signature over headers + body), and DMARC (alignment + policy none/quarantine/reject with aggregate/forensic reporting); BIMI brand indicators.
- **WebSocket & Server-Sent Events** — the WebSocket upgrade (HTTP 101 Switching Protocols, Sec-WebSocket-Key/Accept SHA-1 derivation), full-duplex framing (FIN/RSV/opcode/MASK/payload; opcodes 0x1 text, 0x2 binary, 0x8 close, 0x9/0xA ping/pong; clients always mask); SSE (text/event-stream with data: / id: / event: / retry: fields and automatic Last-Event-ID reconnection); WebSocket vs SSE vs long-polling trade-offs.
- **gRPC & Protocol Buffers** — protobuf binary encoding (field tag = (field_number << 3) | wire_type; wire types 0 varint / 1 64-bit / 2 length-delimited / 5 32-bit; zigzag for signed ints; typically 3–5× smaller than JSON); the four RPC patterns (unary, client-streaming, server-streaming, bidirectional) mapped onto HTTP/2 streams; metadata, deadlines/cancellation, interceptors, grpc-status codes; gRPC-Web for browsers and gRPC vs REST vs GraphQL.

**Key mental models:** HTTP/2 fixes application-layer HoL blocking, but one TCP loss still stalls every stream — only HTTP/3/QUIC isolates loss per stream at the transport; DNS TTL is the master dial trading failover speed against resolver load; never reuse a protobuf field number (retire it with reserved); prefer long-lived WebSocket/SSE connections with heartbeats over reconnecting per message.

---

## 04. Network Security

Security protects data in transit and controls who can reach what — at the perimeter and, increasingly, everywhere. This module runs from the cryptography of TLS 1.3 through firewalls, VPNs, DDoS defense, and zero trust.

**What's covered:**
- **TLS 1.3** — the 1-RTT handshake (ClientHello + key_share + supported_groups → ServerHello + key_share → the encrypted flight EncryptedExtensions/Certificate/CertificateVerify/Finished → client Finished → application data) vs 1.2's 2-RTT; 0-RTT early data and its replay risk; everything removed (RSA key exchange, static DH, CBC mode, RC4, SHA-1/MD5, compression, renegotiation); AEAD-only cipher suites (TLS_AES_128_GCM_SHA256, TLS_AES_256_GCM_SHA384, TLS_CHACHA20_POLY1305_SHA256); ECDHE forward secrecy and the HKDF-based key schedule; certificate-chain validation (leaf/intermediate/CA), OCSP stapling, SNI, HSTS, certificate pinning, and mTLS.
- **Firewalls & WAF** — stateless ACLs on the 5-tuple vs stateful connection tracking (conntrack states NEW/ESTABLISHED/RELATED/INVALID); next-generation firewalls (L7 deep packet inspection, application identity, TLS inspection); Web Application Firewalls (OWASP ModSecurity CRS) detecting SQLi/XSS/LFI/path-traversal; rate limiting at the WAF layer; AWS WAF / Cloudflare / ModSecurity.
- **DDoS Mitigation** — the attack taxonomy: volumetric (bandwidth exhaustion), protocol (SYN flood, ICMP flood), and application (HTTP flood, Slowloris); defenses including SYN cookies (encode connection state in the SYN-ACK sequence number so no backlog slot is held), token-bucket / leaky-bucket rate limiting, anycast dispersion plus scrubbing centers, and BGP blackhole routing (community 666); Cloudflare / AWS Shield / Akamai mitigation layers.
- **VPN Protocols** — WireGuard (~4000 LOC, in-kernel, UDP-only, Curve25519 ECDH + ChaCha20-Poly1305 + BLAKE2s, Noise-based 1-RTT handshake, cryptokey routing via AllowedIPs, peers identified by public key rather than IP:port); IPSec (AH vs ESP, IKEv2 key exchange, transport vs tunnel mode — tunnel for site-to-site); OpenVPN (TLS-based, TUN vs TAP, userspace and slower); site-to-site vs remote-access and split tunneling.
- **Zero Trust** — "never trust, always verify," assume breach, least privilege, and continuous verification replacing the perimeter model; identity-aware proxy vs VPN; Google BeyondCorp; device-trust posture signals; workload identity and service-to-service mTLS (SPIFFE/SPIRE SVIDs); policy engines (OPA/Rego); eBPF micro-segmentation (Cilium); SASE vs SSE; Cloudflare Access / Zscaler / Tailscale patterns.

**Key mental models:** TLS 1.3 buys a round trip and guarantees forward secrecy precisely by deleting every non-AEAD, non-ephemeral option; a stateful firewall only needs a rule for the first packet of a flow, and return traffic is admitted automatically; SYN cookies buy time against SYN floods but are no substitute for upstream scrubbing; zero trust moves the trust boundary off the network and onto verified identity plus device posture, re-checked on every request.

---

## 05. Wireless Networks

Wireless trades physical cable for a shared, noisy, interference-prone medium. Each family — Wi-Fi, cellular, LPWAN — picks a different point on the throughput/range/power/latency surface.

**What's covered:**
- **Wi-Fi 6/6E/7 (802.11ax/be)** — OFDMA subdividing a channel into resource units (26–996 subcarriers) so many clients share a single PPDU, eliminating per-client contention; MU-MIMO spatial multiplexing with beamforming; Target Wake Time (TWT) for roughly 100× IoT battery savings; BSS Coloring to defer only on same-color overlap; Wi-Fi 6E opening the 6 GHz band; Wi-Fi 7 Multi-Link Operation (simultaneous 2.4 + 5 + 6 GHz links), 4096-QAM, and 320 MHz channels (~46 Gbps theoretical vs Wi-Fi 6's ~9.6 Gbps); WPA3 (SAE, OWE) and 802.1X/EAP/RADIUS enterprise auth.
- **Bluetooth & BLE** — Classic BR/EDR (FHSS at 1600 hops/s over 79 channels, piconets, L2CAP/RFCOMM, A2DP audio); BLE (40 channels, 3 advertising channels 37/38/39, connection interval, GATT service → characteristic → descriptor hierarchy over the 23B-MTU ATT protocol); BLE mesh; BLE 5 features (2M PHY for 2× throughput, coded PHY S8 ≈ 125 kbps for ~1 km range); LE Secure Connections pairing and bonding.
- **5G Architecture** — 5G NR spectrum (sub-6 GHz FR1 vs mmWave FR2 at 28/39 GHz), massive MIMO and beamforming, gNB base stations, and O-RAN disaggregation (O-CU/O-DU/O-RU); the service-based 5G Core (AMF, SMF, UPF, PCF, UDM, AUSF, NRF) exposing HTTP/2 APIs over the SBI; network slicing (eMBB / URLLC / mMTC via S-NSSAI, each with isolated UPF and QoS); MEC edge compute; NSA vs SA deployment; URLLC targeting ≤ 1 ms latency.
- **LoRaWAN & IoT Protocols** — the LoRa chirp-spread-spectrum PHY (SF7–SF12 trading data rate for range and sensitivity, SF12 ≈ −137 dBm, ~154 dB link budget for ~15 km rural); LoRaWAN MAC (OTAA/ABP join, Class A/B/C devices, Adaptive Data Rate, and the 1% duty-cycle constraint); MQTT publish-subscribe (QoS 0/1/2, retained messages, Last Will and Testament); CoAP (UDP, REST-like, observe mode); Zigbee/802.15.4 mesh, Z-Wave, and Matter.
- **Interference & Spectrum Management** — the 2.4 / 5 / 6 GHz channel plans (only channels 1/6/11 are non-overlapping at 2.4 GHz), channel bonding (40/80/160 MHz), the hidden-node problem and RTS/CTS, CSMA/CA with binary exponential backoff, and RSSI/SNR/noise-floor measurement plus RF site surveys.

**Key mental models:** Spreading factor (and, for cellular, mmWave vs sub-6 GHz) is the universal range-versus-rate knob across wireless; OFDMA and MU-MIMO turn Wi-Fi from one-talker-at-a-time contention into scheduled parallel transmission; higher frequency means more bandwidth but shorter reach, so 6 GHz Wi-Fi and mmWave 5G are inherently short-range; for LPWAN it is duty-cycle and power budget, not raw throughput, that dominates design.

---

## 06. SDN & Cloud Networking

Software-defined networking decouples the control plane from the data plane so networks become programmable at scale — the model underneath cloud VPC fabrics, CDNs, and service meshes.

**What's covered:**
- **SDN (OpenFlow & P4)** — control-plane / data-plane / application-plane separation with a centralized controller holding the global view; OpenFlow flow tables (match fields + actions + priority + counters, with PACKET_IN / FLOW_MOD reactive programming); controllers (ONOS, OpenDaylight, Ryu); P4 for programmable parse → match-action → deparse pipelines (Tofino ASIC / bmv2, in-band network telemetry); and hardware acceleration via SR-IOV, DPDK kernel-bypass (14.88 Mpps at 64B frames per 10G NIC), and SmartNIC/DPU (NVIDIA BlueField) offload.
- **BGP & Internet Routing** — BGP path-vector routing over TCP port 179, AS numbers, iBGP (full mesh or route reflectors) vs eBGP (next-hop handling); attributes and the best-path order (WEIGHT → LOCAL_PREF → shortest AS_PATH → lowest ORIGIN → lowest MED → eBGP over iBGP → lowest IGP metric → lowest router-id); prefix-list / route-map / AS-path filtering; real hijacks (Pakistan Telecom 2008, Rostelecom 2020) and RPKI ROA/ROV as the defense; internet exchange points.
- **CDN & Anycast** — PoP placement at IXPs and anycast routing (the same prefix announced from many PoPs so each client reaches the nearest by shortest AS path and attack traffic is dispersed); the cache hierarchy (edge → regional → origin shield → origin), cache-key design, and invalidation (TTL vs event-based purge vs surrogate keys); origin pull vs push; edge compute (Cloudflare Workers, Lambda@Edge); and the hit-ratio HR = 1 − misses/requests that determines origin offload.
- **Service Mesh (Istio/Linkerd)** — the sidecar-proxy pattern (Envoy injected per pod, all traffic intercepted transparently via iptables); a control plane (istiod/Pilot) pushing xDS config (LDS/RDS/CDS/EDS/SDS) to the data plane; mTLS enforced via PeerAuthentication; traffic management (VirtualService weight-based canary plus DestinationRule load balancing and circuit breaking); observability (Envoy → Prometheus metrics, Zipkin/Jaeger tracing via propagated b3 headers); Linkerd as a lighter Rust-proxy alternative and ambient/sidecarless mesh; ~1 ms per-hop Envoy overhead.
- **Cloud VPC & Transit Gateways** — AWS VPC (a /16 supernet, per-AZ subnets, route tables, and Internet Gateway vs NAT Gateway vs egress-only IGW); non-transitive VPC Peering vs the hub-and-spoke Transit Gateway with per-security-domain route tables; PrivateLink for private SaaS endpoints; GCP VPC (global subnets, Shared VPC, Private Service Connect); Azure VNet peering and Virtual WAN; and SD-WAN integration.

**Key mental models:** Separate the control plane (centralized policy, global view) from the data plane (fast, simple forwarding) — the pattern recurs across SDN, BGP, and service meshes; BGP trusts whatever it is told, so RPKI and prefix filtering are mandatory, not optional; anycast plus caching are the two levers that convert physical distance into a local RTT; and plan non-overlapping RFC 1918 space before provisioning, or peering and VPN connections fail silently on CIDR overlap.

---

## Cross-Cutting Mental Models

These principles thread through every module and are the highest-yield ideas to internalize — they are also the most common interview and design-review talking points:

1. **Encapsulation and layering** — Each layer wraps the one above in its own header (Ethernet adds a trailer as well): data → segment → packet → frame → bits. This is why MSS = MTU − IP header − TCP header, why an MTU mismatch with the DF bit set silently black-holes traffic, and why the fastest way to diagnose an outage is to ask which layer is failing and isolate one layer at a time.

2. **End-to-end reliability over best-effort delivery** — IP, Ethernet, and Wi-Fi are all best-effort; reliability, ordering, and congestion control live at the transport edge (TCP, QUIC). Congestion control is a self-regulating feedback loop — AIMD probes for available bandwidth and backs off on loss, converging toward fair sharing with no central coordinator.

3. **The bandwidth-delay product and the RTT budget** — In-flight data is capped by BDP = bandwidth × RTT, and steady-state TCP throughput ≈ MSS / (RTT × √p) by the Mathis formula, where p is loss probability. Latency is denominated in round trips, so protocol evolution is largely a war on RTTs: TCP + TLS 1.2 costs 2 RTT before data, TLS 1.3 costs 1, and QUIC 0-RTT costs 0 on resumption — while anycast and CDNs attack the RTT itself.

4. **Control plane / data plane separation** — Decoupling how routes and policies are decided from how packets are actually forwarded is the organizing idea behind routing protocols, SDN/OpenFlow, and service meshes: a control plane (centralized, or distributed but converging) programs a fast, dumb data plane that does longest-prefix match or flow-table lookups at line rate.

5. **Security is never free, and trust is never implicit** — Encryption costs handshake round trips and CPU (QUIC's 0-RTT amortizes exactly this), so defense is layered rather than singular (SYN cookies, then WAF, then scrubbing, then mTLS), and the modern default is zero trust: authenticate and authorize the identity and device on every request instead of trusting anything by virtue of its position on the network.
