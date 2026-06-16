const express = require('express');
const router = express.Router();

const {
  getDashboardStats,
  getHostProperties,
  getEarningsAudit,
  getMonthlyEarningsDetail,
} = require('../controllers/hostController');

const { protect, authorize } = require('../middlewares/authMiddleware');

// @route   GET api/hosts/stats
// @desc    Get host dashboard stats
// @access  Private (Host or Admin)
router.get('/stats', protect, authorize('Host', 'Admin'), getDashboardStats);

// @route   GET api/hosts/properties
// @desc    Get all properties for a host
// @access  Private (Host or Admin)
router.get('/properties', protect, authorize('Host', 'Admin'), getHostProperties);

// @route   GET api/hosts/earnings-audit
// @desc    Get a detailed earnings audit for a host
// @access  Private (Host or Admin)
router.get('/earnings-audit', protect, authorize('Host', 'Admin'), getEarningsAudit);

// @route   GET api/hosts/revenue/:year/:month
// @desc    Get earnings details for a specific month for a host
// @access  Private (Host or Admin)
router.get('/revenue/:year/:month', protect, authorize('Host', 'Admin'), getMonthlyEarningsDetail);

module.exports = router;
