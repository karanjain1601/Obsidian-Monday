# Cybersecurity: Introduction to All Topics

This document is a guided tour of the 6 modules in the Cybersecurity knowledge base — a production-focused reference for engineers and security practitioners who model threats, defend networks and web applications, apply cryptography correctly, run authorized offensive tests, and investigate incidents. The content targets staff-level engineers and blue/red-team practitioners, and covers the full attack-and-defense lifecycle from conceptual foundations through digital forensics and incident response.

**Suggested learning path:** Security Foundations → Network Security → Web Security → Applied Cryptography → Penetration Testing → Digital Forensics & IR

---

## 01. Security Foundations

The conceptual bedrock: what "protection" actually means, how to enumerate and prioritize threats systematically, and how to translate technical findings into business risk. Everything downstream references these models.

**What's covered:**
- **CIA Triad & Security Models** — Confidentiality/Integrity/Availability as explicit tradeoffs, not a checklist; Bell-LaPadula (no read up, no write down — confidentiality), Biba (integrity, the dual), Clark-Wilson (well-formed transactions, separation of duties), Brewer-Nash / Chinese Wall (dynamic conflict-of-interest); defense-in-depth; policy vs mechanism.
- **Threat Modeling** — STRIDE (Spoofing/Tampering/Repudiation/Info Disclosure/DoS/Elevation of Privilege) applied to data-flow diagrams and trust boundaries; PASTA seven-stage attacker simulation; attack trees; LINDDUN for privacy threats; scoring with DREAD and CVSS.
- **Attack Surface Analysis** — Attack surface ≈ entry points × assets × channels; digital/physical/social and supply-chain (dependency) surfaces; CVE/CWE taxonomy; automated mapping with Shodan, Censys, Amass; attack-surface reduction.
- **MITRE ATT&CK** — Tactics TA0001→TA0011 (Initial Access → Exfiltration/C2/Impact) as a palette, not a linear kill chain; technique → sub-technique → procedure hierarchy (T1059 → T1059.003 Windows Command Shell); Navigator coverage heat maps; detection-to-data-source mapping (Sysmon 1/10, Event 4104); threat-actor profiling (APT29/G0016, APT28, Lazarus); D3FEND countermeasures.
- **Risk Management & GRC** — Risk = Likelihood × Impact; qualitative vs quantitative assessment; NIST CSF (Identify/Protect/Detect/Respond/Recover), ISO 27001, SOC 2 Type II; vulnerability-management lifecycle with CVSS base vs environmental scoring and patch SLAs.

