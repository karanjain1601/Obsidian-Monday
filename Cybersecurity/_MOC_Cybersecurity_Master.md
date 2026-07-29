---
title: Cybersecurity Master MOC
aliases: [Cybersecurity Hub, Security MOC]
tags: [Cybersecurity, MOC, Master]
domain: Cybersecurity
created: 2026-07-26
status: complete
---

# 🛡️ Cybersecurity Master Map of Content

> [!abstract] Vault Overview
> A comprehensive cybersecurity knowledge vault spanning security foundations, network defence, web application security, applied cryptography, penetration testing, digital forensics/IR, cloud security, identity & authentication, endpoint security, cyber threat intelligence, and AI red teaming. Designed for security engineers, pentesters, and defenders from intermediate to advanced level.

---

## Vault Architecture

```mermaid
graph TD
    MASTER["🛡️ Cybersecurity Master MOC"]

    MASTER --> F01["01 Security Foundations"]
    MASTER --> F02["02 Network Security"]
    MASTER --> F03["03 Web Security"]
    MASTER --> F04["04 Applied Cryptography"]
    MASTER --> F05["05 Penetration Testing"]
    MASTER --> F06["06 DFIR"]
    MASTER --> F07["07 Cloud Security"]
    MASTER --> F08["08 Identity & Authentication"]
    MASTER --> F09["09 Endpoint Security"]
    MASTER --> F10["10 Threat Intelligence"]
    MASTER --> F11["AI Red Teaming"]

    F01 --> CIA["CIA Triad & Models"]
    F01 --> TM["Threat Modeling"]
    F01 --> MITRE["MITRE ATT&CK"]
    F01 --> GRC["Risk & GRC"]
    F01 --> ASA["Attack Surface Analysis"]

    F02 --> FW["Firewalls & IDS/IPS"]
    F02 --> VPN["VPN & Zero Trust"]
    F02 --> TLS["TLS & SSL"]
    F02 --> DNS["DNS Security"]
    F02 --> NF["Network Forensics"]

    F03 --> OWASP["OWASP Top 10"]
    F03 --> XSS["XSS & CSRF"]
    F03 --> SQLI["SQL/NoSQL Injection"]
    F03 --> JWT["JWT & OAuth"]
    F03 --> API["API Security"]

    F04 --> SYM["Symmetric Encryption"]
    F04 --> ASYM["Asymmetric & PKI"]
    F04 --> HASH["Hashes & MACs"]
    F04 --> TLSP["TLS Protocol Deep Dive"]
    F04 --> PQC["Post-Quantum Crypto"]

    F05 --> RECON["Recon & OSINT"]
    F05 --> EXPLOIT["Exploitation"]
    F05 --> PRIVESC["Privilege Escalation"]
    F05 --> POSTEX["Post-Exploitation"]
    F05 --> REPORT["Report Writing"]

    F06 --> DFIR["DFIR Methodology"]
    F06 --> MEM["Memory Forensics"]
    F06 --> LOG["Log Analysis & SIEM"]
    F06 --> MAL["Malware Analysis"]
    F06 --> IRP["IR Playbooks"]

    F07 --> CLOUDFUND["Cloud Security Fundamentals"]
    F07 --> AWSSEC["AWS Security"]
    F07 --> GCPAZ["GCP & Azure Security"]
    F07 --> K8SSEC["Container & K8s Security"]
    F07 --> CLOUDIAM["Cloud Identity & Access"]
    F07 --> CSPM2["CSPM & Compliance"]

    F08 --> AUTHPROT["Authentication Protocols"]
    F08 --> SSOFED["SSO & Federation"]
    F08 --> DIRSVCS["Directory Services"]
    F08 --> MFA4["Multi-Factor Auth"]
    F08 --> PKICERT["PKI & Certificates"]
    F08 --> PAM2["PAM & Privileged Access"]

    F09 --> EPOVER["Endpoint Security Overview"]
    F09 --> AVEDR["AV & EDR"]
    F09 --> OSHRD["OS Hardening"]
    F09 --> DLPD["DLP & Data Protection"]
    F09 --> APPCTL["Application Control"]

    F10 --> CTIOV["CTI Overview"]
    F10 --> OSINT2["OSINT Techniques"]
    F10 --> SIEM2["SIEM & SOAR"]
    F10 --> HUNT["Threat Hunting"]
    F10 --> IOC["Indicators of Compromise"]

    F11 --> AIRT["AI RT Overview"]
    F11 --> PINJ["Prompt Injection"]
    F11 --> LLMV["LLM Vuln Assessment"]
    F11 --> ADML["Adversarial ML"]
    F11 --> ARTM["AI RT Methodology"]

    style MASTER fill:#1a1a2e,color:#fff
    style F01 fill:#16213e,color:#eee
    style F02 fill:#0f3460,color:#eee
    style F03 fill:#533483,color:#eee
    style F04 fill:#e94560,color:#fff
    style F05 fill:#f5a623,color:#111
    style F06 fill:#2ecc71,color:#111
    style F07 fill:#0d7377,color:#fff
    style F08 fill:#323232,color:#eee
    style F09 fill:#6a1040,color:#eee
    style F10 fill:#1b4332,color:#eee
    style F11 fill:#7f1d1d,color:#eee
```

