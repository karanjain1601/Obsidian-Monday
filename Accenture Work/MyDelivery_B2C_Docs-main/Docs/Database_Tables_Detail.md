# Database Tables - Complete Data Content, Significance & Service Usage

## Table Documentation Format

This document provides detailed information about each table including:
1. **Table Significance** - What business purpose it serves
2. **Data Content** - What type of data is stored
3. **Service Usage** - Which services/components access the table
4. **Key Business Functions** - What functionality depends on this table

**Total Tables Identified: 25+ tables across 7 domains**

---

## 🚛 MyDelivery Domain Tables

### 1. DELIVERY_REQUEST (Primary Table: DDRRRT01)

**📋 Table Significance:**
- Central entity for managing redelivery requests
- Tracks the complete lifecycle of customer delivery requests
- Core business entity that drives the entire MyDelivery workflow

**📊 Data Content:**
- Customer redelivery requests with consignment tracking
- Contact information (email, phone numbers)
- Delivery preferences and instructions
- Status tracking (Created, Open, Closed)
- Delivery dates (requested vs planned)
- Alternative delivery addresses

**🔧 Service Usage:**
- `DefaultDeliveryRequestService` - Main CRUD operations
- `DefaultMyDeliveryService` - Customer-facing operations
- `MyDeliveryAdminFacade` - Admin management functions
- `DeliveryAsyncMessageProcessorMDB` - Async processing
- `DefaultMyDeliveryAdminFacade` - Administrative interface

**🎯 Key Business Functions:**
- Customer redelivery request submission
- Request status management 
- Email notification dispatch
- Admin console management
- Reporting and analytics

---

### 2. DELIVERY_ADDRESS (Primary Table: DDRDAT01)

**📋 Table Significance:**
- Stores alternative delivery addresses for customer requests
- Enables flexible delivery options beyond original address
- Critical for address validation and geocoding

**📊 Data Content:**
- Complete address information (lines 1-3, city, postal code)
- Contact details (name, company)
- Phone numbers (mobile, home, work)
- Country/region information

**🔧 Service Usage:**
- `DefaultDeliveryRequestService` - Links addresses to requests
- `MyDeliveryLocationServiceEnquiryService` - Address validation
- Admin interfaces for address management

**🎯 Key Business Functions:**
- Alternative delivery address selection
- Address validation and geocoding
- Customer contact information management

---

### 3. CUSTOMER_DELIV_EXCL (Primary Table: DDRDXT01)

**📋 Table Significance:**
- Manages customer-specific delivery option exclusions
- Controls which delivery options are available per customer
- Enforces business rules and customer preferences

**📊 Data Content:**
- Customer ID mappings
- Exclusion flags for each delivery option:
  - Redelivery to original address
  - Collection from depot
  - Delivery to alternative address
  - Leave in absence options

**🔧 Service Usage:**
- `DefaultCustomerDeliveryExclusionService` - Main management
- `DefaultMyDeliveryAdminFacade` - Admin configuration
- Business rule validation services

**🎯 Key Business Functions:**
- Customer delivery option restrictions
- Business rule enforcement
- Admin configuration of exclusions
- Global vs country-specific exclusions

---

### 4. DEPOT_DELIV_PARMS (Primary Table: DDRDPT01)

**📋 Table Significance:**
- Configures depot-specific delivery parameters
- Manages collection point settings and capabilities
- Controls depot operational configurations

**📊 Data Content:**
- Depot ID references
- Email addresses for delivery requests
- Collection allowance flags
- Self-collection time configurations

**🔧 Service Usage:**
- `DefaultDepotDeliveryParametersService` - Configuration management
- `DefaultSelfCollectionTimeService` - Time slot management
- Admin interfaces for depot configuration

**🎯 Key Business Functions:**
- Depot collection point management
- Self-collection time slot configuration
- Email notification routing
- Depot capability management

---

### 5. DSTCOUNTRY_DELIV_PARMS (Primary Table: DDRCPT01)

**📋 Table Significance:**
- Country-level delivery configuration and business rules
- Manages delivery windows and administrative settings
- Controls country-specific delivery behavior

**📊 Data Content:**
- Country ISO codes
- Admin window days (how long before delivery)
- Delivery window days (time frame for delivery)
- Data retention periods
- Catchment area validation settings
- Default collection times
- Country-specific delivery option selections

**🔧 Service Usage:**
- `DefaultDestinationCountryDeliveryParametersService` - Configuration
- Country-specific business logic validation
- Admin configuration interfaces

**🎯 Key Business Functions:**
- Country-specific delivery rules
- Business process timing configuration
- Data retention policy enforcement
- Regional delivery option management

---

### 6. SELF_COLLECTION_TIME (Primary Table: DDRSCT01)

