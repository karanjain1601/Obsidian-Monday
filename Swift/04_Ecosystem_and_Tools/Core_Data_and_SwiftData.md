---
title: Core Data and SwiftData
aliases: [SwiftData @Model, Core Data NSPersistentContainer, Core Data NSFetchRequest]
tags: [Swift, SwiftUI, CoreData, SwiftData, Persistence, Database]
domain: Swift
difficulty: Intermediate
created: 2026-07-29
related: [SwiftUI_State_and_Data, SwiftUI_Lists_and_Data, Swift_Networking]
status: complete
---

# Core Data and SwiftData

> [!abstract] TL;DR
> **Core Data** is Apple's mature ORM-based persistence framework (since 2004) using `NSPersistentContainer`, `NSManagedObject`, and `NSFetchRequest` with NSPredicate. **SwiftData** (iOS 17+, macOS 14+) is the modern Swift-native replacement: `@Model` macro turns a plain Swift class into a persistent model; `@Query` fetches into SwiftUI views reactively. For new projects targeting iOS 17+, prefer SwiftData.

---

## SwiftData (iOS 17+) — The Modern Way

### Defining a Model

```swift
import SwiftData

@Model
class Task {
    var title: String
    var isCompleted: Bool
    var createdAt: Date
    var priority: Int

    // Relationship — one-to-many
    var tags: [Tag] = []

    init(title: String, priority: Int = 0) {
        self.title = title
        self.isCompleted = false
        self.createdAt = Date()
        self.priority = priority
    }
}

@Model
class Tag {
    @Attribute(.unique) var name: String    // unique constraint
    var tasks: [Task] = []

    init(name: String) { self.name = name }
}
```

The `@Model` macro synthesizes `Codable`, `Hashable`, and persistence plumbing automatically.

---

### App Setup with `ModelContainer`

```swift
@main
struct TaskApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
        .modelContainer(for: [Task.self, Tag.self])   // injects ModelContainer
        // For in-memory testing:
        // .modelContainer(for: Task.self, inMemory: true)
    }
}
```

---

### CRUD with `@Query` and `ModelContext`

```swift
struct TaskListView: View {
    // @Query — fetches and observes changes reactively
    @Query(sort: \Task.createdAt, order: .reverse) private var tasks: [Task]
    @Query(filter: #Predicate<Task> { !$0.isCompleted }) private var pending: [Task]

    @Environment(\.modelContext) private var modelContext

    var body: some View {
        List {
            ForEach(tasks) { task in
                TaskRow(task: task)
            }
            .onDelete { indexSet in
                for index in indexSet {
                    modelContext.delete(tasks[index])
                }
            }
        }
        .toolbar {
            Button("Add") {
                let task = Task(title: "New Task")
                modelContext.insert(task)   // add to context (auto-saves)
            }
        }
    }
}

// Updating — mutate properties directly, SwiftData tracks changes
task.isCompleted = true
task.title = "Updated title"
// No explicit save needed — autosave handles it
// Or manual save:
try? modelContext.save()
```

---

### Filtering with `#Predicate`

```swift
// Type-safe predicate macro
let highPriority = #Predicate<Task> { task in
    task.priority >= 3 && !task.isCompleted
}

@Query(filter: highPriority, sort: \Task.createdAt) var urgentTasks: [Task]

// Dynamic filter
struct FilteredList: View {
    var minimumPriority: Int

    var body: some View {
        let predicate = #Predicate<Task> { $0.priority >= minimumPriority }
        // Use FetchDescriptor for programmatic queries outside @Query
        let descriptor = FetchDescriptor<Task>(predicate: predicate,
                                               sortBy: [SortDescriptor(\Task.createdAt)])
    }
}
```

---

## Core Data (Pre-iOS 17) — The Battle-Tested Way

### Stack Setup

```swift
import CoreData

class PersistenceController {
    static let shared = PersistenceController()

    let container: NSPersistentContainer

    init(inMemory: Bool = false) {
        container = NSPersistentContainer(name: "MyApp")   // matches .xcdatamodeld name
        if inMemory {
            container.persistentStoreDescriptions.first!.url = URL(fileURLWithPath: "/dev/null")
        }
        container.loadPersistentStores { _, error in
            if let error { fatalError("Core Data error: \(error)") }
        }
        container.viewContext.automaticallyMergesChangesFromParent = true
    }
}
```

