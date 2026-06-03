# Club Management System

A RESTful backend API for managing Clubs, Events, and Event Registrations. Built with Node.js, Express.js, and MongoDB.

---

## Tech Stack Used

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | HTTP server and routing |
| MongoDB | Primary database |
| Mongoose | MongoDB ODM |
| Joi | Request validation |
| dotenv | Environment variable loading |
| cors | Cross-origin resource sharing |
| nodemon | Development auto-restart |

---

## Project Setup Instructions

### Prerequisites

- Node.js v18 or higher
- MongoDB running locally or a MongoDB Atlas connection string

### Steps

1. Clone the repository:

```bash
git clone <repository-url>
cd club-management-system
```

2. Install dependencies:

```bash
npm install
```

3. Create your environment file:

```bash
cp .env.example .env
```

4. Edit `.env` with your values:

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/club-management
```

5. Start the development server:

```bash
npm run dev
```

6. The server will be available at:

```
http://localhost:3000
```

7. Verify the server is running:

```bash
GET http://localhost:3000/health
```

Expected response:

```json
{
  "success": true,
  "message": "Server healthy"
}
```

---

## Database Schema

### Collections and Relationships

The system contains three collections:

```
Club
 └── has many Events (via Event.clubId)
        └── has many Registrations (via Registration.eventId)
```

### Club

| Field | Type | Required | Notes |
|---|---|---|---|
| _id | ObjectId | Auto | Primary key |
| name | String | Yes | Unique, 3–100 chars |
| description | String | Yes | 10–1000 chars |
| createdAt | Date | Auto | Managed by Mongoose |
| updatedAt | Date | Auto | Managed by Mongoose |

### Event

| Field | Type | Required | Notes |
|---|---|---|---|
| _id | ObjectId | Auto | Primary key |
| clubId | ObjectId | Yes | Ref: Club. Immutable after creation |
| title | String | Yes | 3–200 chars |
| description | String | No | Optional. 0–2000 chars |
| location | String | Yes | 3–200 chars |
| startDate | Date | Yes | ISO 8601 format |
| endDate | Date | Yes | ISO 8601 format. Must be >= startDate |
| createdAt | Date | Auto | Managed by Mongoose |
| updatedAt | Date | Auto | Managed by Mongoose |

### Registration

| Field | Type | Required | Notes |
|---|---|---|---|
| _id | ObjectId | Auto | Primary key |
| eventId | ObjectId | Yes | Ref: Event |
| participantName | String | Yes | 2–100 chars |
| participantEmail | String | Yes | Valid email. Max 254 chars |
| createdAt | Date | Auto | Managed by Mongoose |
| updatedAt | Date | Auto | Managed by Mongoose |

### Indexes

**Club:** unique index on `name`  
**Event:** index on `clubId`  
**Registration:** index on `eventId`, unique compound index on `(eventId, participantEmail)`

---

## List of All APIs

### Health

| Method | Endpoint | Description |
|---|---|---|
| GET | /health | Server health check |

### Clubs

| Method | Endpoint | Description |
|---|---|---|
| POST | /clubs | Create a new club |
| GET | /clubs | Get all clubs |
| GET | /clubs/:id | Get a club by ID |
| PUT | /clubs/:id | Update a club |
| DELETE | /clubs/:id | Delete a club (cascade) |

### Events

| Method | Endpoint | Description |
|---|---|---|
| POST | /events | Create a new event |
| GET | /events | Get all events |
| GET | /events/:id | Get an event by ID |
| PUT | /events/:id | Update an event |
| DELETE | /events/:id | Delete an event (cascade) |

### Registrations

| Method | Endpoint | Description |
|---|---|---|
| POST | /registrations | Register for an event |
| GET | /registrations | Get all registrations |
| DELETE | /registrations/:id | Cancel a registration |

---

## Request and Response Examples

### Health Check

**Request**
```http
GET /health
```

**Response** `200 OK`
```json
{
  "success": true,
  "message": "Server healthy"
}
```

---

### POST /clubs

**Request**
```http
POST /clubs
Content-Type: application/json

