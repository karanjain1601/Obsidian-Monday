# Database Tables Quick Reference

## 📊 Tables by Domain

| Domain | Table Name | Primary Purpose | Key Data | Main Services |
|--------|------------|-----------------|----------|---------------|
| **MyDelivery** | DELIVERY_REQUEST | Customer redelivery requests | Consignment ID, status, contact info, delivery preferences | DeliveryRequestService, MyDeliveryService |
| **MyDelivery** | DELIVERY_ADDRESS | Alternative delivery addresses | Address lines, contact details, phone numbers | DeliveryRequestService |
| **MyDelivery** | CUSTOMER_DELIV_EXCL | Customer delivery exclusions | Customer ID, exclusion flags per delivery option | CustomerDeliveryExclusionService |
| **MyDelivery** | DEPOT_DELIV_PARMS | Depot configurations | Depot ID, email settings, collection options | DepotDeliveryParametersService |
| **MyDelivery** | DSTCOUNTRY_DELIV_PARMS | Country delivery rules | Country codes, timing windows, business rules | DestinationCountryDeliveryParametersService |
| **MyDelivery** | SELF_COLLECTION_TIME | Depot collection hours | Day/time schedules, opening hours | SelfCollectionTimeService |
| **MyDelivery** | SYSTEM_PARAMETERS | Global app settings | Configuration key-value pairs | DeliverySystemParameterService |
| **B2C** | CORECV01 | Consignment master data | Consignment details, customer preferences, alert settings | ConsignmentStatusProcessor |
| **B2C** | COREAV01 | Generated alerts | Alert records, status, processing info | AlertProcessor |
| **B2C** | CORESV01 | Status events | Event timestamps, status codes, processing flags | ConsignmentStatusProcessor |
| **Batch** | BATCH_JOB_* | Job execution tracking | Job metadata, execution status, timing | Spring Batch Framework |
| **Location** | RLRLOV01 | Location reference | Location codes, coordinates, names | LocationServiceEnquiryService |

## 🔍 Table Relationships Summary

### Primary Relationships
- **DELIVERY_REQUEST** → **DELIVERY_ADDRESS** (1:N) - Request can have multiple addresses
- **DEPOT_DELIV_PARMS** → **SELF_COLLECTION_TIME** (1:N) - Depot has multiple time slots
- **CORECV01** → **COREAV01** (1:N) - Consignment generates multiple alerts
- **CORECV01** ← **CORESV01** (N:1) - Multiple status events per consignment

### Business Rule Relationships
- **CUSTOMER_DELIV_EXCL** filters available options for customers
- **DSTCOUNTRY_DELIV_PARMS** controls country-specific delivery behavior
- **SYSTEM_PARAMETERS** provides global configuration values

## 📈 Data Volume & Usage Patterns

| Table | Expected Volume | Usage Pattern | Critical For |
|-------|----------------|---------------|--------------|
| DELIVERY_REQUEST | High | CRUD + Search | Customer operations |
| CORECV01 | Very High | Batch read | B2C notifications |
| COREAV01 | Very High | Batch write | Alert processing |
| CORESV01 | Very High | Batch read | Event processing |
| SYSTEM_PARAMETERS | Low | Read-heavy | App configuration |
| CUSTOMER_DELIV_EXCL | Medium | Read-heavy | Business rules |
| DEPOT_DELIV_PARMS | Low | Read-heavy | Depot operations |
| DSTCOUNTRY_DELIV_PARMS | Low | Read-heavy | Country rules |

## 🎯 Business Function Matrix

| Function | Primary Tables | Supporting Tables |
|----------|----------------|-------------------|
| **Customer Redelivery** | DELIVERY_REQUEST, DELIVERY_ADDRESS | CUSTOMER_DELIV_EXCL, DSTCOUNTRY_DELIV_PARMS |
| **Depot Collection** | DEPOT_DELIV_PARMS, SELF_COLLECTION_TIME | DELIVERY_REQUEST |
| **B2C Notifications** | CORECV01, COREAV01, CORESV01 | BATCH_* tables |
| **Admin Configuration** | All parameter tables | SYSTEM_PARAMETERS |
| **Address Validation** | DELIVERY_ADDRESS | RLRLOV01 |
| **Customer Exclusions** | CUSTOMER_DELIV_EXCL | DELIVERY_REQUEST |
| **Batch Processing** | BATCH_* tables | CORECV01, COREAV01, CORESV01 |

## 🔧 Service Access Patterns

### Read-Heavy Services
- **LocationServiceEnquiryService** → RLRLOV01
- **DeliverySystemParameterService** → SYSTEM_PARAMETERS
- **CustomerDeliveryExclusionService** → CUSTOMER_DELIV_EXCL

### Write-Heavy Services  
- **AlertProcessor** → COREAV01
- **ConsignmentStatusProcessor** → CORECV01, CORESV01
- **DeliveryRequestService** → DELIVERY_REQUEST

### Admin Services
- **MyDeliveryAdminFacade** → All MyDelivery tables
- Configuration management across all parameter tables

### Batch Services
- **Spring Batch Framework** → BATCH_* tables
- **B2C Processors** → CORECV01, COREAV01, CORESV01
