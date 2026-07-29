---
title: CRUD Operations
aliases: [MongoDB CRUD, insertOne, findOne, updateOne, deleteOne, bulkWrite]
tags: [MongoDB, NoSQL, Database, CRUD, Operations]
domain: MongoDB
difficulty: Beginner
created: 2026-07-29
related: [Query_Operators, Indexes, Documents_and_Collections]
status: complete
---

# CRUD Operations

> [!abstract] TL;DR
> MongoDB's CRUD layer covers **Create** (`insertOne`/`insertMany`), **Read** (`find`/`findOne` with cursors), **Update** (`updateOne`/`updateMany`/`replaceOne` with update operators), and **Delete** (`deleteOne`/`deleteMany`). The key advanced operations are `findOneAndUpdate` for atomic read-modify-write, and `bulkWrite` for batching mixed operations efficiently. Single-document operations are always atomic; multi-document atomicity requires a transaction.

## Create — Inserting Documents

### `insertOne`

```javascript
const result = await db.collection("users").insertOne({
  name: "Alice Cheng",
  email: "alice@example.com",
  role: "admin",
  createdAt: new Date(),
  tags: ["mongodb", "backend"]
})

console.log(result.insertedId)  // ObjectId auto-generated
```

### `insertMany`

```javascript
// Default: ordered=true — stops at first error
const result = await db.collection("products").insertMany([
  { name: "Widget Pro", price: 29.99, stock: 100 },
  { name: "Gadget Max", price: 49.99, stock: 50 },
  { name: "Thingamajig", price: 9.99, stock: 500 }
], { ordered: false })  // ordered:false = continue on error, batch remaining docs

console.log(result.insertedCount)  // 3
console.log(result.insertedIds)    // { '0': ObjectId(...), '1': ObjectId(...), ... }
```

> [!tip] `ordered: false` for Bulk Imports
> When importing large datasets where some duplicates may exist, `ordered: false` continues past duplicate-key errors and inserts all valid documents. With `ordered: true` (default), a single duplicate stops the entire batch.

---

## Read — Finding Documents

### `findOne` and `find`

```javascript
// findOne — returns first matching document or null
const user = await db.collection("users").findOne(
  { email: "alice@example.com" },                        // filter
  { projection: { name: 1, email: 1, role: 1, _id: 0 } }  // projection
)

// find — returns a Cursor
const cursor = db.collection("products").find(
  { price: { $lt: 50 }, stock: { $gt: 0 } },
  { projection: { name: 1, price: 1 } }
)
```

### Projection

```javascript
// Include fields (1) — only listed fields returned
db.users.find({}, { name: 1, email: 1 })         // includes _id by default
db.users.find({}, { name: 1, email: 1, _id: 0 }) // exclude _id explicitly

// Exclude fields (0) — all fields except listed
db.users.find({}, { password: 0, internalNote: 0 })

// NOTE: Cannot mix include and exclude in one projection (except _id)
// This is INVALID: db.users.find({}, { name: 1, password: 0 })
```

### Cursor Methods

```javascript
// Chaining cursor methods
const results = await db.collection("products")
  .find({ category: "electronics" })
  .sort({ price: -1 })          // -1 = descending
  .skip(20)                     // skip first 20 (for pagination)
  .limit(10)                    // return at most 10
  .toArray()                    // materialize cursor to array

// Iteration without materializing entire result
const cursor = db.collection("logs").find({ level: "ERROR" })
for await (const doc of cursor) {
  processLog(doc)
}

// Count (use countDocuments for accuracy, estimatedDocumentCount for speed)
const exact = await db.collection("users").countDocuments({ role: "admin" })
const fast  = await db.collection("users").estimatedDocumentCount()  // uses metadata, ignores filter
```

> [!warning] Cursor Timeout
> By default, server-side cursors expire after **10 minutes** of inactivity. For long-running cursor iterations, call `cursor.noCursorTimeout()` (requires `killCursors` permission) or increase `cursorTimeoutMillis`.

### Pagination Patterns

```javascript
// Skip/limit pagination — simple but slow for large offsets (must scan skipped docs)
const page = 5, pageSize = 20
db.collection("articles").find({}).sort({ createdAt: -1 }).skip((page - 1) * pageSize).limit(pageSize)

// Cursor-based pagination — performant for large collections
// Store the last seen _id or sort field value
const lastId = ObjectId("64f0a1b2c3d4e5f6a7b8c9d0")
db.collection("articles").find({ _id: { $lt: lastId } }).sort({ _id: -1 }).limit(20)
```

---

## Update — Modifying Documents

### Update Operators Reference