{
  "name": "Photography Club",
  "description": "A club for photography enthusiasts."
}
```

**Response** `201 Created`
```json
{
  "success": true,
  "message": "Club created successfully",
  "data": {
    "_id": "665f1a2b3c4d5e6f7a8b9c0d",
    "name": "Photography Club",
    "description": "A club for photography enthusiasts.",
    "createdAt": "2026-06-08T10:00:00.000Z",
    "updatedAt": "2026-06-08T10:00:00.000Z"
  }
}
```

**Error** `400 Bad Request` (validation failure)
```json
{
  "success": false,
  "message": "\"name\" is required"
}
```

**Error** `409 Conflict` (duplicate name)
```json
{
  "success": false,
  "message": "Club name already exists"
}
```

---

### GET /clubs

**Request**
```http
GET /clubs
```

**Response** `200 OK`
```json
{
  "success": true,
  "message": "Clubs retrieved successfully",
  "data": [
    {
      "_id": "665f1a2b3c4d5e6f7a8b9c0d",
      "name": "Photography Club",
      "description": "A club for photography enthusiasts.",
      "createdAt": "2026-06-08T10:00:00.000Z",
      "updatedAt": "2026-06-08T10:00:00.000Z"
    }
  ]
}
```

---

### GET /clubs/:id

**Request**
```http
GET /clubs/665f1a2b3c4d5e6f7a8b9c0d
```

**Response** `200 OK`
```json
{
  "success": true,
  "message": "Club retrieved successfully",
  "data": {
    "_id": "665f1a2b3c4d5e6f7a8b9c0d",
    "name": "Photography Club",
    "description": "A club for photography enthusiasts.",
    "createdAt": "2026-06-08T10:00:00.000Z",
    "updatedAt": "2026-06-08T10:00:00.000Z"
  }
}
```

**Error** `400 Bad Request` (invalid ID)
```json
{
  "success": false,
  "message": "Invalid ID format"
}
```

**Error** `404 Not Found`
```json
{
  "success": false,
  "message": "Club not found"
}
```

---

### PUT /clubs/:id

**Request**
```http
PUT /clubs/665f1a2b3c4d5e6f7a8b9c0d
Content-Type: application/json

{
  "description": "A club for professional photography enthusiasts."
}
```

**Response** `200 OK`
```json
{
  "success": true,
  "message": "Club updated successfully",
  "data": {
    "_id": "665f1a2b3c4d5e6f7a8b9c0d",
    "name": "Photography Club",
    "description": "A club for professional photography enthusiasts.",
    "createdAt": "2026-06-08T10:00:00.000Z",
    "updatedAt": "2026-06-08T11:00:00.000Z"
  }
}
```

---

### DELETE /clubs/:id

**Request**
```http
DELETE /clubs/665f1a2b3c4d5e6f7a8b9c0d
```

**Response** `200 OK`
```json
{
  "success": true,
  "message": "Club deleted successfully"
}
```

---

### POST /events

**Request**
```http
POST /events
Content-Type: application/json

{
  "clubId": "665f1a2b3c4d5e6f7a8b9c0d",
  "title": "Annual Photo Walk",
  "description": "A guided walk through the city capturing urban life.",
  "location": "City Center Park",
  "startDate": "2026-07-01T09:00:00Z",
  "endDate": "2026-07-01T17:00:00Z"
}
```

**Response** `201 Created`
```json
{
  "success": true,
  "message": "Event created successfully",
  "data": {
    "_id": "665f2b3c4d5e6f7a8b9c0e1f",
    "clubId": "665f1a2b3c4d5e6f7a8b9c0d",
    "title": "Annual Photo Walk",
    "description": "A guided walk through the city capturing urban life.",
    "location": "City Center Park",
    "startDate": "2026-07-01T09:00:00.000Z",
    "endDate": "2026-07-01T17:00:00.000Z",
    "createdAt": "2026-06-08T10:00:00.000Z",
    "updatedAt": "2026-06-08T10:00:00.000Z"
  }
}
```

**Error** `400 Bad Request` (endDate before startDate)
```json
{
  "success": false,
  "message": "endDate must be greater than or equal to startDate"
}
```

**Error** `400 Bad Request` (invalid date format)
```json
{
  "success": false,
  "message": "startDate must be a valid ISO 8601 date"
}
```

**Error** `404 Not Found` (club does not exist)
```json
{
  "success": false,
  "message": "Club not found"
}
```

---

### GET /events

**Request**
```http
GET /events
```

**Response** `200 OK`
```json
{
  "success": true,
  "message": "Events retrieved successfully",
  "data": []
}
```

---

### GET /events/:id

**Request**
```http
GET /events/665f2b3c4d5e6f7a8b9c0e1f
```

**Response** `200 OK`
```json
{
  "success": true,
  "message": "Event retrieved successfully",
  "data": {
    "_id": "665f2b3c4d5e6f7a8b9c0e1f",
    "clubId": "665f1a2b3c4d5e6f7a8b9c0d",
    "title": "Annual Photo Walk",
    "description": "A guided walk through the city capturing urban life.",
    "location": "City Center Park",
    "startDate": "2026-07-01T09:00:00.000Z",
    "endDate": "2026-07-01T17:00:00.000Z",
    "createdAt": "2026-06-08T10:00:00.000Z",
    "updatedAt": "2026-06-08T10:00:00.000Z"
  }
}
```

---

### PUT /events/:id

**Request**
```http
PUT /events/665f2b3c4d5e6f7a8b9c0e1f
Content-Type: application/json

