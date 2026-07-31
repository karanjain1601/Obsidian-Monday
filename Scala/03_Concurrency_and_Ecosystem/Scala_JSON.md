---
title: Scala JSON
aliases: [Circe Scala, Scala JSON Parsing, uPickle Scala, Play JSON]
tags: [Scala, JSON, Circe, uPickle, PlayJSON, Encoders, Decoders]
domain: Scala
difficulty: Intermediate
created: 2026-07-30
related:
  - "[[Scala_Overview]]"
  - "[[Scala_Typeclasses]]"
  - "[[Play_Framework]]"
  - "[[Scala_Error_Handling_FP]]"
status: complete
---

# Scala JSON

> [!abstract] TL;DR
> Scala JSON libraries use the **typeclass pattern**: a `Encoder[A]` knows how to serialize `A → Json`; a `Decoder[A]` knows how to parse `Json → Either[Error, A]`. **Circe** is the dominant choice — it derives codecs automatically via macros (`circe-generic`) and provides a cursor-based navigation API for complex transformations. **uPickle** is simpler and faster, preferred in Scala.js and ZIO contexts. **Play JSON** ships with the Play Framework. Custom encoders/decoders handle non-standard representations without runtime reflection.

---

## Intuition

**Analogy:** Encoding and decoding JSON in Scala is like hiring interpreters. A `Decoder[User]` is an interpreter who speaks JSON and translates to Scala (possibly failing if the JSON is malformed). An `Encoder[User]` translates back. Circe's automatic derivation is a machine that generates a pair of interpreters for any case class without you writing them — you just describe the shape of the data (the case class) and the machine handles the rest. When the automatic interpreter doesn't produce the right output (e.g., a date field needs special formatting), you write a custom interpreter that overrides the default.

---

## How It Works

```mermaid
graph TD
    Scala["Scala Case Class\ncase class User(id: Long, name: String)"]:::scala

    Scala --> Encoder["Encoder[User]\nUser → Json"]:::encode
    JSON["JSON String / Value\n{\"id\":1,\"name\":\"Alice\"}"]:::json

    JSON --> Decoder["Decoder[User]\nJson → Either[DecodingFailure, User]"]:::decode

    Encoder --> Derived["Auto-derived\ncirce-generic\n@derives JsonEncoder"]:::auto
    Decoder --> Derived

    Encoder --> Custom["Custom Encoder\nforProductN, new Encoder { ... }"]:::custom
    Decoder --> Custom

    Derived --> Circe["Circe\nio.circe"]:::lib
    Derived --> uPickle["uPickle\ncom.lihaoyi.upickle"]:::lib
    Derived --> PlayJSON["Play JSON\nplay.api.libs.json"]:::lib

    classDef scala fill:#FFF9C4,stroke:#F9A825,color:#212121
    classDef encode fill:#E8F5E9,stroke:#2E7D32,color:#1B5E20
    classDef decode fill:#E3F2FD,stroke:#1565C0,color:#0D47A1
    classDef json fill:#FCE4EC,stroke:#C62828,color:#B71C1C
    classDef auto fill:#EDE7F6,stroke:#6A1B9A,color:#1A237E
    classDef custom fill:#FFF3E0,stroke:#E65100,color:#BF360C
    classDef lib fill:#F1F8E9,stroke:#558B2F,color:#1B5E20
```

---

## Circe

### Automatic Derivation

```scala
// build.sbt
libraryDependencies ++= Seq(
  "io.circe" %% "circe-core"    % "0.14.9",
  "io.circe" %% "circe-generic" % "0.14.9",
  "io.circe" %% "circe-parser"  % "0.14.9"
)
```

```scala
import io.circe.*
import io.circe.generic.semiauto.*
import io.circe.syntax.*
import io.circe.parser.*

case class Address(street: String, city: String, zip: String)
case class User(id: Long, name: String, email: String, address: Address)

// Derive codecs automatically — must be in companion object or given scope
object Address:
  given Encoder[Address] = deriveEncoder
  given Decoder[Address] = deriveDecoder

object User:
  given Encoder[User] = deriveEncoder
  given Decoder[User] = deriveDecoder

// Encode: Scala → JSON
val user = User(1L, "Alice", "alice@example.com", Address("123 Main St", "SF", "94105"))
val json: Json = user.asJson
println(json.spaces2)
// {
//   "id" : 1,
//   "name" : "Alice",
//   "email" : "alice@example.com",
//   "address" : { "street" : "123 Main St", "city" : "SF", "zip" : "94105" }
// }

// Decode: JSON string → Either[Error, User]
val jsonStr = """{"id":1,"name":"Alice","email":"alice@example.com","address":{"street":"123 Main St","city":"SF","zip":"94105"}}"""
val result: Either[Error, User] = decode[User](jsonStr)
result match
  case Right(u) => println(u.name)        // Alice
  case Left(e)  => println(s"Error: $e")
```

### Cursor Navigation

Cursors let you navigate and transform JSON without full decoding:

```scala
val rawJson: Json = parse(jsonStr).getOrElse(Json.Null)

// HCursor — navigate and extract fields
val cursor: HCursor = rawJson.hcursor

val name: Either[DecodingFailure, String] = cursor.downField("name").as[String]
val city: Either[DecodingFailure, String] = cursor.downField("address").downField("city").as[String]

// Modify: transform JSON values functionally
val uppercased: Json = rawJson.hcursor
  .downField("name")
  .withFocus(_.mapString(_.toUpperCase))
  .top
  .getOrElse(rawJson)

// Array navigation
val users: Json = parse("""[{"id":1},{"id":2}]""").getOrElse(Json.Null)
val firstId = users.hcursor.downArray.downField("id").as[Int]  // Right(1)
val secondId = users.hcursor.downN(1).downField("id").as[Int]  // Right(2)
```

