---
title: "Spring Data MongoDB"
aliases: ["MongoRepository", "@Document", "MongoDB Spring", "Aggregation Pipeline Java"]
tags: [java, spring, spring-data, intermediate]
domain: Java
difficulty: intermediate
created: 2026-07-26
related: ["[[Spring_Data_JPA]]", "[[Repository_Pattern]]", "[[JPQL_and_Criteria_API]]"]
status: complete
---

# 🍃 Spring Data MongoDB

> [!abstract] TL;DR
> Spring Data MongoDB maps Java objects to MongoDB documents using `@Document`. `MongoRepository` provides the same derived-query magic as JPA repositories but for MongoDB collections. `MongoTemplate` gives low-level access to MongoDB operations. The **Aggregation Pipeline** is MongoDB's powerful data transformation mechanism — use it for grouping, lookups, and complex projections that go beyond simple find queries.

## Intuition — analogy FIRST
MongoDB is like a filing cabinet of JSON sticky notes (documents) instead of rows in a spreadsheet (relational table). A JPA `@Entity` maps one class to one table row — rigid, every row has the same columns. A `@Document` maps one class to a JSON blob — flexible, each document can have different fields and nested objects. A user in JPA requires an `addresses` table with foreign keys; in MongoDB, addresses are just embedded in the user document itself.

---

## How It Works

```mermaid
graph TD
    Java["@Document class\nJava object"]
    Mongo["MongoDB Collection\nBSON documents"]
    MR["MongoRepository\nderived queries, CRUD"]
    MT["MongoTemplate\nlow-level: Criteria, Update, Aggregation"]
    Agg["Aggregation Pipeline\n$match $group $lookup $project"]

    Java <-->|"MongoConverter\n(type mapping)"| Mongo
    MR -->|"uses"| MT
    MT -->|"runs"| Agg
    Agg -->|"query"| Mongo

    style Java fill:#4a9eff,color:#fff
    style Mongo fill:#7ed321,color:#fff
    style MT fill:#7c3aed,color:#fff
    style Agg fill:#e64980,color:#fff
```

## Key Concepts / Details

### Setup

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-mongodb</artifactId>
</dependency>
```

```yaml
# application.yml
spring:
  data:
    mongodb:
      uri: mongodb://localhost:27017/mydb
      # or with auth:
      # uri: mongodb://user:password@localhost:27017/mydb?authSource=admin
```

### Document Mapping

```java
@Document(collection = "users")   // maps to "users" collection
@CompoundIndex(def = "{'email': 1}", unique = true)  // compound index
public class User {

    @Id                           // maps to MongoDB's _id field
    private String id;            // String (MongoDB ObjectId as string) or ObjectId type

    @Field("email_addr")          // override field name in document
    private String email;

    @Indexed(unique = true)       // single-field index
    private String username;

    private String name;

    // Embedded document — stored inline (no join)
    private Address address;

    // List of embedded documents
    private List<OrderSummary> recentOrders = new ArrayList<>();

    @DBRef                        // reference to another document (like FK, lazy by default)
    private Team team;

    @CreatedDate                  // auto-populated by Spring Data auditing
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;

    @Version                      // optimistic locking — incremented on each save
    private Long version;
}

// Embedded value objects (no @Document — they're embedded)
public record Address(
    String street,
    String city,
    String country,
    String postalCode
) {}

// Enable auditing
@Configuration
@EnableMongoAuditing
public class MongoConfig {}
```

### MongoRepository — Derived Queries

```java
public interface UserRepository extends MongoRepository<User, String> {

    // Same derived-query syntax as JPA
    Optional<User> findByEmail(String email);
    List<User> findByAddressCity(String city);    // nested field: address.city
    List<User> findByRecentOrdersProductId(String productId); // nested list field

    // MongoDB-specific: near geospatial query
    List<User> findByLocationNear(Point location, Distance distance);

    // Regex query
    List<User> findByNameRegex(String pattern);

    // @Query with MongoDB JSON query syntax
    @Query("{ 'email': ?0, 'address.country': ?1 }")
    List<User> findByEmailAndCountry(String email, String country);

    // Projection — return only specific fields
    @Query(value = "{ 'status': ?0 }", fields = "{ 'email': 1, 'name': 1 }")
    List<User> findEmailAndNameByStatus(String status);

    // Pagination works the same as JPA
    Page<User> findByAddressCountry(String country, Pageable pageable);
}
```

### MongoTemplate — Low-Level Operations

```java
@Service
public class UserSearchService {
    private final MongoTemplate mongoTemplate;

    // Query with Criteria builder
    public List<User> searchUsers(String name, String city, int minAge) {
        Criteria criteria = new Criteria();
        if (name != null) criteria.and("name").regex(name, "i");  // case-insensitive regex
        if (city != null) criteria.and("address.city").is(city);
        if (minAge > 0) criteria.and("age").gte(minAge);

        Query query = new Query(criteria)
            .limit(50)
            .skip(0)
            .with(Sort.by(Sort.Direction.DESC, "createdAt"));

        return mongoTemplate.find(query, User.class);
    }

    // Update
    public void activateUser(String userId) {
        Query query = new Query(Criteria.where("id").is(userId));
        Update update = new Update()
            .set("status", "ACTIVE")
            .set("updatedAt", Instant.now())
            .inc("loginCount", 1);          // increment

        mongoTemplate.updateFirst(query, update, User.class);
    }

