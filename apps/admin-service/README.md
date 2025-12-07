# Admin Service

Administrative operations and system management for Jatra Railway.

## Features

- **Train Management**: CRUD operations for trains and coaches
- **Route Management**: Create and manage routes with stations
- **Journey Management**: Schedule and manage train journeys
- **Station Management**: Add and update railway stations
- **User Management**: View and manage user accounts
- **Booking Oversight**: View all bookings and statistics
- **System Stats**: Overall system analytics and health

## API Endpoints

### Train Management
- `GET /api/admin/trains` - List all trains with pagination
- `POST /api/admin/trains` - Create new train
- `GET /api/admin/trains/:id` - Get train details
- `PUT /api/admin/trains/:id` - Update train
- `DELETE /api/admin/trains/:id` - Delete train

### Route Management
- `GET /api/admin/routes` - List all routes
- `POST /api/admin/routes` - Create new route
- `GET /api/admin/routes/:id` - Get route details
- `PUT /api/admin/routes/:id` - Update route
- `DELETE /api/admin/routes/:id` - Delete route

### Journey Management
- `GET /api/admin/journeys` - List all journeys
- `POST /api/admin/journeys` - Create journey
- `PUT /api/admin/journeys/:id` - Update journey
- `DELETE /api/admin/journeys/:id` - Cancel journey

### Station Management
- `GET /api/admin/stations` - List all stations
- `POST /api/admin/stations` - Add new station
- `PUT /api/admin/stations/:id` - Update station

### User Management
- `GET /api/admin/users` - List all users with filters
- `GET /api/admin/users/:id` - Get user details
- `PUT /api/admin/users/:id/role` - Update user role

### Booking Management
- `GET /api/admin/bookings` - List all bookings with filters
- `GET /api/admin/bookings/:id` - Get booking details

### System Statistics
- `GET /api/admin/stats/overview` - System overview stats
- `GET /api/admin/stats/revenue` - Revenue statistics

## Running the Service

```bash
# Development
pnpm start:dev

# Production
pnpm build
pnpm start:prod
```

## Environment Variables

- `PORT` - Service port (default: 3010)
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - JWT secret for admin auth verification

## Port

3010

## Security

All endpoints require admin authentication via JWT token with ADMIN role.
