const mongoose = require('mongoose');
const moment = require('moment');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Booking = require('../models/Booking');
const Property = require('../models/Property');

// Initialize Razorpay lazily or safely
let razorpay;
try {
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    console.log('Razorpay initialized successfully.');
  } else {
    console.warn('Razorpay keys are missing. Razorpay functionality will not work.');
  }
} catch (error) {
  console.error(`Razorpay initialization failed: ${error.message}`);
}

// @desc    Create a new booking and Razorpay order
// @route   POST /api/bookings
// @access  Private (Traveler)
exports.createBooking = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { propertyId, startDate, endDate } = req.body;

    if (!razorpay) {
      await session.abortTransaction();
      session.endSession();
      return res.status(500).json({ success: false, message: 'Razorpay is not configured on the server' });
    }

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

    const totalPrice = duration * property.baseRate;

    // --- Razorpay Order Creation ---
    const options = {
      amount: totalPrice * 100, // Razorpay expects amount in paise (₹1 = 100 paise)
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    const booking = (await Booking.create([{
      travelerId: req.user._id,
      propertyId,
      hostId: property.hostId,
      startDate,
      endDate,
      totalPrice,
      razorpayOrderId: razorpayOrder.id,
      paymentStatus: 'Unpaid',
      status: 'Pending',
    }], { session }))[0];

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      data: booking,
      razorpayOrder,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

// @desc    Verify Razorpay Payment
// @route   POST /api/bookings/verify
// @access  Private (Traveler)
exports.verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({ success: false, message: 'Razorpay Key Secret is not configured' });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isSignatureValid = expectedSignature === razorpay_signature;

    if (isSignatureValid) {
      const booking = await Booking.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        {
          paymentStatus: 'Paid',
          status: 'Confirmed',
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
        },
        { new: true }
      );

      if (!booking) {
        return res.status(404).json({ success: false, message: 'Booking not found' });
      }

      res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
        data: booking,
      });
    } else {
      await Booking.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { paymentStatus: 'Failed' }
      );
      res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }
  } catch (error) {
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