---

## Sections Overview

| # | Section | Notes | Key Topics | Difficulty |
|---|---------|-------|------------|------------|
| 01 | [[01_Security_Foundations/_MOC_Security_Foundations\|Security Foundations]] | 5 | CIA, STRIDE, ATT&CK, GRC, CVE | Beginner–Intermediate |
| 02 | [[02_Network_Security/_MOC_Network_Security\|Network Security]] | 5 | Firewalls, VPN, TLS, DNS, NetForensics | Intermediate |
| 03 | [[03_Web_Security/_MOC_Web_Security\|Web Security]] | 5 | OWASP Top 10, XSS, SQLi, JWT, APIs | Intermediate |
| 04 | [[04_Applied_Cryptography/_MOC_Applied_Cryptography\|Applied Cryptography]] | 5 | AES, RSA/ECC, MACs, TLS 1.3, PQC | Advanced |
| 05 | [[05_Penetration_Testing/_MOC_Penetration_Testing\|Penetration Testing]] | 5 | OSINT, Exploitation, PrivEsc, C2, Reports | Advanced |
| 06 | [[06_Digital_Forensics_IR/_MOC_DFIR\|Digital Forensics & IR]] | 5 | NIST IR, Memory, SIEM, Malware, Playbooks | Advanced |
| 07 | [[07_Cloud_Security/_MOC_Cloud_Security\|Cloud Security]] | 6 | Shared Responsibility, AWS/GCP/Azure, K8s, IAM, CSPM | Intermediate–Advanced |
| 08 | [[08_Identity_and_Authentication/_MOC_Identity_and_Authentication\|Identity & Authentication]] | 6 | Kerberos, SAML/OIDC, AD, MFA/FIDO2, PKI, PAM | Intermediate–Advanced |
| 09 | [[09_Endpoint_Security/_MOC_Endpoint_Security\|Endpoint Security]] | 5 | AV/EDR, OS Hardening, DLP, AppLocker/WDAC, Credential Guard | Intermediate–Advanced |
| 10 | [[10_Threat_Intelligence/_MOC_Threat_Intelligence\|Threat Intelligence]] | 5 | CTI lifecycle, OSINT, SIEM/SOAR, Threat Hunting, IoCs/YARA | Intermediate–Advanced |
| 11 | [[AI_Red_Teaming/_MOC_AI_Red_Teaming\|AI Red Teaming]] | 5 | OWASP LLM Top 10, Prompt Injection, Adversarial ML, PyRIT, Garak | Advanced |

---

## Learning Paths

### Path A — Security Analyst (Blue Team)
1. [[01_Security_Foundations/CIA_Triad_and_Security_Models|CIA Triad]] → [[01_Security_Foundations/Threat_Modeling|Threat Modeling]] → [[01_Security_Foundations/MITRE_ATT_CK|MITRE ATT&CK]]
2. [[02_Network_Security/Firewalls_and_IDS_IPS|Firewalls & IDS/IPS]] → [[02_Network_Security/TLS_and_SSL|TLS]] → [[02_Network_Security/DNS_Security|DNS Security]]
3. [[06_Digital_Forensics_IR/DFIR_Methodology|DFIR Methodology]] → [[06_Digital_Forensics_IR/Log_Analysis_and_SIEM|Log Analysis & SIEM]] → [[06_Digital_Forensics_IR/IR_Playbooks|IR Playbooks]]