**Key mental models:** CIA is a set of explicit tradeoffs, not a maximize-all checklist; threat-model during design, not after architecture is frozen; risk = vulnerability × asset value × threat likelihood (a critical CVE in software you don't run is zero risk); never claim ATT&CK coverage for a technique whose data source you don't actually collect.

---

## 02. Network Security

Controls that protect data in transit and restrict unauthorized access — from packet filters to zero-trust identity — plus the forensic techniques that reconstruct an intrusion from captured traffic.

**What's covered:**
- **Firewalls & IDS/IPS** — Stateless → stateful (conntrack states NEW/ESTABLISHED/RELATED/INVALID) → NGFW (App-ID, TLS inspection); iptables/nftables first-match-wins ordering with default-deny; DMZ directionality (Internet→LAN is never direct); IDS (out-of-band tap/SPAN) vs inline IPS (drop/reset); Snort/Suricata rules (content/flow/sid/rev); signature vs anomaly and the base-rate fallacy (99% TPR, 1% FPR, 0.1% prior → ~91% of alerts false); fragmentation and TCP-overlap evasion.
- **VPN & Zero Trust** — IPsec tunnel vs transport mode (IKEv2, ESP, AH); WireGuard (Noise protocol, ChaCha20-Poly1305); SSL-VPN; Zero Trust "never trust, always verify"; ZTNA vs VPN, BeyondCorp, software-defined perimeter (SDP), SASE.
- **TLS/SSL** — TLS 1.3 (RFC 8446) 1-RTT handshake (ClientHello key_share → ServerHello → then-encrypted EncryptedExtensions/Certificate/CertificateVerify/Finished); HKDF-Extract/Expand key ladder bound to the transcript hash; AEAD-only record layer with sequence-derived nonces; chain validation (signature, validity, SAN over CN, key usage, revocation); OCSP stapling and Certificate Transparency (crt.sh); 0-RTT replay risk (idempotent GETs only); removed: static RSA, CBC, renegotiation, compression.
- **DNS Security** — DNSSEC (ZSK/KSK, RRSIG, DS records, chain of trust — integrity/authenticity only, not privacy); DoH and DoT for privacy; DNS tunneling/exfiltration; DNS rebinding; split-horizon; RPZ; email DNS (SPF/DKIM/DMARC).
- **Network Forensics** — Wireshark/tshark display filters; full-packet pcap vs flow-level NetFlow/IPFIX; HTTP/TLS session reassembly; JA3/JA3S fingerprinting and domain-generation-algorithm hunting; tcpdump one-liners; timeline reconstruction.

**Key mental models:** Castle-and-moat perimeter fails against phishing and insiders — authenticate and authorize every request regardless of network location (Zero Trust); every TLS 1.3 key exchange is ephemeral (EC)DHE, so forward secrecy is structural; disabling certificate verification turns encryption into an authenticated-to-nobody channel any on-path attacker can MITM; DNSSEC ≠ privacy (use DoH/DoT); place sensors on east-west segments, not just the perimeter.

---

## 03. Web Security

Web applications are the most common attack surface in modern organizations. The OWASP Top 10 taxonomy anchors this module, with deep dives into injection, XSS/CSRF, and the auth protocols most often misconfigured.

**What's covered:**
- **OWASP Top 10 (2021)** — A01 Broken Access Control (now #1, present in ~94% of tested apps; IDOR, deny-by-default), A02 Cryptographic Failures, A03 Injection (now folds in XSS), A04 Insecure Design (survey-driven), A05 Security Misconfiguration (XXE merged in), A06 Vulnerable & Outdated Components (Log4Shell / CVE-2021-44228, SBOM/SCA), A07 Identification & Auth Failures, A08 Software & Data Integrity Failures (insecure deserialization, SolarWinds), A09 Logging & Monitoring Failures, A10 SSRF (169.254.169.254 cloud metadata); ranked by incidence rate rather than raw frequency.
- **XSS & CSRF** — Reflected/stored/DOM-based XSS; textContent over innerHTML, DOMPurify sanitization; Content-Security-Policy and its bypasses; SameSite cookie attribute (Strict/Lax/None); CSRF token validation, double-submit cookie, origin checking.
- **SQL & NoSQL Injection** — Error-based, boolean- and time-based blind, UNION extraction, second-order (stored) injection; parameterized queries/prepared statements as the real fix (parameterize at every execution point); ORM false safety; WAF-bypass encoding/comments/case; NoSQL (MongoDB `$where`, operator injection); GraphQL injection.
- **JWT & OAuth 2.0** — JWT header.payload.signature; the `alg:none` attack; RS256↔HS256 key confusion / algorithm-confusion attack; expiry bypass; OAuth flows (authorization code + PKCE, client credentials, deprecated implicit); redirect_uri validation bypass; CSRF on the OAuth callback; token leakage via Referer; PKCE downgrade.
- **API Security & GraphQL** — IDOR/BOLA vs BFLA, mass assignment, rate limiting; OpenAPI/Swagger exposure; GraphQL introspection disclosure; nested-query DoS (depth/complexity limits); batching attacks; field-level authorization; OWASP API Security Top 10.

**Key mental models:** Client-side validation is UX only — always validate, authorize, and enforce on the server, deny by default, and scope every object lookup to the authenticated principal (`WHERE id = ? AND owner_id = ?`); parameterize at every SQL execution point, including second-order paths; store session tokens in HttpOnly/Secure/SameSite cookies, never localStorage; verify `iss` and `sub` together; a WAF is defense-in-depth, not a fix.

---

## 04. Applied Cryptography

The mathematical foundation of every security guarantee: the symmetric and asymmetric primitives in daily use, how they compose into TLS 1.3, and what the post-quantum transition demands of existing deployments.

**What's covered:**
- **Symmetric Encryption** — AES round function (SubBytes S-box = multiplicative inverse in GF(2⁸) + affine → confusion; ShiftRows + MixColumns → diffusion; AddRoundKey), 10/12/14 rounds for 128/192/256; modes: ECB (never — the "penguin"), CBC (random unpredictable IV; padding oracles POODLE/Lucky13), CTR (no integrity), GCM (CTR + GHASH over GF(2¹²⁸), AEAD); ChaCha20-Poly1305 (constant-time, no S-box lookups); nonce reuse is catastrophic (C₁ ⊕ C₂ = P₁ ⊕ P₂, and GCM leaks the GHASH subkey H → forgery, the "forbidden attack"); KDFs (PBKDF2 ≥ 600k iters, bcrypt = 2^cost, scrypt, Argon2id memory-hard, HKDF); Encrypt-then-MAC over MAC-then-Encrypt.
- **Asymmetric & PKI** — RSA (n = pq, e = 65537, d ≡ e⁻¹ mod φ(n); textbook RSA is deterministic and malleable; PKCS#1 v1.5 → Bleichenbacher/ROBOT padding oracle; use OAEP to encrypt, PSS to sign); ECC (P-256, Curve25519/X25519, Ed25519 with deterministic RFC 6979 nonces — a 256-bit curve ≈ 128-bit security ≈ RSA-3072); ECDSA nonce reuse fully recovers the private key; X.509/ASN.1 DER (match SAN not CN; Basic Constraints CA:FALSE); root → intermediate → leaf chain; CRL vs OCSP soft-fail; SPKI pinning (HPKP deprecated — "HPKP suicide").
- **Hash Functions & MACs** — Preimage/second-preimage ≈ 2ⁿ but collisions only ≈ 2^(n/2) by the birthday bound (256-bit → 128-bit); MD5/SHA-1 collision-broken (SHAttered ≈ 2⁶³); Merkle–Damgård length-extension flaw breaks H(k ∥ m); Keccak sponge (SHA-3) is structurally immune; HMAC = H((k ⊕ opad) ∥ H((k ⊕ ipad) ∥ m)); BLAKE3 parallel Merkle tree; slow memory-hard password hashing; MAC vs signature (non-repudiation) vs AEAD.
- **TLS 1.3 Protocol** — Full handshake with key_share; key schedule early_secret → handshake_secret → master_secret via HKDF; 0-RTT early data and its replay window; TLSPlaintext → TLSCiphertext record layer; forward-secrecy guarantee; JA3/JA3S fingerprinting.
- **Post-Quantum Cryptography** — Shor (period-finding via QFT, ~O(log³N)) breaks RSA/(EC)DH/ECDSA outright; Grover (O(√N) = O(2^(n/2))) only halves symmetric security (AES-256, SHA-384 stay safe — just double sizes); "harvest now, decrypt later"; lattice MLWE (b = As + e mod q); CRYSTALS-Kyber (ML-KEM, FIPS 203), CRYSTALS-Dilithium (ML-DSA, FIPS 204), SPHINCS+ (SLH-DSA, FIPS 205 — hash-only conservative hedge), Falcon; hybrid X25519MLKEM768; crypto agility.

**Key mental models:** Never ECB, never reuse an AEAD nonce (GCM reuse forfeits the authentication key → forgery, not just one message); never roll your own crypto — use vetted libraries (libsodium, BouncyCastle); use HMAC (not bare H(k ∥ m)) and Argon2id for passwords; compare tags in constant time; Grover only halves symmetric security so don't panic on AES-256 — but Shor breaks every deployed public-key scheme, so migrate long-lived secrets to hybrid PQC now.

---

## 05. Penetration Testing

Authorized adversarial simulation across the full engagement lifecycle — scope, reconnaissance, exploitation, escalation, lateral movement, and a deliverable that actually drives remediation.

**What's covered:**
- **Reconnaissance & OSINT** — Passive (Shodan, Censys, WHOIS, Certificate Transparency/crt.sh, LinkedIn/GitHub dorking, theHarvester) vs active (Nmap host/port/service/OS discovery, Masscan, Nessus); DNS enumeration (zone transfer, subdomain brute-force via amass/subfinder); web crawling (httprobe, waybackurls); recon-ng framework.
- **Exploitation Techniques** — Metasploit (search/use/set/run; staged vs stageless payloads; Meterpreter); searchsploit/Exploit-DB; buffer overflow and RCE; web exploitation (SQLmap, Burp Suite Professional, XSStrike); password attacks (Hashcat modes, John the Ripper, credential stuffing); phishing (GoPhish).
- **Privilege Escalation** — The enumerate → find misconfig → abuse → re-enumerate loop (LinPEAS/WinPEAS); Linux (SUID/SGID + GTFOBins shell escapes, `sudo -l` NOPASSWD, writable `$PATH`, world-writable cron, cap_setuid/cap_dac_override, Docker-socket/`--privileged` container escape); Windows (SeImpersonatePrivilege "potato" chains, AlwaysInstallElevated, unquoted service paths, DLL hijacking, weak service ACLs); mapped to ATT&CK T1548/T1134/T1574/T1611.
- **Post-Exploitation & Lateral Movement** — Persistence (Run keys T1547.001, scheduled tasks/Event 4698, WMI subscriptions, web shells, service creation/7045); credential harvesting (LSASS/SAM, Mimikatz, secretsdump.py, LaZagne); lateral movement (PsExec, WMI exec, Pass-the-Hash, Overpass-/Pass-the-Ticket Kerberos, BloodHound shortest-path-to-Domain-Admin); C2 (Cobalt Strike, Sliver, Havoc — beacon jitter, JA3, DNS tunneling); OPSEC and SOC deconfliction.
- **Report Writing & Methodology** — PTES, OWASP Testing Guide, NIST SP 800-115; written scope and rules of engagement; severity via CVSS plus business context; executive summary vs technical narrative; reproducible PoC (Burp request/response captures, repro scripts); retest and attestation.

**Key mental models:** Get written authorization and a defined scope before touching anything — out-of-scope scanning is legal exposure; demonstrate the full chain (access → escalation → lateral movement → business-critical data), not just a foothold; exhaust misconfiguration paths before crash-prone kernel exploits; pair every finding with its specific hardening step and reproducible evidence (a screenshot is not proof); every offensive technique writes telemetry somewhere — read the attack as a detection to-do list.

---

## 06. Digital Forensics & Incident Response

Detecting incidents, preserving evidence under legal chain of custody, reconstructing what happened, and recovering — from RAM acquisition through malware sandboxing to the incident-response playbook.

**What's covered:**
- **DFIR Methodology** — NIST SP 800-61 lifecycle (Preparation → Detection → Containment → Eradication → Recovery → Lessons Learned); chain of custody; order of volatility (RAM/network state before disk/logs); acquisition with write blockers and forensic imaging (dd, FTK Imager); triage vs full forensics; legal holds.
- **Memory Forensics** — Acquire to a separate drive (WinPmem → .raw/.aff4; LiME kernel module on Linux); Volatility 3 workflow (pslist vs psscan cross-view to catch DKOM-unlinked processes, pstree for bad parentage, malfind for private RWX non-file-backed injection, netscan for live C2, cmdline, handles for mutex IOCs); process-hollowing indicators; VAD analysis; LSASS credential extraction (hashdump/lsadump/cachedump).
- **Log Analysis & SIEM** — Critical Windows Event IDs (4624 logon + Logon Type 3=network/10=RDP/2=interactive/9=NewCredentials, 4625 spray, 4688 process creation with command-line auditing, 4720/4728 account+group changes, 7045 service install, 1102 log cleared); Linux auditd, /var/log/auth.log, binary wtmp/btmp; Splunk SPL, Elastic EQL sequences, vendor-neutral Sigma → sigmac; Beats → Logstash → Elasticsearch → Kibana pipeline; z = (x − μ)/σ anomaly with |z| > 3.
- **Malware Analysis** — Static (strings, PE import-table analysis, YARA rules, PEStudio, Detect-It-Easy) vs dynamic (Cuckoo, Any.Run, REMnux, Procmon, Wireshark); anti-analysis (packing, obfuscation, VM/timing detection); IOC extraction (IP/domain/hash/mutex/registry keys); families (RATs, ransomware, rootkits, wipers).
- **IR Playbooks** — Playbook structure (trigger → triage → containment → evidence collection → eradication → recovery → post-mortem); scenario playbooks (ransomware, data exfiltration, web shell, Business Email Compromise); tabletop exercises; toolkits (KAPE triage, Velociraptor remote IR, TheHive case management); Purple Team exercises.

**Key mental models:** Never reboot a live compromised host before capturing RAM — volatile evidence (processes, sockets, decryption keys) is gone forever; always cross-view pslist against psscan to expose DKOM hiding; logs on the compromised host are untrustworthy, so ship them off-host to a write-once SIEM in real time; if LSASS was dumped, assume every credential used on that host is compromised and rotate them all; complete root-cause analysis before eradication or you reinfect within hours; never baseline over a window that already contains the attacker.

---

## Cross-Cutting Mental Models

These principles thread through every module and separate a real defender or operator from a checklist-follower:

1. **Defense in depth, deny by default** — No single control holds. Layer independent controls (segmentation, server-side authorization, AEAD, EDR, centralized logging) and fail closed. Broken Access Control tops the OWASP list precisely because one missing server-side check defeats everything upstream of it.

2. **Map every attack to its telemetry, and every detection to a real data source** — ATT&CK "coverage" is a lie if the log source is disabled. Every technique — privilege escalation, lateral movement, C2 beaconing — writes evidence somewhere (Sysmon, Windows Event IDs, JA3, NetFlow); detection engineering is the discipline of collecting and correlating it, then tuning against a clean baseline.

3. **Risk = likelihood × impact, in context** — A critical CVSS score on an air-gapped box is low actual risk; a medium score on an internet-facing service is high. Contextualize by network reachability, asset value, authentication required, and compensating controls — never treat the CVSS base score as the risk score.

4. **Cryptography fails at the edges, not in the math** — AES and SHA-256 are not broken; deployments are. ECB mode, reused nonces, missing certificate validation, home-rolled primitives, non-constant-time comparisons, and padding oracles are where real breaks live. Use vetted libraries and AEAD, and build crypto agility for the post-quantum migration.

5. **Assume breach — preserve evidence, then find root cause** — Sophisticated attackers move laterally before you detect them, so scope the incident broadly. Capture volatile evidence before any containment that risks power, keep off-host tamper-evident logs, and eradicate only after full root-cause analysis identifies every persistence mechanism — then harden the specific path (D3FEND) so it cannot be reused.
