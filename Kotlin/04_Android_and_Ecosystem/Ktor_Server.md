---
title: Ktor Server
aliases: [Ktor Framework, Ktor Routing, Ktor Plugins, Ktor vs Spring Boot]
tags: [Kotlin, Ktor, Server, WebFramework, Routing, WebSockets]
domain: Kotlin
difficulty: Advanced
created: 2026-07-29
related: []
status: complete
---

# 🟣 Ktor Server

> [!abstract] TL;DR
> Ktor is JetBrains' asynchronous, Kotlin-native web framework — lightweight, coroutine-based, and DSL-driven. Applications are composed of **plugins** (middleware): `ContentNegotiation` for JSON, `Authentication` for auth, `Logging` for request logs. Routing is defined in a nested DSL. Requests and responses are first-class coroutine primitives. `testApplication` provides in-process integration testing without spinning up a real server. Compared to Spring Boot: Ktor is lighter and more Kotlin-idiomatic; Spring Boot is more feature-complete with battle-tested ecosystem.

---

## Intuition

Spring Boot assumes you want an opinionated, batteries-included framework with annotation magic. Ktor assumes you want explicit, composable building blocks. There's no hidden magic: plugins are installed explicitly, routing is code (not annotations), and the entire application is a set of coroutine-aware functions. This makes Ktor excellent for microservices, APIs, and teams that want full control with minimal framework overhead.

---

## How It Works

### Application Setup

```kotlin
// build.gradle.kts
dependencies {
    implementation("io.ktor:ktor-server-core:2.3.7")
    implementation("io.ktor:ktor-server-netty:2.3.7")           // engine
    implementation("io.ktor:ktor-server-content-negotiation:2.3.7")
    implementation("io.ktor:ktor-serialization-kotlinx-json:2.3.7")
    implementation("io.ktor:ktor-server-auth:2.3.7")
    implementation("io.ktor:ktor-server-logging:2.3.7")
    testImplementation("io.ktor:ktor-server-test-host:2.3.7")
}

// src/main/kotlin/Application.kt
fun main() {
    embeddedServer(Netty, port = 8080, host = "0.0.0.0", module = Application::module)
        .start(wait = true)
}

fun Application.module() {
    configurePlugins()
    configureRouting()
}
```

### Plugins (Middleware)

```kotlin
fun Application.configurePlugins() {
    // JSON serialization / deserialization
    install(ContentNegotiation) {
        json(Json {
            prettyPrint = true
            isLenient   = true
            ignoreUnknownKeys = true
        })
    }

    // Request/Response logging
    install(CallLogging) {
        level = Level.INFO
        filter { call -> call.request.path().startsWith("/api") }
    }

    // CORS
    install(CORS) {
        anyHost()
        allowHeader(HttpHeaders.ContentType)
        allowMethod(HttpMethod.Put)
        allowMethod(HttpMethod.Delete)
    }

    // Authentication — Bearer token
    install(Authentication) {
        bearer("auth-bearer") {
            authenticate { tokenCredential ->
                validateToken(tokenCredential.token)
                    ?.let { userId -> UserIdPrincipal(userId) }
            }
        }
    }

    // Sessions
    install(Sessions) {
        cookie<UserSession>("SESSION") {
            cookie.maxAgeInSeconds = 3600
        }
    }
}
```

### Routing DSL

```kotlin
@Serializable
data class User(val id: Long, val name: String, val email: String)
@Serializable
data class CreateUserRequest(val name: String, val email: String)

fun Application.configureRouting() {
    routing {
        // Static files
        static("/static") { resources("static") }

        // API routes
        route("/api/v1") {
            route("/users") {
                // GET /api/v1/users
                get {
                    val users = userService.getAllUsers()
                    call.respond(users)            // serialized to JSON
                }

                // GET /api/v1/users?page=1&size=20
                get("/paginated") {
                    val page = call.request.queryParameters["page"]?.toInt() ?: 1
                    val size = call.request.queryParameters["size"]?.toInt() ?: 20
                    call.respond(userService.getPage(page, size))
                }

                // POST /api/v1/users
                post {
                    val req = call.receive<CreateUserRequest>()   // deserialized from JSON
                    val user = userService.create(req.name, req.email)
                    call.respond(HttpStatusCode.Created, user)
                }

                // GET /api/v1/users/{id}
                get("/{id}") {
                    val id = call.parameters["id"]?.toLongOrNull()
                        ?: return@get call.respond(HttpStatusCode.BadRequest, "Invalid ID")
                    val user = userService.getById(id)
                        ?: return@get call.respond(HttpStatusCode.NotFound, "User not found")
                    call.respond(user)
                }

                // DELETE /api/v1/users/{id} — protected
                authenticate("auth-bearer") {
                    delete("/{id}") {
                        val principal = call.principal<UserIdPrincipal>()!!
                        val id = call.parameters["id"]!!.toLong()
                        userService.delete(id, principal.name)
                        call.respond(HttpStatusCode.NoContent)
                    }
                }
            }
        }
    }
}
```

