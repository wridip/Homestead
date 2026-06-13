const express = require('express');
const router = express.Router();
const { getAdminStats, getAllUsers, getAllProperties } = require('../controllers/adminController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// All routes require Admin role
router.use(protect);
router.use(authorize('Admin'));

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.get('/users/:id/audit', getUserAudit);
router.get('/properties', getAllProperties);
router.put('/properties/:id/toggle', togglePropertyStatus);
router.get('/revenue/:year/:month', getMonthlyRevenueDetail);

module.exports = router;