**📋 Table Significance:**
- Manages depot self-collection time slots
- Defines when customers can collect packages
- Critical for depot operational scheduling

**📊 Data Content:**
- Day of week schedules
- Opening and closing times per day
- Depot-specific time configurations
- Links to depot parameters

**🔧 Service Usage:**
- `DefaultSelfCollectionTimeService` - Time slot management
- `DefaultDepotDeliveryParametersService` - Associated with depot config
- Customer-facing collection time display

**🎯 Key Business Functions:**
- Customer collection appointment scheduling
- Depot operational hour management
- Collection time display to customers

---

### 7. SYSTEM_PARAMETERS (Primary Table: DDRSPT01)

**📋 Table Significance:**
- Global application configuration settings
- Runtime parameter management
- System behavior control

**📊 Data Content:**
- Parameter names (keys)
- Parameter values (configuration settings)
- System-level configuration like:
  - `ADDITIONAL_ALLOWED_LOCALES`
  - `PLANNED_DELIVERY_STATUSSES`
  - `WA_ERROR_STATUSSES`

**🔧 Service Usage:**
- `DefaultDeliverySystemParameterService` - Parameter management
- `DefaultMyDeliveryAdminFacade` - Admin configuration
- All services for configuration lookup

**🎯 Key Business Functions:**
- Global system configuration
- Feature toggle management
- Business rule parameter storage
- Admin system maintenance

---

## 📧 B2C Notification Domain Tables

### 8. CORECV01 (Consignment Data Table)

**📋 Table Significance:**
- Central consignment and customer data repository
- Drives the entire B2C notification workflow
- Master data for notification processing

**📊 Data Content:**
- Consignment identifiers and metadata
- Customer contact preferences (email, SMS)
- Delivery timing information
- Alert type configurations (8 different alert types)
- Language and country preferences
- Customer notification preferences
- Service management options (SMO IDs 1-8)

**🔧 Service Usage:**
- `ConsignmentStatusProcessor` - Reads consignment data for processing
- `AlertProcessor` - Uses for notification generation
- B2C batch jobs for notification processing

**🎯 Key Business Functions:**
- Customer notification preference management
- Consignment tracking data storage
- Alert configuration and routing
- Multi-language notification support

---

### 9. COREAV01 (Alert Data Table)

**📋 Table Significance:**
- Stores generated notification/alert records
- Tracks notification processing status
- Audit trail for customer communications

**📊 Data Content:**
- Alert timestamps and types
- Processing status codes
- Template configurations
- Retry counters for failed notifications
- Additional alert information
- Language preferences
- Business unit references

**🔧 Service Usage:**
- `AlertProcessor` - Creates and updates alert records
- `ConsumerAlerter` - Processes notifications
- B2C batch processing for alert management

**🎯 Key Business Functions:**
- Email/SMS notification generation
- Notification status tracking
- Communication audit trail
- Failed notification retry management

---

### 10. CORESV01 (Status Event Table)

**📋 Table Significance:**
- Tracks consignment status change events
- Triggers for notification generation
- Event-driven processing foundation

**📊 Data Content:**
- Status event timestamps
- Status codes (XSF, XSS, XSG, XSD)
- Processing indicators
- Business unit references
- Event review dates

**🔧 Service Usage:**
- `ConsignmentStatusProcessor` - Processes status changes
- B2C batch jobs for event-driven notifications
- Status change monitoring services

**🎯 Key Business Functions:**
- Status change event tracking
- Notification trigger management
- Event-driven workflow processing
- Status audit trail

---

## 🔄 Spring Batch Framework Tables

### 11-16. BATCH_* Tables

**📋 Table Significance:**
- Support Spring Batch framework for B2C processing
- Job execution tracking and management
- Batch processing workflow control

**📊 Data Content:**
- Job instance and execution metadata
- Step execution details and status
- Job parameters and context
- Execution timing and status tracking

**🔧 Service Usage:**
- `B2cJobParametersIncrementer` - Job parameter management
- Spring Batch framework infrastructure
- B2C notification batch jobs

**🎯 Key Business Functions:**
- Batch job execution management
- Processing status monitoring
- Job restart and recovery
- Performance monitoring

---

## 📍 Location Service Tables

### 17. RLRLOV01 (Location Reference Table)

**📋 Table Significance:**
- Reference data for location and geocoding
- Supports address validation and mapping
- Geographic coordinate storage

**📊 Data Content:**
- Location identifiers and codes
- Geographic coordinates (X, Y)
- Location names and descriptions

**🔧 Service Usage:**
- `LocationServiceEnquiryService` - Location lookup
- `MyDeliveryLocationServiceEnquiryService` - Geocoding support
- Address validation services

**🎯 Key Business Functions:**
- Address validation and geocoding
- Location reference lookup
- Geographic coordinate management
- Mapping and routing support