### Custom Encoders and Decoders

```scala
import java.time.LocalDate
import java.time.format.DateTimeFormatter

// Custom encoder for LocalDate → "YYYY-MM-DD" string
given Encoder[LocalDate] = Encoder.encodeString.contramap(_.toString)

// Custom decoder for String → LocalDate
given Decoder[LocalDate] = Decoder.decodeString.emap { str =>
  Either.catchNonFatal(LocalDate.parse(str))
    .leftMap(e => s"Invalid date '$str': ${e.getMessage}")
}

// Sum type (sealed trait) with type discriminator
sealed trait Shape
case class Circle(radius: Double) extends Shape
case class Rectangle(width: Double, height: Double) extends Shape

object Shape:
  given Encoder[Shape] = Encoder.instance:
    case Circle(r)     => Json.obj("type" -> "circle".asJson,    "radius" -> r.asJson)
    case Rectangle(w, h) => Json.obj("type" -> "rectangle".asJson, "width" -> w.asJson, "height" -> h.asJson)

  given Decoder[Shape] = Decoder.instance: cursor =>
    cursor.downField("type").as[String].flatMap:
      case "circle"    => cursor.downField("radius").as[Double].map(Circle(_))
      case "rectangle" =>
        for
          w <- cursor.downField("width").as[Double]
          h <- cursor.downField("height").as[Double]
        yield Rectangle(w, h)
      case other => Left(DecodingFailure(s"Unknown shape: $other", cursor.history))
```

---

## uPickle

uPickle is faster and simpler — preferred in Scala.js and ZIO projects:

```scala
// build.sbt
libraryDependencies += "com.lihaoyi" %% "upickle" % "3.3.1"
```

```scala
import upickle.default.*

case class User(id: Long, name: String, email: String) derives ReadWriter

// ReadWriter is both Encoder + Decoder in one
val user = User(1L, "Alice", "alice@example.com")

// Encode
val jsonStr: String = write(user)
val jsonPretty: String = write(user, indent = 2)

// Decode
val parsed: User = read[User](jsonStr)

// Custom field names
@upickle.implicits.key("user_id")
case class UserDto(@upickle.implicits.key("full_name") name: String) derives ReadWriter
```

---

## Play JSON

Play JSON ships with the Play Framework and uses a macro-based `Format[A]`:

```scala
import play.api.libs.json.*

case class User(id: Long, name: String, email: String)

object User:
  // Automatically derive reads + writes
  implicit val format: OFormat[User] = Json.format[User]

  // Or derive separately
  implicit val reads:  Reads[User]  = Json.reads[User]
  implicit val writes: OWrites[User] = Json.writes[User]

// Encode
val user  = User(1L, "Alice", "alice@example.com")
val jsVal = Json.toJson(user)
val str   = Json.stringify(jsVal)   // compact
val pretty = Json.prettyPrint(jsVal)

// Decode
val result: JsResult[User] = Json.parse(str).validate[User]
result match
  case JsSuccess(u, _) => println(u.name)
  case JsError(errors) => println(errors)

// Manual format with transformation
implicit val customReads: Reads[User] =
  (JsPath \ "user_id").read[Long] and
  (JsPath \ "full_name").read[String] and
  (JsPath \ "contact" \ "email").read[String]
)(User.apply)
```

---

## Library Comparison

| Aspect | Circe | uPickle | Play JSON |
|---|---|---|---|
| Derivation style | `deriveEncoder/Decoder` or `derives` | `derives ReadWriter` | `Json.format[A]` |
| Error type | `Either[DecodingFailure, A]` | Exception (catchable) | `JsResult[A]` |
| Cursor / navigation | Yes (HCursor, ACursor) | No | `JsPath` traversal |
| Performance | Good | Fastest | Good |
| Scala.js support | Yes | Yes | Limited |
| Cats Effect integration | Excellent | Moderate | Play-only |
| Bundle size | Medium | Small | Large (Play dependency) |
| Best with | http4s, fs2, Cats Effect | ZIO, Scala.js, simple APIs | Play Framework |

---

## Common Pitfalls

- **Missing `given` in scope** — `asJson` or `decode[A]` fails to compile if the codec isn't imported. Always place derived instances in the companion object or import them explicitly.
- **Circular imports with auto-derivation** — deriving codecs for mutually recursive types requires `lazy given` or explicit `deriveEncoder[A]` calls in the right order.
- **`parser.parse` vs `decode`** — `parse` returns `Either[ParsingFailure, Json]` (invalid JSON syntax); `decode` returns `Either[Error, A]` (includes both parse and decoding errors). Use `decode` for the full pipeline.
- **Large `Json` AST in memory** — parsing large JSON with Circe loads the whole AST into memory. For streaming, use `circe-fs2` or `circe-streaming` with FS2.
- **uPickle exceptions on invalid input** — uPickle throws exceptions rather than returning `Either`. Wrap `read[A](str)` in `Either.catchNonFatal` for safe handling.

---

## Review Questions

1. What is the difference between `Encoder[A]` and `Decoder[A]` in Circe? Why are they separate typeclasses?
2. When would you use a `HCursor` instead of full case-class decoding?
3. How would you write a custom `Decoder` for a sealed trait that uses a `"type"` field as a discriminator?
4. What is the advantage of uPickle over Circe for a Scala.js project?

---

Related: [[Scala_Overview]] | [[Scala_Typeclasses]] | [[Play_Framework]] | [[Scala_Error_Handling_FP]] | [[ScalaJS]]

#Scala #JSON #Circe #uPickle #PlayJSON #Encoders #Decoders