| Operator | Purpose | Example |
|---|---|---|
| `$set` | Set field value (add if absent) | `{ $set: { status: "active" } }` |
| `$unset` | Remove a field | `{ $unset: { tempField: "" } }` |
| `$inc` | Increment/decrement numeric field | `{ $inc: { views: 1, stock: -5 } }` |
| `$mul` | Multiply numeric field | `{ $mul: { price: 1.1 } }` (10% price increase) |
| `$rename` | Rename a field | `{ $rename: { "oldName": "newName" } }` |
| `$min` | Update if new value is less | `{ $min: { lowestPrice: 9.99 } }` |
| `$max` | Update if new value is greater | `{ $max: { highScore: 1500 } }` |
| `$currentDate` | Set to current date | `{ $currentDate: { updatedAt: true } }` |
| `$push` | Append to array | `{ $push: { tags: "mongodb" } }` |
| `$pull` | Remove matching elements from array | `{ $pull: { tags: "deprecated" } }` |
| `$addToSet` | Add to array if not present (set semantics) | `{ $addToSet: { roles: "editor" } }` |
| `$pop` | Remove first (-1) or last (1) array element | `{ $pop: { queue: -1 } }` |
| `$pullAll` | Remove all matching values | `{ $pullAll: { scores: [0, 1] } }` |
| `$each` | Push multiple items | `{ $push: { tags: { $each: ["a", "b"] } } }` |
| `$slice` | Trim array after push | `{ $push: { recent: { $each: ["x"], $slice: -10 } } }` |
| `$sort` (array) | Sort array after push | `{ $push: { scores: { $each: [95], $sort: -1 } } }` |
| `$bit` | Bitwise operations | `{ $bit: { flags: { or: 4 } } }` |

### `updateOne` and `updateMany`

```javascript
// Update first matching document
const result = await db.collection("products").updateOne(
  { _id: ObjectId("64f0...") },              // filter
  {
    $set: { status: "discontinued" },
    $inc: { version: 1 },
    $currentDate: { updatedAt: true }
  }
)
console.log(result.matchedCount, result.modifiedCount)

// Update all matching documents
await db.collection("orders").updateMany(
  { status: "pending", createdAt: { $lt: new Date("2026-01-01") } },
  { $set: { status: "expired" } }
)

// Upsert: insert if no match
await db.collection("counters").updateOne(
  { _id: "pageviews" },
  { $inc: { count: 1 } },
  { upsert: true }   // creates { _id: "pageviews", count: 1 } if not present
)
```

### `replaceOne` vs `updateOne`

```javascript
// replaceOne — replaces ENTIRE document (except _id)
// DANGEROUS: removes all fields not in the replacement
await db.collection("users").replaceOne(
  { _id: ObjectId("64f0...") },
  { name: "Alice", email: "alice@new.com", role: "user" }  // full document replacement
)

// updateOne with $set — modifies only specified fields
// SAFER for most use cases
await db.collection("users").updateOne(
  { _id: ObjectId("64f0...") },
  { $set: { email: "alice@new.com" } }  // only email changes
)
```

### Array Update Operators

```javascript
// Positional operator $ — updates the FIRST matching array element
db.students.updateOne(
  { "grades.subject": "Math" },
  { $set: { "grades.$.score": 95 } }   // updates the Math grade
)

// $[] — updates ALL array elements
db.students.updateOne(
  { _id: ObjectId("...") },
  { $set: { "grades.$[].passed": true } }  // set passed=true on ALL grades
)

// $[identifier] — filtered positional: update elements matching arrayFilters
db.students.updateOne(
  { _id: ObjectId("...") },
  { $set: { "grades.$[elem].passed": true } },
  { arrayFilters: [{ "elem.score": { $gte: 60 } }] }  // only grades where score >= 60
)
```

---

## Delete Operations

```javascript
// Delete first matching document
const result = await db.collection("sessions").deleteOne({ token: "expired-token-abc" })
console.log(result.deletedCount)  // 0 or 1

// Delete all matching documents
const result2 = await db.collection("logs").deleteMany({
  level: "DEBUG",
  timestamp: { $lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }  // older than 7 days
})
console.log(result2.deletedCount)

// No "delete all" shortcut — pass empty filter {}
// db.collection.deleteMany({}) — deletes everything, be careful!
// db.collection.drop() — drops the collection entirely (faster)
```

---

## Atomic Read-Modify-Write: `findOneAndUpdate`

`findOneAndUpdate` atomically finds and modifies a document in a **single operation** — no other operation can modify the document between the find and the update. Critical for patterns like queue consumers, counters, and state machines.

```javascript
// Return the document AFTER the update (default: before)
const updatedOrder = await db.collection("orders").findOneAndUpdate(
  { status: "pending", assignedTo: null },          // filter: find unassigned pending order
  {
    $set: { assignedTo: "worker-001", status: "processing" },
    $currentDate: { claimedAt: true }
  },
  {
    returnDocument: "after",   // "before" (default) or "after"
    sort: { createdAt: 1 },    // pick oldest first
    upsert: false              // don't create if not found
  }
)

if (!updatedOrder) console.log("No pending orders — queue is empty")
```

