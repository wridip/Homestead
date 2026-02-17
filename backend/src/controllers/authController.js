const User = require('../models/User');
const { generateAccessToken, generateRefreshToken, clearToken } = require('../utils/jwt');
const jwt = require('jsonwebtoken');

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
exports.signup = async (req, res, next) => {
  const { name, email, password, role } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const user = await User.create({ name, email, password, role });

    if (user) {
      const accessToken = generateAccessToken(res, user._id, user.role);
      generateRefreshToken(res, user._id);

      res.status(201).json({
        success: true,
        token: accessToken,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid user data' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user and get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      const accessToken = generateAccessToken(res, user._id, user.role);
      generateRefreshToken(res, user._id);

      res.json({
        success: true,
        token: accessToken,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
exports.logout = (req, res, next) => {
  clearToken(res);
  res.status(200).json({ success: true, message: 'User logged out successfully' });
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh-token
// @access  Private
exports.refresh = async (req, res, next) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(401).json({ success: false, message: 'No refresh token found' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid refresh token' });
    }

    const accessToken = generateAccessToken(res, user._id, user.role);

    res.json({
      success: true,
      token: accessToken,
    });
  } catch (error) {
    next(error);
  }
};