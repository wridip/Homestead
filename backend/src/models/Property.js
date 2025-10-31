const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  hostId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  contact: {
    type: String,
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  amenities: [{ type: String }],
  roomTypes: [{
    name: String,
    beds: Number,
    occupancy: Number,
  }],
  baseRate: {
    type: Number,
    required: true
  },
  seasonalPricing: [{
    season: String,
    rate: Number,
  }],
  images: [{ type: String }],
  status: {
    type: String,
    required: true,
    default: 'Active',
    enum: ['Active', 'Inactive', 'Under Construction']
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual populate
propertySchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'propertyId',
  justOne: false
});

const Property = mongoose.model('Property', propertySchema);
module.exports = Property;