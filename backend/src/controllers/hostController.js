const Booking = require('../models/Booking');
const Property = require('../models/Property');
const moment = require('moment');

// @desc    Get host dashboard stats
// @route   GET /api/hosts/stats
// @access  Private (Host)
exports.getDashboardStats = async (req, res, next) => {
  try {
    const hostId = req.user._id;

    // Get total properties
    const totalProperties = await Property.countDocuments({ hostId });

    // Get total bookings
    const totalBookings = await Booking.countDocuments({ hostId });

    // Get upcoming bookings (from today onwards)
    const upcomingBookings = await Booking.find({
      hostId,
      startDate: { $gte: moment().startOf('day').toDate() },
      status: 'Confirmed',
    })
      .sort({ startDate: 'asc' })
      .limit(5)
      .populate('propertyId', 'title');

    // Get monthly earnings (for the current month)
    const startOfMonth = moment().startOf('month').toDate();
    const endOfMonth = moment().endOf('month').toDate();

    const monthlyBookings = await Booking.find({
      hostId,
      status: 'Confirmed',
      createdAt: { $gte: startOfMonth, $lte: endOfMonth },
    });

    const monthlyEarnings = monthlyBookings.reduce(
      (acc, booking) => acc + booking.totalPrice,
      0
    );

    // Calculate occupancy rate (for the next 30 days)
    const upcoming30Days = moment().add(30, 'days').toDate();
    const hostProperties = await Property.find({ hostId }).select('_id');
    const propertyIds = hostProperties.map(p => p._id);

    const bookingsInNext30Days = await Booking.find({
      propertyId: { $in: propertyIds },
      status: 'Confirmed',
      startDate: { $lt: upcoming30Days },
      endDate: { $gt: moment().startOf('day').toDate() },
    });

    let totalBookedDays = 0;
    bookingsInNext30Days.forEach(booking => {
      const start = moment.max(moment(booking.startDate), moment());
      const end = moment.min(moment(booking.endDate), moment().add(30, 'days'));
      totalBookedDays += end.diff(start, 'days');
    });

    const totalPossibleDays = totalProperties * 30;
    const occupancyRate = totalPossibleDays > 0 ? (totalBookedDays / totalPossibleDays) * 100 : 0;

    res.status(200).json({
      success: true,
      data: {
        totalProperties,
        totalBookings,
        upcomingBookings,
        monthlyEarnings,
        occupancyRate: occupancyRate.toFixed(2),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all properties for a host
// @route   GET /api/hosts/properties
// @access  Private (Host)
exports.getHostProperties = async (req, res, next) => {
  try {
    const properties = await Property.find({ hostId: req.user._id });

    res.status(200).json({
      success: true,
      count: properties.length,
      data: properties,
    });
  } catch (error) {
    next(error);
  }
};
