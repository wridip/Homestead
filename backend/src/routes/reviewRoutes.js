const express = require('express');
const router = express.Router({ mergeParams: true }); // mergeParams allows us to get params from parent router

const { createReview, getReviewsForProperty } = require('../controllers/reviewController');

// All routes here are prefixed with /api/properties/:propertyId/reviews

const { protect, authorize } = require('../middlewares/authMiddleware');

// @route   POST /
// @desc    Create a new review for a property
// @access  Private (Traveler who has completed a booking)
router.post('/', protect, authorize('Traveler'), createReview);

// @route   GET /
// @desc    Get all reviews for a property
// @access  Public
router.get('/', getReviewsForProperty);

module.exports = router;