---
title: "Java Networking — Map of Content"
aliases: ["MOC Java Networking"]
tags: [MOC, java, networking, sockets, http, websocket, nio]
domain: Java
created: 2026-07-26
status: complete
---

# 🌐 Java Networking — Map of Content

> [!abstract] What This Section Covers
> Java's networking stack spans raw TCP sockets, the modern HTTP/2 client (`java.net.http`), WebSockets for real-time communication, non-blocking I/O with NIO/Netty for high throughput, and TLS/SSL for secure channels. Understanding this stack lets you build anything from a custom protocol server to a high-performance API client.

## Concept Map
```mermaid
graph TD
    CENTER["🌐 Java Networking"]

    CENTER --> SOCK["[[Java_Sockets]]\nServerSocket · Socket\nTCP/UDP · blocking I/O"]
    CENTER --> HTTP["[[HTTP_Client_Java11]]\nHttpClient · HttpRequest\nHTTP/2 · async · reactive"]
    CENTER --> WS["[[WebSocket_Java]]\nWebSocket API\nServerEndpoint · OnMessage"]
    CENTER --> NIO["[[NIO_and_Netty]]\nChannels · Selectors · ByteBuffer\nNetty Pipeline · EventLoopGroup"]
    CENTER --> TLS["[[SSL_TLS_Java]]\nSSLContext · JSSE\ncertificates · mTLS"]

    SOCK -->|"non-blocking upgrade"| NIO
    SOCK -->|"secured by"| TLS
    HTTP -->|"HTTP/2 multiplexing"| NIO
    WS -->|"TLS upgrade"| TLS

    style CENTER fill:#7c3aed,color:#fff
    style SOCK fill:#4a9eff,color:#fff
    style HTTP fill:#4a9eff,color:#fff
    style NIO fill:#7ed321,color:#fff
    style TLS fill:#e64980,color:#fff
    style WS fill:#f5a623,color:#fff
```

## Learning Path
1. [[Java_Sockets]] — The foundation: TCP/UDP sockets and blocking I/O.
2. [[HTTP_Client_Java11]] — The modern Java 11 HTTP client for REST/HTTP/2.
3. [[WebSocket_Java]] — Real-time bidirectional communication with WebSockets.
4. [[NIO_and_Netty]] — Non-blocking I/O for high-concurrency servers.
5. [[SSL_TLS_Java]] — Securing connections with TLS and mutual authentication.

## All Notes at a Glance
| Note | Difficulty | What You'll Learn |
|------|------------|-------------------|
| [[Java_Sockets]] | Beginner | ServerSocket, Socket, DatagramSocket, multi-threaded echo server |
| [[HTTP_Client_Java11]] | Intermediate | HttpClient, HttpRequest, sync/async, reactive body publishers, HTTP/2 |
| [[WebSocket_Java]] | Intermediate | JSR 356 @ServerEndpoint, Spring WebSocket, STOMP, session management |
| [[NIO_and_Netty]] | Advanced | Channels, Selectors, ByteBuffer, Netty ChannelHandler, pipeline |
| [[SSL_TLS_Java]] | Advanced | SSLContext, TrustManager, KeyManager, certificate pinning, mTLS |

## Key Questions This Section Answers
- When should you use NIO vs traditional blocking sockets?
- How does the Java 11 `HttpClient` handle HTTP/2 multiplexing?
- What is the difference between WebSocket and SSE (Server-Sent Events)?
- How does Netty's event loop model achieve high concurrency?
- How do you implement mutual TLS (mTLS) in Java?

## Related Sections
- [[_MOC_Java_Master|↑ Java Master MOC]]
- [[34_Java_Annotations/_MOC_Java_Annotations|← Java Annotations]]
- [[36_Functional_Java/_MOC_Functional_Java|→ Functional Java]]

#MOC #java #networking #sockets #http #websocket #nio #tls
