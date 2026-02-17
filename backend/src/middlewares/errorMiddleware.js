const multer = require('multer');
const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message;

  // Log to console for dev
  console.error(err.stack);

  // Multer errors
  if (err instanceof multer.MulterError) {
    error.statusCode = 400;
    error.message = `File Upload Error: ${err.message}`;
  }

  // Multer File Filter Error
  if (error.message && error.message.includes('Images Only!')) {
    error.statusCode = 400;
    error.message = 'Invalid file type. Only image files are allowed.';
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    error.statusCode = 404;
    error.message = message;
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = { statusCode: 400, message };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = { statusCode: 400, message };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
  });
};

module.exports = errorHandler;