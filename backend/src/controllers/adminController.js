const User = require('../models/User');
const Property = require('../models/Property');
const Booking = require('../models/Booking');
const moment = require('moment');

// @desc    Get system-wide stats for Admin
// @route   GET /api/admin/stats
// @access  Private (Admin)
exports.getAdminStats = async (req, res, next) => {
  try {
    let startDateRange;
    let range;

    if (req.query.dateRange === 'all') {
      const oldestBooking = await Booking.findOne().sort({ createdAt: 1 });
      startDateRange = oldestBooking ? moment(oldestBooking.createdAt).startOf('day').toDate() : moment().subtract(1, 'year').startOf('day').toDate();
      range = moment().diff(moment(startDateRange), 'days') + 1;
    } else {
      range = parseInt(req.query.dateRange) || 7;
      startDateRange = moment().subtract(range - 1, 'days').startOf('day').toDate();
    }
    
    const totalUsers = await User.countDocuments();
    const totalHosts = await User.countDocuments({ role: 'Host' });
    const totalTravelers = await User.countDocuments({ role: 'Traveler' });
    
    const totalProperties = await Property.countDocuments();
    const activeProperties = await Property.countDocuments({ status: 'Active' });
    
    const totalBookings = await Booking.countDocuments();
    
    // Revenue and Completed Bookings for the selected period
    const periodBookings = await Booking.find({ 
      status: 'Completed',
      createdAt: { $gte: startDateRange }
    });
    const periodRevenue = periodBookings.reduce((acc, b) => acc + b.totalPrice, 0);

    // Recent 10 bookings
    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('travelerId', 'name email')
      .populate('propertyId', 'name');

    // Stats for growth (last 30 days)
    const thirtyDaysAgo = moment().subtract(30, 'days').toDate();
    const newUsers = await User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
    const newBookings = await Booking.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });

    // Monthly Revenue Audit (Last 6 months)
    const sixMonthsAgo = moment().subtract(6, 'months').startOf('month').toDate();
    const monthlyRevenue = await Booking.aggregate([
      {
        $match: {
          status: 'Completed',
          endDate: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: { 
            month: { $month: "$endDate" },
            year: { $year: "$endDate" }
          },
          totalRevenue: { $sum: "$totalPrice" },
          bookingCount: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } }
    ]);

    // Graph Data based on range
    const aggregatedStats = await Booking.aggregate([
      {
        $match: {
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

    const bookingDataMap = new Map(aggregatedStats.map(item => [item._id, item]));
    const bookingData = [];
    // Only generate full range for smaller timeframes to avoid massive payloads
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
        users: { total: totalUsers, hosts: totalHosts, travelers: totalTravelers, new: newUsers },
        properties: { total: totalProperties, active: activeProperties },
        bookings: { total: totalBookings, completed: periodBookings.length, new: newBookings },
        revenue: periodRevenue,
        recentBookings,
        monthlyRevenue,
        bookingData
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (Admin)
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort('-createdAt');
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all properties (Admin)
// @route   GET /api/admin/properties
// @access  Private (Admin)
exports.getAllProperties = async (req, res, next) => {
  try {
    const properties = await Property.find().populate('hostId', 'name email').sort('-createdAt');
    res.status(200).json({ success: true, data: properties });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user audit (Admin)
// @route   GET /api/admin/users/:id/audit
// @access  Private (Admin)
exports.getUserAudit = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Traveler Stats
    const travelerBookings = await Booking.find({ travelerId: user._id })
      .populate('propertyId', 'name address baseRate')
      .sort('-createdAt');
    
    const travelerStats = {
      totalBookings: travelerBookings.length,
      totalSpend: travelerBookings.reduce((acc, b) => acc + b.totalPrice, 0),
      avgBookingValue: travelerBookings.length > 0 ? (travelerBookings.reduce((acc, b) => acc + b.totalPrice, 0) / travelerBookings.length).toFixed(0) : 0,
      completedBookings: travelerBookings.filter(b => b.status === 'Completed').length,
      cancelledBookings: travelerBookings.filter(b => b.status === 'Cancelled').length
    };

    // Host Stats
    const hostProperties = await Property.find({ hostId: user._id });
    const hostBookings = await Booking.find({ hostId: user._id })
      .populate('propertyId', 'name')
      .populate('travelerId', 'name email')
      .sort('-createdAt');

    const hostStats = {
      totalProperties: hostProperties.length,
      totalHostEarnings: hostBookings.reduce((acc, b) => b.status === 'Completed' ? acc + b.totalPrice : acc, 0),
      avgYieldPerProperty: hostProperties.length > 0 ? (hostBookings.reduce((acc, b) => b.status === 'Completed' ? acc + b.totalPrice : acc, 0) / hostProperties.length).toFixed(0) : 0,
      totalActiveListings: hostProperties.filter(p => p.status === 'Active').length
    };

    res.status(200).json({
      success: true,
      data: {
        user,
        travelerStats,
        hostStats,
        bookings: travelerBookings,
        properties: hostProperties,
        hostBookings
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle property status (Admin)
// @route   PUT /api/admin/properties/:id/toggle
// @access  Private (Admin)
exports.togglePropertyStatus = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    property.status = property.status === 'Active' ? 'Inactive' : 'Active';
    await property.save();

    res.status(200).json({ success: true, data: property });
  } catch (error) {
    next(error);
  }
};

// @desc    Get revenue details for a specific month (Admin)
// @route   GET /api/admin/revenue/:year/:month
// @access  Private (Admin)
exports.getMonthlyRevenueDetail = async (req, res, next) => {
  try {
    const { year, month } = req.params;
    const startDate = moment([year, month - 1]).startOf('month').toDate();
    const endDate = moment([year, month - 1]).endOf('month').toDate();

    const bookings = await Booking.find({
      status: 'Completed',
      endDate: { $gte: startDate, $lte: endDate }
    })
    .populate('travelerId', 'name email')
    .populate('propertyId', 'name address')
    .sort('-endDate')
    .lean();

    const bookingsWithNights = bookings.map(b => ({
      ...b,
      nights: moment(b.endDate).diff(moment(b.startDate), 'days')
    }));

    res.status(200).json({
      success: true,
      data: bookingsWithNights
    });
  } catch (error) {
    next(error);
  }
};
