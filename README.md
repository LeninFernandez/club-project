# Club Management System

> A RESTful backend API for managing Clubs, Events, and Event Registrations.

**Deployment Link:** [https://club-project-6f83.onrender.com](https://club-project-6f83.onrender.com)  
**Demo Video:** [Watch Demo](https://drive.google.com/file/d/11EiGR0sVAnN3vfOhP74eHosb2O3Lf0rs/view?usp=sharing)

## Project Setup Instructions

### Prerequisites

- Node.js v18+
- A MongoDB connection string (MongoDB Atlas free tier or local MongoDB)

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/LeninFernandez/club-project.git
cd club-project

# 2. Install dependencies
npm install

# 3. Create your environment file
cp .env.example .env
```

Open `.env` and set your values:

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/club-management
```

```bash
# 4. Start the development server
npm run dev
```

The server starts at `http://localhost:3000`.

Verify it is running:

```bash
curl http://localhost:3000/health
# Expected: { "success": true, "message": "Server healthy" }
```

> **MongoDB Atlas users:** ensure your cluster's Network Access allows connections from `0.0.0.0/0` or your machine's IP, otherwise the connection will be refused.

---

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `MONGODB_URI` | Yes | — | MongoDB connection string |
| `PORT` | No | 3000 | Server port |
| `NODE_ENV` | No | development | Runtime environment |

---

## Postman Collection

A Postman collection covering all endpoints is included in the repository.

**File:** `postman/club-management.postman_collection.json`

To use: open Postman → Import → select the file above. Set the `baseUrl` variable to `https://club-project-6f83.onrender.com` for the live API or `http://localhost:3000` for local.

---

## Deployment

Deployed on **Render**.

**Live URL:** [https://club-project-6f83.onrender.com](https://club-project-6f83.onrender.com)

To deploy your own instance:

1. Push the repository to GitHub
2. Create a new Web Service on [Render](https://render.com)
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables in the Render dashboard: `MONGODB_URI`, `PORT`, `NODE_ENV`

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB |
| ODM | Mongoose |
| Validation | Joi |
| Environment | dotenv |
| CORS | cors |

---

## Features

- Full CRUD for Clubs, Events, and Registrations
- Cascade delete — deleting a Club removes its Events and Registrations; deleting an Event removes its Registrations
- Request validation on all write operations (Joi)
- Centralized error handling
- All responses follow a consistent `{ success, message, data }` structure
- Environment-based configuration
- Modular folder structure (routes → controllers → services → models)

---

## Project Structure

```
src/
├── app.js
├── server.js
├── config/          # env.js, db.js
├── controllers/     # thin handlers
├── services/        # business logic
├── models/          # Mongoose schemas
├── routes/          # endpoint mapping
├── middlewares/     # errorHandler, notFound, validate
├── validators/      # Joi schemas
└── utils/           # ApiError, asyncHandler
```

---

## Database Schema

### Relationships

```
Club
 └── has many Events      (via Event.clubId)
        └── has many Registrations  (via Registration.eventId)
```

### Club

| Field | Type | Required | Notes |
|---|---|---|---|
| _id | ObjectId | Auto | Primary key |
| name | String | Yes | Unique, 3–100 chars |
| description | String | Yes | 10–1000 chars |
| createdAt | Date | Auto | |
| updatedAt | Date | Auto | |

### Event

| Field | Type | Required | Notes |
|---|---|---|---|
| _id | ObjectId | Auto | Primary key |
| clubId | ObjectId | Yes | Ref: Club. Immutable after creation |
| title | String | Yes | 3–200 chars |
| description | String | No | Optional, 0–2000 chars |
| location | String | Yes | 3–200 chars |
| startDate | Date | Yes | ISO 8601 |
| endDate | Date | Yes | ISO 8601. Must be ≥ startDate |
| createdAt | Date | Auto | |
| updatedAt | Date | Auto | |

### Registration

| Field | Type | Required | Notes |
|---|---|---|---|
| _id | ObjectId | Auto | Primary key |
| eventId | ObjectId | Yes | Ref: Event |
| participantName | String | Yes | 2–100 chars |
| participantEmail | String | Yes | Valid email, max 254 chars. Stored lowercase |
| createdAt | Date | Auto | |
| updatedAt | Date | Auto | |

### Indexes

| Collection | Field(s) | Type |
|---|---|---|
| Club | name | Unique |
| Event | clubId | Single-field |
| Registration | eventId | Single-field |
| Registration | (eventId, participantEmail) | Unique compound |

---

## API Endpoints

### Health

| Method | Endpoint | Description |
|---|---|---|
| GET | /health | Server health check |

### Clubs

| Method | Endpoint | Description |
|---|---|---|
| POST | /clubs | Create a club |
| GET | /clubs | Get all clubs |
| GET | /clubs/:id | Get a club by ID |
| PUT | /clubs/:id | Update a club |
| DELETE | /clubs/:id | Delete a club (cascade) |

### Events

| Method | Endpoint | Description |
|---|---|---|
| POST | /events | Create an event |
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

## Request & Response Examples

### GET /health

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
  "name": "Tech Club",
  "description": "Club for technology enthusiasts"
}
```

**Response** `201 Created`
```json
{
  "success": true,
  "message": "Club created successfully",
  "data": {
    "name": "Tech Club",
    "description": "Club for technology enthusiasts",
    "_id": "665f1a2b3c4d5e6f7a8b9c0d",
    "createdAt": "2026-06-08T10:00:00.000Z",
    "updatedAt": "2026-06-08T10:00:00.000Z",
    "__v": 0
  }
}
```

**Errors**

| Status | Message |
|---|---|
| 400 | `"name" is required` |
| 409 | `Club name already exists` |

---

### GET /clubs

**Response** `200 OK`
```json
{
  "success": true,
  "message": "Clubs retrieved successfully",
  "data": [
    {
      "_id": "665f1a2b3c4d5e6f7a8b9c0d",
      "name": "Tech Club",
      "description": "Club for technology enthusiasts",
      "createdAt": "2026-06-08T10:00:00.000Z",
      "updatedAt": "2026-06-08T10:00:00.000Z",
      "__v": 0
    }
  ]
}
```

---

### GET /clubs/:id

**Response** `200 OK`
```json
{
  "success": true,
  "message": "Club retrieved successfully",
  "data": {
    "_id": "665f1a2b3c4d5e6f7a8b9c0d",
    "name": "Tech Club",
    "description": "Club for technology enthusiasts",
    "createdAt": "2026-06-08T10:00:00.000Z",
    "updatedAt": "2026-06-08T10:00:00.000Z",
    "__v": 0
  }
}
```

**Errors**

| Status | Message |
|---|---|
| 400 | `Invalid ID format` |
| 404 | `Club not found` |

---

### PUT /clubs/:id

**Request**
```http
PUT /clubs/665f1a2b3c4d5e6f7a8b9c0d
Content-Type: application/json

{
  "description": "Updated description"
}
```

**Response** `200 OK`
```json
{
  "success": true,
  "message": "Club updated successfully",
  "data": {
    "_id": "665f1a2b3c4d5e6f7a8b9c0d",
    "name": "Tech Club",
    "description": "Updated description",
    "createdAt": "2026-06-08T10:00:00.000Z",
    "updatedAt": "2026-06-08T11:00:00.000Z",
    "__v": 0
  }
}
```

**Errors**

| Status | Message |
|---|---|
| 400 | `Invalid ID format` |
| 404 | `Club not found` |
| 409 | `Club name already exists` |

---

### DELETE /clubs/:id

**Response** `200 OK`
```json
{
  "success": true,
  "message": "Club deleted successfully"
}
```

**Errors**

| Status | Message |
|---|---|
| 400 | `Invalid ID format` |
| 404 | `Club not found` |

---

### POST /events

**Request**
```http
POST /events
Content-Type: application/json

{
  "clubId": "665f1a2b3c4d5e6f7a8b9c0d",
  "title": "Hackathon",
  "description": "Annual Hackathon",
  "location": "VIT Chennai",
  "startDate": "2026-06-10T09:00:00Z",
  "endDate": "2026-06-10T17:00:00Z"
}
```

**Response** `201 Created`
```json
{
  "success": true,
  "message": "Event created successfully",
  "data": {
    "clubId": "665f1a2b3c4d5e6f7a8b9c0d",
    "title": "Hackathon",
    "description": "Annual Hackathon",
    "location": "VIT Chennai",
    "startDate": "2026-06-10T09:00:00.000Z",
    "endDate": "2026-06-10T17:00:00.000Z",
    "_id": "665f2b3c4d5e6f7a8b9c0e1f",
    "createdAt": "2026-06-08T10:00:00.000Z",
    "updatedAt": "2026-06-08T10:00:00.000Z",
    "__v": 0
  }
}
```

**Errors**

| Status | Message |
|---|---|
| 400 | `endDate must be greater than or equal to startDate` |
| 400 | `startDate must be a valid ISO 8601 date` |
| 404 | `Club not found` |

---

### GET /events

**Response** `200 OK`
```json
{
  "success": true,
  "message": "Events retrieved successfully",
  "data": [
    {
      "_id": "665f2b3c4d5e6f7a8b9c0e1f",
      "clubId": "665f1a2b3c4d5e6f7a8b9c0d",
      "title": "Hackathon",
      "description": "Annual Hackathon",
      "location": "VIT Chennai",
      "startDate": "2026-06-10T09:00:00.000Z",
      "endDate": "2026-06-10T17:00:00.000Z",
      "createdAt": "2026-06-08T10:00:00.000Z",
      "updatedAt": "2026-06-08T10:00:00.000Z",
      "__v": 0
    }
  ]
}
```

---

### GET /events/:id

**Response** `200 OK`
```json
{
  "success": true,
  "message": "Event retrieved successfully",
  "data": {
    "_id": "665f2b3c4d5e6f7a8b9c0e1f",
    "clubId": "665f1a2b3c4d5e6f7a8b9c0d",
    "title": "Hackathon",
    "description": "Annual Hackathon",
    "location": "VIT Chennai",
    "startDate": "2026-06-10T09:00:00.000Z",
    "endDate": "2026-06-10T17:00:00.000Z",
    "createdAt": "2026-06-08T10:00:00.000Z",
    "updatedAt": "2026-06-08T10:00:00.000Z",
    "__v": 0
  }
}
```

**Errors**

| Status | Message |
|---|---|
| 400 | `Invalid ID format` |
| 404 | `Event not found` |

---

### PUT /events/:id

**Request**
```http
PUT /events/665f2b3c4d5e6f7a8b9c0e1f
Content-Type: application/json

{
  "location": "Updated Location"
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
    "title": "Hackathon",
    "description": "Annual Hackathon",
    "location": "Updated Location",
    "startDate": "2026-06-10T09:00:00.000Z",
    "endDate": "2026-06-10T17:00:00.000Z",
    "createdAt": "2026-06-08T10:00:00.000Z",
    "updatedAt": "2026-06-08T11:00:00.000Z",
    "__v": 0
  }
}
```

**Errors**

| Status | Message |
|---|---|
| 400 | `Invalid ID format` |
| 400 | `clubId cannot be modified` |
| 404 | `Event not found` |

---

### DELETE /events/:id

**Response** `200 OK`
```json
{
  "success": true,
  "message": "Event deleted successfully"
}
```

**Errors**

| Status | Message |
|---|---|
| 400 | `Invalid ID format` |
| 404 | `Event not found` |

---

### POST /registrations

**Request**
```http
POST /registrations
Content-Type: application/json

{
  "eventId": "665f2b3c4d5e6f7a8b9c0e1f",
  "participantName": "John Doe",
  "participantEmail": "john@example.com"
}
```

**Response** `201 Created`
```json
{
  "success": true,
  "message": "Registration created successfully",
  "data": {
    "eventId": "665f2b3c4d5e6f7a8b9c0e1f",
    "participantName": "John Doe",
    "participantEmail": "john@example.com",
    "_id": "665f3c4d5e6f7a8b9c0e1f2a",
    "createdAt": "2026-06-08T10:00:00.000Z",
    "updatedAt": "2026-06-08T10:00:00.000Z",
    "__v": 0
  }
}
```

**Errors**

| Status | Message |
|---|---|
| 404 | `Event not found` |
| 409 | `Participant is already registered for this event` |

---

### GET /registrations

**Response** `200 OK`
```json
{
  "success": true,
  "message": "Registrations retrieved successfully",
  "data": [
    {
      "_id": "665f3c4d5e6f7a8b9c0e1f2a",
      "eventId": "665f2b3c4d5e6f7a8b9c0e1f",
      "participantName": "John Doe",
      "participantEmail": "john@example.com",
      "createdAt": "2026-06-08T10:00:00.000Z",
      "updatedAt": "2026-06-08T10:00:00.000Z",
      "__v": 0
    }
  ]
}
```

---

### DELETE /registrations/:id

**Response** `200 OK`
```json
{
  "success": true,
  "message": "Registration cancelled successfully"
}
```

**Errors**

| Status | Message |
|---|---|
| 400 | `Invalid ID format` |
| 404 | `Registration not found` |

---

### Error Response Format

All errors follow this structure:

```json
{
  "success": false,
  "message": "<error description>"
}
```

---

## Known Limitations

- Cascade deletes are not atomic — a crash mid-delete may leave orphaned documents
- No authentication or authorization — all endpoints are public
- No pagination — list endpoints return all documents
- No filtering or search

These are documented trade-offs for the current implementation.
