# Subscription & Billing API System

A production-style backend API for managing clients, subscription plans, purchases, upgrade and downgrade flows, billing lifecycle events, payment webhooks, and admin analytics.

## Tech Stack

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT authentication
- Swagger/OpenAPI
- Vercel deployment

## Architecture

The project uses a simple MVC structure:

- `src/models` contains MongoDB schemas and indexes.
- `src/services` contains business logic for auth, plans, subscriptions, analytics, and webhooks.
- `src/controllers` handles request/response coordination.
- `src/routes` defines API endpoints.
- `src/middlewares` contains authentication, RBAC, validation, and response formatting helpers.
- `src/docs` contains the OpenAPI specification.

The goal is to keep the code easy to explain in an interview while still handling real subscription rules and edge cases.

## Features

- User registration and login with JWT
- Password hashing with bcrypt
- Role-based access control for Admin and User
- Subscription plan management
- Purchase, upgrade, downgrade, and cancel flows
- Expiry handling for active subscriptions
- Webhook payment update endpoint with secret validation
- Admin analytics with MongoDB aggregations
- Event logging for key billing actions
- Swagger documentation

## Setup

1. Install dependencies.
2. Copy `.env.example` to `.env` and fill in secrets.
3. Start the server.

```bash
npm install
npm run dev
```

## Environment Variables

- `PORT` - server port
- `MONGODB_URI` - MongoDB Atlas connection string
- `JWT_SECRET` - JWT signing secret
- `JWT_EXPIRES_IN` - JWT expiry time, for example `7d`
- `WEBHOOK_SECRET` - shared secret for webhook requests
- `ADMIN_SEED_NAME` - admin seed user name
- `ADMIN_SEED_EMAIL` - admin seed user email
- `ADMIN_SEED_PASSWORD` - admin seed user password
- `APP_NAME` - application name shown in Swagger
- `DEPLOYMENT_URL` - deployed Vercel URL

## API Base URL

The routes are mounted at the root path.

- Swagger UI: `/api-docs`
- Health check: `/health`

## API Examples

### Register

```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123!"
}
```

### Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Password123!"
}
```

### Purchase Subscription

```http
POST /subscriptions/purchase
Authorization: Bearer <token>
Content-Type: application/json

{
  "planId": "665f1b1a2d1c2a0000000001",
  "autoRenew": true
}
```

### Webhook Payment Update

```http
POST /webhook/payment-update
x-webhook-secret: <secret>
Content-Type: application/json

{
  "subscriptionId": "665f1b1a2d1c2a0000000002",
  "eventType": "payment_success",
  "metadata": {
    "transactionId": "txn_123"
  }
}
```

## Deployment

The project is configured for Vercel using `vercel.json` and `api/index.js`.

Deployment URL: `https://your-vercel-deployment-url.vercel.app`

## Postman Collection

Import `postman_collection.json` into Postman to test the API groups for auth, plans, subscriptions, analytics, and webhooks.
