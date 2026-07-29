---
title: Rust Serde
aliases: [Serde, Rust serialization, Rust JSON, serde_json, Rust YAML, bincode]
tags: [Rust, serde, serialization, JSON, deserialization, data-formats]
domain: Rust
difficulty: Intermediate
created: 2026-07-29
related:
  - "[[Structs_and_Methods]]"
  - "[[Enums_and_Pattern_Matching]]"
  - "[[Rust_Web_with_Axum]]"
  - "[[Rust_Web_Ecosystem]]"
status: complete
---

# Rust Serde

> [!abstract] TL;DR
> Serde is Rust's universal serialization framework — one derive macro (`#[derive(Serialize, Deserialize)]`) works with JSON, YAML, TOML, bincode, MessagePack, and 20+ other formats. The architecture separates the data model (your Rust types) from the format (JSON bytes) via the Serialize/Deserialize traits. Custom serialization, field renaming, skipping, and conditional logic are all achievable via attributes.

---

## Intuition

Serde's design is elegant: `Serde` defines a data model with 29 possible types (i64, string, map, seq, struct, enum, etc.). Your Rust types implement `Serialize` (know how to describe themselves in this model) and `Deserialize` (know how to reconstruct themselves from this model). Format crates (`serde_json`, `serde_yaml`, `bincode`) implement the actual encoding/decoding. Your types work with all formats without any format-specific code.

The `#[derive]` macros auto-generate the trait implementations by inspecting your struct/enum definition at compile time — this is where procedural macros shine.

---

## Setup

```toml
[dependencies]
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
serde_yaml = "0.9"     # optional
toml = "0.8"            # optional
bincode = "1.3"         # optional, for binary format
```

---

## Basic Derive — JSON

```rust
use serde::{Serialize, Deserialize};
use serde_json;

#[derive(Debug, Serialize, Deserialize)]
struct User {
    id: u64,
    username: String,
    email: String,
    active: bool,
}

fn main() {
    let user = User {
        id: 1,
        username: String::from("alice"),
        email: String::from("alice@example.com"),
        active: true,
    };

    // Serialize to JSON string
    let json = serde_json::to_string(&user).unwrap();
    println!("{json}");
    // {"id":1,"username":"alice","email":"alice@example.com","active":true}

    // Pretty-print JSON
    let pretty = serde_json::to_string_pretty(&user).unwrap();
    println!("{pretty}");

    // Serialize to JSON bytes (Vec<u8>)
    let bytes = serde_json::to_vec(&user).unwrap();

    // Deserialize from JSON string
    let json_str = r#"{"id":2,"username":"bob","email":"bob@example.com","active":false}"#;
    let parsed: User = serde_json::from_str(json_str).unwrap();
    println!("{:?}", parsed);

    // Deserialize from bytes
    let from_bytes: User = serde_json::from_slice(&bytes).unwrap();
}
```

---

## Serde Field Attributes

```rust
use serde::{Serialize, Deserialize};
use serde_json;

#[derive(Debug, Serialize, Deserialize)]
struct ApiResponse {
    // Rename field in JSON (camelCase API, snake_case Rust)
    #[serde(rename = "userId")]
    user_id: u64,

    // Skip serializing if None
    #[serde(skip_serializing_if = "Option::is_none")]
    middle_name: Option<String>,

    // Provide a default if field is missing during deserialization
    #[serde(default)]
    active: bool,  // defaults to false if not present in JSON

    // Custom default value
    #[serde(default = "default_role")]
    role: String,

    // Skip this field entirely (neither serialize nor deserialize)
    #[serde(skip)]
    internal_state: u32,

    // Flatten a nested struct into the parent JSON object
    #[serde(flatten)]
    metadata: Metadata,
}

fn default_role() -> String { String::from("user") }

#[derive(Debug, Serialize, Deserialize)]
struct Metadata {
    created_at: String,
    updated_at: String,
}

// Rename all fields to camelCase (applies to all fields in the struct)
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct Config {
    max_connections: u32,    // → "maxConnections" in JSON
    connection_timeout: u64, // → "connectionTimeout"
    retry_on_failure: bool,  // → "retryOnFailure"
}
```

