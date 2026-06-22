const jwt = require('jsonwebtoken');

const generateAccessToken = (res, userId, role) => {
  const token = jwt.sign({ userId, role }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  });

  // Store access token in an httpOnly cookie — not accessible to JS (prevents XSS theft)
  res.cookie('accessToken', token, {
    httpOnly: true,
    secure: true,       // HTTPS only (Vercel)
    sameSite: 'none',   // Required for cross-origin requests
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  return token; // Still return it so existing callers that need the value still work
};

const generateRefreshToken = (res, userId) => {
  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true, // Always true for HTTPS (Vercel)
    sameSite: 'none', // Needed for cross-site cookies
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return refreshToken;
};

const clearToken = (res) => {
  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    expires: new Date(0),
  };
  res.cookie('accessToken', '', cookieOptions);
  res.cookie('refreshToken', '', cookieOptions);
};

module.exports = { generateAccessToken, generateRefreshToken, clearToken };