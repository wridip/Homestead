const express = require('express');
const router = express.Router();

const {
  createBooking,
  getUserBookings,
  getHostBookings,
  cancelBooking,
  approveBooking,
} = require('../controllers/bookingController');

const { protect, authorize } = require('../middlewares/authMiddleware');

// @route   POST api/bookings
// @desc    Create a new booking
// @access  Private (Traveler)
router.post('/', protect, authorize('Traveler'), createBooking);

// @route   GET api/bookings/user
// @desc    Get all bookings for the logged-in user
// @access  Private (Traveler)
router.get('/user', protect, authorize('Traveler'), getUserBookings);

// @route   GET api/bookings/host
// @desc    Get all bookings for the logged-in host's properties
// @access  Private (Host)
router.get('/host', protect, authorize('Host'), getHostBookings);

// @route   PUT api/bookings/:id/approve
// @desc    Approve a booking
// @access  Private (Host)
router.put('/:id/approve', protect, authorize('Host'), approveBooking);

// @route   PUT api/bookings/:id/cancel
// @desc    Cancel a booking
// @access  Private (Traveler or Host)
router.put('/:id/cancel', protect, cancelBooking);

module.exports = router;