---

## Enums with Serde

Serde handles all four enum representation styles:

```rust
use serde::{Serialize, Deserialize};

// 1. Externally tagged (default): {"Circle": {"radius": 3.0}}
#[derive(Debug, Serialize, Deserialize)]
enum Shape {
    Circle { radius: f64 },
    Rectangle { width: f64, height: f64 },
    Point,
}

// 2. Internally tagged: {"type": "Circle", "radius": 3.0}
#[derive(Debug, Serialize, Deserialize)]
#[serde(tag = "type")]
enum ShapeInternal {
    Circle { radius: f64 },
    Rectangle { width: f64, height: f64 },
}

// 3. Adjacently tagged: {"t": "Circle", "c": {"radius": 3.0}}
#[derive(Debug, Serialize, Deserialize)]
#[serde(tag = "t", content = "c")]
enum ShapeAdjacent {
    Circle { radius: f64 },
    Rectangle { width: f64, height: f64 },
}

// 4. Untagged: just the data, type inferred from structure (fragile — use carefully)
#[derive(Debug, Serialize, Deserialize)]
#[serde(untagged)]
enum NumberOrString {
    Number(f64),
    Text(String),
}

fn main() {
    let s = Shape::Circle { radius: 3.0 };
    println!("{}", serde_json::to_string(&s).unwrap());
    // {"Circle":{"radius":3.0}}

    let si = ShapeInternal::Circle { radius: 3.0 };
    println!("{}", serde_json::to_string(&si).unwrap());
    // {"type":"Circle","radius":3.0}
}
```

---

## The serde_json Value Type

For working with arbitrary JSON without a fixed schema:

```rust
use serde_json::{Value, json};

fn main() {
    // The json! macro creates a Value at compile time
    let v: Value = json!({
        "name": "Alice",
        "age": 30,
        "hobbies": ["coding", "reading"],
        "address": {
            "city": "London",
            "zip": "EC1A"
        }
    });

    // Navigate with indexing
    println!("{}", v["name"]);        // "Alice"
    println!("{}", v["age"]);         // 30
    println!("{}", v["hobbies"][0]);  // "coding"
    println!("{}", v["address"]["city"]); // "London"

    // Convert Value back to a typed struct
    #[derive(Deserialize)]
    struct Person { name: String, age: u32 }
    let person: Person = serde_json::from_value(v.clone()).unwrap();

    // Pattern match on Value variants
    match &v {
        Value::Object(map)  => println!("{} keys", map.len()),
        Value::Array(arr)   => println!("{} items", arr.len()),
        Value::String(s)    => println!("string: {s}"),
        Value::Number(n)    => println!("number: {n}"),
        Value::Bool(b)      => println!("bool: {b}"),
        Value::Null         => println!("null"),
    }

    // Merge/modify JSON
    if let Value::Object(ref mut map) = v.clone() {
        map.insert("new_field".to_string(), json!(42));
    }
}
```

---

## Custom Serialization

For types where derive isn't sufficient:

