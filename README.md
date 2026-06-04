# Club Management System

> A RESTful backend API for managing Clubs, Events, and Event Registrations.

**Live API:** [https://club-project-6f83.onrender.com](https://club-project-6f83.onrender.com)

**Demo Video:** _(link to be added)_

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

### Error Responses

All error responses follow the same structure:

```json
{
  "success": false,
  "message": "<error description>"
}
```

| Status | When |
|---|---|
| 400 | Validation failure or invalid ID format |
| 404 | Resource not found |
| 409 | Duplicate club name or duplicate registration |
| 500 | Unexpected server error |


## Setup Instructions

### Prerequisites

- Node.js v18+
- MongoDB Atlas URI (or local MongoDB)

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/LeninFernandez/club-project
cd club-project

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env with your values

# 4. Start development server
npm run dev
```

Server runs at `http://localhost:3000`. Verify with `GET /health`.

---

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `MONGODB_URI` | Yes | — | MongoDB connection string |
| `PORT` | No | 3000 | Server port |
| `NODE_ENV` | No | development | Environment |

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/club-management
```

---

## Deployment

Deployed on **Render**.

**Live URL:** [https://club-project-6f83.onrender.com](https://club-project-6f83.onrender.com)

To deploy your own instance:

1. Push the repository to GitHub
2. Create a new Web Service on [Render](https://render.com)
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables: `MONGODB_URI`, `PORT`, `NODE_ENV`

---

## Known Limitations

- Cascade deletes are not atomic — a crash mid-delete may leave orphaned documents
- No authentication or authorization — all endpoints are public
- No pagination — list endpoints return all documents
- No filtering or search

These are documented trade-offs for the current implementation.
