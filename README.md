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

### Prerequisites

-   [Node.js](https://nodejs.org/en/download/) (v20+ recommended)
-   [npm](https://www.npmjs.com/get-npm)
-   [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account for the database.

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/homestead-management-system.git
    cd homestead-management-system
    ```

2.  **Setup the Backend:**
    ```bash
    cd backend
    npm install
    # Create a .env file based on .env.example and configure variables (PORT, DB_URI, JWT_SECRET, etc.)
    ```

3.  **Setup the Frontend:**
    ```bash
    cd frontend
    npm install
    # Create a .env file and configure VITE_GOOGLE_MAPS_API_KEY (e.g., http://localhost:5000)
    ```

### Running the Application (Development)

-   **Backend:** `cd backend && npm run dev` (Runs on `http://localhost:5000` by default)
-   **Frontend:** `cd frontend && npm run dev` (Runs on `http://localhost:5173` by default)

### Building the Application

-   **Frontend:** `cd frontend && npm run build` (Generates the production-ready files in the `dist` folder)

### Testing the Application

-   **Frontend Tests:** `cd frontend && npm run test` (Runs Vitest for component and logic testing)
-   **Frontend Linting:** `cd frontend && npm run lint` (Checks for code quality issues using ESLint)

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
