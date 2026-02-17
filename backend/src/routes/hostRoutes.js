const express = require('express');
const router = express.Router();

const {
  getDashboardStats,
  getHostProperties,
  getEarningsAudit,
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

// @route   GET api/hosts/earnings-audit
// @desc    Get a detailed earnings audit for a host
// @access  Private (Host)
router.get('/earnings-audit', protect, authorize('Host'), getEarningsAudit);

module.exports = router;
