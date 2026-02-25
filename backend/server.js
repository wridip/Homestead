const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const cookieParser = require('cookie-parser');
const csurf = require('@dr.pogodin/csurf');
const mongoSanitize = require('express-mongo-sanitize');

const rateLimit = require('express-rate-limit');

// Load environment variables
dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Set security-related HTTP headers
app.use(helmet());

// Log HTTP requests in development mode
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CSRF Protection
const csrfProtection = csurf({ cookie: true });
app.use(csrfProtection);

app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

if (process.env.NODE_ENV !== 'test') {
  // Sanitize data
  app.use(mongoSanitize());



  // Rate limiting
  const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 100,
  });
  app.use(limiter);
}

// --- Database Connection ---
if (process.env.NODE_ENV !== 'test') {
  const connectDB = require('./src/config/db');
  connectDB();
}

// --- API Routes ---
const authRoutes = require('./src/routes/authRoutes');
const propertyRoutes = require('./src/routes/propertyRoutes');
const bookingRoutes = require('./src/routes/bookingRoutes');
const reviewRoutes = require('./src/routes/reviewRoutes');
const hostRoutes = require('./src/routes/hostRoutes');
const photoRoutes = require('./src/routes/photoRoutes');
const messageRoutes = require('./src/routes/messageRoutes');
const userRoutes = require('./src/routes/userRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/hosts', hostRoutes);
app.use('/api/photos', photoRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);
// Nested reviews route under properties
app.use('/api/properties/:propertyId/reviews', reviewRoutes);

// Basic route for testing
app.get('/api', (req, res) => {
  res.status(200).json({ message: 'Welcome to the Homestead Management System API!' });
});

const errorHandler = require('./src/middlewares/errorMiddleware');
app.use(errorHandler);

// --- Server Initialization ---
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}

module.exports = app;
