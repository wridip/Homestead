const express = require('express');
const router = express.Router();

const { signup, login, logout, refresh } = require('../controllers/authController');
const validationMiddleware = require('../middlewares/validationMiddleware');
const { signupSchema, loginSchema } = require('../utils/validationSchemas');

// @route   POST api/auth/signup
// @desc    Register a new user
// @access  Public
router.post('/signup', validationMiddleware(signupSchema), signup);

// @route   POST api/auth/login
// @desc    Authenticate user and get token
// @access  Public
router.post('/login', validationMiddleware(loginSchema), login);

const { protect } = require('../middlewares/authMiddleware');

// @route   POST api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', protect, logout);

// @route   POST api/auth/refresh-token
// @desc    Refresh access token
// @access  Private
router.post('/refresh-token', protect, refresh);

module.exports = router;