# MyDelivery API Response Bodies

Based on the test data reference file (`MyDelivery_SIT_Test_Data.md`), here are the expected response bodies for each MyDelivery REST endpoint. These are structured JSON responses, assuming successful requests (status 200 OK). Error scenarios are included at the end for completeness. All responses follow a consistent structure with `success`, `errors`, `warnings`, and `data` fields.

## 1. `/isConsignmentRedeliverable/` (POST)
Validates if a consignment can be redelivered.
```json
{
  "success": true,
  "errors": [],
  "warnings": [],
  "data": {
    "redeliverable": true
  }
}
```

## 2. `/getConsignmentDetails/` (POST)
Retrieves detailed information about a consignment.
```json
{
  "success": true,
  "errors": [],
  "warnings": [],
  "data": {
    "consignmentNumber": "GBR123456789",
    "originalAddress": {
      "name": "John Smith",
      "addressLine1": "123 High Street",
      "addressLine2": "Flat 4B",
      "townOrCity": "London",
      "postcodeOrSuburb": "SW1A 1AA",
      "countryCode": "GB"
    },
    "depotCode": "LON001",
    "depotName": "London Central Depot",
    "depotAddress": "TNT Depot, Industrial Estate, London, E1 8XX",
    "status": "Delivered",
    "deliveryDate": "2024-01-10"
  }
}
```

## 3. `/getAvailableOptions/` (POST)
Lists available redelivery options for a consignment.
```json
{
  "success": true,
  "errors": [],
  "warnings": [],
  "data": {
    "availableOptions": [
      {
        "type": "OriginalAddress",
        "label": "(Re)deliver to original address",
        "enabled": true
      },
      {
        "type": "SelfCollection",
        "label": "Collect from TNT location",
        "enabled": true
      },
      {
        "type": "AlternativeAddress",
        "label": "Deliver to alternative address",
        "enabled": true
      },
      {
        "type": "LeaveInAbsence",
        "label": "Leave in absence - my address",
        "enabled": true
      },
      {
        "type": "LeaveWithNeighbour",
        "label": "Leave in absence - neighbour's address",
        "enabled": true
      }
    ]
  }
}
```

## 4. `/getAvailableDates/` (POST)
Provides available dates for a specific redelivery option.
```json
{
  "success": true,
  "errors": [],
  "warnings": [],
  "data": {
    "availableDates": [
      {
        "date": "2024-01-16",
        "displayText": "Tuesday, 16 January 2024",
        "available": true
      },
      {
        "date": "2024-01-17",
        "displayText": "Wednesday, 17 January 2024",
        "available": true
      },
      {
        "date": "2024-01-18",
        "displayText": "Thursday, 18 January 2024",
        "available": true
      }
    ]
  }
}
```

## 5. `/checkPhoneNumbers/` (GET)
Validates phone number formats.
```json
{
  "success": true,
  "errors": [],
  "warnings": [],
  "data": {
    "mobilePhoneValid": true,
    "homePhoneValid": true,
    "workPhoneValid": true
  }
}
```

## 6. `/confirm/` (POST) - Original Address
Confirms redelivery to the original address.
```json
{
  "success": true,
  "errors": [],
  "warnings": [],
  "data": {
    "confirmationNumber": "RD-GBR123456789-001",
    "consignmentNumber": "GBR123456789",
    "deliveryOption": "OriginalAddress",
    "requestedDeliveryDate": "2024-01-16",
    "contactName": "John Smith",
    "contactEmail": "john.smith@example.com",
    "message": "Your redelivery request has been confirmed. You will receive a confirmation email at john.smith@example.com"
  }
}
```

## 7. `/confirm/` (POST) - Self Collection
Confirms self-collection from a depot.
```json
{
  "success": true,
  "errors": [],
  "warnings": [],
  "data": {
    "confirmationNumber": "SC-GBR123456789-001",
    "consignmentNumber": "GBR123456789",
    "deliveryOption": "SelfCollection",
    "collectionDate": "2024-01-16",
    "depotDetails": {
      "code": "LON001",
      "name": "London Central Depot",
      "address": "TNT Depot, Industrial Estate, London, E1 8XX",
      "openingHours": {
        "monday": "08:00-18:00",
        "tuesday": "08:00-18:00",
        "wednesday": "08:00-18:00",
        "thursday": "08:00-18:00",
        "friday": "08:00-18:00",
        "saturday": "09:00-13:00",
        "sunday": "Closed"
      }
    },
    "message": "Please bring two forms of ID including passport or driver's license"
  }
}
```

