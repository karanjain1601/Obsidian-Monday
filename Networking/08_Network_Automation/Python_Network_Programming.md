---
title: "Python Network Programming"
aliases: ["Netmiko", "NAPALM", "Nornir", "Scapy", "Python Networking Libraries"]
tags: [Networking, network-automation, python]
domain: Networking
difficulty: Intermediate
created: 2026-07-29
related: ["[[Network_Automation_Overview]]", "[[Ansible_for_Networks]]", "[[Network_Troubleshooting]]"]
status: complete
---

# Python Network Programming

> [!abstract] TL;DR
> Four Python libraries dominate network automation: **Netmiko** (SSH to any device, sends CLI commands), **NAPALM** (unified multi-vendor API — get facts, compare and commit configs), **Nornir** (parallel task execution framework with inventory management), and **Scapy** (craft, send, capture, and analyze packets at any layer). Together they cover 95% of network automation needs: Netmiko for quick CLI tasks, NAPALM for structured multi-vendor operations, Nornir for running tasks at scale, and Scapy for testing and research.

## Netmiko — SSH for Network Devices

Netmiko wraps Paramiko SSH with network device-specific handling: command prompts, pagination, privilege escalation, config mode entry.

### Basic Connection and Commands

```python
from netmiko import ConnectHandler

# Device dictionary
cisco_router = {
    "device_type": "cisco_ios",
    "host": "192.168.1.1",
    "username": "admin",
    "password": "S3cretPass",
    "secret": "EnablePass",    # enable password
}

# Context manager handles connect/disconnect cleanly
with ConnectHandler(**cisco_router) as conn:
    # Enter enable mode
    conn.enable()

    # send_command: waits for prompt, handles --More-- pagination
    output = conn.send_command("show ip route")
    print(output)

    # send_command with TextFSM structured output (returns list of dicts)
    routes = conn.send_command("show ip route", use_textfsm=True)
    for route in routes:
        print(f"Network: {route['network']}, Next-Hop: {route['nexthop']}")
```

### Sending Configuration

```python
with ConnectHandler(**cisco_router) as conn:
    conn.enable()

    # send_config_set: enters config mode, sends commands, exits config mode
    config_commands = [
        "interface GigabitEthernet0/1",
        "description Uplink to Distribution",
        "ip address 10.0.1.1 255.255.255.252",
        "no shutdown",
    ]
    output = conn.send_config_set(config_commands)
    print(output)

    # Save config
    conn.save_config()

    # Send config from a file
    output = conn.send_config_from_file("configs/router1_ospf.txt")
```

### Multi-Device Loop with Netmiko

```python
import yaml
from netmiko import ConnectHandler
from concurrent.futures import ThreadPoolExecutor

def collect_version(device_info):
    try:
        with ConnectHandler(**device_info) as conn:
            version = conn.send_command("show version", use_textfsm=True)
            return {"host": device_info["host"], "version": version[0]["version"]}
    except Exception as e:
        return {"host": device_info["host"], "error": str(e)}

with open("inventory.yml") as f:
    devices = yaml.safe_load(f)["devices"]

# Parallel collection across all devices
with ThreadPoolExecutor(max_workers=10) as pool:
    results = list(pool.map(collect_version, devices))

for r in results:
    print(r)
```

### Supported Device Types (Selected)

| device_type | Vendor/OS |
|-------------|-----------|
| `cisco_ios` | Cisco IOS / IOS-XE |
| `cisco_nxos` | Cisco NX-OS |
| `cisco_xr` | Cisco IOS-XR |
| `juniper_junos` | Juniper JunOS |
| `arista_eos` | Arista EOS |
| `paloalto_panos` | Palo Alto PAN-OS |
| `linux` | Linux servers |
| `autodetect` | Auto-detect device type |

## NAPALM — Unified Multi-Vendor API

NAPALM (Network Automation and Programmability Abstraction Layer with Multivendor support) provides a unified API that abstracts vendor differences. The same Python code works across Cisco IOS, JunOS, EOS, and NX-OS.

### Getting Facts and Interface Data

```python
import napalm

# Initialize driver for the vendor
driver = napalm.get_network_driver("ios")

device = driver(
    hostname="192.168.1.1",
    username="admin",
    password="S3cretPass",
    optional_args={"secret": "EnablePass"},
)

device.open()

# get_facts: hostname, vendor, model, serial, OS version, uptime, interfaces
facts = device.get_facts()
print(f"Hostname: {facts['hostname']}")
print(f"Model: {facts['model']}, OS: {facts['os_version']}")

# get_interfaces: returns dict with speed, duplex, IP, MAC, description
interfaces = device.get_interfaces()
for iface, details in interfaces.items():
    if details["is_up"]:
        print(f"{iface}: {details['speed']} Mbps, {details['description']}")

# get_bgp_neighbors: all BGP peers with state, prefixes received/sent
bgp = device.get_bgp_neighbors()
for vrf, data in bgp.items():
    for peer_ip, peer_data in data["peers"].items():
        print(f"Peer {peer_ip}: {peer_data['description']}, "
              f"State: {'UP' if peer_data['is_up'] else 'DOWN'}")

device.close()
```

### Compare Config and Commit Workflow

NAPALM's killer feature: **compare, review, commit or discard** — like a database transaction for network config.

