# Database Data Flow & Service Interactions

## 🔄 Data Flow Diagrams

### MyDelivery Application Data Flow

```
Customer Request → DELIVERY_REQUEST → DeliveryRequestService
                      ↓
                  DELIVERY_ADDRESS ← Customer selects alternative address
                      ↓
              Check CUSTOMER_DELIV_EXCL ← Apply business rules
                      ↓
              Check DSTCOUNTRY_DELIV_PARMS ← Country-specific rules
                      ↓
                  Process Request
                      ↓
              DEPOT_DELIV_PARMS → If depot collection selected
                      ↓
              SELF_COLLECTION_TIME → Show available time slots
```

### B2C Notification Data Flow

```
External System → CORESV01 (Status Events) → ConsignmentStatusProcessor
                      ↓
                  CORECV01 (Consignment Data) ← Update with new status
                      ↓
              Generate Alerts → COREAV01 (Alert Records)
                      ↓
                  AlertProcessor → Send Email/SMS
                      ↓
              Update COREAV01 ← Processing status
```

### Configuration Data Flow

```
Admin User → MyDeliveryAdminFacade → SYSTEM_PARAMETERS
                ↓                        ↓
           DEPOT_DELIV_PARMS → SELF_COLLECTION_TIME
                ↓
           DSTCOUNTRY_DELIV_PARMS
                ↓
           CUSTOMER_DELIV_EXCL
```

## 📊 Service Interaction Matrix

### MyDelivery Services

| Service | Creates | Reads | Updates | Deletes |
|---------|---------|-------|---------|---------|
| **DeliveryRequestService** | DELIVERY_REQUEST | DELIVERY_REQUEST, DELIVERY_ADDRESS | DELIVERY_REQUEST | DELIVERY_REQUEST (soft) |
| **CustomerDeliveryExclusionService** | CUSTOMER_DELIV_EXCL | CUSTOMER_DELIV_EXCL | CUSTOMER_DELIV_EXCL | CUSTOMER_DELIV_EXCL |
| **DepotDeliveryParametersService** | DEPOT_DELIV_PARMS | DEPOT_DELIV_PARMS, SELF_COLLECTION_TIME | DEPOT_DELIV_PARMS | DEPOT_DELIV_PARMS, SELF_COLLECTION_TIME |
| **DeliverySystemParameterService** | SYSTEM_PARAMETERS | SYSTEM_PARAMETERS | SYSTEM_PARAMETERS | SYSTEM_PARAMETERS |
| **DestinationCountryDeliveryParametersService** | DSTCOUNTRY_DELIV_PARMS | DSTCOUNTRY_DELIV_PARMS | DSTCOUNTRY_DELIV_PARMS | DSTCOUNTRY_DELIV_PARMS |
| **SelfCollectionTimeService** | - | SELF_COLLECTION_TIME | - | SELF_COLLECTION_TIME |
| **MyDeliveryService** | - | All tables (business logic) | - | - |

### B2C Services

| Service | Creates | Reads | Updates | Deletes |
|---------|---------|-------|---------|---------|
| **ConsignmentStatusProcessor** | COREAV01 | CORECV01, CORESV01 | CORECV01 | - |
| **AlertProcessor** | - | COREAV01 | COREAV01 | - |
| **ConsumerAlerter** | - | COREAV01 | COREAV01 | - |

## 🎯 Critical Business Processes

### 1. Customer Redelivery Request Process

**Tables Involved:** DELIVERY_REQUEST, DELIVERY_ADDRESS, CUSTOMER_DELIV_EXCL, DSTCOUNTRY_DELIV_PARMS

**Flow:**
1. Customer submits request → Create DELIVERY_REQUEST
2. Check customer exclusions → Read CUSTOMER_DELIV_EXCL
3. Apply country rules → Read DSTCOUNTRY_DELIV_PARMS  
4. Store alternative address → Create DELIVERY_ADDRESS
5. Process request → Update DELIVERY_REQUEST status

**Services:** DeliveryRequestService, MyDeliveryService, CustomerDeliveryExclusionService

---

### 2. Depot Collection Configuration

**Tables Involved:** DEPOT_DELIV_PARMS, SELF_COLLECTION_TIME

**Flow:**
1. Admin configures depot → Create/Update DEPOT_DELIV_PARMS
2. Set collection times → Create/Update SELF_COLLECTION_TIME
3. Customer views times → Read both tables
4. Customer books slot → Update DELIVERY_REQUEST

**Services:** DepotDeliveryParametersService, SelfCollectionTimeService

---

### 3. B2C Alert Processing

**Tables Involved:** CORESV01, CORECV01, COREAV01, BATCH_*

**Flow:**
1. Status event received → Insert into CORESV01
2. Batch job reads events → ConsignmentStatusProcessor reads CORESV01
3. Update consignment → Update CORECV01
4. Generate alert → Create COREAV01
5. Process alert → AlertProcessor updates COREAV01
6. Send notification → External email/SMS systems

**Services:** ConsignmentStatusProcessor, AlertProcessor, ConsumerAlerter

---

### 4. System Configuration Management

**Tables Involved:** SYSTEM_PARAMETERS, All configuration tables

**Flow:**
1. Admin updates config → MyDeliveryAdminFacade
2. Parameter stored → SYSTEM_PARAMETERS
3. Application reads config → All services
4. Behavior modified → Runtime application behavior

**Services:** DeliverySystemParameterService, MyDeliveryAdminFacade

## 🔍 Data Dependencies

### High Dependencies (Critical)
- **DELIVERY_REQUEST** ← Most MyDelivery functionality depends on this
- **CORECV01** ← All B2C processing depends on this
- **SYSTEM_PARAMETERS** ← Global app behavior

### Medium Dependencies (Important)
- **CUSTOMER_DELIV_EXCL** ← Business rule enforcement
- **DEPOT_DELIV_PARMS** ← Depot operations
- **COREAV01** ← Alert processing and audit

### Low Dependencies (Supporting)
- **SELF_COLLECTION_TIME** ← Depot scheduling only
- **DELIVERY_ADDRESS** ← Alternative address only
- **BATCH_*** ← Framework infrastructure
- **RLRLOV01** ← Location lookup only

## 📈 Performance Considerations

### High-Volume Tables (Require Optimization)
- **CORECV01** - Millions of consignments
- **COREAV01** - Millions of alerts  
- **CORESV01** - Millions of status events
- **DELIVERY_REQUEST** - High customer usage

### Read-Optimized Tables
- **SYSTEM_PARAMETERS** - Cache-friendly
- **CUSTOMER_DELIV_EXCL** - Business rule lookups
- **DSTCOUNTRY_DELIV_PARMS** - Country rule lookups
- **RLRLOV01** - Location reference data

### Write-Optimized Tables  
- **COREAV01** - High insert volume from batch processing
- **CORESV01** - High insert volume from status events
- **DELIVERY_REQUEST** - Customer transaction processing
