const express = require('express');
const router = express.Router();
const { getMe, updateMe, getUserProfile } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadPhoto');

// Private routes
router.get('/me', protect, getMe);
router.put('/me', protect, upload, updateMe);

// Public routes
router.get('/:id', getUserProfile);

module.exports = router;
