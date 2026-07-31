# Complete Database Tables Reference Guide

## Quick Reference Summary

**Total Tables Identified: 32+ tables across 7 functional domains**

| Domain | Table Count | Primary Purpose |
|--------|------------|----------------|
| **MyDelivery** | 8 tables | Core delivery request management |
| **Customer Identification** | 2 tables | Customer profile management |
| **Track & Consignment** | 5 tables | Package tracking system |
| **B2C Notification** | 3 tables | Customer notification system |
| **Common Codes** | 7+ tables | Reference data and business rules |
| **Spring Batch** | 6 tables | Batch processing framework |
| **Location** | 1 table | Geographic reference data |

---

## 📋 Complete Table Inventory

### 🚛 MyDelivery Domain (8 Tables)

| Table Name | Purpose | Key Data | Physical Table |
|------------|---------|----------|----------------|
| **DELIVERY_REQUEST** | Customer redelivery requests | Consignment ID, status, contact info | DDRRRT01 |
| **DELIVERY_ADDRESS** | Alternative delivery addresses | Address details, contact information | DDRDAT01 |
| **CUSTOMER_DELIV_EXCL** | Customer delivery exclusions | Customer restrictions, exclusion flags | DDRDXT01 |
| **DEPOT_DELIV_PARMS** | Depot configurations | Depot settings, email configuration | DDRDPT01 |
| **DSTCOUNTRY_DELIV_PARMS** | Country delivery rules | Country codes, timing windows, business rules | DDRCPT01 |
| **SELF_COLLECTION_TIME** | Depot collection hours | Day/time schedules, opening hours | DDRSCT01 |
| **SYSTEM_PARAMETERS** | Global app settings | Configuration key-value pairs | DDRSPT01 |
| **DDL_LOG** | Database change tracking | Schema changes, deployment history | DDL_LOG |

### 👤 Customer Identification Domain (2 Tables)

| Table Name | Purpose | Key Data | Physical Table |
|------------|---------|----------|----------------|
| **CNRCUV01** | Customer master data | Customer IDs, origin types, country codes | CNRCUV01 |
| **CNRACV01** | Customer accounts | Account IDs, business location ownership | CNRACV01 |

### 📦 Track & Consignment Domain (5 Tables)

| Table Name | Purpose | Key Data | Physical Table |
|------------|---------|----------|----------------|
| **CORCOV01** | Consignment overview | Consignment IDs, legacy mapping, metadata | CORCOV01 |
| **CORCSV01** | Consignment status events | Status codes, event timestamps, delivery details | CORCSV01 |
| **CORCNV01** | Consignment addresses | Delivery addresses, location information | CORCNV01 |
| **CORZDV01** | Consignment data view Z | Specialized consignment data processing | CORZDV01 |
| **CORZPV01** | Consignment data view P | Performance and analytics data | CORZPV01 |

### 📧 B2C Notification Domain (3 Tables)

| Table Name | Purpose | Key Data | Physical Table |
|------------|---------|----------|----------------|
| **CORECV01** | Consignment notification data | Customer preferences, alert settings, contact info | CORECV01 |
| **COREAV01** | Generated alerts | Alert records, processing status, retry counters | COREAV01 |
| **CORESV01** | Status events | Event processing, status tracking | CORESV01 |

### 🔧 Common Codes Domain (7+ Tables)

| Table Name | Purpose | Key Data | Physical Table |
|------------|---------|----------|----------------|
| **NCRBLV01** | Business locations | Location IDs, business units, geographic data | NCRBLV01 |
| **NCRBSV01** | Business schedules | Operating hours, service schedules | NCRBSV01 |
| **NCRBHV02** | Business holidays | Holiday calendars, service interruptions | NCRBHV02 |
| **NCRSDV01** | Status codes | Multi-dimensional status definitions | NCRSDV01 |
| **NCRQSV01** | Quality status mapping | Status-quality relationships | NCRQSV01 |
| **NCRQUV01** | Quality codes | Quality indicators and descriptions | NCRQUV01 |
| **NCRQLV01** | Quality language | Multi-language quality descriptions | NCRQLV01 |

### 🔄 Spring Batch Domain (6 Tables)

| Table Name | Purpose | Key Data | Physical Table |
|------------|---------|----------|----------------|
| **BATCH_JOB_INSTANCE** | Job definitions | Job names, instances | BATCH_JOB_INSTANCE |
| **BATCH_JOB_EXECUTION** | Job execution tracking | Execution status, timing, results | BATCH_JOB_EXECUTION |
| **BATCH_JOB_EXECUTION_PARAMS** | Job parameters | Execution parameters | BATCH_JOB_EXECUTION_PARAMS |
| **BATCH_STEP_EXECUTION** | Step execution tracking | Step status, counts, performance | BATCH_STEP_EXECUTION |
| **BATCH_STEP_EXECUTION_CONTEXT** | Step context data | Step execution state | BATCH_STEP_EXECUTION_CONTEXT |
| **BATCH_JOB_EXECUTION_CONTEXT** | Job context data | Job execution state | BATCH_JOB_EXECUTION_CONTEXT |

### 📍 Location Domain (1 Table)

| Table Name | Purpose | Key Data | Physical Table |
|------------|---------|----------|----------------|
| **RLRLOV01** | Location reference | Location codes, coordinates, names | RLRLOV01 |

---

## 🔍 Cross-Domain Integration Matrix

| Source Domain | Target Domain | Integration Type | Business Purpose |
|---------------|---------------|------------------|------------------|
| MyDelivery | Track/Consignment | Logical Link | Request tracking via consignment ID |
| Customer ID | MyDelivery | Data Validation | Customer profile drives delivery exclusions |
| Track/Consignment | B2C Notification | Event-Driven | Status changes trigger notifications |
| Common Codes | All Domains | Reference Data | Status validation, location lookup |
| Location | MyDelivery | Address Services | Address validation and geocoding |
| Spring Batch | B2C Notification | Processing Framework | Batch notification processing |

