# Homestead Management System - Architecture Blueprint

This document outlines the complete architecture, tech stack, and design principles for the Homestead Management System. The goal is to build a scalable, maintainable, and secure full-stack application.

## 1. Tech Stack Rationale

The MERN stack (MongoDB, Express, React, Node.js) combined with Tailwind CSS and Vite is chosen for its robustness, developer productivity, and vibrant ecosystem.

-   **Node.js & Express:** Provides a fast, scalable, and lightweight backend, perfect for building RESTful APIs. Its non-blocking I/O model is ideal for a data-intensive application.
-   **MongoDB & Mongoose:** A NoSQL database that offers flexibility and scalability. Its document-based structure maps naturally to JavaScript objects, simplifying data handling. Mongoose provides schema validation and business logic hooks.
-   **React & Vite:** A powerful combination for building modern, fast, and interactive user interfaces. Vite offers a significantly faster development experience compared to traditional bundlers.
-   **Tailwind CSS:** A utility-first CSS framework that enables rapid UI development and ensures design consistency without leaving the HTML.
-   **JWT (JSON Web Tokens):** A standard for creating access tokens that assert claims, enabling stateless and secure authentication between the client and server.

---

## 2. Backend Architecture (Node.js + Express)

The backend follows a layered architecture inspired by Clean Architecture principles to ensure separation of concerns and maintainability.

### 2.1. Backend Folder Structure

```
backend/
├── src/
│   ├── config/             # Environment variables, database connection
│   │   └── db.js
│   ├── controllers/        # Request handling and business logic
│   │   ├── authController.js
│   │   ├── propertyController.js
│   │   ├── bookingController.js
│   │   └── reviewController.js
│   ├── middlewares/        # Express middleware (auth, error handling, validation)
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── validationMiddleware.js
│   ├── models/             # Mongoose database schemas and models
│   │   ├── User.js
│   │   ├── Property.js
│   │   ├── Booking.js
│   │   └── Review.js
│   ├── routes/             # API endpoint definitions
│   │   ├── authRoutes.js
│   │   ├── propertyRoutes.js
│   │   ├── bookingRoutes.js
│   │   └── reviewRoutes.js
│   └── utils/              # Utility functions (e.g., JWT helpers, email service)
│       └── jwt.js
├── .env.example            # Example environment variables
├── .gitignore
├── package.json
└── server.js               # Main server entry point
```

### 2.2. Backend Dependencies

-   **Production:** `express`, `mongoose`, `jsonwebtoken`, `bcryptjs`, `cors`, `dotenv`, `helmet`, `morgan`, `joi`, `express-rate-limit`, `express-mongo-sanitize`, `xss-clean`
-   **Development:** `nodemon`

---

## 3. Frontend Architecture (React + Vite + Tailwind)

The frontend is structured to be modular and scalable, separating concerns into pages, reusable components, services for API calls, and state management.

### 3.1. Frontend Folder Structure

```
frontend/
├── src/
│   ├── assets/             # Static assets (images, logos, fonts)
│   ├── components/         # Reusable UI components (Navbar, PropertyCard, etc.)
│   │   ├── common/         # Generic components (Button, Input, Loader)
│   │   └── layout/         # Layout components (Navbar, Footer, Sidebar)
│   ├── context/            # React Context for global state management (Auth, etc.)
│   │   ├── AuthContext.js
│   │   └── ThemeContext.js
│   ├── hooks/              # Custom React hooks (e.g., useFetch, useAuth)
│   ├── pages/              # Top-level page components (Home, Login, Dashboard)
│   │   ├── public/         # Pages accessible to all users
│   │   └── protected/      # Pages requiring authentication (Dashboard, MyBookings)
│   ├── routes/             # Application routing configuration
│   │   └── AppRouter.js
│   ├── services/           # API communication layer (axios instances, endpoints)
│   │   ├── authService.js
│   │   └── propertyService.js
│   └── utils/              # Utility functions (formatters, validators)
├── .gitignore
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

### 3.2. Frontend Dependencies

-   **Production:** `react`, `react-dom`, `react-router-dom`, `axios`, `recharts`, `@reduxjs/toolkit`, `react-redux`
-   **Development:** `vite`, `@vitejs/plugin-react`, `tailwindcss`, `postcss`, `autoprefixer`, `eslint`

---

## 4. Database Schema (MongoDB + Mongoose)

### 4.1. User Schema (`User.js`)

```javascript
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Traveler', 'Host', 'Admin'], default: 'Traveler' },
  avatar: { type: String, default: 'default-avatar.png' },
  isVerified: { type: Boolean, default: false },
}, { timestamps: true });
```

### 4.2. Property Schema (`Property.js`)

```javascript
const propertySchema = new mongoose.Schema({
  hostId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  location: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
  },
  pricePerNight: { type: Number, required: true },
  amenities: [{ type: String }], // e.g., ['wifi', 'kitchen', 'parking']
  maxGuests: { type: Number, required: true },
  images: [{ type: String }], // URLs to images
  isListed: { type: Boolean, default: true },
  averageRating: { type: Number, default: 0 },
}, { timestamps: true });
```

### 4.3. Booking Schema (`Booking.js`)

```javascript
const bookingSchema = new mongoose.Schema({
  travelerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  hostId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'], default: 'Pending' },
}, { timestamps: true });
```

### 4.4. Review Schema (`Review.js`)

```javascript
const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
}, { timestamps: true });
```

---

## 5. Environment Variables (`.env.example`)

These variables will be stored in a `.env` file in the `backend` directory.

```
# Server Configuration
PORT=5000

# MongoDB Database Connection
DB_URI=mongodb://localhost:27017/homestead-management

# JWT Authentication
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=1d

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```