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

// Startup Environment Check
if (process.env.NODE_ENV !== 'test') {
  const requiredEnvVars = ['DB_URI', 'JWT_ACCESS_SECRET'];
  const missingVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
  if (missingVars.length > 0) {
    console.error(`[CRITICAL] Missing required environment variables: ${missingVars.join(', ')}`);
    console.error('The server may fail to handle requests correctly.');
  }
}

const connectDB = require('./src/config/db');

const app = express();

// Enable trust proxy for Vercel/proxies
app.set('trust proxy', 1);

// --- Database Connection Middleware ---
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

// --- CORS ---
// Two-tier origin strategy:
//   Tier 1 — exact match for known production + dev origins.
//   Tier 2 — scoped regex for Vercel preview deployments that belong ONLY to
//             this project's team (wridip-sarkars-projects). This avoids the
//             original catch-all *.vercel.app wildcard (which let ANY Vercel
//             user bypass CORS) while still allowing every preview branch URL.
const ALLOWED_ORIGINS_EXACT = [
  'http://localhost:5173',
  'https://homestead-ui.vercel.app',
  'https://homestead-management-system.vercel.app',
];

// Matches: homestead-<hash>-wridip-sarkars-projects.vercel.app
// Also matches the extra CORS_ORIGIN env var set per-deployment in Vercel.
const TEAM_PREVIEW_PATTERN = /^https:\/\/homestead(-[a-z0-9]+)*-wridip-sarkars-projects\.vercel\.app$/;

if (process.env.CORS_ORIGIN) {
  ALLOWED_ORIGINS_EXACT.push(process.env.CORS_ORIGIN);
}

app.use(cors({
  origin: (origin, callback) => {
    // Allow server-to-server / curl (no origin header)
    if (!origin) return callback(null, true);
    if (
      ALLOWED_ORIGINS_EXACT.includes(origin) ||
      TEAM_PREVIEW_PATTERN.test(origin)
    ) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Set security-related HTTP headers
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP to avoid issues with maps/external scripts for now
}));

// Log HTTP requests in development mode
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// --- Body parsing middleware (with size limits to prevent large-payload DoS) ---
app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: true, limit: '50kb' }));
app.use(cookieParser());

// --- Rate Limiters ---
// Helper to create a rate limiter with standard options
const makeRateLimiter = (windowMs, max, message) =>
  rateLimit({
    windowMs,
    max,
    message: { success: false, message },
    standardHeaders: true,  // Return RateLimit-* headers
    legacyHeaders: false,   // Disable X-RateLimit-* legacy headers
    validate: { xForwardedForHeader: false }, // Suppress Vercel proxy warning
  });

// Global limiter — covers every route including /api/csrf-token
const globalLimiter = makeRateLimiter(
  1 * 60 * 1000, // 1 minute window
  100,           // 100 requests per IP per minute
  'Too many requests, please slow down.'
);

// Strict limiters for sensitive auth endpoints
const loginLimiter = makeRateLimiter(
  15 * 60 * 1000, // 15 minute window
  10,             // 10 attempts per IP per 15 min
  'Too many login attempts. Please try again in 15 minutes.'
);

const signupLimiter = makeRateLimiter(
  60 * 60 * 1000, // 1 hour window
  10,             // 10 signups per IP per hour
  'Too many accounts created from this IP. Please try again later.'
);

const refreshLimiter = makeRateLimiter(
  15 * 60 * 1000, // 15 minute window
  30,             // 30 refresh calls per IP per 15 min
  'Too many token refresh attempts. Please try again later.'
);

const googleAuthLimiter = makeRateLimiter(
  15 * 60 * 1000, // 15 minute window
  20,             // 20 Google auth calls per IP per 15 min
  'Too many Google login attempts. Please try again later.'
);

if (process.env.NODE_ENV !== 'test') {
  // Apply global limiter BEFORE all routes (including csrf-token)
  app.use(globalLimiter);

  // Sanitize data against NoSQL injection
  app.use(mongoSanitize());
}

// CSRF Protection
const isProd = process.env.NODE_ENV === 'production' || process.env.VERCEL;
const csrfProtection = csurf({
  cookie: {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax', // 'none' needed for cross-origin Vercel deployments
  },
});
app.use(csrfProtection);

app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// --- API Routes ---
const authRoutes = require('./src/routes/authRoutes');
const propertyRoutes = require('./src/routes/propertyRoutes');
const bookingRoutes = require('./src/routes/bookingRoutes');
const reviewRoutes = require('./src/routes/reviewRoutes');
const hostRoutes = require('./src/routes/hostRoutes');
const photoRoutes = require('./src/routes/photoRoutes');
const messageRoutes = require('./src/routes/messageRoutes');
const userRoutes = require('./src/routes/userRoutes');
const adminRoutes = require('./src/routes/adminRoutes');

// Attach per-route limiters to sensitive auth endpoints before mounting the router
if (process.env.NODE_ENV !== 'test') {
  app.use('/api/auth/login', loginLimiter);
  app.use('/api/auth/signup', signupLimiter);
  app.use('/api/auth/refresh-token', refreshLimiter);
  app.use('/api/auth/google', googleAuthLimiter);
}

app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/hosts', hostRoutes);
app.use('/api/photos', photoRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
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