    // Upsert (insert if not exists, update if exists)
    public void upsertUserPreference(String userId, String key, Object value) {
        Query query = new Query(Criteria.where("userId").is(userId));
        Update update = new Update().set("preferences." + key, value);
        mongoTemplate.upsert(query, update, UserPreferences.class);
    }

    // Delete
    public void deleteInactiveUsers(LocalDateTime cutoff) {
        Query query = new Query(
            Criteria.where("status").is("INACTIVE")
                    .and("lastLoginAt").lt(cutoff));
        mongoTemplate.remove(query, User.class);
    }
}
```

### Aggregation Pipeline

```java
@Service
public class OrderAnalyticsService {
    private final MongoTemplate mongoTemplate;

    // GROUP BY equivalent — order stats per customer
    public List<CustomerStats> getCustomerOrderStats() {
        Aggregation agg = Aggregation.newAggregation(
            Aggregation.match(Criteria.where("status").is("COMPLETED")),  // $match
            Aggregation.group("customerId")                               // $group by customerId
                .count().as("orderCount")
                .sum("totalAmount").as("totalSpent")
                .first("customerId").as("customerId"),
            Aggregation.sort(Sort.Direction.DESC, "totalSpent"),          // $sort
            Aggregation.limit(100)                                        // $limit
        );

        return mongoTemplate.aggregate(agg, "orders", CustomerStats.class)
            .getMappedResults();
    }

    // $lookup — equivalent to SQL JOIN
    public List<OrderWithCustomer> getOrdersWithCustomers(String status) {
        Aggregation agg = Aggregation.newAggregation(
            Aggregation.match(Criteria.where("status").is(status)),
            Aggregation.lookup("users",          // from collection
                               "customerId",     // localField
                               "_id",            // foreignField
                               "customer"),      // as
            Aggregation.unwind("customer"),      // flatten the array $lookup returns
            Aggregation.project("_id", "totalAmount", "status")
                .and("customer.name").as("customerName")
                .and("customer.email").as("customerEmail")
        );

        return mongoTemplate.aggregate(agg, "orders", OrderWithCustomer.class)
            .getMappedResults();
    }

    // $facet — multiple aggregations in parallel (for faceted search)
    public SearchResult facetedSearch(SearchFilter filter) {
        Aggregation agg = Aggregation.newAggregation(
            Aggregation.match(buildCriteria(filter)),
            Aggregation.facet(
                Aggregation.count().as("count")
            ).as("totalCount")
             .and(
                Aggregation.group("category").count().as("count")
             ).as("categoryCounts")
        );

        return mongoTemplate.aggregate(agg, "products", SearchResult.class)
            .getUniqueMappedResult();
    }
}
```

---

## Real-World Notes

- **Embedded vs `@DBRef`**: prefer embedding for data that is always read/written together (address with user, order lines with order). Use `@DBRef` only when you need to reference documents independently. `@DBRef` triggers an additional query per reference — it's not a JOIN.
- **Schema flexibility is a double-edged sword**: MongoDB lets you store any structure, which is great for evolving schemas but means your application must handle documents with missing/different fields gracefully. Add `@BsonIgnoreIfNull` or null checks.
- **ObjectId as String**: using `String id` auto-generates MongoDB ObjectIds stored as strings. This works but loses the timestamp embedded in ObjectId. Use `ObjectId id` if you need the embedded creation time.
- **Transactions in MongoDB**: MongoDB 4.0+ supports multi-document ACID transactions. Use `@Transactional` with a `MongoTransactionManager` bean for operations that must be atomic across multiple documents.

---

## Common Pitfalls

- **N+1 with `@DBRef`**: accessing `user.getTeam()` on 1000 users with `@DBRef` triggers 1000 separate queries. Prefer embedding or use `$lookup` in an aggregation pipeline.
- **Case-sensitive collection name**: `@Document(collection = "Users")` vs `@Document(collection = "users")` — MongoDB is case-sensitive on collection names. Inconsistent naming causes silent data isolation.
- **Aggregation result mapping**: the aggregation result field names must match the output DTO's field names exactly. A mismatch silently maps to `null`.
- **Missing index on frequent query fields**: MongoDB does a full collection scan without an index. Add `@Indexed` on fields used in `find()` queries and check query plans with `explain()`.

---

## Related Concepts

- [[Spring_Data_JPA]] — Relational alternative; compare embedded vs join-based relationships
- [[Repository_Pattern]] — MongoRepository extends the same abstraction
- [[JPQL_and_Criteria_API]] — Criteria API parallels MongoDB's Criteria builder

---

## Review Questions

1. What is the difference between an embedded document and `@DBRef` in MongoDB? When would you use each?
2. How does Spring Data MongoDB's derived query `findByAddressCity` know to query the nested field?
3. What is the MongoDB Aggregation Pipeline equivalent of SQL's `GROUP BY`, `JOIN`, and `WHERE`?
4. What is the N+1 problem in MongoDB and how do you fix it using aggregation?
5. How does optimistic locking work in Spring Data MongoDB?

---

## Sources

- Spring Data MongoDB Reference: https://docs.spring.io/spring-data/mongodb/docs/current/reference/html/
- MongoDB Aggregation Pipeline: https://www.mongodb.com/docs/manual/aggregation/

#java #spring #spring-data #mongodb #document #mongorepository #mongotemplate #aggregation-pipeline
