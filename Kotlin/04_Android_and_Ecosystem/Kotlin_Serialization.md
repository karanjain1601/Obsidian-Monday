---
title: Kotlin Serialization
aliases: [kotlinx.serialization, Kotlin JSON, @Serializable, KSerializer, Kotlin Serde]
tags: [Kotlin, Serialization, JSON, kotlinx, CBOR, Protobuf, DataClasses]
domain: Kotlin
difficulty: Intermediate
created: 2026-07-30
related:
  - "[[Kotlin_Spring_Boot]]"
  - "[[Ktor_Server]]"
  - "[[Kotlin_Multiplatform]]"
  - "[[Kotlin_Classes_and_OOP]]"
status: complete
---

# 🟣 Kotlin Serialization

> [!abstract] TL;DR
> `kotlinx.serialization` is Kotlin's compile-time, reflection-free serialization library. A Gradle compiler plugin generates type-safe serializers at compile time for classes annotated with `@Serializable`, eliminating the runtime reflection used by Gson/Moshi and making it fully compatible with Kotlin Multiplatform. The same `@Serializable` annotation works across JSON, CBOR, and Protocol Buffers formats. Custom serializers let you handle types the compiler cannot auto-generate for (e.g., `LocalDate`, `UUID`).

---

## Intuition

`kotlinx.serialization` is Kotlin's answer to Serde — a compile-time, reflection-free serialization library that generates serializers as part of the Kotlin compiler plugin. Unlike Gson (which uses reflection at runtime) or Moshi (which needs kapt adapters), `kotlinx.serialization` is idiomatic Kotlin from the ground up.

Think of Gson as a locksmith who picks any lock at runtime — flexible but slow and brittle. `kotlinx.serialization` is more like a key that was cut precisely at compile time for each lock: faster, safer, and it works the same whether you're running on the JVM, iOS (Kotlin/Native), or a browser (Kotlin/JS). The "Serde" analogy is apt: just as Rust's Serde separates the *data model* (your struct) from the *format* (JSON, MessagePack), `kotlinx.serialization` separates your `@Serializable` class from the format (`Json`, `Cbor`, `ProtoBuf`).

---

## How It Works

### Setup

```kotlin
// build.gradle.kts
plugins {
    kotlin("jvm") version "2.0.0"
    kotlin("plugin.serialization") version "2.0.0"   // Required compiler plugin
}

dependencies {
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.7.1")
    // Optional additional formats:
    // implementation("org.jetbrains.kotlinx:kotlinx-serialization-cbor:1.7.1")
    // implementation("org.jetbrains.kotlinx:kotlinx-serialization-protobuf:1.7.1")
}
```

### `@Serializable` Annotation

Annotate any data class, enum, or sealed class. The compiler plugin generates a `serializer()` function and a `SerialDescriptor` at compile time — no runtime reflection required.

```kotlin
import kotlinx.serialization.*
import kotlinx.serialization.json.*

@Serializable
data class User(
    val id: Long,
    val name: String,
    val email: String,
    val role: Role = Role.VIEWER
)

@Serializable
enum class Role { ADMIN, EDITOR, VIEWER }

@Serializable
data class ApiResponse<T>(
    val data: T,
    val success: Boolean = true,
    val message: String? = null
)
```

### JSON Encoding and Decoding

```kotlin
fun main() {
    val user = User(id = 1, name = "Alice", email = "alice@example.com", role = Role.ADMIN)

    // ── Encoding ──────────────────────────────────────────────────────────────
    val json = Json.encodeToString(user)
    // {"id":1,"name":"Alice","email":"alice@example.com","role":"ADMIN"}

    val prettyJson = Json { prettyPrint = true }.encodeToString(user)

    // ── Decoding ──────────────────────────────────────────────────────────────
    val decoded: User = Json.decodeFromString(json)
    println(decoded.name)  // Alice

    // ── Generic wrapper ───────────────────────────────────────────────────────
    val response = ApiResponse(data = user)
    val responseJson = Json.encodeToString(response)

    // ── Encoding to JsonElement (intermediate representation) ─────────────────
    val element: JsonElement = Json.encodeToJsonElement(user)
    val obj = element.jsonObject
    println(obj["name"]?.jsonPrimitive?.content)   // Alice

    // ── Parsing raw JSON ──────────────────────────────────────────────────────
    val rawJson = """{"id": 2, "name": "Bob", "unknown_field": true}"""
    val lenientJson = Json { ignoreUnknownKeys = true }
    val bob: User = lenientJson.decodeFromString(rawJson)  // unknown_field ignored
}
```

### Json Configuration Options

```kotlin
// All configuration lives in the Json { ... } builder
val json = Json {
    prettyPrint         = true           // human-readable output (dev/debug)
    ignoreUnknownKeys   = true           // ignore fields not in the data class (forward compat)
    isLenient           = true           // allow unquoted strings, trailing commas
    encodeDefaults      = false          // skip fields with default values in output
    explicitNulls       = false          // skip null fields in output (like Jackson NON_NULL)
    coerceInputValues   = true           // replace invalid enum values with default
    allowStructuredMapKeys = true        // allow non-primitive keys in JSON maps
    classDiscriminator  = "type"         // change the polymorphism type key (default: "type")
    serializersModule   = myModule       // register custom/contextual serializers
}
```

