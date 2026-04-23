# TravelSphere 🌍✈️

**TravelSphere** is a premium, full-stack web application designed to revolutionize the way travelers discover, plan, and book their dream vacations. Featuring a stunning 3D interactive globe and a dynamic booking system, TravelSphere offers a seamless, immersive, and highly visual user experience for booking curated travel packages.

---

## ✨ Key Features

* **Interactive 3D Globe Exploration:** Users can spin a high-performance 3D WebGL globe to discover destinations globally, complete with dynamic flight paths and geolocation features.
* **Smart Travel Search Engine:** A robust search bar with live auto-complete, dynamic date selection, and group size toggles that remember user preferences seamlessly across pages.
* **Dynamic Package Booking:** Real-time calculation of trip durations and personalized pricing based on custom start and end dates.
* **Customer Dashboard ("My Trips"):** A dedicated space for travelers to view their active, upcoming, and past bookings, and manage cancellations.
* **Admin Control Panel:** A clean, operational dashboard for system administrators to manage packages, destinations, and system health.
* **Premium UI/UX:** Built with a modern, glassmorphism-inspired design system utilizing Tailwind CSS, smooth Framer Motion animations, and deep dark/light mode integration.
* **Secure Authentication:** Full JWT-based authentication for user logins, registrations, and role-based access control (Admin vs. Customer).

---

## 🛠️ Tech Stack

This project is built using the **MERN** stack.

### Frontend
* **React.js** (Vite)
* **Tailwind CSS** (for styling)
* **Framer Motion** (for smooth page transitions and micro-animations)
* **React Router v6** (for SPA navigation)
* **React Globe.GL / Three.js** (for 3D globe rendering)
* **Axios** (for API communication)

### Backend
* **Node.js & Express.js**
* **MongoDB** (with Mongoose ODM)
* **JSON Web Tokens (JWT)** (for secure authentication)
* **Bcrypt.js** (for password hashing)
* **Cors & Dotenv**

---

## 🚀 Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites
Make sure you have the following installed:
* [Node.js](https://nodejs.org/) (v16 or higher)
* [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas URI)
* Git

### Installation

1. **Clone the repository** (if applicable):
   ```bash
   git clone <repository-url>
   cd TravelSphere
   ```

2. **Install Backend Dependencies:**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies:**
   ```bash
   cd ../frontend
   npm install
   ```

### ⚙️ Environment Variables

You need to set up your `.env` files for both the frontend and backend.

**Backend (`backend/.env`):**
Create a `.env` file in the `backend` directory and add the following:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**Frontend (`frontend/.env`):**
Create a `.env` file in the `frontend` directory and add the following:
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🏃‍♂️ Running the Application

You will need two terminal windows to run the frontend and backend concurrently.

**1. Start the Backend Server:**
```bash
cd backend
npm run dev
```
*(The backend should start running on `http://localhost:5000`)*

**2. Start the Frontend Development Server:**
```bash
cd frontend
npm run dev
```
*(The frontend should start running on `http://localhost:5173`)*

Open your browser and navigate to `http://localhost:5173` to explore TravelSphere!

---

## 📁 Project Structure

```text
TravelSphere/
├── backend/                  # Express/Node.js Server
│   ├── config/               # Database connection configs
│   ├── controllers/          # Request handlers (auth, packages, bookings)
│   ├── middleware/           # JWT auth and error handling middleware
│   ├── models/               # Mongoose schemas
│   ├── routes/               # Express API routes
│   └── seed/                 # Database seeding scripts
│
└── frontend/                 # React Application
    ├── public/               # Static assets
    └── src/
        ├── components/       # Reusable UI components (Navbar, GlobeSection, SearchBar)
        ├── context/          # React Contexts (AuthContext, ThemeContext)
        ├── hooks/            # Custom React hooks
        ├── pages/            # Page-level components (Home, PackageDetail, Dashboard)
        ├── services/         # Axios API service wrappers
        └── styles/           # Global CSS and Tailwind directives
```

---

*Designed and Built for The C. Tech. (CATALYST TECHONOLOGIES PVT. LTD.).*