{
  "location": "Riverside Park"
}
```

**Response** `200 OK`
```json
{
  "success": true,
  "message": "Event updated successfully",
  "data": {
    "_id": "665f2b3c4d5e6f7a8b9c0e1f",
    "clubId": "665f1a2b3c4d5e6f7a8b9c0d",
    "title": "Annual Photo Walk",
    "description": "A guided walk through the city capturing urban life.",
    "location": "Riverside Park",
    "startDate": "2026-07-01T09:00:00.000Z",
    "endDate": "2026-07-01T17:00:00.000Z",
    "createdAt": "2026-06-08T10:00:00.000Z",
    "updatedAt": "2026-06-08T11:00:00.000Z"
  }
}
```

**Error** `400 Bad Request` (attempt to change clubId)
```json
{
  "success": false,
  "message": "clubId cannot be modified"
}
```

---

### DELETE /events/:id

**Request**
```http
DELETE /events/665f2b3c4d5e6f7a8b9c0e1f
```

**Response** `200 OK`
```json
{
  "success": true,
  "message": "Event deleted successfully"
}
```

---

### POST /registrations

**Request**
```http
POST /registrations
Content-Type: application/json

{
  "eventId": "665f2b3c4d5e6f7a8b9c0e1f",
  "participantName": "Jane Smith",
  "participantEmail": "jane.smith@example.com"
}
```

**Response** `201 Created`
```json
{
  "success": true,
  "message": "Registration created successfully",
  "data": {
    "_id": "665f3c4d5e6f7a8b9c0e1f2a",
    "eventId": "665f2b3c4d5e6f7a8b9c0e1f",
    "participantName": "Jane Smith",
    "participantEmail": "jane.smith@example.com",
    "createdAt": "2026-06-08T10:00:00.000Z",
    "updatedAt": "2026-06-08T10:00:00.000Z"
  }
}
```

**Error** `409 Conflict` (duplicate registration)
```json
{
  "success": false,
  "message": "Participant is already registered for this event"
}
```

**Error** `404 Not Found` (event does not exist)
```json
{
  "success": false,
  "message": "Event not found"
}
```

---

### GET /registrations

**Request**
```http
GET /registrations
```

**Response** `200 OK`
```json
{
  "success": true,
  "message": "Registrations retrieved successfully",
  "data": []
}
```

---

### DELETE /registrations/:id

**Request**
```http
DELETE /registrations/665f3c4d5e6f7a8b9c0e1f2a
```

**Response** `200 OK`
```json
{
  "success": true,
  "message": "Registration cancelled successfully"
}
```

---

## Known Limitations (Version 1)

- **Cascade deletes are not atomic.** If a crash occurs mid-delete, orphaned documents may remain.
- **No authentication or authorization.** All endpoints are publicly accessible.
- **No pagination.** List endpoints return all documents.
- **No filtering or search.**

These limitations are documented trade-offs for Version 1. They are candidates for post-V1 enhancement.

---

## Deployment

### Deploying to Render

1. Push the repository to GitHub.
2. Create a new Web Service on [Render](https://render.com).
3. Set the build command: `npm install`
4. Set the start command: `npm start`
5. Add environment variables in the Render dashboard:
   - `PORT`
   - `MONGODB_URI`
   - `NODE_ENV=production`

### Deployment Link

_To be updated after deployment._