---

## 👤 Customer Identification Domain Tables

### 18. CNRCUV01 (Customer Data Table)

**📋 Table Significance:**
- Master customer data repository
- Customer identification and profile management
- Core customer information for delivery services

**📊 Data Content:**
- Customer IDs (CUS_ID) - Primary identifier
- Country ISO codes (COU_ISO_ID)
- Customer origin type codes (CUS_ORGN_TYPE_CD)
- Customer profile and demographic data
- Business relationship information

**🔧 Service Usage:**
- Customer identification services
- MyDelivery customer lookup
- B2C customer validation
- Admin customer management

**🎯 Key Business Functions:**
- Customer identity verification
- Customer profile management
- Cross-system customer linking
- Customer segmentation and classification

---

### 19. CNRACV01 (Customer Account Data Table)

**📋 Table Significance:**
- Customer account and business relationship management
- Links customers to business locations
- Account-level configuration and permissions

**📊 Data Content:**
- Customer Account IDs (CAC_ID)
- Business location ownership (BUL_CSYS_ID_OWN)
- Account relationship data
- Business unit associations
- Account-level preferences

**🔧 Service Usage:**
- Customer account services
- Business location mapping
- Account permission validation
- Customer-depot relationship management

**🎯 Key Business Functions:**
- Customer-business location mapping
- Account-level delivery permissions
- Business relationship management
- Multi-location customer support

---

## 📦 Track & Consignment Domain Tables

### 20. CORCOV01 (Consignment Overview Table)

**📋 Table Significance:**
- Master consignment tracking data
- Links legacy and new consignment identifiers
- Core table for package tracking functionality

**📊 Data Content:**
- Consignment IDs (CON_ID) - Primary identifier
- Legacy consignment IDs (CON_LEGACY_ID)
- Business system identifiers
- Consignment metadata and status
- Tracking event timestamps
- Update and soft lock information

**🔧 Service Usage:**
- Consignment tracking services
- MyDelivery package lookup
- B2C status notification services
- Track and trace functionality

**🎯 Key Business Functions:**
- Package tracking and tracing
- Consignment status management
- Legacy system integration
- Customer tracking queries

---

### 21. CORCSV01 (Consignment Status Table)

**📋 Table Significance:**
- Detailed consignment status event history
- Event-driven status tracking
- Audit trail for package journey

**📊 Data Content:**
- Status event timestamps (COS_EVENT_TD)
- Status quality codes (XSF_ID, XSS_ID, XSG_ID, XSD_ID)
- Event details and remarks
- Location and business unit context
- Signature and delivery confirmation
- Package count and delivery details

**🔧 Service Usage:**
- ConsignmentStatusProcessor (B2C)
- Status update services
- Event-driven notification triggers
- Tracking and audit services

**🎯 Key Business Functions:**
- Real-time status updates
- Event-driven notifications
- Delivery confirmation tracking
- Status history audit trail

---

### 22. CORCNV01 (Consignment Address Table)

**📋 Table Significance:**
- Consignment delivery address information
- Links consignments to delivery locations
- Address validation and geocoding support

**📊 Data Content:**
- Consignment address details
- Delivery location information
- Address validation status
- Geographic coordinates
- Address change history

**🔧 Service Usage:**
- Address validation services
- Delivery routing services
- Location-based services
- Address change management

**🎯 Key Business Functions:**
- Delivery address management
- Route planning and optimization
- Address validation and correction
- Location-based delivery options

---

### 23-24. CORZDV01 & CORZPV01 (Consignment Data Views)

**📋 Table Significance:**
- Specialized consignment data views
- Support specific business processes
- Data aggregation and reporting tables

**📊 Data Content:**
- Filtered consignment data
- Process-specific information
- Performance and analytics data
- Business intelligence support

**🔧 Service Usage:**
- Control-M batch jobs (ZCOCSCC07)
- Reporting and analytics services
- Business intelligence queries
- Performance monitoring

**🎯 Key Business Functions:**
- Automated data processing
- Business reporting and analytics
- Performance monitoring
- Data warehouse support

---

## 🔧 Common Codes Domain Tables

### 25. NCRBLV01 (Business Location Table)

**📋 Table Significance:**
- Master business location reference data
- Depot and service point information
- Geographic business unit management

**📊 Data Content:**
- Business location IDs (BUL_CSYS_ID)
- Business location codes (BUL_ID)
- Location details and metadata
- Geographic and operational information

**🔧 Service Usage:**
- Business location services
- Depot management systems
- Location-based routing
- Service point configuration

**🎯 Key Business Functions:**
- Business location management
- Depot and service point operations
- Location-based service delivery
- Geographic service coverage

---

### 26. NCRBSV01 (Business Location Schedule Table)

