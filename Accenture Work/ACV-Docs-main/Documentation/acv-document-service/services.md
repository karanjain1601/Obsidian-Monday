# REST API & Service Contracts — ACV Document Service

## Endpoint Inventory

| HTTP Method | Endpoint | Purpose | Auth |
|---|---|---|---|
| `POST` | `/api/v1/{countryCode}/documents/generate` | Generate document from template | Yes |
| `POST` | `/api/v1/{countryCode}/documents/generateAdhoc` | Generate ad-hoc document (no storage) | Yes |
| `POST` | `/api/v1/{countryCode}/documents/download` | Download latest generated document | Yes |
| `POST` | `/api/v1/{countryCode}/documents/preview` | Preview document (PDF, no store) | Yes |
| `GET` | `/api/v1/{countryCode}/{transactionId}/{uploadPath}/{fileName}` | Download document by path | Yes |
| `GET` | `/template/api/v1/sections/_search` | Search template sections | Yes |
| `POST` | `/template/api/v1/sections` | Create section | Yes |
| `POST` | `/template/api/v1/{countryCode}/templates` | Create template | Yes |
| `GET` | `/template/api/v1/{countryCode}/templates` | Get template details | Yes |
| `POST` | `/blob/api/v1/storage/upload` | Upload file to Blob Storage | Yes |
| `GET` | `/blob/api/v1/storage/download/{fileName}` | Download file from Blob Storage | Yes |
| `DELETE` | `/blob/api/v1/storage/delete/{fileName}` | Delete file from Blob Storage | Yes |

---

## Document Generation

### Generate Document

```http
POST /api/v1/{countryCode}/documents/generate
Authorization: Bearer {token}
Content-Type: application/json
```

**Path Parameters:**
- `countryCode` (String) — Country code (US, IN, DE, GB, etc.)

**Request Body:**
```json
{
  "documentCode": "COMPLIANCE_REPORT",
  "localeCode": "en_US",
  "transactionId": "550e8400-e29b-41d4-a716-446655440000",
  "data": {
    "applicantName": "John Doe",
    "complianceStatus": "PASSED",
    "checkDate": "2024-04-02"
  }
}
```

**Response:** `200 OK`
```json
{
  "documentId": "doc-550e8400",
  "fileName": "compliance_report_550e8400.pdf",
  "uploadPath": "documents/2024/04/02",
  "contentType": "application/pdf",
  "generatedAt": "2024-04-02T10:30:00Z",
  "fileSize": 250000,
  "blobUrl": "https://storage.blob.core.windows.net/documents/2024/04/02/compliance_report_550e8400.pdf"
}
```

**Error Responses:**
- `400 Bad Request` — Invalid documentCode, countryCode, or localeCode
- `404 Not Found` — Template not found
- `500 Internal Server Error` — Template rendering failed

---

### Generate Ad-Hoc Document

```http
POST /api/v1/{countryCode}/documents/generateAdhoc
Authorization: Bearer {token}
Content-Type: application/json
```

**Response:** `200 OK` (returns PDF bytes directly, no storage)
```
Content-Type: application/pdf
Content-Disposition: attachment; filename=adhoc_document.pdf

[PDF binary data]
```

---

### Preview Document

```http
POST /api/v1/{countryCode}/documents/preview
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:** Same as Generate Document

**Response:** `200 OK` (returns PDF bytes for preview, not stored)
```
Content-Type: application/pdf
Content-Disposition: attachment; filename=preview.pdf

[PDF binary data]
```

---

### Download Document

```http
POST /api/v1/{countryCode}/documents/download
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "documentId": "doc-550e8400"
}
```

**Response:** `200 OK`
```
Content-Type: application/pdf
Content-Disposition: attachment; filename=compliance_report_550e8400.pdf

[PDF binary data]
```

---

## Template Management

### Search Templates

```http
GET /template/api/v1/sections/_search?section=header&localeCode=en_US&page=1&size=10
Authorization: Bearer {token}
```

**Query Parameters:**
- `section` (String, required) — Section name to search
- `localeCode` (String, optional) — Locale (default: en_US)
- `page` (Integer, optional) — Page number (1-25, default: 1)
- `size` (Integer, optional) — Page size (1-25, default: 10)

**Response:** `200 OK`
```json
{
  "content": [
    {
      "id": 1,
      "sectionName": "header",
      "templateContent": "<div>...</div>",
      "localeCode": "en_US",
      "createdAt": "2024-04-01T00:00:00Z"
    }
  ],
  "totalElements": 100,
  "totalPages": 10,
  "currentPage": 1,
  "pageSize": 10
}
```

---

### Create Template

```http
POST /template/api/v1/{countryCode}/templates
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "documentCode": "COMPLIANCE_REPORT",
  "localeCode": "en_US",
  "templateName": "Compliance Report V1",
  "sections": [
    {
      "sectionId": 1,
      "displayOrder": 1,
      "isRequired": true
    }
  ]
}
```

**Response:** `201 Created`
```json
{
  "templateId": "tpl-uuid",
  "documentCode": "COMPLIANCE_REPORT",
  "localeCode": "en_US",
  "createdAt": "2024-04-02T10:30:00Z"
}
```

---

## Blob Storage Operations

### Upload File

```http
POST /blob/api/v1/storage/upload
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Form Parameters:**
- `file` (File, required) — File to upload

**Response:** `200 OK`
```json
{
  "fileName": "document.pdf",
  "blobUrl": "https://storage.blob.core.windows.net/documents/document.pdf",
  "uploadedAt": "2024-04-02T10:30:00Z",
  "fileSize": 250000
}
```

---

### Download File

```http
GET /blob/api/v1/storage/download/{fileName}
Authorization: Bearer {token}
```

**Response:** `200 OK`
```
Content-Type: application/octet-stream
Content-Disposition: attachment; filename=document.pdf

[Binary data]
```

---

### Delete File

```http
DELETE /blob/api/v1/storage/delete/{fileName}
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "status": "success",
  "message": "File deleted successfully",
  "fileName": "document.pdf",
  "deletedAt": "2024-04-02T10:30:00Z"
}
```

---

## Error Handling

### Standard Error Response

```json
{
  "status": "error",
  "code": "TEMPLATE_NOT_FOUND",
  "message": "Template not found for documentCode=INVALID, countryCode=US, localeCode=en_US",
  "timestamp": "2024-04-02T10:30:00Z",
  "path": "/api/v1/US/documents/generate"
}
```

### Common Error Codes

| Code | HTTP Status | Meaning |
|------|---|---|
| `INVALID_REQUEST` | 400 | Missing or invalid parameters |
| `TEMPLATE_NOT_FOUND` | 404 | Template doesn't exist |
| `TEMPLATE_RENDERING_FAILED` | 500 | Thymeleaf rendering error |
| `BLOB_UPLOAD_FAILED` | 500 | Azure Blob Storage error |
| `DATA_FETCH_FAILED` | 503 | Data Service unavailable |
| `UNAUTHORIZED` | 401 | Invalid or missing token |
| `FORBIDDEN` | 403 | Insufficient permissions |

---

## Authentication & Authorization

All `/api/v1` and `/template/api/v1` endpoints require **OAuth2 JWT Bearer token**.

Token must include claims:
- `sub` — Service principal
- `scope` — "document:generate", "template:manage", etc.
- `aud` — "document-service"

Blob Storage endpoints can be public or private based on deployment config.

---

**Last Updated:** April 2, 2026  
**Version:** 1.0
