const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log('MongoDB connected successfully.');
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    if (process.env.NODE_ENV !== 'test') {
      // Exit process with failure
      process.exit(1);
    }
  }
};

module.exports = connectDB;