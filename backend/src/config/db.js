const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log('Using existing MongoDB connection.');
    return;
  }

  if (!process.env.DB_URI) {
    throw new Error('DB_URI is not defined in environment variables');
  }

  try {
    const db = await mongoose.connect(process.env.DB_URI);
    isConnected = db.connections[0].readyState;
    console.log('MongoDB connected successfully.');
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    throw error;
  }
};

module.exports = connectDB;