### Path B — Penetration Tester (Red Team)
1. [[01_Security_Foundations/Attack_Surface_Analysis|Attack Surface]] → [[05_Penetration_Testing/Reconnaissance_and_OSINT|Recon & OSINT]]
2. [[05_Penetration_Testing/Exploitation_Techniques|Exploitation]] → [[05_Penetration_Testing/Privilege_Escalation|Privilege Escalation]] → [[05_Penetration_Testing/Post_Exploitation_and_Lateral_Movement|Post-Exploitation]]
3. [[03_Web_Security/OWASP_Top_10|OWASP Top 10]] → [[03_Web_Security/SQL_and_NoSQL_Injection|SQLi]] → [[03_Web_Security/JWT_and_OAuth|JWT/OAuth]]

### Path C — Security Engineer (Cryptography Focus)
1. [[04_Applied_Cryptography/Symmetric_Encryption|Symmetric Encryption]] → [[04_Applied_Cryptography/Asymmetric_Cryptography_and_PKI|Asymmetric & PKI]]
2. [[04_Applied_Cryptography/Hash_Functions_and_MACs|Hashes & MACs]] → [[04_Applied_Cryptography/TLS_Protocol_Deep_Dive|TLS Deep Dive]]
3. [[02_Network_Security/TLS_and_SSL|TLS Handshake]] → [[04_Applied_Cryptography/Post_Quantum_Cryptography|Post-Quantum Crypto]]

### Path D — SOC Analyst / Threat Intel Analyst

1. [[01_Security_Foundations/MITRE_ATT_CK|MITRE ATT&CK]] → [[09_Endpoint_Security/Endpoint_Security_Overview|Endpoint Security Overview]] → [[09_Endpoint_Security/Antivirus_and_EDR|AV & EDR]]
2. [[10_Threat_Intelligence/Threat_Intelligence_Overview|CTI Overview]] → [[10_Threat_Intelligence/OSINT_Techniques|OSINT Techniques]] → [[10_Threat_Intelligence/Indicators_of_Compromise|IoCs & YARA]]
3. [[10_Threat_Intelligence/SIEM_and_SOAR|SIEM & SOAR]] → [[10_Threat_Intelligence/Threat_Hunting|Threat Hunting]]

### Path E — Full-Spectrum (16 weeks)
Foundations (2w) → Network Security (2w) → Web Security (2w) → Cryptography (2w) → Pentest (2w) → DFIR (2w) → Endpoint Security (2w) → Threat Intelligence (2w)

---

## Cross-Vault Links

| Related Vault | Connection |
|---------------|------------|
| [[../System Design/_MOC_SystemDesign_Master|System Design]] | Zero Trust architecture, secure API design patterns |
| [[../Database/_MOC_Database_Master|Database]] | SQL injection context, encryption at rest, access controls |
| [[../AI-ML/_MOC_AI_ML_Master|AI/ML]] | Adversarial ML, LLM security, AI-assisted threat detection, alignment context for AI red teaming |

---

## Section MOC Index

- [[01_Security_Foundations/_MOC_Security_Foundations|01 Security Foundations MOC]]
- [[02_Network_Security/_MOC_Network_Security|02 Network Security MOC]]
- [[03_Web_Security/_MOC_Web_Security|03 Web Security MOC]]
- [[04_Applied_Cryptography/_MOC_Applied_Cryptography|04 Applied Cryptography MOC]]
- [[05_Penetration_Testing/_MOC_Penetration_Testing|05 Penetration Testing MOC]]
- [[06_Digital_Forensics_IR/_MOC_DFIR|06 DFIR MOC]]
- [[07_Cloud_Security/_MOC_Cloud_Security|07 Cloud Security MOC]]
- [[08_Identity_and_Authentication/_MOC_Identity_and_Authentication|08 Identity & Authentication MOC]]
- [[09_Endpoint_Security/_MOC_Endpoint_Security|09 Endpoint Security MOC]]
- [[10_Threat_Intelligence/_MOC_Threat_Intelligence|10 Threat Intelligence MOC]]
- [[AI_Red_Teaming/_MOC_AI_Red_Teaming|11 AI Red Teaming MOC]]

---

## Key Frameworks at a Glance

| Framework | Purpose | Notes |
|-----------|---------|-------|
| MITRE ATT&CK | Adversary TTP taxonomy | TA0001–TA0011 tactics |
| NIST CSF | Risk management lifecycle | Identify/Protect/Detect/Respond/Recover |
| OWASP Top 10 | Web vuln ranking | Updated 2021 |
| CVSS v3.1 | Vulnerability scoring | Base/Temporal/Environmental |
| NIST SP800-61 | IR lifecycle | Prep→Detect→Contain→Eradicate→Recover |
| PTES | Pentest standard | 7 phases |

#Cybersecurity #MOC #Master