### Field Annotations

```kotlin
@Serializable
data class Article(
    val id: Long,

    @SerialName("article_title")         // JSON key is "article_title", Kotlin property is "title"
    val title: String,

    @Required                            // field must be present in JSON, even if it has a default
    val published: Boolean = false,

    @Transient                           // excluded from serialization entirely — must have default
    val internalCache: String = "",

    @EncodeDefault(EncodeDefault.Mode.ALWAYS)   // always encode even if Json { encodeDefaults = false }
    val version: Int = 1
)

// Serialized form: {"id":1,"article_title":"...","published":true,"version":1}
// Note: internalCache is absent; version always present
```

> [!warning] `@Transient` collision
> `kotlinx.serialization`'s `@Transient` is `kotlinx.serialization.Transient`, NOT `kotlin.jvm.Transient` (which marks JVM serialization). They look identical in code — always check the import. Using the wrong one produces confusing results.

### Sealed Class Polymorphism

```kotlin
@Serializable
sealed class Shape {
    abstract val color: String
}

@Serializable
@SerialName("circle")                    // discriminator value in JSON
data class Circle(
    override val color: String,
    val radius: Double
) : Shape()

@Serializable
@SerialName("rectangle")
data class Rectangle(
    override val color: String,
    val width: Double,
    val height: Double
) : Shape()

// Usage
val shape: Shape = Circle(color = "red", radius = 5.0)
val encoded = Json.encodeToString(shape)
// {"type":"circle","color":"red","radius":5.0}

val decoded: Shape = Json.decodeFromString(encoded)  // returns Circle
```

For **open polymorphism** (non-sealed hierarchies), register a `SerializersModule`:

```kotlin
val module = SerializersModule {
    polymorphic(Animal::class) {
        subclass(Dog::class, Dog.serializer())
        subclass(Cat::class, Cat.serializer())
    }
}

val json = Json { serializersModule = module }
```

### Custom Serializers

When the compiler cannot auto-generate a serializer (third-party types, value transformations), implement `KSerializer<T>`:

```kotlin
import kotlinx.serialization.*
import kotlinx.serialization.descriptors.*
import kotlinx.serialization.encoding.*
import java.time.LocalDate

// Custom serializer for java.time.LocalDate (not @Serializable)
object LocalDateSerializer : KSerializer<LocalDate> {

    // Describes the wire format — here it's a String primitive
    override val descriptor: SerialDescriptor =
        PrimitiveSerialDescriptor("LocalDate", PrimitiveKind.STRING)

    override fun serialize(encoder: Encoder, value: LocalDate) {
        encoder.encodeString(value.toString())   // "2026-07-30"
    }

    override fun deserialize(decoder: Decoder): LocalDate {
        return LocalDate.parse(decoder.decodeString())
    }
}

// Custom UUID serializer
object UuidSerializer : KSerializer<java.util.UUID> {
    override val descriptor = PrimitiveSerialDescriptor("UUID", PrimitiveKind.STRING)
    override fun serialize(encoder: Encoder, value: java.util.UUID) = encoder.encodeString(value.toString())
    override fun deserialize(decoder: Decoder): java.util.UUID = java.util.UUID.fromString(decoder.decodeString())
}

// Apply at the property level
@Serializable
data class Event(
    val id: Long,
    val name: String,

    @Serializable(with = LocalDateSerializer::class)
    val date: LocalDate,

    @Serializable(with = UuidSerializer::class)
    val correlationId: java.util.UUID
)

// Or register globally via module (applies contextually)
val module = SerializersModule {
    contextual(LocalDate::class, LocalDateSerializer)
    contextual(java.util.UUID::class, UuidSerializer)
}
val json = Json { serializersModule = module }
```

### Alternative Formats

The `@Serializable` annotation is format-agnostic. Switch to CBOR or Protocol Buffers by swapping the encoder:

```kotlin
import kotlinx.serialization.cbor.Cbor
import kotlinx.serialization.protobuf.ProtoBuf

@Serializable
data class Measurement(val sensor: String, val value: Double, val timestamp: Long)

val m = Measurement("temperature", 23.5, 1700000000L)

// JSON — human-readable, ~50 bytes
val jsonBytes = Json.encodeToString(m).toByteArray()

// CBOR — binary, ~30 bytes, self-describing
val cborBytes = Cbor.encodeToByteArray(m)
val decoded: Measurement = Cbor.decodeFromByteArray(cborBytes)

// Protocol Buffers — binary, ~20 bytes, needs @ProtoNumber field tags
@Serializable
data class MeasurementProto(
    @ProtoNumber(1) val sensor: String,
    @ProtoNumber(2) val value: Double,
    @ProtoNumber(3) val timestamp: Long
)

val protoBytes = ProtoBuf.encodeToByteArray(MeasurementProto("temperature", 23.5, 1700000000L))
```