```rust
use serde::{Serialize, Deserialize, Serializer, Deserializer};
use std::fmt;

// Custom type: serialize as a string, deserialize from string
struct Color(u8, u8, u8);

impl Serialize for Color {
    fn serialize<S: Serializer>(&self, s: S) -> Result<S::Ok, S::Error> {
        s.serialize_str(&format!("#{:02X}{:02X}{:02X}", self.0, self.1, self.2))
    }
}

impl<'de> Deserialize<'de> for Color {
    fn deserialize<D: Deserializer<'de>>(d: D) -> Result<Self, D::Error> {
        struct ColorVisitor;
        impl<'de> serde::de::Visitor<'de> for ColorVisitor {
            type Value = Color;
            fn expecting(&self, f: &mut fmt::Formatter) -> fmt::Result {
                f.write_str("a hex color string like #FF0000")
            }
            fn visit_str<E: serde::de::Error>(self, s: &str) -> Result<Color, E> {
                let hex = s.trim_start_matches('#');
                let r = u8::from_str_radix(&hex[0..2], 16).map_err(E::custom)?;
                let g = u8::from_str_radix(&hex[2..4], 16).map_err(E::custom)?;
                let b = u8::from_str_radix(&hex[4..6], 16).map_err(E::custom)?;
                Ok(Color(r, g, b))
            }
        }
        d.deserialize_str(ColorVisitor)
    }
}

// Serialize with a custom function (simpler than full custom impl)
mod date_format {
    use serde::{self, Deserialize, Serializer, Deserializer};

    pub fn serialize<S: Serializer>(date: &chrono::NaiveDate, s: S) -> Result<S::Ok, S::Error> {
        s.serialize_str(&date.format("%Y-%m-%d").to_string())
    }
    pub fn deserialize<'de, D: Deserializer<'de>>(d: D) -> Result<chrono::NaiveDate, D::Error> {
        let s = String::deserialize(d)?;
        chrono::NaiveDate::parse_from_str(&s, "%Y-%m-%d")
            .map_err(serde::de::Error::custom)
    }
}

#[derive(Serialize, Deserialize)]
struct Event {
    name: String,
    #[serde(with = "date_format")]  // use the custom module for this field
    date: chrono::NaiveDate,
}
```

---

## Other Format Crates

```rust
// serde_yaml
let yaml_str = "name: Alice\nage: 30";
let user: User = serde_yaml::from_str(yaml_str).unwrap();
let yaml_out = serde_yaml::to_string(&user).unwrap();

// toml
let toml_str = r#"[database]\nurl = "postgres://localhost/db""#;

// bincode — compact binary format (faster than JSON, not human-readable)
let encoded: Vec<u8> = bincode::serialize(&user).unwrap();
let decoded: User = bincode::deserialize(&encoded).unwrap();
// bincode is ideal for: cache storage, inter-process communication, game save files

// messagepack (rmp-serde)
use rmp_serde as rmps;
let packed = rmps::to_vec(&user).unwrap();
let unpacked: User = rmps::from_slice(&packed).unwrap();
```

---

## Common Pitfalls

- **`serde_json::from_str` vs `from_slice`** — `from_str` takes `&str` (valid UTF-8); `from_slice` takes `&[u8]` (handles bytes). Both work for JSON but `from_str` errors if the bytes aren't valid UTF-8.
- **`#[serde(default)]` on the whole struct** — adding `#[serde(default)]` to the struct means ALL missing fields get their `Default` value, which can silently hide typos in field names in config files.
- **Untagged enums are fragile** — Serde tries each variant in order; ambiguous types can deserialize to the wrong variant. Use tagged enums for reliability.
- **`skip_serializing_if = "Option::is_none"` vs `default`** — `skip_serializing_if` only affects serialization (output). `default` affects deserialization (input). They complement each other for optional fields.
- **Cloning in `serde_json::Value` navigation** — indexing a `Value` returns `&Value`; `.clone()` to convert to a typed struct if needed.

---

## Review Questions

1. What is the architectural separation that makes Serde work with 20+ data formats? What do the `Serialize` and `Deserialize` traits represent?
2. You have a struct field `created_at: DateTime<Utc>` that must serialize to ISO 8601 string format in JSON. How do you achieve this without manually implementing `Serialize` for the whole struct?
3. Explain the four enum representation styles in Serde. When would you choose internally tagged over externally tagged?
4. When is `serde_json::Value` appropriate vs a strongly typed struct? What are the tradeoffs?

---

#Rust #serde #serialization #JSON #deserialization #data-formats
