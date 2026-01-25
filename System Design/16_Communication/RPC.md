---
title: RPC (Remote Procedure Call)
tags: [SystemDesign, RPC, Communication, Microservices, DistributedSystems]
---

# 📞 RPC (Remote Procedure Call)

## 🧠 Core Idea

**RPC (Remote Procedure Call)** allows a client to execute a procedure on a **remote server** as if it were a **local function call**.

> Goal: **Abstract network communication so remote service calls feel like local method invocations.**

RPC hides the complexity of networking, serialization, and transport from the developer.

---

## 📖 Definition

In RPC, a client calls a function that actually runs in a **different address space**, usually on another machine.

Although coded like a local call, the system handles:
- Network communication  
- Data serialization  
- Request/response handling  

Remote calls are **slower and less reliable** than local calls, so distinguishing them is important in design.

---

## ⚙️ How RPC Works

```
Client Program
    ↓
Client Stub → Marshals procedure + arguments
    ↓
Client Communication Module → Sends request over network
    ↓
Server Communication Module → Receives request
    ↓
Server Stub → Unmarshals request
    ↓
Server Procedure Executes
    ↓
Response sent back in reverse order
```

---

## 🔄 RPC is Request–Response

Just like HTTP:

```
Client → RPC Request → Server
Client ← RPC Response ← Server
```

---

## 💻 Sample RPC-style Calls

```
GET /someoperation?data=anId
```

```
POST /anotheroperation
{
  "data": "anId",
  "anotherdata": "another value"
}
```

---

## 🧩 Popular RPC Frameworks

- **gRPC (Protocol Buffers)**  
- **Apache Thrift**  
- **Apache Avro**  

These frameworks provide:
- Interface definition files  
- Automatic client/server code generation  
- Efficient binary serialization  

---

## 🎯 Why RPC is Used

- High-performance internal communication  
- Strongly-typed service interfaces  
- Efficient binary payloads  
- Suitable for microservice-to-microservice calls  

---

## ⚖️ RPC vs REST

| Aspect | RPC | REST |
|--------|-----|------|
| Focus | Behaviors / Actions | Resources / Data |
| Interface | Function calls | HTTP verbs |
| Payload | Usually binary | Usually JSON |
| Coupling | Tightly coupled | Loosely coupled |
| Performance | Higher | Moderate |
| Human-readable | No | Yes |

---

## ⚠️ Disadvantages of RPC

- Tight coupling between client and service  
- New API required for every new operation  
- Harder to debug  
- Less friendly to standard HTTP caching layers  
- Requires additional tooling  

---

## 🧠 Design Insight

```
Internal microservice communication → RPC/gRPC
Public APIs → REST or GraphQL
Performance critical calls → RPC
```

---

## 🔗 Related Topics

[[Communication]]  
[[HTTP]]  
[[TCP]]  
[[gRPC]]  
[[Microservices]]

---

## 📚 Source

- System Design Primer — RPC  
  https://github.com/donnemartin/system-design-primer#remote-procedure-call-rpc

---

## 🏷️ Tags

#SystemDesign #RPC #Communication #DistributedSystems #Microservices
