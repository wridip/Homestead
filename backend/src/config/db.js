const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log('Using existing MongoDB connection.');
    return;
  }

  try {
    const db = await mongoose.connect(process.env.DB_URI);
    isConnected = db.connections[0].readyState;
    console.log('MongoDB connected successfully.');
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    // Don't exit process in serverless
  }
};

module.exports = connectDB;