**📋 Table Significance:**
- Business location operating schedules
- Service time management
- Operational hour configuration

**📊 Data Content:**
- Business location operating hours
- Service type schedules (STF_ID = 'OPS')
- Day-specific timing information
- Schedule effective dates

**🔧 Service Usage:**
- Schedule management services
- Operating hour validation
- Service availability checking
- Customer facing schedule display

**🎯 Key Business Functions:**
- Operating hour management
- Service availability validation
- Customer schedule information
- Operational planning support

---

### 27. NCRBHV02 (Business Location Holidays Table)

**📋 Table Significance:**
- Business location holiday calendar
- Service interruption management
- Holiday schedule configuration

**📊 Data Content:**
- Holiday dates (BOH_END_DT)
- Business location holiday schedules
- Holiday duration and type
- Service impact information

**🔧 Service Usage:**
- Holiday calendar services
- Service availability validation
- Schedule planning systems
- Customer notification systems

**🎯 Key Business Functions:**
- Holiday schedule management
- Service interruption planning
- Customer expectation management
- Operational calendar maintenance

---

### 28-33. Status Quality Code Tables (NCRSDV01, NCRQSV01, NCRQUV01, NCRQLV01)

**📋 Table Significance:**
- Status and quality code management system
- Multi-dimensional status coding
- Language-specific status descriptions

**📊 Data Content:**
- Status dimension codes (XSF_ID, XSS_ID, XSG_ID, XSD_ID)
- Quality indicators (QLT_ID)
- Multi-language descriptions
- Effective date ranges
- Status relationship mappings

**🔧 Service Usage:**
- Status validation services
- Quality code lookup systems
- Multi-language status translation
- Business rule validation

**🎯 Key Business Functions:**
- Multi-dimensional status management
- Quality indicator tracking
- International status support
- Business process validation

---

## 📊 Service Dependencies Matrix

| Domain | Tables | Primary Services | Admin Services | Batch/Async |
|--------|--------|-----------------|----------------|-------------|
| **MyDelivery** | 8 tables | DeliveryRequestService, MyDeliveryService | MyDeliveryAdminFacade | DeliveryAsyncMessageProcessorMDB |
| **B2C Notification** | 3 tables | ConsumerAlerter | - | ConsignmentStatusProcessor, AlertProcessor |
| **Spring Batch** | 6 tables | - | - | Spring Batch Framework |
| **Location** | 1 table | LocationServiceEnquiryService | - | - |
| **Customer ID** | 2 tables | Customer identification services | Customer management | - |
| **Track/Consignment** | 5 tables | Tracking services | - | Control-M jobs, B2C processors |
| **Common Codes** | 7+ tables | Reference data services | Location/schedule management | - |

---

## 🔗 Key Integration Points

1. **DELIVERY_REQUEST ↔ DELIVERY_ADDRESS**: Request with alternative delivery addresses
2. **DELIVERY_REQUEST ↔ CUSTOMER_DELIV_EXCL**: Customer-specific delivery restrictions
3. **DEPOT_DELIV_PARMS ↔ SELF_COLLECTION_TIME**: Depot configuration with time slots
4. **CORECV01 → COREAV01**: Consignment data drives alert generation
5. **CORESV01 → CORECV01**: Status events update consignment data
6. **All Tables**: Audit fields (created/updated timestamps, user tracking, soft delete)

---

## 🔄 Extended Integration Points

**Cross-Domain Integrations:**
1. **DELIVERY_REQUEST ↔ CORCOV01**: Delivery requests linked to consignment tracking
2. **CNRCUV01 ↔ CUSTOMER_DELIV_EXCL**: Customer profiles drive delivery exclusions
3. **NCRBLV01 ↔ DEPOT_DELIV_PARMS**: Business locations linked to depot parameters
4. **CORCSV01 → CORECV01**: Status events trigger B2C notifications
5. **NCRSDV01/NCRQSV01 ↔ All Status Fields**: Status validation across all domains

**Data Flow Patterns:**
- **Event-driven**: Status changes → Notifications
- **Reference-driven**: Customer/Location lookups
- **Batch-driven**: Scheduled processing and reporting
- **Real-time**: Tracking and status updates

**Business Process Integrations:**
- Customer requests delivery → Track consignment → Send notifications
- Validate customer → Check exclusions → Configure delivery options
- Status change → Quality validation → Multi-language notification

---

## 📈 Total Table Count Summary

- **MyDelivery Domain**: 8 tables
- **B2C Notification**: 3 tables  
- **Spring Batch**: 6 tables
- **Location Service**: 1 table
- **Customer Identification**: 2 tables
- **Track & Consignment**: 5 tables
- **Common Codes**: 7+ tables

**Total: 32+ database tables** identified across 7 functional domains supporting the complete delivery ecosystem.
