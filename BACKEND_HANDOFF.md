# TravelSphere — Backend Handoff Document

> **Purpose:** This document provides all the context needed to build the TravelSphere backend from scratch. It maps every frontend API call, data model, auth flow, and response shape so that the backend can be wired up seamlessly without modifying the existing React frontend.

---

## 1. Project Overview

TravelSphere is a premium travel booking platform (MERN stack). The **frontend is 100% complete** and currently uses mock data from `client/src/data/mockData.js`. The backend must replace this mock layer with a real REST API.

### Project Structure (current)

```
TravelSphere/
├── client/                    # React + Vite frontend (COMPLETE)
│   ├── src/
│   │   ├── services/api.js    # Axios instance — ALL API contracts defined here
│   │   ├── context/AuthContext.jsx  # Auth state management
│   │   ├── data/mockData.js   # Mock data (reference for DB seeding)
│   │   ├── pages/             # All page components
│   │   └── components/        # Reusable UI components
│   └── vite.config.js
└── server/                    # ⬅ BUILD THIS
    ├── config/
    ├── models/
    ├── routes/
    ├── controllers/
    ├── middleware/
    ├── utils/
    ├── seed/
    ├── .env
    ├── package.json
    └── server.js
```

### Tech Stack (Backend)
- **Runtime:** Node.js (v18+)
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Auth:** JWT (Bearer token) + bcryptjs
- **Environment:** dotenv

---

## 2. API Base Configuration

The frontend Axios instance is pre-configured in `client/src/services/api.js`:

```javascript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});
```

- **Base URL:** `http://localhost:5000/api`
- **Auth Header:** `Authorization: Bearer <JWT_TOKEN>`
- **Token Storage Key:** `localStorage.getItem('ts_token')`
- **On 401:** Frontend auto-clears token and redirects to `/login`

---

## 3. Authentication System

### 3.1 Auth Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/register` | Public | Create new user account |
| `POST` | `/api/auth/login` | Public | Authenticate and get JWT |
| `GET` | `/api/auth/me` | Protected | Get current logged-in user |
| `POST` | `/api/auth/forgot-password` | Public | Send password reset email |
| `POST` | `/api/auth/reset-password/:token` | Public | Reset password with token |

### 3.2 Request & Response Shapes

#### `POST /api/auth/register`

**Request Body:**
```json
{
  "name": "Alex Johnson",
  "email": "alex@example.com",
  "phone": "+1 555 000 0000",
  "password": "securepassword123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "usr-001",
    "name": "Alex Johnson",
    "email": "alex@example.com",
    "phone": "+1 555 000 0000",
    "role": "user",
    "avatar": null,
    "createdAt": "2024-06-15T00:00:00Z"
  }
}
```

**Validation Rules:**
- `name`: required
- `email`: required, unique, valid email format
- `password`: required, min 6 characters
- `phone`: optional

#### `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "alex@example.com",
  "password": "securepassword123"
}
```

**Response (200):** Same shape as register response (token + user).

**Error (401):**
```json
{ "message": "Invalid credentials. Please try again." }
```

#### `GET /api/auth/me`

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "user": {
    "_id": "usr-001",
    "name": "Alex Johnson",
    "email": "alex@example.com",
    "phone": "+1 555 000 0000",
    "role": "user",
    "avatar": "https://...",
    "createdAt": "2024-06-15T00:00:00Z"
  }
}
```

> **CRITICAL:** The frontend reads `data.user` from the response and checks `data.user.role === 'admin'` for admin access. Ensure the user object always includes the `role` field.

---

## 4. Data Models (Mongoose Schemas)

### 4.1 User

```javascript
{
  name:      { type: String, required: true, trim: true },
  email:     { type: String, required: true, unique: true, lowercase: true },
  password:  { type: String, required: true, minlength: 6, select: false },
  phone:     { type: String, default: '' },
  role:      { type: String, enum: ['user', 'admin'], default: 'user' },
  avatar:    { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
}
```

### 4.2 Destination