### Compiler Plugin Flow

```mermaid
graph TD
    SRC["@Serializable\ndata class User(...)"]:::src
    PLUGIN["kotlin.serialization\ncompiler plugin"]:::plugin
    SER["Generated\nUser.Companion.serializer()"]:::gen
    DESC["SerialDescriptor\n(field names, kinds, nullability)"]:::gen
    JSON["Json.encodeToString(user)"]:::api
    ENCODE["KSerializer.serialize()\n→ encodes each field"]:::api
    OUT["JSON string\n{\"id\":1,\"name\":\"Alice\",...}"]:::out
    DECODE["Json.decodeFromString<User>(json)"]:::api
    DECODE2["KSerializer.deserialize()\n→ reconstructs data class"]:::api
    OBJ["User(id=1, name=\"Alice\", ...)"]:::out

    SRC -->|"compile time"| PLUGIN
    PLUGIN --> SER
    PLUGIN --> DESC
    SER --> JSON
    DESC --> JSON
    JSON --> ENCODE
    ENCODE --> OUT
    OUT --> DECODE
    DECODE --> DECODE2
    DECODE2 --> OBJ

    classDef src fill:#FFF9C4,stroke:#F9A825,color:#212121
    classDef plugin fill:#EDE7F6,stroke:#6A1B9A,color:#1A237E
    classDef gen fill:#E8F5E9,stroke:#2E7D32,color:#1B5E20
    classDef api fill:#E3F2FD,stroke:#1565C0,color:#0D47A1
    classDef out fill:#FCE4EC,stroke:#880E4F,color:#880E4F
```

---

## Serialization Library Comparison

| Library | Reflection | Kotlin Idiomatic | KMP Support | Custom Types | Null Safety | Performance |
|---------|-----------|-----------------|-------------|--------------|-------------|-------------|
| **kotlinx.serialization** | None (compile-time) | Native | Full | `KSerializer<T>` | Enforced | Excellent |
| **Gson** | Runtime | Partial (Java-first) | JVM only | `TypeAdapter<T>` | Not enforced | Good |
| **Moshi** | Runtime + kapt | Decent | JVM only | `JsonAdapter<T>` | Decent | Good |
| **Jackson (kotlin module)** | Runtime | Decent | JVM only | `StdSerializer<T>` | Partial | Very good |

## Format Comparison

| Format | Human-Readable | Size | Schema | Speed | Best For |
|--------|---------------|------|--------|-------|---------|
| JSON | Yes | Large | No | Medium | REST APIs, config |
| CBOR | No | Small (~60% of JSON) | No | Fast | IoT, embedded |
| ProtoBuf | No | Smallest | Yes (field numbers) | Fastest | gRPC, high-throughput |

---

## Common Pitfalls

| # | Pitfall | Fix |
|---|---------|-----|
| 1 | Missing the compiler plugin — cryptic `Serializer for class 'X' is not found` at runtime | Always add `kotlin("plugin.serialization")` to the `plugins {}` block in `build.gradle.kts` |
| 2 | Using `@Transient` but forgetting the default value — compile error | `@Transient` requires a default value; it cannot be computed from JSON since it is excluded |
| 3 | Importing `kotlin.jvm.Transient` instead of `kotlinx.serialization.Transient` | Check imports carefully; IDE auto-import may pick the wrong one |
| 4 | Sealed class polymorphism not working — `Polymorphic serializer was not found` | Add `@SerialName("...")` on each subclass; for open hierarchies, register via `SerializersModule` |
| 5 | `encodeDefaults = false` silently drops required fields | Use `@EncodeDefault(Mode.ALWAYS)` on fields that must always be present regardless of default |
| 6 | Large numbers of `@Serializable` classes increasing compile times noticeably | Expected behavior; use incremental compilation (`org.gradle.caching=true`) and modularize |
| 7 | `decodeFromString` with a JSON array into a `List<T>` — type erasure issue | Use `Json.decodeFromString<List<User>>(json)` — reified inline function resolves this correctly |

---

## Review Questions

1. What is the difference between `@SerialName` and `@Transient` in `kotlinx.serialization`? What happens if you forget to give a `@Transient` field a default value?
2. Explain the difference between `kotlinx.serialization`'s `@Transient` and Kotlin's `kotlin.jvm.Transient`. Why can they cause subtle bugs?
3. How does sealed class polymorphism work in `kotlinx.serialization`? What JSON field is used as the type discriminator, and how do you change it?
4. Walk through implementing a `KSerializer<T>` for a custom type. What are the three members you must override, and what does each one do?
5. If your project targets both JVM and iOS via Kotlin Multiplatform, why is `kotlinx.serialization` preferable over Gson for JSON handling?

---

Related: [[Kotlin_Spring_Boot]] | [[Ktor_Server]] | [[Kotlin_Multiplatform]] | [[Gradle_Kotlin_DSL]] | [[Kotlin_Classes_and_OOP]]

#Kotlin #Serialization #JSON #kotlinx #KMP
