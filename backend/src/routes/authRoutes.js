const express = require('express');
const router = express.Router();

const { signup, login, logout, refresh, googleLogin } = require('../controllers/authController');
const validationMiddleware = require('../middlewares/validationMiddleware');
const { signupSchema, loginSchema } = require('../utils/validationSchemas');
const { verifyCaptcha } = require('../middlewares/captchaMiddleware');

// @route   POST api/auth/signup
// @desc    Register a new user
// @access  Public
router.post('/signup', [verifyCaptcha, validationMiddleware(signupSchema)], signup);

// @route   POST api/auth/login
// @desc    Authenticate user and get token
// @access  Public
router.post('/login', [verifyCaptcha, validationMiddleware(loginSchema)], login);

// @route   POST api/auth/google
// @desc    Google login
// @access  Public
router.post('/google', googleLogin);

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