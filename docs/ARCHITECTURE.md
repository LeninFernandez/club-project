# Club Management System - Architecture

## Purpose

This document defines the application's architecture, project structure, coding conventions, and implementation rules.

All generated code must follow this architecture unless explicitly approved otherwise.

---

# Architecture Style

## Layered Architecture

The application follows a layered architecture.

Request flow:

```text
Client
  ↓
Routes
  ↓
Controllers
  ↓
Services
  ↓
Models
  ↓
MongoDB
```

Each layer has a single responsibility.

---

# Layer Responsibilities

## Routes

Responsibilities:

* Define API endpoints.
* Map requests to controllers.

Must NOT:

* Contain business logic.
* Access database directly.
* Perform complex validation.

---

## Controllers

Responsibilities:

* Receive requests.
* Call services.
* Return HTTP responses.

Must NOT:

* Access MongoDB directly.
* Contain business rules.
* Perform database queries.

Controllers should remain thin.

---

## Services

Responsibilities:

* Business logic.
* Application rules.
* Database interaction through models.

Examples:

* Create Club
* Create Event
* Register for Event
* Cascade deletion logic

Services are the primary location for application logic.

---

## Models

Responsibilities:

* Define MongoDB schemas.
* Define indexes.
* Define validation constraints supported by the schema.

Must NOT:

* Contain business logic.

---

## Middleware

Responsibilities:

* Validation
* Error handling
* Request processing

Examples:

* Validation middleware
* Error handler middleware
* Not Found middleware

---

# Project Structure

```text
src/
│
├── config/
│   ├── db.js
│   └── env.js
│
├── controllers/
│   ├── club.controller.js
│   ├── event.controller.js
│   └── registration.controller.js
│
├── services/
│   ├── club.service.js
│   ├── event.service.js
│   └── registration.service.js
│
├── models/
│   ├── club.model.js
│   ├── event.model.js
│   └── registration.model.js
│
├── routes/
│   ├── club.routes.js
│   ├── event.routes.js
│   └── registration.routes.js
│
├── middlewares/
│   ├── errorHandler.js
│   ├── notFound.js
│   └── validate.js
│
├── validators/
│   ├── club.validator.js
│   ├── event.validator.js
│   └── registration.validator.js
│
├── utils/
│   ├── ApiError.js
│   └── asyncHandler.js
│
├── app.js
└── server.js
```

---

# Environment Configuration

All configuration values must come from environment variables.

Examples:

```env
PORT=
MONGODB_URI=
NODE_ENV=
```

Hardcoded configuration values are not allowed.

---

# API Response Format

All successful responses should follow a consistent format.

Example:

```json
{
  "success": true,
  "message": "Club created successfully",
  "data": {}
}
```

---

# Error Response Format

All errors should follow a consistent format.

Example:

```json
{
  "success": false,
  "message": "Club not found"
}
```

Validation errors may include additional details.

---

# HTTP Status Codes

Use standard status codes.

Examples:

```text
200 OK
201 Created
400 Bad Request
404 Not Found
409 Conflict
500 Internal Server Error
```

Do not return 200 for failed operations.

---

# Validation Strategy

Validation must occur before service execution.

Every POST and PUT endpoint must validate incoming data.

Validation should include:

* Required fields
* String length constraints (see DECISIONS.md — String Length Constraints)
* Email format validation (max 254 chars, valid email format)
* Date validation (ISO 8601 format required for all date fields)
* Date range validation (endDate >= startDate)
* MongoDB ObjectId format validation for all path parameters

Invalid requests must return:

```text
400 Bad Request
```

### ObjectId Validation

Any path parameter expected to be a MongoDB ObjectId must be validated before any database query is executed.

An invalid ObjectId format must return:

```json
{
  "success": false,
  "message": "Invalid ID format"
}
```

HTTP Status: 400 Bad Request

---

# Error Handling Strategy

Use centralized error handling.

Requirements:

* Controllers should not contain repeated try/catch blocks.
* Errors should be forwarded to the error middleware.
* Business errors should use custom error classes where appropriate.

---

# Naming Conventions

## Files

Use lowercase names.

Examples:

```text
club.service.js
event.controller.js
registration.model.js
```

---

## Variables

Use camelCase.

Example:

```js
clubId
participantEmail
startDate
```

---

## Constants

Use UPPER_SNAKE_CASE.

Example:

```js
MAX_PAGE_SIZE
DEFAULT_LIMIT
```

---

# Database Access Rules

Services may access models.

Controllers may NOT access models.

Routes may NOT access models.

This separation must be maintained consistently.

---

# Documentation Requirements

The implementation should support:

* Swagger/OpenAPI documentation
* Postman Collection

Documentation should remain synchronized with implemented APIs.

---

# Deployment Requirements

Application should be deployable on Render.

Requirements:

* Environment variables supported
* Production-ready startup script
* No local-only dependencies

---

# Version 1 Success Criteria

Architecture is considered successful when:

* All required APIs are implemented.
* Validation exists for all write operations.
* Error handling is centralized.
* Folder structure remains modular.
* Business logic exists only in services.
* MongoDB integration works.
* Deployment succeeds.

```
```
