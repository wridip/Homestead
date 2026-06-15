const Booking = require('../models/Booking');
const Property = require('../models/Property');
const moment = require('moment');
const mongoose = require('mongoose');

// @desc    Get host dashboard stats
// @route   GET /api/hosts/stats
// @access  Private (Host)
exports.getDashboardStats = async (req, res, next) => {
  try {
    const hostId = req.user._id;
    let startDateRange;
    let range;

    if (req.query.dateRange === 'all') {
      const oldestBooking = await Booking.findOne({ hostId }).sort({ createdAt: 1 });
      startDateRange = oldestBooking ? moment(oldestBooking.createdAt).startOf('day').toDate() : moment().subtract(1, 'year').startOf('day').toDate();
      range = moment().diff(moment(startDateRange), 'days') + 1;
    } else {
      range = parseInt(req.query.dateRange) || 7;
      startDateRange = moment().subtract(range - 1, 'days').startOf('day').toDate();
    }

    // Get total properties
    const totalProperties = await Property.countDocuments({ hostId });

    // Get total bookings
    const totalBookings = await Booking.countDocuments({ hostId });

    // Get upcoming bookings
    const upcomingBookings = await Booking.find({
      hostId,
      startDate: { $gte: moment().startOf('day').toDate() },
      status: { $in: ['Pending', 'Confirmed'] },
    })
      .sort({ startDate: 'asc' })
      .limit(5)
      .populate('propertyId', 'name images')
      .populate('travelerId', 'name')
      .lean();

    const upcomingWithNights = upcomingBookings.map(b => ({
      ...b,
      nights: moment(b.endDate).diff(moment(b.startDate), 'days')
    }));

    // Stats for current month vs last month
    const startOfCurrentMonth = moment().startOf('month').toDate();
    const startOfLastMonth = moment().subtract(1, 'month').startOf('month').toDate();
    const endOfLastMonth = moment().subtract(1, 'month').endOf('month').toDate();

    // New properties this month
    const newPropertiesThisMonth = await Property.countDocuments({
      hostId,
      createdAt: { $gte: startOfCurrentMonth }
    });

    // Monthly earnings (completed bookings this month)
    const completedBookingsThisMonth = await Booking.find({
      hostId,
      status: 'Completed',
      endDate: { $gte: startOfCurrentMonth },
    });
    const monthlyEarnings = completedBookingsThisMonth.reduce((acc, b) => acc + b.totalPrice, 0);

    // Earnings growth
    const completedBookingsLastMonth = await Booking.find({
      hostId,
      status: 'Completed',
      endDate: { $gte: startOfLastMonth, $lte: endOfLastMonth },
    });
    const lastMonthEarnings = completedBookingsLastMonth.reduce((acc, b) => acc + b.totalPrice, 0);
    const earningsGrowth = lastMonthEarnings > 0 
      ? ((monthlyEarnings - lastMonthEarnings) / lastMonthEarnings) * 100 
      : (monthlyEarnings > 0 ? 100 : 0);

    // Booking growth
    const bookingsThisMonth = await Booking.countDocuments({
      hostId,
      createdAt: { $gte: startOfCurrentMonth }
    });
    const bookingsLastMonth = await Booking.countDocuments({
      hostId,
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
    });
    const bookingGrowth = bookingsLastMonth > 0 
      ? ((bookingsThisMonth - bookingsLastMonth) / bookingsLastMonth) * 100 
      : (bookingsThisMonth > 0 ? 100 : 0);

    // Occupancy Rate
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
      const diff = end.diff(start, 'days');
      if (diff > 0) totalBookedDays += diff;
    });

    const totalPossibleDays = totalProperties * 30;
    const occupancyRate = totalPossibleDays > 0 ? (totalBookedDays / totalPossibleDays) * 100 : 0;
    
    // Real Graph Data using Aggregation
    const startDateRange = moment().subtract(range - 1, 'days').startOf('day').toDate();
    
    const aggregatedStats = await Booking.aggregate([
      {
        $match: {
          hostId: new mongoose.Types.ObjectId(hostId),
          createdAt: { $gte: startDateRange }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          bookings: { $sum: 1 },
          revenue: { $sum: "$totalPrice" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Fill in missing dates with zero values
    const bookingDataMap = new Map(aggregatedStats.map(item => [item._id, item]));
    const bookingData = [];
    const iterRange = range > 365 ? 365 : range; 
    for (let i = iterRange - 1; i >= 0; i--) {
      const dateStr = moment().subtract(i, 'days').format('YYYY-MM-DD');
      const data = bookingDataMap.get(dateStr) || { bookings: 0, revenue: 0 };
      bookingData.push({
        date: dateStr,
        bookings: data.bookings,
        revenue: data.revenue
      });
    }

    res.status(200).json({
      success: true,
      data: {
        totalProperties,
        totalBookings,
        upcomingBookings: upcomingWithNights,
        monthlyEarnings,
        occupancyRate: occupancyRate.toFixed(1),
        bookingData,
        newPropertiesThisMonth,
        bookingGrowth: bookingGrowth.toFixed(1),
        earningsGrowth: earningsGrowth.toFixed(1),
        occupancyRateGrowth: (occupancyRate > 0 ? 2.5 : 0), // Placeholder for occupancy growth
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
      const nights = moment(booking.endDate).diff(moment(booking.startDate), 'days');
      
      if (!acc[monthYear]) {
        acc[monthYear] = {
          bookings: [],
          totalEarnings: 0,
        };
      }
      acc[monthYear].bookings.push({
        ...booking.toObject(),
        nights
      });
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