```javascript
// findOneAndDelete — atomic find-and-delete
const deleted = await db.collection("jobs").findOneAndDelete(
  { status: "queued" },
  { sort: { priority: -1, createdAt: 1 } }
)
```

> [!tip] findOneAndUpdate vs Transactions
> For single-document atomic operations, `findOneAndUpdate` is always preferable to a multi-document transaction — it is **dramatically cheaper** (no session overhead, no commit round-trip). Only use transactions when you truly need atomicity across multiple documents or collections.

---

## Bulk Write Operations

`bulkWrite` batches multiple write operations in a single round-trip, with control over ordering:

```javascript
const bulkOps = [
  // Insert
  { insertOne: { document: { sku: "NEW-001", name: "New Item", price: 15.99 } } },

  // Update
  { updateOne: {
      filter: { sku: "W-100" },
      update: { $inc: { stock: -5 } },
      upsert: false
  }},

  // Update many
  { updateMany: {
      filter: { category: "clearance" },
      update: { $set: { discountPct: 50 } }
  }},

  // Replace
  { replaceOne: {
      filter: { sku: "OLD-X" },
      replacement: { sku: "OLD-X", name: "Replaced Item", price: 0 }
  }},

  // Delete
  { deleteOne: { filter: { sku: "DEPRECATED-99" } } },
  { deleteMany: { filter: { stock: 0, discontinued: true } } }
]

const result = await db.collection("inventory").bulkWrite(bulkOps, {
  ordered: false  // continue on error; true (default) stops at first error
})

console.log({
  insertedCount:  result.insertedCount,
  matchedCount:   result.matchedCount,
  modifiedCount:  result.modifiedCount,
  deletedCount:   result.deletedCount,
  upsertedCount:  result.upsertedCount
})
```

**When to use `bulkWrite`:**
- Importing or migrating data in batches
- Synchronizing state from an external system (upsert each item)
- Mixed updates/deletes in one round-trip (e.g., processing a queue of changes)

---

## Write Concern and Read Concern

These tune the **durability vs latency** trade-off:

```javascript
// Write concern — how many replica set members must acknowledge
db.collection("orders").insertOne(doc, {
  writeConcern: { w: "majority", j: true, wtimeout: 5000 }
  // w: "majority"  — wait for majority of voting members
  // j: true        — wait for journal flush (survive crashes)
  // wtimeout: 5000 — fail after 5 seconds if not acknowledged
})

// Read concern — snapshot isolation level for reads
db.collection("orders").find(filter, {
  readConcern: { level: "majority" }  // only read data acknowledged by majority
  // levels: "local" (default), "majority", "linearizable", "snapshot" (in transactions)
})
```

| `w` Value | Meaning | Durability | Latency |
|---|---|---|---|
| `0` | Fire and forget | None | Lowest |
| `1` (default) | Primary acknowledged | Lost on primary crash before replication | Low |
| `"majority"` | Majority of voting members | Survives primary failure | Medium |
| `n` (number) | n replicas acknowledged | Survives up to n-1 failures | High |

---

## Common Pitfalls

1. **Using `replaceOne` when you meant `updateOne`.** `replaceOne` silently drops all fields not in the replacement. Always prefer `updateOne` with `$set` unless you specifically want a full document replace.
2. **Forgetting `upsert: true` in `updateOne` for "create-or-update" patterns.** Without `upsert`, a no-match returns `matchedCount: 0, modifiedCount: 0` silently.
3. **`estimatedDocumentCount()` after a partial restore or migration.** It reads collection metadata which may be stale. Use `countDocuments()` for accuracy.
4. **Holding a cursor open longer than 10 minutes without fetching.** The cursor times out server-side, throwing a `CursorNotFound` error. Process data in smaller batches.
5. **Using `deleteMany({})` thinking it's reversible.** There is no rollback on a delete without a transaction. Use `db.collection.drop()` to delete a whole collection — it's faster.
6. **Large `insertMany` without `ordered: false` on duplicate-key data.** A single duplicate halts the entire batch. Use `ordered: false` for idempotent bulk imports.

---

## Review Questions

1. What is the difference between `updateOne` with `$set` and `replaceOne`? When would you use each?
2. Explain why `findOneAndUpdate` is preferable to a read-then-write pattern for implementing a work queue. What race condition does it prevent?
3. You need to update 50,000 documents in a collection. Compare using `updateMany` vs `bulkWrite` with `ordered: false`. When would you prefer one over the other?

#MongoDB #NoSQL #CRUD #insertOne #findOne #updateOne #deleteOne #bulkWrite