### Fetch, Create, Delete

```swift
// Fetch
let request = NSFetchRequest<TaskEntity>(entityName: "TaskEntity")
request.predicate = NSPredicate(format: "isCompleted == NO AND priority >= %d", 3)
request.sortDescriptors = [NSSortDescriptor(key: "createdAt", ascending: false)]
let results = try context.fetch(request)

// Create
let task = TaskEntity(context: context)
task.id = UUID()
task.title = "Core Data Task"
task.createdAt = Date()
try context.save()

// Delete
context.delete(task)
try context.save()
```

### SwiftUI Integration with `@FetchRequest`

```swift
struct CoreDataListView: View {
    @FetchRequest(
        sortDescriptors: [NSSortDescriptor(keyPath: \TaskEntity.createdAt, ascending: false)],
        predicate: NSPredicate(format: "isCompleted == NO"),
        animation: .default
    )
    private var tasks: FetchedResults<TaskEntity>

    @Environment(\.managedObjectContext) private var viewContext

    var body: some View {
        List(tasks) { task in
            Text(task.title ?? "")
        }
    }
}
```

---

## Migration Strategies

| Scenario | SwiftData | Core Data |
|---|---|---|
| Add optional column | Auto — no migration needed | Add attribute as optional |
| Add required column | Add default value in `@Attribute` | Lightweight migration |
| Rename entity | `@Attribute(originalName:)` | Mapping model |
| Complex transformation | Custom `VersionedSchema` | NSMigrationPolicy subclass |

```swift
// SwiftData versioned schemas
enum TaskSchemaV2: VersionedSchema {
    static var models: [any PersistentModel.Type] { [Task.self] }
    static var versionIdentifier = Schema.Version(2, 0, 0)

    @Model class Task {
        var title: String
        var isCompleted: Bool
        var dueDate: Date?   // new field — optional, no migration needed
    }
}
```

---

## Comparison Table

| Feature | SwiftData | Core Data |
|---|---|---|
| Syntax | `@Model` macro, `@Query` | `.xcdatamodeld` + NSManagedObject |
| Minimum OS | iOS 17 / macOS 14 | iOS 3 / macOS 10.4 |
| Thread safety | Actor-based | Explicit context management |
| Predicates | Type-safe `#Predicate` macro | `NSPredicate` string format |
| SwiftUI integration | Native `@Query` | `@FetchRequest` |
| Maturity | New (2023) | Very mature (20+ years) |

---

## Common Pitfalls

1. **`@Model` on struct** — SwiftData models must be classes, not structs. The macro requires a reference type.
2. **Threading Core Data contexts** — `NSManagedObjectContext` is not thread-safe. Always perform operations on the context's queue using `context.perform { }`.
3. **Forgetting `context.save()`** in Core Data — changes are not persisted until `save()` is called. SwiftData autosaves on app lifecycle events but explicit save is available.
4. **`@Query` not updating** — if a `@Query` doesn't react to changes, verify `modelContainer` is injected in the environment. Missing container is a silent failure.
5. **Large `@FetchRequest` result sets** — fetching thousands of objects into memory strains performance. Use `fetchBatchSize` (Core Data) or pagination (SwiftData `FetchDescriptor` with `fetchLimit`/`fetchOffset`).

---

## Review Questions

1. **What does the `@Model` macro do under the hood?**
   *Answer: It synthesizes `PersistentModel` conformance, adds `@Observable` tracking for SwiftUI, generates property accessors that read/write through SwiftData's storage, and registers the class in the schema.*

2. **How does `@Query` differ from `@FetchRequest` in Core Data?**
   *Answer: `@Query` is type-safe (uses Swift keypaths and `#Predicate` macros), requires no entity name strings, and automatically uses the `ModelContext` from the environment. `@FetchRequest` uses string-based `NSPredicate` and requires an `NSManagedObjectContext` in the environment.*

3. **When would you still choose Core Data over SwiftData in a new project?**
   *Answer: When targeting iOS 16 or earlier, when migrating an existing Core Data codebase incrementally, or when you need advanced features (NSFetchedResultsController for UIKit, complex many-to-many with custom join attributes, or background processing with custom merge policies).*

#Swift #SwiftUI #CoreData #SwiftData #Persistence #Database
