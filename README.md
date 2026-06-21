# Homestead Management System

**Homestead Management System** is a full-stack web application designed as a modern booking and management platform for unique and offbeat homestays. It connects travelers seeking authentic experiences with hosts in rural and less-traveled locations, with a focus on promoting sustainable and responsible tourism.

This repository contains both the frontend (React, Vite, Tailwind CSS) and backend (Node.js, Express, MongoDB) of the application, built following modern architectural principles like Clean Architecture and RESTful design.

## Features

-   **For Travelers:**
    -   Explore a curated list of unique homestays.
    -   Filter properties by location, price, amenities, and more.
    -   View detailed property information, including images and reviews.
    -   Book stays securely and manage upcoming reservations.
-   **For Hosts:**
    -   A dedicated dashboard to manage properties and bookings.
    -   Full CRUD (Create, Read, Update, Delete) functionality for property listings.
    -   View and manage incoming booking requests.
-   **Secure Authentication:**
    -   JWT-based authentication with password hashing (bcrypt).
    -   Role-based access control (Traveler, Host, Admin) to protect routes and actions.

---

## Tech Stack

| Category      | Technology                                                                                                   |
| :------------ | :----------------------------------------------------------------------------------------------------------- |
| **Frontend**  | [React](https://react.dev/) (`v19`), [Vite](https://vitejs.dev/), [Tailwind CSS](https://tailwindcss.com/)      |
| **Backend**   | [Node.js](https://nodejs.org/), [Express](https://expressjs.com/)                                              |
| **Database**  | [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Managed Cloud Database)                                   |
| **Auth**      | [JSON Web Tokens (JWT)](https://jwt.io/), [bcrypt.js](https://github.com/dcodeIO/bcrypt.js)                      |

---

## Project Architecture

The project is structured as a client-server application, with a clear separation between the frontend and backend.

### Backend Architecture (Node.js/Express)
The backend follows a modular **MVC (Model-View-Controller)** pattern (without the traditional "View" layer as it serves a JSON API):
-   **`src/routes/`**: Defines the API endpoints and maps them to controllers.
-   **`src/controllers/`**: Contains the business logic for handling requests.
-   **`src/models/`**: Mongoose schemas and models for MongoDB.
-   **`src/middlewares/`**: Custom middleware for authentication, error handling, and request validation.
-   **`src/config/`**: Database and environment configuration.
-   **`src/utils/`**: Helper functions and utility classes.

### Frontend Architecture (React/Vite)
The frontend is built with React and follows a component-based architecture:
-   **`src/components/`**: Reusable UI components (Common, Layout, Property, Search, etc.).
-   **`src/pages/`**: Main page components for different routes (Home, Explore, Dashboard, etc.).
-   **`src/context/`**: React Context for global state management (Auth, Theme, Google Maps).
-   **`src/hooks/`**: Custom React hooks for data fetching and side effects.
-   **`src/services/`**: API service layers for communicating with the backend.
-   **`src/assets/`**: Static assets like images and custom CSS.

---

## Getting Started

Follow these steps to run and test the Homestead Management System on your local machine.

### Prerequisites

You need the following installed on your PC:
- **Node.js** (v20+ recommended) - [Download here](https://nodejs.org/en/download/)
- **npm** (usually bundled with Node.js)
- **MongoDB** (Community Edition installed locally, or a MongoDB Atlas cloud URI) - [Download local MongoDB here](https://www.mongodb.com/try/download/community)

---

### Setup Guide

If you downloaded the repository as a ZIP from GitHub (or cloned it), files containing sensitive credentials (like `.env`) are ignored by Git. You must configure them manually to run the app locally.

1. **Extract** the downloaded ZIP file to a folder on your PC.
2. **Setup the Backend Environment (`backend/.env`):**
   * Go into the `backend` directory.
   * Copy the `/.env.example` file and rename it to `.env` (or create a new `.env` file).
   * Configure the parameters. For local testing, you should have **MongoDB** running locally on your PC (default port: `27017`):
     ```env
     PORT=5000
     NODE_ENV=development
     DB_URI=mongodb://localhost:27017/homestead-management
     
     # Use a custom secret string of your choice for JWT token security
     JWT_SECRET=your_jwt_secret_key_here
     JWT_EXPIRES_IN=1d
     
     CORS_ORIGIN=http://localhost:5173
     ```
3. **Setup the Frontend Environment (`frontend/.env`):**
   * Go into the `frontend` directory.
   * Create a new file named `.env`.
   * Configure your Google Maps API key (necessary for displaying map features and autocomplete search fields):
     ```env
     VITE_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY
     ```
4. Proceed to the **Install & Run** section below.

---

### Install & Run

Run the backend and frontend servers in separate terminal windows.

#### 1. Start the Backend Server
```bash
cd backend
npm install
npm run dev
```
*The backend server will run on [http://localhost:5000](http://localhost:5000).*

#### 2. Start the Frontend Server
```bash
cd frontend
npm install
npm run dev
```
*The frontend React application will open automatically on [http://localhost:5173](http://localhost:5173).*

---

### How to Test the Features

Once both servers are running and you open the frontend in your browser:
1. **User Sign Up:** 
   * Click **Sign Up** in the navbar.
   * You can choose to register as a **Traveler** (to search, view, and book properties) or a **Host** (to list properties and manage incoming booking requests on your dashboard).
2. **Explore & Book (Traveler Role):**
   * Log in with a traveler account.
   * Go to the *Explore* page, browse listings, check detail pages, and send booking requests.
3. **Manage Listings (Host Role):**
   * Log in with a host account.
   * Go to the *Dashboard* to add/edit property details, upload photos, and approve/decline traveler booking requests.

---

### Additional Scripts

* **Frontend Unit Tests:** Run `cd frontend && npm run test` to run Vite-based unit and component tests.
* **Frontend Linting:** Run `cd frontend && npm run lint` to check for syntax and style formatting guidelines.
* **Production Build:** Run `cd frontend && npm run build` to compile the optimized production-ready bundle.

---

## API Documentation

The backend provides a RESTful API for all operations.

### Authentication
-   `POST /api/auth/signup`: Register a new user.
-   `POST /api/auth/login`: Authenticate a user and receive a JWT.
-   `POST /api/auth/logout`: Log out the current user.

### Properties
-   `GET /api/properties`: Fetch all properties (with optional filtering).
-   `GET /api/properties/:id`: Fetch a single property by ID.
-   `POST /api/properties`: Create a new property listing (Requires Host role).
-   `PUT /api/properties/:id`: Update an existing property (Requires Host/Owner).
-   `DELETE /api/properties/:id`: Delete a property listing (Requires Host/Owner).

### Bookings
-   `GET /api/bookings`: Fetch all bookings for the logged-in user.
-   `POST /api/bookings`: Create a new booking request.
-   `PUT /api/bookings/:id`: Update booking status (e.g., Cancel or Confirm).

### Reviews
-   `GET /api/properties/:propertyId/reviews`: Get all reviews for a specific property.
-   `POST /api/properties/:propertyId/reviews`: Submit a review for a property (Requires Traveler role).

### Users
-   `GET /api/users/profile`: Get the profile of the currently authenticated user.
-   `PUT /api/users/profile`: Update the user's profile information.
