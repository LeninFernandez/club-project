# Club Management System - API and Database Specification

# 1. API Analysis

This section identifies the database operations required by each API.

The database schema must support these operations efficiently.

---

# CLUB APIs

## POST /clubs

### Purpose

Create a new club.

### Database Operation

Insert one Club document.

### Example Query Pattern

```text
Create Club
```

### Validation Requirements

* name required, 3–100 chars
* description required, 10–1000 chars
* club name must be unique

### Expected Result

One new Club document is stored.

---

## GET /clubs

### Purpose

Retrieve all clubs.

### Database Operation

Find all Club documents.

### Example Query Pattern

```text
Get All Clubs
```

### Expected Result

List of all clubs.

---

## GET /clubs/:id

### Purpose

Retrieve a single club.

### Database Operation

Find Club by _id.

### Example Query Pattern

```text
Find Club By ID
```

### Expected Result

Single Club document.

---

## PUT /clubs/:id

### Purpose

Update an existing club.

### Database Operation

Find Club by _id and update fields.

### Example Query Pattern

```text
Update Club By ID
```

### Validation Requirements

* name (if provided) must remain unique
* updated values must satisfy schema validation

---

## DELETE /clubs/:id

### Purpose

Delete a club.

### Database Operations

1. Find Club by _id
2. Delete Club
3. Find Events using clubId
4. Delete related Events
5. Delete related Registrations

### Example Query Pattern

```text
Delete Club
→ Delete Events By clubId
→ Delete Registrations By eventId
```

### Notes

Requires cascade deletion logic.

---

# EVENT APIs

## POST /events

### Purpose

Create an event.

### Database Operations

1. Verify Club exists
2. Insert Event

### Example Query Pattern

```text
Find Club By ID
→ Create Event
```

### Validation Requirements

* clubId required
* title required, 3–200 chars
* description optional, 0–2000 chars if provided
* location required, 3–200 chars
* startDate required, ISO 8601 format (e.g. `2026-06-08T10:00:00Z`)
* endDate required, ISO 8601 format (e.g. `2026-06-08T10:00:00Z`)
* endDate must be greater than or equal to startDate

---

## GET /events

### Purpose

Retrieve all events.

### Database Operation

Find all Event documents.

### Example Query Pattern

```text
Get All Events
```

---

## GET /events/:id

### Purpose

Retrieve one event.

### Database Operation

Find Event by _id.

### Example Query Pattern

```text
Find Event By ID
```

---

## PUT /events/:id

### Purpose

Update an event.

### Database Operation

Find Event by _id and update.

### Validation Requirements

* title (if provided) must be 3–200 chars
* description (if provided) must be 0–2000 chars
* location (if provided) must be 3–200 chars
* startDate (if provided) must be valid ISO 8601 format
* endDate (if provided) must be valid ISO 8601 format
* endDate must always be greater than or equal to startDate, evaluated against the final state after applying the update

### Immutability Rules

* clubId is immutable after event creation
* A request that includes clubId must be rejected with 400 Bad Request

---

## DELETE /events/:id

### Purpose

Delete an event.

### Database Operations

1. Delete Event
2. Delete Registrations belonging to Event

### Example Query Pattern

```text
Delete Event
→ Delete Registrations By eventId
```

### Notes

Requires cascade deletion logic.

---

# REGISTRATION APIs

## POST /registrations

### Purpose

Register a participant for an event.

### Database Operations

1. Verify Event exists
2. Check duplicate registration
3. Insert Registration

### Example Query Pattern

```text
Find Event By ID
→ Check Registration By (eventId, email)
→ Create Registration
```

### Validation Requirements

* participantName required, 2–100 chars
* participantEmail required, valid email format, max 254 chars
* eventId required

### Business Rules

A participant may register only once for a specific event.

---

## GET /registrations

### Purpose

Retrieve all registrations.

### Database Operation

Find all Registration documents.

### Example Query Pattern

```text
Get All Registrations
```

---

## DELETE /registrations/:id

### Purpose

Cancel a registration.

### Database Operation

Delete Registration by _id.

### Example Query Pattern

```text
Delete Registration By ID
```

---

# API Access Pattern Summary

The most important access patterns are:

```text
Find Club By ID
Find Event By ID
Find Registration By ID

Find Events By clubId

Find Registrations By eventId

Find Registration By
(eventId, participantEmail)
```

The database schema and indexes must be designed to support these patterns efficiently.

---

# 2. Database Indexes

The following indexes must be created to support the access patterns above.

## Club Collection

| Index | Type |
|---|---|
| _id | Default (auto) |
| name | Unique single-field |

## Event Collection

| Index | Type | Purpose |
|---|---|---|
| _id | Default (auto) | — |
| clubId | Single-field | Query events by club |

## Registration Collection

| Index | Type | Purpose |
|---|---|---|
| _id | Default (auto) | — |
| eventId | Single-field | Query registrations by event |
| (eventId, participantEmail) | Unique compound | Prevent duplicate registrations |

The unique compound index on `(eventId, participantEmail)` enforces the one-registration-per-participant rule at the database level.
A duplicate key error (MongoDB error code 11000) on this index must be caught in the service layer and returned as 409 Conflict.

---

# 3. Invalid ObjectId Handling

Any path parameter that is expected to be a MongoDB ObjectId (e.g., `:id` in `/clubs/:id`, `/events/:id`, `/registrations/:id`) must be validated before any database operation is attempted.

If the supplied value is not a valid MongoDB ObjectId format, the request must be rejected immediately.

Response:

```json
{
  "success": false,
  "message": "Invalid ID format"
}
```

HTTP Status: 400 Bad Request

This check applies to all endpoints that accept an `:id` path parameter:

```text
GET  /clubs/:id
PUT  /clubs/:id
DELETE /clubs/:id

GET  /events/:id
PUT  /events/:id
DELETE /events/:id

DELETE /registrations/:id
```
