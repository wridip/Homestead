const User = require('../models/User');
const Property = require('../models/Property');
const Booking = require('../models/Booking');
const moment = require('moment');

// @desc    Get system-wide stats for Admin
// @route   GET /api/admin/stats
// @access  Private (Admin)
exports.getAdminStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalHosts = await User.countDocuments({ role: 'Host' });
    const totalTravelers = await User.countDocuments({ role: 'Traveler' });
    
    const totalProperties = await Property.countDocuments();
    const activeProperties = await Property.countDocuments({ status: 'Active' });
    
    const totalBookings = await Booking.countDocuments();
    const completedBookings = await Booking.find({ status: 'Completed' });
    const totalRevenue = completedBookings.reduce((acc, b) => acc + b.totalPrice, 0);

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

    res.status(200).json({
      success: true,
      data: {
        users: { total: totalUsers, hosts: totalHosts, travelers: totalTravelers, new: newUsers },
        properties: { total: totalProperties, active: activeProperties },
        bookings: { total: totalBookings, completed: completedBookings.length, new: newBookings },
        revenue: totalRevenue,
        recentBookings,
        monthlyRevenue
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
    const users = await User.find().select('-password');
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
    const properties = await Property.find().populate('hostId', 'name email');
    res.status(200).json({ success: true, data: properties });
  } catch (error) {
    next(error);
  }
};
