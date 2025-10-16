const express = require('express');
const router = express.Router();

const {
  createProperty,
  getProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
} = require('../controllers/propertyController');

const { protect, authorize } = require('../middlewares/authMiddleware');

// @route   POST api/properties
// @desc    Create a new property
// @access  Private (Host)
router.post('/', protect, authorize('Host', 'Admin'), createProperty);

// @route   GET api/properties
// @desc    Get all properties (with filters)
// @access  Public
router.get('/', getProperties);

// @route   GET api/properties/:id
// @desc    Get a single property by ID
// @access  Public
router.get('/:id', getPropertyById);

// @route   PUT api/properties/:id
// @desc    Update a property
// @access  Private (Host)
router.put('/:id', protect, authorize('Host', 'Admin'), updateProperty);

// @route   DELETE api/properties/:id
// @desc    Delete a property
// @access  Private (Host)
router.delete('/:id', protect, authorize('Host', 'Admin'), deleteProperty);

module.exports = router;