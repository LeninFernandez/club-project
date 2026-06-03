# Club Management System - Architectural Decisions

## Purpose

This document records approved architectural and design decisions for the project.

All implementation work must follow these decisions unless explicitly changed and approved.

---

# Scope Decisions

## Version 1 Principle

Implement the assignment requirements completely before introducing enhancements.

Priority:

1. Required APIs
2. Validation
3. Error Handling
4. Database Integration
5. Documentation
6. Deployment

Enhancements may be considered only after Version 1 is complete.

---

# Database Decisions

## Database

MongoDB will be used as the primary database.

Reason:

* Fits assignment requirements.
* Existing familiarity with MongoDB.
* Faster development within project timeline.

---

## Database Indexes

The following indexes must be defined on their respective collections.

### Event

| Index | Type | Purpose |
|---|---|---|
| clubId | Single-field | Query events by club |

### Registration

| Index | Type | Purpose |
|---|---|---|
| eventId | Single-field | Query registrations by event |
| (eventId, participantEmail) | Unique compound | Enforce one registration per participant per event |

The unique compound index on Registration replaces the application-level duplicate check and enforces uniqueness at the database level.
Duplicate key errors (MongoDB error code 11000) must be caught in the service layer and returned as 409 Conflict.

---

# Entity Decisions

The system contains exactly three business entities in Version 1:

1. Club
2. Event
3. Registration

No additional business entities should be introduced without approval.

---

## Explicitly Excluded Entities

The following entities are intentionally excluded from Version 1:

* User
* Team
* Payment
* Notification
* Attendance
* Role
* Permission
* Audit Log

Reason:

These are not required by the assignment.

---

# Relationship Decisions

## Club → Event

Relationship:

One Club can have many Events.

Implementation:

Events will store a reference to the Club.

Example:

```text
Event
 └── clubId
```

Clubs will NOT store an array of events.

Reason:

Prevents document growth and keeps relationships scalable.

---

## Event → Registration

Relationship:

One Event can have many Registrations.

Implementation:

Registrations will store a reference to the Event.

Example:

```text
Registration
 └── eventId
```

Events will NOT store arrays of registrations.

Reason:

Prevents unbounded document growth.

---

# Club Decisions

## Club Name

Club names must be unique.

Reason:

A club represents a unique organization within the system.

---

# Event Decisions

## Event Title

Event titles do NOT need to be unique.

Reason:

Different clubs may host events with identical names.

---

## Event Update Rules

The following rules apply to PUT /events/:id:

* endDate must always be greater than or equal to startDate, even on partial updates.
* clubId is immutable after event creation. It may not be changed via PUT /events/:id.

A request that attempts to change clubId must be rejected with 400 Bad Request.

---

## Event Dates

Events will contain:

* startDate
* endDate

Reason:

Supports both:

* Single-day events
* Multi-day events

Examples:

Workshop:

* startDate = endDate

Hackathon:

* startDate < endDate

---

## Date Format

All date fields (startDate, endDate) must be provided and stored as ISO 8601 strings.

Accepted format:

```text
YYYY-MM-DDTHH:mm:ssZ
```

Example:

```text
2026-06-08T10:00:00Z
```

Any date value that cannot be parsed as a valid ISO 8601 date must be rejected with 400 Bad Request.

---

## Event Description

The `description` field on Event is OPTIONAL.

A valid Event document may be created without providing a description.

If provided, description must satisfy the string length constraints defined in this document.

---

# Registration Decisions

## Duplicate Registrations

Duplicate registrations are NOT allowed.

A participant may register only once for the same event.

Uniqueness Rule:

```text
eventId + participantEmail
```

Reason:

Prevents duplicate registrations.

---

## Participant Storage

Participant information will be stored directly inside Registration records.

Version 1 does not use a User collection.

Reason:

User management is outside assignment scope.

---

# Deletion Strategy

## Club Deletion

Deleting a Club should also remove:

* Related Events
* Related Registrations

Strategy:

Cascade Delete

---

## Event Deletion

Deleting an Event should also remove:

* Related Registrations

Strategy:

Cascade Delete

---

# Data Duplication Policy

Avoid redundant data storage whenever possible.

Examples:

Do NOT store:

* Event title inside Registration
* Club name inside Event

Use references instead.

Reason:

Prevents synchronization problems and inconsistent data.

---

# Registration Count Policy

Registration counts should be calculated dynamically when needed.

Do NOT store:

```text
registrationCount
```

inside Event documents.

Reason:

Avoids counter synchronization issues.

---

# Timestamp Policy

All collections should contain:

* createdAt
* updatedAt

Implementation may use automatic timestamps.

Reason:

Improves maintainability and debugging.

---

# String Length Constraints

All string fields must satisfy the following length constraints after trimming whitespace.

## Club

| Field | Min | Max | Required |
|---|---|---|---|
| name | 3 | 100 | Yes |
| description | 10 | 1000 | Yes |

## Event

| Field | Min | Max | Required |
|---|---|---|---|
| title | 3 | 200 | Yes |
| description | 0 | 2000 | No (optional) |
| location | 3 | 200 | Yes |

## Registration

| Field | Min | Max | Required |
|---|---|---|---|
| participantName | 2 | 100 | Yes |
| participantEmail | — | 254 | Yes (valid email format) |

Strings that consist only of whitespace must be treated as empty and rejected if the field is required.

---

# API Design Decisions

The required API list defined in REQUIREMENTS.md is the source of truth.

Do not add new endpoints during Version 1 unless explicitly approved.

---

# Enhancement Backlog (Post Version 1)

The following features may be considered only after Version 1 is complete:

* Event Capacity
* Team Registration
* Authentication
* Authorization
* Pagination
* Filtering
* Search
* Advanced Analytics
* Notification System
* File Upload Support

These features are not part of the initial implementation.

# Planned Collections

## Club

| Field | Type | Notes |
|---|---|---|
| _id | ObjectId | Auto-generated |
| name | String | Required. Unique. 3–100 chars. |
| description | String | Required. 10–1000 chars. |
| createdAt | Date | Auto-managed |
| updatedAt | Date | Auto-managed |

## Event

| Field | Type | Notes |
|---|---|---|
| _id | ObjectId | Auto-generated |
| clubId | ObjectId | Required. Ref: Club. Immutable after creation. |
| title | String | Required. 3–200 chars. |
| description | String | Optional. 0–2000 chars. |
| location | String | Required. 3–200 chars. |
| startDate | Date | Required. ISO 8601 format. |
| endDate | Date | Required. ISO 8601 format. Must be >= startDate. |
| createdAt | Date | Auto-managed |
| updatedAt | Date | Auto-managed |

## Registration

| Field | Type | Notes |
|---|---|---|
| _id | ObjectId | Auto-generated |
| eventId | ObjectId | Required. Ref: Event. |
| participantName | String | Required. 2–100 chars. |
| participantEmail | String | Required. Valid email. Max 254 chars. |
| createdAt | Date | Auto-managed |
| updatedAt | Date | Auto-managed |