```javascript
{
  id:          { type: String, required: true, unique: true },  // slug e.g. 'santorini'
  name:        { type: String, required: true },
  country:     { type: String, required: true },
  region:      { type: String, enum: ['Europe', 'Asia', 'Americas', 'Africa', 'Oceania'] },
  image:       { type: String, required: true },                // card thumbnail URL
  heroImage:   { type: String },                                // full-width hero URL
  description: { type: String, required: true },
  tags:        [String],                                        // e.g. ['Island', 'Romance', 'Beach']
  climate:     { type: String },                                // e.g. 'Mediterranean'
  bestMonths:  [String],                                        // e.g. ['May', 'Jun', 'Sep', 'Oct']
  rating:      { type: Number, min: 0, max: 5, default: 0 },
  reviewCount: { type: Number, default: 0 },
  highlights:  [String],                                        // e.g. ['Oia Sunset', 'Caldera Views']
  featured:    { type: Boolean, default: false },
  createdAt:   { type: Date, default: Date.now }
}
```

### 4.3 Package (Tour Package)

```javascript
{
  id:             { type: String, required: true, unique: true },  // e.g. 'pkg-001'
  title:          { type: String, required: true },
  destinationId:  { type: String, required: true },                // FK → Destination.id
  destination:    { type: String, required: true },                // Display string e.g. 'Santorini & Mykonos, Greece'
  image:          { type: String, required: true },
  duration:       { type: Number, required: true },                // in days
  groupSize:      {
    min: { type: Number, default: 1 },
    max: { type: Number, default: 20 }
  },
  price:          { type: Number, required: true },                // current price (per person)
  originalPrice:  { type: Number },                                // strikethrough price
  rating:         { type: Number, min: 0, max: 5, default: 0 },
  reviewCount:    { type: Number, default: 0 },
  badge:          { type: String },                                // 'Best Seller' | 'Trending' | 'Luxury' | 'Adventure' | 'Seasonal'
  tags:           [String],
  includes:       [String],                                        // e.g. ['Flights', 'Hotels', 'Breakfast']
  excludes:       [String],                                        // e.g. ['Visa', 'Travel Insurance']
  difficulty:     { type: String, enum: ['Easy', 'Moderate', 'Challenging'] },
  itinerary:      [{
    day:           Number,
    title:         String,
    activities:    [String],
    accommodation: String
  }],
  featured:       { type: Boolean, default: false },
  createdAt:      { type: Date, default: Date.now }
}
```

### 4.4 Hotel

```javascript
{
  id:             { type: String, required: true, unique: true },  // e.g. 'htl-001'
  name:           { type: String, required: true },
  destinationId:  { type: String, required: true },                // FK → Destination.id
  destination:    { type: String, required: true },                // Display string
  image:          { type: String, required: true },
  stars:          { type: Number, min: 1, max: 5 },
  rating:         { type: Number, min: 0, max: 5, default: 0 },
  reviewCount:    { type: Number, default: 0 },
  pricePerNight:  { type: Number, required: true },
  amenities:      [String],                                        // e.g. ['Pool', 'WiFi', 'Spa']
  type:           { type: String },                                // 'Boutique Hotel' | 'Resort' | 'Ultra-Luxury' etc.
  featured:       { type: Boolean, default: false },
  createdAt:      { type: Date, default: Date.now }
}
```

### 4.5 Booking

```javascript
{
  id:           { type: String, unique: true },                    // auto-generated e.g. 'BK-2024-001'
  userId:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  packageId:    { type: String, required: true },                  // FK → Package.id
  packageTitle: { type: String, required: true },
  destination:  { type: String, required: true },
  image:        { type: String },
  startDate:    { type: Date, required: true },
  endDate:      { type: Date, required: true },
  travelers:    { type: Number, required: true, min: 1 },
  totalAmount:  { type: Number, required: true },
  status:       { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
  bookingRef:   { type: String, unique: true },                    // auto-generated e.g. 'TS-GR-001'
  createdAt:    { type: Date, default: Date.now }
}
```

---