## 8. `/getAlternativeAddressAvailableDates/` (POST)
Gets available dates for delivery to an alternative address.
```json
{
  "success": true,
  "errors": [],
  "warnings": [],
  "data": {
    "availableDates": [
      {
        "date": "2024-01-17",
        "displayText": "Wednesday, 17 January 2024",
        "available": true
      },
      {
        "date": "2024-01-18",
        "displayText": "Thursday, 18 January 2024",
        "available": true
      }
    ]
  }
}
```

## 9. `/confirmAlternativeAddress/` (POST)
Confirms delivery to an alternative address.
```json
{
  "success": true,
  "errors": [],
  "warnings": [],
  "data": {
    "confirmationNumber": "AA-GBR123456789-001",
    "consignmentNumber": "GBR123456789",
    "deliveryOption": "AlternativeAddress",
    "requestedDeliveryDate": "2024-01-17",
    "alternativeAddress": {
      "contactName": "Jane Doe",
      "companyName": "Government Office",
      "addressLine1": "10 Downing Street",
      "townOrCity": "London",
      "postcodeOrSuburb": "SW1A 2AA",
      "countryCode": "GB"
    },
    "message": "Your parcel will be delivered to the alternative address on 17 January 2024"
  }
}
```

## 10. `/getAddressForPrefill/` (GET)
Retrieves address suggestions for pre-filling forms (e.g., for neighbour lookup).
```json
{
  "success": true,
  "errors": [],
  "warnings": [],
  "data": {
    "addresses": [
      {
        "addressLine1": "12 Baker Street",
        "addressLine2": "",
        "townOrCity": "London",
        "postcodeOrSuburb": "NW1 6XE",
        "countryCode": "GB"
      },
      {
        "addressLine1": "14 Baker Street",
        "addressLine2": "",
        "townOrCity": "London",
        "postcodeOrSuburb": "NW1 6XE",
        "countryCode": "GB"
      }
    ]
  }
}
```

## 11. `/confirmLeaveWithNeighbour/` (POST)
Confirms leaving the parcel with a neighbour.
```json
{
  "success": true,
  "errors": [],
  "warnings": [],
  "data": {
    "confirmationNumber": "LN-GBR123456789-001",
    "consignmentNumber": "GBR123456789",
    "deliveryOption": "LeaveWithNeighbour",
    "requestedDeliveryDate": "2024-01-16",
    "neighbourAddress": {
      "name": "Bob Williams",
      "addressLine1": "12 Baker Street",
      "townOrCity": "London",
      "postcodeOrSuburb": "NW1 6XE",
      "countryCode": "GB"
    },
    "message": "Your parcel will be delivered to your neighbour Bob Williams at 12 Baker Street"
  }
}
```

## Error Responses (Common Across Endpoints)
- **Consignment Not Found**:
```json
{
  "success": false,
  "errors": [
    {
      "code": "CONSIGNMENT_NOT_FOUND",
      "message": "Consignment number INVALID999 not found in system",
      "field": "consignmentNumber"
    }
  ],
  "warnings": [],
  "data": null
}
```

- **Postcode Mismatch**:
```json
{
  "success": false,
  "errors": [
    {
      "code": "INVALID_POSTCODE",
      "message": "Postcode does not match delivery address for this consignment",
      "field": "postcodeOrSuburb"
    }
  ],
  "warnings": [],
  "data": null
}
```

- **Invalid Delivery Date**:
```json
{
  "success": false,
  "errors": [
    {
      "code": "INVALID_DELIVERY_DATE",
      "message": "Requested delivery date 2024-01-14 is not available. Please select from available dates.",
      "field": "requestedDeliveryDate"
    }
  ],
  "warnings": [],
  "data": null
}
```

- **Phone Validation Warning**:
```json
{
  "success": true,
  "errors": [],
  "warnings": [
    {
      "code": "PHONE_FORMAT_WARNING",
      "message": "Mobile phone number format does not match country code GB",
      "field": "mobilePhone"
    }
  ],
  "data": {
    "mobilePhoneValid": false,
    "homePhoneValid": true,
    "workPhoneValid": true
  }
}
```

These responses are based on the test scenarios in the `MyDelivery_SIT_Test_Data.md` file. Actual SIT responses may vary slightly depending on data and configuration. Use the Insomnia collection for direct testing!
