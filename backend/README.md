
# Backend API for Risk Management Platform

This is the backend API for the Risk Management Platform. It provides authentication, risk management, simulation, and other functionality needed by the frontend application.

## Technology Stack

- **Node.js** with Express.js
- **MongoDB** for data storage
- **JWT** for authentication
- **RESTful API** architecture

## Getting Started

### Prerequisites

- Node.js (v14.x or higher)
- MongoDB (local or remote)

### Installation

1. Clone the repository
2. Navigate to the backend directory:
   ```
   cd backend
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Create a `.env` file in the root directory (see `.env.example` for required variables)
5. Start the development server:
   ```
   npm run dev
   ```

## API Endpoints

The API provides the following endpoints:

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password

### Risks

- `GET /api/risks` - List risks (with pagination and filtering)
- `GET /api/risks/:id` - Get risk details
- `POST /api/risks` - Create a new risk
- `PUT /api/risks/:id` - Update a risk
- `DELETE /api/risks/:id` - Delete a risk
- `POST /api/risks/:id/responses` - Add a response to a risk
- `GET /api/risks/statistics/summary` - Get risk statistics

### Simulations

- `GET /api/simulations` - List all simulations
- `GET /api/simulations/:id` - Get simulation details
- `POST /api/simulations` - Create a new simulation
- `POST /api/simulations/:id/run` - Run a simulation
- `GET /api/simulations/:id/results` - Get simulation results
- `POST /api/simulations/compare` - Compare multiple simulations

### Legislation Monitoring

- `GET /api/legislation` - List legislation items
- `GET /api/legislation/:id` - Get legislation item details
- `POST /api/legislation` - Create a legislation item
- `PUT /api/legislation/:id` - Update a legislation item
- `POST /api/legislation/import` - Import legislation data

### News Monitoring

- `GET /api/news` - List news items
- `GET /api/news/:id` - Get news item details
- `POST /api/news` - Create a news item
- `PUT /api/news/:id` - Update a news item
- `POST /api/news/import` - Import news from external sources

### Organization

- `GET /api/organization` - Get organization details
- `PUT /api/organization` - Update organization
- `GET /api/organization/settings` - Get organization settings
- `PUT /api/organization/settings` - Update organization settings

### User Management (Admin)

- `GET /api/users` - List all users
- `GET /api/users/:id` - Get user details
- `POST /api/users` - Create a new user
- `PUT /api/users/:id` - Update a user
- `DELETE /api/users/:id` - Delete a user
- `PUT /api/users/:id/role` - Update user role

## Authentication

All endpoints except `/api/auth/login` and `/api/auth/register` require authentication. To authenticate requests, include an `Authorization` header with a Bearer token:

```
Authorization: Bearer <token>
```

## Error Handling

The API returns consistent error responses in the following format:

```json
{
  "status": "error",
  "message": "Error message description"
}
```

## Success Responses

Successful responses follow this format:

```json
{
  "status": "success",
  "data": { ... },
  "message": "Optional success message"
}
```

## Pagination

Endpoints that return collections support pagination via query parameters:

- `page` - Page number (default: 1)
- `pageSize` - Number of items per page (default: 10)

Paginated responses include metadata:

```json
{
  "status": "success",
  "data": [ ... ],
  "page": 1,
  "pageSize": 10,
  "totalItems": 100,
  "totalPages": 10
}
```

## Filtering

Many collection endpoints support filtering via query parameters. See individual endpoint documentation for supported filters.

## Development

### Running Tests

```
npm test
```

### Linting

```
npm run lint
```

## Deployment

For production deployment, set the appropriate environment variables and run:

```
npm start
```

Consider using process managers like PM2 for production environments.
