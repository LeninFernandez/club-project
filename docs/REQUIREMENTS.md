# Club Management System - Requirements

## Objective

Build the backend for a Club Management System.

The system should allow management of:

* Clubs
* Events
* Event Registrations

The implementation should prioritize clean architecture, maintainability, scalability, validation, error handling, and documentation.

---

# Core Functionalities

## 1. Club Management

The system must support:

* Create Club
* Get All Clubs
* Get Club By ID
* Update Club
* Delete Club

### Required APIs

```http
POST /clubs
GET /clubs
GET /clubs/:id
PUT /clubs/:id
DELETE /clubs/:id
```

---

## 2. Event Management

The system must support:

* Create Event
* Get All Events
* Get Event By ID
* Update Event
* Delete Event

### Required APIs

```http
POST /events
GET /events
GET /events/:id
PUT /events/:id
DELETE /events/:id
```

---

## 3. Event Registration

The system must support:

* Register for an Event
* Get All Registrations
* Cancel Registration

### Required APIs

```http
POST /registrations
GET /registrations
DELETE /registrations/:id
```

---

# Technical Stack

## Backend

* Node.js
* Express.js

## Database

* MongoDB

---

# Required Features

The implementation must include:

* Proper Validation
* Error Handling
* Environment Variables
* Modular Folder Structure
* Database Integration

---

# Preferred Features

The implementation should include, if time permits:

* Deployment
* API Documentation
* Postman Collection

Possible deployment platforms:

* Render
* Railway
* Fly.io
* Vercel

---

# README Requirements

The README must contain:

## Project Setup Instructions

Steps required to run the application locally.

## Tech Stack Used

List all technologies used.

## Database Schema

Description of collections and relationships.

## List of All APIs

All implemented endpoints.

## Request and Response Examples

Example requests and responses for all APIs.

## Deployment Link

Deployment URL if deployed.

---

# Evaluation Criteria

The project will be evaluated on:

1. API Design
2. Database Design
3. Clean Architecture
4. Error Handling
5. Documentation Quality
6. Deployment

---

# Version 1 Scope

Version 1 is considered complete when:

* All required APIs are implemented.
* Validation is implemented.
* Error handling is implemented.
* Environment variables are used.
* MongoDB integration is complete.
* Documentation is present.
* README is complete.

Additional features may be added only after Version 1 is complete.

---

# Non-Goals for Version 1

The following features are not required by the assignment and should not be assumed to exist unless explicitly approved:

* Authentication
* Authorization
* User Accounts
* Team Management
* Payment Processing
* Notifications
* Analytics
* Capacity Management
* Eligibility Rules
* File Uploads

```
```
