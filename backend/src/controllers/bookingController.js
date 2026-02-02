const mongoose = require('mongoose');
const moment = require('moment');
const Booking = require('../models/Booking');
const Property = require('../models/Property');
const { sendBookingConfirmation } = require('../utils/notifications');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private (Traveler)
exports.createBooking = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { propertyId, startDate, endDate } = req.body; // totalPrice removed

    const property = await Property.findById(propertyId).session(session);

    if (!property) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ success: false, message: `Property not found with id of ${propertyId}` });
    }

    // Check for overlapping bookings
    const overlappingBooking = await Booking.findOne({
      propertyId,
      $or: [
        { startDate: { $lt: endDate }, endDate: { $gt: startDate } },
      ],
      status: { $ne: 'Cancelled' }
    }).session(session);

    if (overlappingBooking) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ success: false, message: 'Property is not available for the selected dates' });
    }

    // --- Price Calculation ---
    const start = moment(startDate);
    const end = moment(endDate);
    const duration = end.diff(start, 'days');

    // For now, we'll use the baseRate. In the future, we can implement logic
    // to check for seasonal pricing.
    const totalPrice = duration * property.baseRate;


    const booking = (await Booking.create([{
      travelerId: req.user._id,
      propertyId,
      hostId: property.hostId,
      startDate,
      endDate,
      totalPrice, // Use the server-calculated price
    }], { session }))[0];

    await session.commitTransaction();
    session.endSession();

    // Send booking confirmation email
    try {
      // We need to get the full user object for the email
      const user = await req.user.populate('email name');
      await sendBookingConfirmation(booking, user, property);
    } catch (emailError) {
      // Log the error, but don't fail the request because the booking was successful.
      console.error('Failed to send confirmation email:', emailError);
    }

    res.status(201).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

// @desc    Get all bookings for the logged-in user
// @route   GET /api/bookings/user
// @access  Private (Traveler)
exports.getUserBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ travelerId: req.user._id }).populate('propertyId', 'name location');

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings for the logged-in host's properties
// @route   GET /api/bookings/host
// @access  Private (Host)
exports.getHostBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ hostId: req.user._id }).populate('propertyId', 'name').populate('travelerId', 'name email avatar');

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve a booking
// @route   PUT /api/bookings/:id/approve
// @access  Private (Host)
exports.approveBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: `Booking not found with id of ${req.params.id}` });
    }

    // Check if user is the host of the property
    if (booking.hostId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to approve this booking' });
    }

    booking.status = 'Confirmed';
    await booking.save();

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Complete a booking
// @route   PUT /api/bookings/:id/complete
// @access  Private (Host)
exports.completeBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: `Booking not found with id of ${req.params.id}` });
    }

    // Check if user is the host of the property
    if (booking.hostId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to complete this booking' });
    }

    booking.status = 'Completed';
    await booking.save();

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel a booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private (Traveler or Host)
exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: `Booking not found with id of ${req.params.id}` });
    }

    // Check if user is the traveler or the host of the property
    if (booking.travelerId.toString() !== req.user.id && booking.hostId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to cancel this booking' });
    }

    booking.status = 'Cancelled';
    await booking.save();

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};