```python
device.open()

# Load candidate configuration (merge with existing, or replace)
device.load_merge_candidate(filename="configs/new_ospf.cfg")
# or: device.load_replace_candidate(filename="configs/full_router.cfg")

# Compare: shows diff between running config and candidate
diff = device.compare_config()
if diff:
    print("Configuration diff:")
    print(diff)
    
    # Review diff, then decide
    confirm = input("Apply changes? (yes/no): ")
    if confirm.lower() == "yes":
        device.commit_config()    # atomic apply
        print("Configuration committed.")
    else:
        device.discard_config()   # throw away candidate
        print("Changes discarded.")
else:
    print("No changes needed.")
    device.discard_config()

device.close()
```

### Additional NAPALM Getters

```python
# get_route_to: routing table entries for a specific prefix
routes = device.get_route_to("10.0.0.0/8")

# get_arp_table: ARP cache entries
arp = device.get_arp_table()

# get_lldp_neighbors: LLDP neighbor discovery
lldp = device.get_lldp_neighbors_detail()

# get_environment: CPU, memory, fans, temperature, power
env = device.get_environment()
print(f"CPU: {env['cpu'][0]['%usage']}%")
print(f"Memory free: {env['memory']['available_ram']} bytes")
```

## Nornir — Parallel Task Execution Framework

Nornir is a pure Python automation framework (not a CLI tool). It provides inventory management and parallel task execution — think "Ansible in Python, with full Python control."

### Inventory and Initialization

```python
from nornir import InitNornir
from nornir.core.filter import F
from nornir_netmiko.tasks import netmiko_send_command
from nornir_utils.plugins.functions import print_result

# Initialize with config file
nr = InitNornir(config_file="nornir_config.yml")
```

```yaml
# nornir_config.yml
inventory:
  plugin: SimpleInventory
  options:
    host_file: "inventory/hosts.yml"
    group_file: "inventory/groups.yml"
    defaults_file: "inventory/defaults.yml"

runner:
  plugin: threaded
  options:
    num_workers: 20          # run 20 devices in parallel
```

```yaml
# inventory/hosts.yml
router1:
  hostname: 192.168.1.1
  groups:
    - cisco_ios
  data:
    role: core
    site: DC1

router2:
  hostname: 192.168.1.2
  groups:
    - cisco_ios
  data:
    role: edge
    site: DC2
```

### Running Tasks and Filtering

```python
from nornir_netmiko.tasks import netmiko_send_command
from nornir.core.filter import F

# Run on all devices
result = nr.run(task=netmiko_send_command, command_string="show ip bgp summary")
print_result(result)

# Filter by host data — only core routers at DC1
dc1_core = nr.filter(F(role="core") & F(site="DC1"))
result = dc1_core.run(
    task=netmiko_send_command,
    command_string="show ip ospf neighbor"
)

# Custom task function
from nornir.core.task import Task, Result

def configure_ntp(task: Task, ntp_server: str) -> Result:
    commands = [
        f"ntp server {ntp_server}",
        "ntp update-calendar",
    ]
    task.run(
        task=netmiko_send_command,
        command_string="\n".join(commands),
    )
    return Result(host=task.host, result=f"NTP configured: {ntp_server}")

result = nr.run(task=configure_ntp, ntp_server="10.0.0.10")
print_result(result)

# Access individual host results
for host, multi_result in result.items():
    if multi_result.failed:
        print(f"FAILED: {host} — {multi_result.exception}")
```

## Scapy — Packet Crafting and Analysis

Scapy lets you build, send, capture, and analyze packets at any network layer — essential for testing, security research, and protocol development.

```python
from scapy.all import *

# Craft and send an ICMP ping
packet = IP(dst="8.8.8.8") / ICMP()
response = sr1(packet, timeout=2, verbose=False)
if response:
    print(f"Reply from {response.src}: ttl={response.ttl}")

# TCP SYN scan (detect open ports)
target = "192.168.1.1"
ports_to_scan = [22, 23, 80, 443, 8080]
answered, _ = sr(
    IP(dst=target) / TCP(dport=ports_to_scan, flags="S"),
    timeout=2,
    verbose=False
)
for sent, received in answered:
    if received[TCP].flags == "SA":    # SYN-ACK = open
        print(f"Port {sent[TCP].dport}: OPEN")

# Craft custom DNS query
dns_query = IP(dst="8.8.8.8") / UDP(dport=53) / DNS(
    rd=1,
    qd=DNSQR(qname="example.com", qtype="A")
)
response = sr1(dns_query, timeout=2, verbose=False)
if response and response.haslayer(DNSRR):
    print(f"DNS answer: {response[DNSRR].rdata}")

# Sniff traffic on an interface
packets = sniff(iface="eth0", count=10, filter="tcp port 80")
for pkt in packets:
    pkt.show()
```

## Common Pitfalls

- Netmiko `send_command` timeout — increase `read_timeout` for commands that take longer (e.g., `show tech-support`)
- NAPALM `load_replace_candidate` replaces the **entire** configuration — use `load_merge_candidate` unless you want a full replace
- Nornir fails silently by default — always check `result.failed` and implement error handling; use `raise_on_error=True` for CI pipelines
- Scapy requires root/admin privileges to send raw packets — run with `sudo` or in a privileged container

## Review Questions

1. What is the difference between `send_command` and `send_config_set` in Netmiko? Why does `send_config_set` not require you to manually type `configure terminal`?
2. Explain the NAPALM commit workflow. How does it differ from using `ios_config` in Ansible? When would you prefer NAPALM's compare/commit over Ansible?
3. You need to run a `show ip route` command across 500 routers and save results to a file. Compare how you would implement this using Netmiko alone (sequential) vs Nornir (parallel). What is the expected time difference if each command takes 2 seconds?

#Networking #network-automation #python
