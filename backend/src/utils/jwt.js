const jwt = require('jsonwebtoken');

const generateAccessToken = (res, userId, role) => {
  const token = jwt.sign({ userId, role }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  });
  return token;
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
  res.cookie('refreshToken', '', {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    expires: new Date(0),
  });
};

module.exports = { generateAccessToken, generateRefreshToken, clearToken };