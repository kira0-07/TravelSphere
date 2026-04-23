# TravelSphere Backend

A complete REST API backend for the TravelSphere travel booking platform built with Node.js, Express, and MongoDB.

## Tech Stack

- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Auth:** JWT + bcryptjs
- **Environment:** dotenv
- **CORS:** Enabled for frontend ports 3000 and 5173

## Quick Start

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Configure Environment

Create a `.env` file (already created):

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/travelsphere
JWT_SECRET=travelsphere_jwt_secret_key_2024
JWT_EXPIRE=30d
```

### 3. Seed Database

```bash
npm run seed
```

This creates:
- Admin user: `admin@travelsphere.com` / `admin123`
- Test user: `alex@example.com` / `password123`
- 9 destinations, 5 packages, 5 hotels, 3 sample bookings

### 4. Start Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Server runs at: `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password/:token` - Reset password

### Destinations
- `GET /api/destinations` - List all (supports: region, tag, search, featured)
- `GET /api/destinations/:id` - Get single
- `POST /api/destinations` - Create (Admin)
- `PUT /api/destinations/:id` - Update (Admin)
- `DELETE /api/destinations/:id` - Delete (Admin)

### Packages
- `GET /api/packages` - List all (supports: destinationId, search, badge, maxPrice, difficulty, tag)
- `GET /api/packages/featured` - Featured packages only
- `GET /api/packages/:id` - Get single
- `POST /api/packages` - Create (Admin)
- `PUT /api/packages/:id` - Update (Admin)
- `DELETE /api/packages/:id` - Delete (Admin)

### Hotels
- `GET /api/hotels` - List all (supports: destination, search, type, minStars)
- `GET /api/hotels/:id` - Get single
- `POST /api/hotels` - Create (Admin)
- `PUT /api/hotels/:id` - Update (Admin)
- `DELETE /api/hotels/:id` - Delete (Admin)

### Bookings
- `POST /api/bookings` - Create booking (User)
- `GET /api/bookings/my` - Get my bookings (User)
- `GET /api/bookings/:id` - Get single booking (User)
- `PATCH /api/bookings/:id/cancel` - Cancel booking (User)
- `GET /api/bookings/admin/all` - Get all bookings (Admin)
- `PATCH /api/bookings/:id/status` - Update status (Admin)

### Admin Dashboard
- `GET /api/admin/stats` - Dashboard stats (Admin)
- `GET /api/admin/bookings/recent` - Recent 10 bookings (Admin)
- `GET /api/admin/revenue` - Revenue summary (Admin)

## Authentication

The API uses JWT Bearer tokens:
1. Login/register returns `{ token, user }`
2. Store token in `localStorage` with key `ts_token`
3. Send as `Authorization: Bearer <token>` header
4. Frontend auto-redirects to `/login` on 401

## Project Structure

```
server/
├── config/
│   └── db.js              # Database connection
├── controllers/
│   ├── authController.js
│   ├── bookingController.js
│   ├── destinationController.js
│   ├── hotelController.js
│   ├── packageController.js
│   └── adminController.js
├── middleware/
│   ├── auth.js            # JWT verification
│   ├── admin.js           # Admin authorization
│   └── errorHandler.js    # Global error handling
├── models/
│   ├── Booking.js
│   ├── Destination.js
│   ├── Hotel.js
│   ├── Package.js
│   └── User.js
├── routes/
│   ├── adminRoutes.js
│   ├── authRoutes.js
│   ├── bookingRoutes.js
│   ├── destinationRoutes.js
│   ├── hotelRoutes.js
│   └── packageRoutes.js
├── seed/
│   └── seed.js            # Database seeding script
├── .env                   # Environment variables
├── package.json
└── server.js              # Main entry point
```

## Frontend Integration

The Vite frontend is already configured to proxy `/api` requests to port 5000.

In `frontend/vite.config.js`:
```javascript
server: {
  proxy: {
    '/api': 'http://localhost:5000'
  }
}
```

## Test Accounts

After seeding:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@travelsphere.com | admin123 |
| User | alex@example.com | password123 |

## Health Check

```bash
curl http://localhost:5000/api/health
```

Response: `{"status":"OK","message":"TravelSphere API is running"}`
