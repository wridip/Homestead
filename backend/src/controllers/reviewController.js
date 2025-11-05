const Review = require('../models/Review');
const Property = require('../models/Property');
const Booking = require('../models/Booking');

// @desc    Create a new review for a property
// @route   POST /api/properties/:propertyId/reviews
// @access  Private (Traveler)
exports.createReview = async (req, res, next) => {
  const { rating, comment } = req.body;
  const propertyId = req.params.propertyId;
  const userId = req.user._id;

  try {
    // Check if the user has a completed booking for this property
    const booking = await Booking.findOne({
      propertyId,
      travelerId: userId,
      status: 'Completed',
    });

    if (!booking) {
      return res.status(403).json({ success: false, message: 'You can only review properties you have stayed at.' });
    }

    // Check if the user has already reviewed this property
    const existingReview = await Review.findOne({ propertyId, userId });

    if (existingReview) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this property.' });
    }

    const review = await Review.create({
      propertyId,
      userId,
      rating,
      comment,
    });

    // Recalculate the average rating for the property
    const reviews = await Review.find({ propertyId });
    const totalRating = reviews.reduce((acc, item) => item.rating + acc, 0);
    const averageRating = totalRating / reviews.length;

    await Property.findByIdAndUpdate(propertyId, {
      averageRating: averageRating.toFixed(1),
      numReviews: reviews.length,
    });

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reviews for a property
// @route   GET /api/properties/:propertyId/reviews
// @access  Public
exports.getReviewsForProperty = async (req, res, next) => {
  try {
    const reviews = await Review.find({ propertyId: req.params.propertyId }).populate('userId', 'name');
    res.status(200).json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    next(error);
  }
};