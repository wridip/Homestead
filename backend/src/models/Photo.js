const mongoose = require('mongoose');

const PhotoSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  property: {
    type: mongoose.Schema.ObjectId,
    ref: 'Property',
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  caption: {
    type: String,
    required: true,
  },
  socialLink: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Photo', PhotoSchema);