## 5. API Routes — Full Specification

### 5.1 Destinations

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/destinations` | Public | List all destinations (supports query params) |
| `GET` | `/api/destinations/:id` | Public | Get single destination by slug ID |
| `POST` | `/api/destinations` | Admin | Create new destination |
| `PUT` | `/api/destinations/:id` | Admin | Update destination |
| `DELETE` | `/api/destinations/:id` | Admin | Delete destination |

**Query Params for `GET /api/destinations`:**
- `region` (string) — filter by region
- `tag` (string) — filter by tag
- `search` (string) — search by name or country (case-insensitive)
- `featured` (boolean) — filter featured only

**Response shape (list):**
```json
[
  {
    "id": "santorini",
    "name": "Santorini",
    "country": "Greece",
    "region": "Europe",
    "image": "https://...",
    "heroImage": "https://...",
    "description": "...",
    "tags": ["Island", "Romance"],
    "climate": "Mediterranean",
    "bestMonths": ["May", "Jun"],
    "rating": 4.9,
    "reviewCount": 2847,
    "highlights": ["Oia Sunset"],
    "featured": true
  }
]
```

### 5.2 Packages

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/packages` | Public | List all packages |
| `GET` | `/api/packages/featured` | Public | List featured packages only |
| `GET` | `/api/packages/:id` | Public | Get single package by ID |
| `POST` | `/api/packages` | Admin | Create new package |
| `PUT` | `/api/packages/:id` | Admin | Update package |
| `DELETE` | `/api/packages/:id` | Admin | Delete package |

**Query Params for `GET /api/packages`:**
- `destinationId` (string) — filter by destination
- `search` (string) — search by title or destination
- `badge` (string) — filter by badge type
- `maxPrice` (number) — filter by max price
- `difficulty` (string) — filter by difficulty
- `tag` (string) — filter by tag

### 5.3 Hotels

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/hotels` | Public | List all hotels |
| `GET` | `/api/hotels/:id` | Public | Get single hotel by ID |
| `POST` | `/api/hotels` | Admin | Create new hotel |
| `PUT` | `/api/hotels/:id` | Admin | Update hotel |
| `DELETE` | `/api/hotels/:id` | Admin | Delete hotel |

**Query Params for `GET /api/hotels`:**
- `destination` (string) — filter by destinationId
- `search` (string) — search by name or destination
- `type` (string) — filter by hotel type
- `minStars` (number) — filter by minimum stars

### 5.4 Bookings

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/bookings` | User | Create a new booking |
| `GET` | `/api/bookings/my` | User | Get current user's bookings |
| `GET` | `/api/bookings/:id` | User | Get single booking by ID |
| `PATCH` | `/api/bookings/:id/cancel` | User | Cancel a booking |
| `GET` | `/api/bookings/admin/all` | Admin | Get all bookings (admin) |
| `PATCH` | `/api/bookings/:id/status` | Admin | Update booking status |

**`POST /api/bookings` Request Body:**
```json
{
  "packageId": "pkg-001",
  "packageTitle": "Greek Island Hopping",
  "destination": "Santorini & Mykonos, Greece",
  "image": "https://...",
  "startDate": "2024-09-15",
  "endDate": "2024-09-25",
  "travelers": 2,
  "totalAmount": 4998
}
```

**`PATCH /api/bookings/:id/status` Request Body:**
```json
{ "status": "confirmed" }
```