### WebSockets

```kotlin
fun Application.configureWebSockets() {
    install(WebSockets) {
        pingPeriod = Duration.ofSeconds(15)
        timeout    = Duration.ofSeconds(60)
        maxFrameSize = Long.MAX_VALUE
    }

    routing {
        webSocket("/ws/chat/{roomId}") {
            val roomId = call.parameters["roomId"]!!
            val session = this

            chatRooms.join(roomId, session)
            try {
                for (frame in incoming) {
                    if (frame is Frame.Text) {
                        val text = frame.readText()
                        chatRooms.broadcast(roomId, text)
                    }
                }
            } finally {
                chatRooms.leave(roomId, session)
            }
        }
    }
}
```

### Testing with `testApplication`

```kotlin
@Test
fun `GET users returns list`() = testApplication {
    application { module() }                          // install the full app module

    val response = client.get("/api/v1/users")
    assertEquals(HttpStatusCode.OK, response.status)
    val users = response.body<List<User>>()
    assertTrue(users.isNotEmpty())
}

@Test
fun `POST user creates and returns 201`() = testApplication {
    application { module() }
    val client = createClient {
        install(io.ktor.client.plugins.contentnegotiation.ContentNegotiation) { json() }
    }

    val response = client.post("/api/v1/users") {
        contentType(ContentType.Application.Json)
        setBody(CreateUserRequest("Alice", "alice@example.com"))
    }
    assertEquals(HttpStatusCode.Created, response.status)
    val user = response.body<User>()
    assertEquals("Alice", user.name)
}
```

## Ktor vs Spring Boot

| Aspect | Ktor | Spring Boot |
|--------|------|-------------|
| Language | Kotlin-native | Java + Kotlin |
| Configuration | Code (DSL) | Annotations + auto-config |
| Startup time | ~100 ms | ~1–3 seconds |
| Memory footprint | Low (~100 MB) | Higher (~300 MB+) |
| Learning curve | Low (Kotlin-first) | High (Spring ecosystem) |
| Ecosystem | Growing | Mature, enterprise-grade |
| DI | Manual / Koin | Spring IoC (comprehensive) |
| Best for | Microservices, KMP backends | Enterprise apps, Spring ecosystem |

## Common Pitfalls

| # | Pitfall | Fix |
|---|---------|-----|
| 1 | Blocking call inside a route handler — blocks the Netty thread | Use `withContext(Dispatchers.IO)` for blocking operations (JDBC, file I/O) |
| 2 | `call.receive()` after `call.respond()` — body already consumed | Only receive/respond once per request; store received body in a local val |
| 3 | Forgetting `ContentNegotiation` plugin — receives `UnsupportedMediaTypeException` | Always install `ContentNegotiation` when handling JSON request/response bodies |
| 4 | Route parameter parsing without null check — throws on missing param | Use `call.parameters["id"] ?: return@get call.respond(BadRequest)` |
| 5 | WebSocket frame not checked for type — `ClassCastException` | Always check `frame is Frame.Text` or `frame is Frame.Binary` before reading |

## Review Questions

1. How does Ktor's plugin system differ from Spring Boot's auto-configuration? What are the trade-offs?
2. Why must you use `withContext(Dispatchers.IO)` for JDBC calls inside a Ktor route handler?
3. What does `testApplication { }` provide that makes it superior to starting a real server for integration tests?

---

Related: [[Kotlin_Coroutines_Intro]] | [[Structured_Concurrency]] | [[Kotlin_Multiplatform]] | [[Kotlin_Testing]] | [[Spring_IoC_Container]]

#Kotlin
