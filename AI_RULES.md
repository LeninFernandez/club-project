# AI Rules

Follow all documents in /docs.

Do not introduce entities beyond:
- Club
- Event
- Registration

Do not introduce:
- Authentication
- Authorization
- Users
- Teams
- Payments

Do not change API contracts defined in REQUIREMENTS.md.

Controllers must remain thin.

Business logic belongs in services.

Routes must only map endpoints.

Use MongoDB with Mongoose.

Ask for approval before architectural changes.