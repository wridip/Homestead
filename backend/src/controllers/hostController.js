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

    // Get upcoming bookings (from today onwards, including pending)
    const upcomingBookings = await Booking.find({
      hostId,
      startDate: { $gte: moment().startOf('day').toDate() },
      status: { $in: ['Pending', 'Confirmed'] },
    })
      .sort({ startDate: 'asc' })
      .limit(5)
      .populate('propertyId', 'name images')
      .populate('travelerId', 'name');

    // Get monthly earnings (for the current month from completed bookings)
    const startOfMonth = moment().startOf('month').toDate();
    const endOfMonth = moment().endOf('month').toDate();

    const completedBookingsThisMonth = await Booking.find({
      hostId,
      status: 'Completed',
      endDate: { $gte: startOfMonth, $lte: endOfMonth },
    });

    const monthlyEarnings = completedBookingsThisMonth.reduce(
      (acc, booking) => acc + booking.totalPrice,
      0
    );

    // Calculate occupancy rate (for the next 30 days based on confirmed bookings)
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
    
    // --- Mock Graph Data ---
    // This part is not implemented in the original code, but is required for the graph.
    // I will add a placeholder for booking and revenue data for the graph.
    // A real implementation would require a more complex aggregation query.
    const bookingData = [];
    for (let i = 6; i >= 0; i--) {
      const date = moment().subtract(i, 'days').format('YYYY-MM-DD');
      bookingData.push({
        date,
        bookings: Math.floor(Math.random() * 5),
        revenue: Math.floor(Math.random() * 5000),
      });
    }

    res.status(200).json({
      success: true,
      data: {
        totalProperties,
        totalBookings,
        upcomingBookings,
        monthlyEarnings,
        occupancyRate: occupancyRate.toFixed(2),
        bookingData, // Placeholder data for the graph
        // Mock values for other stats until they are implemented
        newPropertiesThisMonth: 1,
        bookingGrowth: 5.5,
        earningsGrowth: 12.0,
        occupancyRateGrowth: 2.3,
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

// @desc    Get a detailed earnings audit for a host
// @route   GET /api/hosts/earnings-audit
// @access  Private (Host)
exports.getEarningsAudit = async (req, res, next) => {
  try {
    const hostId = req.user._id;

    const completedBookings = await Booking.find({
      hostId,
      status: 'Completed',
    })
    .populate('travelerId', 'name')
    .populate('propertyId', 'name')
    .sort({ endDate: -1 });

    // Group bookings by month
    const monthlyAudit = completedBookings.reduce((acc, booking) => {
      const monthYear = moment(booking.endDate).format('MMMM YYYY');
      if (!acc[monthYear]) {
        acc[monthYear] = {
          bookings: [],
          totalEarnings: 0,
        };
      }
      acc[monthYear].bookings.push(booking);
      acc[monthYear].totalEarnings += booking.totalPrice;
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      data: monthlyAudit,
    });
  } catch (error) {
    next(error);
  }
};
