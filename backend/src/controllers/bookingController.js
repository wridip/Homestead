const Booking = require('../models/Booking');
const Property = require('../models/Property');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private (Traveler)
exports.createBooking = async (req, res, next) => {
  try {
    const { propertyId, startDate, endDate, totalPrice } = req.body;

    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({ success: false, message: `Property not found with id of ${propertyId}` });
    }

    // Check for overlapping bookings
    const overlappingBooking = await Booking.findOne({
      propertyId,
      $or: [
        { startDate: { $lt: endDate }, endDate: { $gt: startDate } },
      ],
      status: { $ne: 'Cancelled' }
    });

    if (overlappingBooking) {
      return res.status(400).json({ success: false, message: 'Property is not available for the selected dates' });
    }

    const booking = await Booking.create({
      travelerId: req.user._id,
      propertyId,
      hostId: property.hostId,
      startDate,
      endDate,
      totalPrice,
    });

    res.status(201).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings for the logged-in user
// @route   GET /api/bookings/user
// @access  Private (Traveler)
exports.getUserBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ travelerId: req.user._id }).populate('propertyId', 'title location');

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
    const bookings = await Booking.find({ hostId: req.user._id }).populate('propertyId', 'title').populate('travelerId', 'name email');

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
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