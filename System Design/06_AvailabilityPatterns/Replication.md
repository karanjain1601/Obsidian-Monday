---
title: Replication
tags: [SystemDesign, Availability, Reliability, DistributedSystems, Replication]
---

# 🧬 Replication

## 🧠 Core Idea

**Replication** is an availability pattern that involves maintaining **multiple copies of the same data** across different servers or locations.

If one node fails, data can still be retrieved from another replica, ensuring **high availability, fault tolerance, and data durability**.

> Goal: **Avoid data loss and keep systems operational during failures.**

---

## 📖 Definition

Replication ensures that data written to one node is **copied to other nodes**, so the system continues to function even if a server crashes or a network partition occurs.

It is a fundamental building block of:
- Distributed databases
- Microservices
- Cloud storage systems

---

## 🎯 Why Replication Matters

- Prevents data loss  
- Improves system availability  
- Enables failover mechanisms  
- Supports disaster recovery  
- Helps scale read workloads  

---

## 🧩 Types of Replication

### 1️⃣ Master–Slave Replication

#### 🧠 Concept
- One server acts as the **Master** (handles all writes).
- Multiple **Slave** servers replicate data from the master.
- Slaves typically serve **read requests**.

#### ⚙️ Behavior
- If the master fails → a slave can be **promoted** to master.
- Simple and widely used.

#### ✅ Advantages
- Easy to implement  
- Prevents write conflicts  
- Good for read scaling  

#### ❌ Disadvantages
- Master is a single write bottleneck  
- Failover required if master crashes  

#### 💡 Examples
- MySQL replication  
- PostgreSQL streaming replication  

---

### 2️⃣ Master–Master Replication (Multi-Leader)

#### 🧠 Concept
- Multiple servers act as **masters**.
- Each node can accept **reads and writes**.
- Data is synchronized across all masters.

#### ⚙️ Behavior
- If one master fails → others continue serving traffic.
- Requires **conflict resolution** for simultaneous updates.

#### ✅ Advantages
- High availability  
- No single point of write failure  

#### ❌ Disadvantages
- Complex conflict resolution  
- Risk of data inconsistency  

#### 💡 Examples
- Cassandra  
- CouchDB  
- DynamoDB global tables  

---

## ⚖️ Comparison

| Aspect | Master–Slave | Master–Master |
|--------|--------------|---------------|
| Write Nodes | Single | Multiple |
| Read Scaling | High | High |
| Write Scaling | Limited | High |
| Conflict Risk | None | Possible |
| Complexity | Low | High |
| Availability | Medium | Very High |

---

## 🧠 Replication vs Backup

| Replication | Backup |
|-------------|--------|
| Real-time data copying | Periodic snapshots |
| Enables high availability | Enables disaster recovery |
| Prevents downtime | Prevents data loss after catastrophe |

Both are usually used together in production systems.

---

## 🏗️ Replication in System Design

Replication directly supports:
- [[Failover]]  
- [[Availability Patterns]]  
- [[Consistency Patterns]]  
- [[Disaster Recovery]]  

It is also tightly connected to:
- [[CAP Theorem]]  
- [[Quorum Reads and Writes]]  

---

## 🖼️ Diagram Placeholder

Add an image to your Obsidian vault:

```
![[replication-architecture-diagram.png]]
```

---

## 📚 Source

- System Design Primer — Replication  
  https://github.com/donnemartin/system-design-primer#replication

---

## 🏷️ Tags

#SystemDesign #Replication #DistributedSystems #HighAvailability
