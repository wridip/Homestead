const express = require('express');
const router = express.Router();

const {
  getDashboardStats,
  getHostProperties,
} = require('../controllers/hostController');

const { protect, authorize } = require('../middlewares/authMiddleware');

// @route   GET api/hosts/stats
// @desc    Get host dashboard stats
// @access  Private (Host)
router.get('/stats', protect, authorize('Host'), getDashboardStats);

// @route   GET api/hosts/properties
// @desc    Get all properties for a host
// @access  Private (Host)
router.get('/properties', protect, authorize('Host'), getHostProperties);

module.exports = router;
