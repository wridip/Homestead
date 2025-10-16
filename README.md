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
| **Database**  | [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)                                   |
| **Auth**      | [JSON Web Tokens (JWT)](https://jwt.io/), [bcrypt.js](https://github.com/dcodeIO/bcrypt.js)                      |
| **Testing**   | **Backend:** [Jest](https://jestjs.io/), [Supertest](https://github.com/ladjs/supertest) <br> **Frontend:** [Vitest](https://vitest.dev/), [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) |
| **Security**  | [Helmet](https://helmetjs.github.io/), [CORS](https://expressjs.com/en/resources/middleware/cors.html), [Rate Limiting](https://github.com/express-rate-limit/express-rate-limit), [Mongo Sanitize](https://github.com/fiznool/express-mongo-sanitize), [XSS Clean](https://github.com/leizongmin/js-xss) |

---

## Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/en/download/) (v18 or higher recommended)
-   [npm](https://www.npmjs.com/get-npm)
-   [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally.

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/homestead-management-system.git
    cd homestead-management-system
    ```

2.  **Setup the Backend:**
    ```bash
    # Navigate to the backend directory
    cd backend

    # Install dependencies
    npm install

    # Create a .env file from the example
    cp .env.example .env

    # Update your .env file with your MongoDB URI and a JWT secret
    # Example:
    # DB_URI=mongodb://localhost:27017/homestead
    # JWT_SECRET=a_very_strong_and_long_secret_key
    ```

3.  **Setup the Frontend:**
    ```bash
    # Navigate to the frontend directory from the root
    cd frontend

    # Install dependencies
    npm install
    ```

### Running the Application

You will need two separate terminals to run both the backend and frontend servers simultaneously.

-   **Run the Backend Server:**
    ```bash
    # In the /backend directory
    npm run dev
    ```
    The backend API will be running at `http://localhost:5000`.

-   **Run the Frontend Server:**
    ```bash
    # In the /frontend directory
    npm run dev
    ```
    The frontend application will be available at `http://localhost:5173`.

### Running Tests

-   **Run Backend Tests:**
    ```bash
    # In the /backend directory
    npm test
    ```

-   **Run Frontend Tests:**
    ```bash
    # In the /frontend directory
    npm test
    ```

---

## Project Structure

The project is organized into a monorepo structure with two main directories: `backend` and `frontend`. A detailed architectural overview can be found in `ARCHITECTURE.md`.

### Backend Structure

```
backend/
├── src/
│   ├── config/         # Database connection
│   ├── controllers/    # Business logic
│   ├── middlewares/    # Auth, error handling, etc.
│   ├── models/         # Mongoose schemas
│   └── routes/         # API routes
├── .env.example
└── server.js           # Server entry point
```

### Frontend Structure

```
frontend/
├── src/
│   ├── components/     # Reusable UI components
│   ├── context/        # Global state (AuthContext)
│   ├── pages/          # Application pages
│   ├── routes/         # Routing configuration
│   └── services/       # API services
└── vite.config.js
```

---

## API Documentation

A high-level overview of the main API endpoints.

### Authentication (`/api/auth`)

-   `POST /signup`: Register a new user.
-   `POST /login`: Authenticate a user and receive a JWT.

### Properties (`/api/properties`)

-   `GET /`: Get all listed properties with optional filters.
-   `GET /:id`: Get a single property by its ID.
-   `POST /`: Create a new property (Host/Admin only).
-   `PUT /:id`: Update an existing property (Host/Admin only).
-   `DELETE /:id`: Delete a property (Host/Admin only).

### Bookings (`/api/bookings`)

-   `POST /`: Create a new booking (Traveler only).
-   `GET /user`: Get all bookings for the logged-in traveler.
-   `GET /host`: Get all bookings for the logged-in host.
-   `PUT /:id/cancel`: Cancel a booking."# Homestead-Management-System" 