---

## 📊 Service Access Patterns by Domain

### MyDelivery Services
| Service | Primary Tables | Access Pattern |
|---------|----------------|---------------|
| **DeliveryRequestService** | DELIVERY_REQUEST, DELIVERY_ADDRESS | High-volume CRUD |
| **CustomerDeliveryExclusionService** | CUSTOMER_DELIV_EXCL | Read-heavy validation |
| **DepotDeliveryParametersService** | DEPOT_DELIV_PARMS, SELF_COLLECTION_TIME | Configuration lookup |
| **DeliverySystemParameterService** | SYSTEM_PARAMETERS | Global configuration |

### Customer & Tracking Services
| Service | Primary Tables | Access Pattern |
|---------|----------------|---------------|
| **Customer Identity Services** | CNRCUV01, CNRACV01 | Customer lookup and validation |
| **Consignment Tracking Services** | CORCOV01, CORCSV01, CORCNV01 | Real-time tracking queries |
| **Control-M Jobs** | CORZDV01, CORZPV01 | Batch data processing |

### B2C & Notification Services
| Service | Primary Tables | Access Pattern |
|---------|----------------|---------------|
| **ConsignmentStatusProcessor** | CORECV01, CORESV01 | Event-driven processing |
| **AlertProcessor** | COREAV01 | High-volume alert generation |
| **ConsumerAlerter** | COREAV01 | Notification dispatch |

### Common Codes Services
| Service | Primary Tables | Access Pattern |
|---------|----------------|---------------|
| **Business Location Services** | NCRBLV01, NCRBSV01, NCRBHV02 | Location and schedule lookup |
| **Status Validation Services** | NCRSDV01, NCRQSV01, NCRQUV01, NCRQLV01 | Status code validation |

---

## 🎯 Business Function Cross-Reference

### Core Business Functions

| Function | Primary Domain | Supporting Domains | Key Tables |
|----------|----------------|-------------------|------------|
| **Customer Redelivery Request** | MyDelivery | Customer ID, Common Codes | DELIVERY_REQUEST, CNRCUV01, NCRSDV01 |
| **Package Tracking** | Track/Consignment | B2C Notification | CORCOV01, CORCSV01, CORECV01 |
| **Customer Notifications** | B2C Notification | Track/Consignment, Customer ID | COREAV01, CORCSV01, CNRCUV01 |
| **Depot Collection** | MyDelivery | Common Codes | DEPOT_DELIV_PARMS, SELF_COLLECTION_TIME, NCRBLV01 |
| **Address Validation** | Location | MyDelivery | RLRLOV01, DELIVERY_ADDRESS |
| **Status Quality Management** | Common Codes | All domains | NCRSDV01, NCRQSV01, NCRQUV01, NCRQLV01 |
| **Batch Processing** | Spring Batch | B2C Notification | BATCH_*, CORECV01, COREAV01 |

### Data Flow Patterns

1. **Customer Request Flow**
   ```
   CNRCUV01 → DELIVERY_REQUEST → CORCOV01 → CORECV01
   Customer → Request → Tracking → Notifications
   ```

2. **Status Update Flow**
   ```
   CORCSV01 → NCRSDV01/NCRQSV01 → CORESV01 → COREAV01
   Event → Validation → Processing → Alert
   ```

3. **Configuration Flow**
   ```
   DSTCOUNTRY_DELIV_PARMS → DEPOT_DELIV_PARMS → SELF_COLLECTION_TIME
   Country Rules → Depot Config → Collection Hours
   ```

---

## 📈 Volume & Performance Characteristics

### High-Volume Tables (Millions of Records)
- **CORECV01** - Consignment master data
- **COREAV01** - Alert records (high insert/update volume)
- **CORCSV01** - Status events (continuous inserts)
- **CORESV01** - Processed events

### Medium-Volume Tables (Thousands of Records)
- **DELIVERY_REQUEST** - Customer requests
- **CORCOV01** - Consignment tracking
- **CNRCUV01** - Customer profiles

### Low-Volume Tables (Configuration Data)
- **SYSTEM_PARAMETERS** - Global settings
- **DEPOT_DELIV_PARMS** - Depot configurations
- **DSTCOUNTRY_DELIV_PARMS** - Country rules
- **NCRBLV01** - Business locations

### Batch Processing Tables
- **BATCH_*** - Spring Batch framework (moderate volume)
- **CORZDV01**, **CORZPV01** - Batch processing views

---

## 🔧 Database Administration Notes

### Critical Tables for Operations
1. **CORECV01** - B2C notification heart
2. **DELIVERY_REQUEST** - MyDelivery core
3. **SYSTEM_PARAMETERS** - Global configuration
4. **NCRSDV01/NCRQSV01** - Status validation

### Backup Priority
- **High**: All transactional tables (DELIVERY_REQUEST, CORECV01, COREAV01)
- **Medium**: Configuration tables (SYSTEM_PARAMETERS, DEPOT_DELIV_PARMS)
- **Low**: Reference data (NCRBLV01, RLRLOV01)

### Monitoring Focus
- **Performance**: COREAV01 (alert generation), CORCSV01 (status events)
- **Growth**: CORECV01, COREAV01, CORESV01
- **Availability**: DELIVERY_REQUEST, SYSTEM_PARAMETERS

This comprehensive reference covers all 32+ tables identified across the complete delivery ecosystem, providing quick access to table purposes, relationships, and operational characteristics.