### 5.5 Admin Dashboard

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/admin/stats` | Admin | Dashboard summary stats |
| `GET` | `/api/admin/bookings/recent` | Admin | Latest 10 bookings |
| `GET` | `/api/admin/revenue` | Admin | Revenue summary |

**`GET /api/admin/stats` Response:**
```json
{
  "totalUsers": 150,
  "totalBookings": 420,
  "totalRevenue": 1250000,
  "totalDestinations": 10,
  "totalPackages": 5,
  "totalHotels": 5
}
```

---

## 6. Middleware Requirements

### 6.1 `auth.js` — JWT Authentication

```javascript
// Extract token from Authorization header: "Bearer <token>"
// Verify with JWT_SECRET
// Attach user to req.user
// Return 401 if missing or invalid
```

### 6.2 `admin.js` — Admin Authorization

```javascript
// Must be used AFTER auth middleware
// Check req.user.role === 'admin'
// Return 403 if not admin
```

### 6.3 `errorHandler.js` — Global Error Handler

```javascript
// Catch all errors
// Return JSON: { message: "..." }
// In dev mode, include stack trace
```

---

## 7. Database Seeding

Create a `server/seed/seed.js` script that:
1. Clears all collections
2. Creates a default admin user:
   - Email: `admin@travelsphere.com`
   - Password: `admin123`
   - Role: `admin`
3. Creates a default test user:
   - Email: `alex@example.com`
   - Password: `password123`
   - Role: `user`
4. Seeds all destinations from `mockData.js` (10 destinations)
5. Seeds all packages from `mockData.js` (5 packages)
6. Seeds all hotels from `mockData.js` (5 hotels)
7. Seeds sample bookings from `mockData.js` (3 bookings)

Run with: `npm run seed`

---

## 8. Environment Variables

Create `server/.env`:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/travelsphere
JWT_SECRET=travelsphere_jwt_secret_key_2024
JWT_EXPIRE=30d
```

---

## 9. Package Dependencies

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^8.0.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "dotenv": "^16.3.1",
    "cors": "^2.8.5",
    "express-async-handler": "^1.2.0",
    "morgan": "^1.10.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
}
```

### Scripts

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "seed": "node seed/seed.js"
  }
}
```

---

## 10. CORS Configuration

```javascript
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
```

---

## 11. Error Response Format

All errors should follow this shape (the frontend `catch` blocks expect `err?.message`):

```json
{
  "message": "Human-readable error message",
  "success": false
}
```

---

## 12. Important Frontend Integration Notes

1. **Token Key:** The frontend stores the JWT in `localStorage` with key `ts_token`. The backend doesn't need to worry about this — just return `{ token, user }` from login/register.

2. **User Object Shape:** The `AuthContext` reads:
   - `data.user` (from login/register response)
   - `data.user.role` (to determine admin access)
   - `data.token` (to store JWT)

3. **ID Fields:** The frontend currently uses string slugs/IDs (e.g., `'santorini'`, `'pkg-001'`). The backend should use the `id` field (not `_id`) for routing. You can use a virtual or the custom `id` field.

4. **Featured Endpoint:** `GET /api/packages/featured` must be defined BEFORE `GET /api/packages/:id` in Express routes, otherwise Express will treat "featured" as an ID parameter.

5. **The frontend proxy:** The Vite dev server can be configured to proxy `/api` requests to port 5000. Add this to `client/vite.config.js`:
   ```javascript
   server: {
     proxy: {
       '/api': 'http://localhost:5000'
     }
   }
   ```

6. **Booking Creation:** When a user books, the frontend sends the package details in the request body (packageTitle, destination, image). The backend should verify the `packageId` exists and store the booking with the user's ID from the JWT.

---

## 13. Quick Start Checklist

- [ ] Initialize `server/` with `npm init -y`
- [ ] Install dependencies
- [ ] Create `.env` with MongoDB URI and JWT secret
- [ ] Build Mongoose models (User, Destination, Package, Hotel, Booking)
- [ ] Build auth middleware (JWT verification)
- [ ] Build admin middleware (role check)
- [ ] Build auth routes (register, login, getMe)
- [ ] Build CRUD routes for Destinations, Packages, Hotels
- [ ] Build Booking routes (create, list, cancel, admin management)
- [ ] Build Admin stats routes
- [ ] Create seed script and run it
- [ ] Add CORS and error handling middleware
- [ ] Test all endpoints
- [ ] Configure Vite proxy in client

---

*This document was auto-generated from the TravelSphere frontend codebase. All API contracts, data shapes, and auth flows match the existing `client/src/services/api.js` and `client/src/context/AuthContext.jsx` exactly.*
