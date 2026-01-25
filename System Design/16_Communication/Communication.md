---
title: Communication in Distributed Systems
tags: [SystemDesign, Communication, Networking, Protocols, APIs]
---

# 📡 Communication in Distributed Systems

## 🧠 Core Idea

No modern system exists in isolation. **Services must communicate** with each other over networks using well-defined **protocols** and **architectural communication styles**.

> Goal: **Enable reliable, efficient, and scalable data exchange between systems.**

---

## 🌐 Network Protocols

### 🔹 HTTP (HyperText Transfer Protocol)
- Foundation of web communication  
- Request/Response model  
- Stateless  
- Runs over TCP  
- Common for REST and GraphQL APIs  

---

### 🔹 TCP (Transmission Control Protocol)
- Reliable, connection-oriented protocol  
- Guarantees message delivery and order  
- Used when correctness is critical  
- Example: HTTP, gRPC  

---

### 🔹 UDP (User Datagram Protocol)
- Connectionless, faster than TCP  
- No delivery guarantees  
- Used for real-time systems  
- Example: Video streaming, gaming, DNS  

---

## ⚙️ Communication Styles

### 🔹 RPC (Remote Procedure Call)
- Call functions on remote services as if local  
- Focuses on action-based communication  
- Example: gRPC, Thrift  

---

### 🔹 REST (Representational State Transfer)
- Resource-based communication  
- Uses HTTP verbs (GET, POST, PUT, DELETE)  
- Stateless and widely used in web APIs  

---

### 🔹 GraphQL
- Query-based API language  
- Clients specify exactly what data they need  
- Reduces over-fetching and under-fetching  

---

### 🔹 gRPC
- High-performance RPC framework by Google  
- Uses Protocol Buffers  
- Supports streaming  
- Ideal for microservice-to-microservice communication  

---

## ⚖️ Style Comparison

| Style | Best For | Strength |
|--------|----------|----------|
| REST | Public APIs | Simplicity & web compatibility |
| RPC/gRPC | Internal microservices | High performance |
| GraphQL | Client-driven data queries | Flexible responses |

---

## 🎯 Why Communication Matters

- Connects microservices  
- Enables distributed architectures  
- Impacts latency and throughput  
- Affects scalability and reliability  

---

## 🧠 Design Insight

```
Public Web APIs → REST or GraphQL
Internal Microservices → gRPC or RPC
Real-time Systems → UDP-based protocols
```

---

## 🔗 Related Topics

[[Asynchronism]]  
[[Message Queues]]  
[[Load Balancers]]  
[[Service Discovery]]  
[[Latency vs Throughput]]

---

## 🏷️ Tags

#SystemDesign #Networking #Protocols #Communication #DistributedSystems
