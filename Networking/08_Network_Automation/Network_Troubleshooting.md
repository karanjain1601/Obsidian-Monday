---
title: Network Troubleshooting
aliases: [Network Troubleshooting Methodology, Network Diagnostics, tcpdump, Wireshark]
tags: [Networking, NetworkAutomation, Troubleshooting, Diagnostics, Wireshark, tcpdump]
domain: Networking
difficulty: Intermediate
created: 2026-07-29
related: [Network_Automation_Overview, SNMP_and_Network_Monitoring, Routing_Fundamentals, OSPF_Protocol, BGP_Protocol]
status: complete
---

# Network Troubleshooting

> [!abstract] TL;DR
> Systematic network troubleshooting starts at the OSI model — identify which layer is failing before jumping to solutions. The toolkit spans from physical cable testers through ping/traceroute/mtr for reachability, tcpdump/Wireshark for packet capture, and show commands on Cisco devices. Document as you go; unknown state is the enemy.

---

## Troubleshooting Methodology

Two approaches: **bottom-up** (start at Layer 1, work up — best when physical problems are suspected) and **top-down** (start at Layer 7, work down — best when the app layer is known). **Divide and conquer** (start at Layer 3/4) is most efficient for intermittent issues.

Steps: (1) Define the problem, (2) Gather information, (3) Form a hypothesis, (4) Test — one variable at a time, (5) Implement fix and document, (6) Verify normal operation, (7) Write a runbook.

---

## Layer-by-Layer Checklist

| Layer | What to Check | Tools |
|-------|-------------|-------|
| L1 Physical | Cable, port LEDs, SFP, duplex/speed mismatch | Cable tester, show interface |
| L2 Data Link | MAC table, VLAN assignment, STP state | show mac address-table, show spanning-tree |
| L3 Network | IP addressing, subnet mask, routing table | ping, traceroute, show ip route |
| L4 Transport | TCP connection, port blocked by ACL/firewall | telnet host port, nc -zv, netstat |
| L7 Application | DNS resolution, HTTP codes, cert expiry | nslookup, curl -v, openssl s_client |

---

## Essential Diagnostic Commands

### Linux Host

Access denied. Option -c requires administrative privileges.
Server:  dns.google
Address:  8.8.8.8

DNS request timed out.
    timeout was 2 seconds.
Name:    example.com
Addresses:  2606:4700:10::ac42:93f3
	  2606:4700:10::6814:179a
	  172.66.147.243
	  104.20.23.154

<!doctype html><html lang="en"><head><title>Example Domain</title><link rel="icon" href="data:,"><meta name="viewport" content="width=device-width, initial-scale=1"><style>body{background:#eee;width:60vw;margin:15vh auto;font-family:system-ui,sans-serif}h1{font-size:1.5em}div{opacity:0.8}a:link,a:visited{color:#348}</style></head><body><div><h1>Example Domain</h1><p>This domain is for use in documentation examples without needing permission. Avoid use in operations.</p><p><a href="https://iana.org/domains/example">Learn more</a></p></div></body></html>
Access denied. Option -c requires administrative privileges.
notBefore=May 31 21:39:12 2026 GMT
notAfter=Aug 29 21:41:26 2026 GMT
subject=CN=example.com

### Cisco IOS



---

## Packet Capture with tcpdump



---

## Common Issues and Root Causes

| Symptom | Likely Cause | Diagnostic |
|---------|-------------|-----------|
| Latency jumps at hop N in traceroute | Link congestion between hops N-1 and N | mtr, SNMP interface utilization |
| Intermittent drops | Duplex mismatch, faulty cable | show interface — CRC errors, input drops |
| Routing loop (TTL expiry in traceroute) | Misconfigured static route | traceroute, show ip route |
| BGP neighbor down | ACL blocking TCP 179, MTU mismatch | show ip bgp summary, telnet peer 179 |
| OSPF stuck at EXSTART | MTU mismatch between OSPF neighbors | show ip ospf neighbor, ip ospf mtu-ignore |
| DNS resolution failures | DNS unreachable, NXDOMAIN | dig, check /etc/resolv.conf |
| TLS handshake failure | Expired cert, cipher mismatch, SNI missing | openssl s_client |

---

## Network Documentation Essentials

Every troubleshooting session should produce or update: (1) network diagram with IP addressing, (2) IP address plan and VLAN assignments, (3) change log with rollback plan, (4) runbook for recurring incidents, (5) updated baseline metrics.

---

## Common Pitfalls

1. **Changing multiple things at once** — you cannot tell which change fixed or broke things. One change, one test.
2. **Not testing from the affected host** — network behavior varies by source IP, VLAN, and routing path.
3. **Forgetting ACLs** — routing may work but ACLs silently drop packets; check show ip access-lists hit counts.
4. **Assuming the problem is the network** — verify at the application level first; DNS, database timeouts, and app bugs are often blamed on networking.
5. **Skipping documentation** — the same issue recurs without a written root cause and remediation.

---

## Related Concepts

- [[SNMP_and_Network_Monitoring]] — proactive baseline data accelerates troubleshooting
- [[BGP_Protocol]] — BGP neighbor state and prefix troubleshooting
- [[OSPF_Protocol]] — OSPF adjacency state machine and common failures
- [[Network_Automation_Overview]] — automated workflows reduce human error that causes incidents

---

## Review Questions

1. **Traceroute shows latency jump from 5ms at hop 3 to 150ms at hop 4, staying at 150ms for all subsequent hops. Where is the problem?**
   *Answer: The link between hop 3 and hop 4 (or the device at hop 4). The latency is consistent after hop 4 — it was introduced at that specific hop, not accumulating.*

2. **An OSPF neighbor is stuck in EXSTART/EXCHANGE. What are the two most common causes?**
   *Answer: (1) MTU mismatch — Database Description packets get fragmented; fix with ip ospf mtu-ignore or matching MTUs. (2) Duplicate Router IDs in the same OSPF area.*

3. **When do you prefer tcpdump -w capture.pcap over live analysis?**
   *Answer: When the issue is intermittent (capture the exact failure moment) or when traffic volume is too high to analyze in real time — save to pcap, then analyze in Wireshark with filtering after the fact.*

#Networking #Troubleshooting #tcpdump #Wireshark #NetworkDiagnostics
