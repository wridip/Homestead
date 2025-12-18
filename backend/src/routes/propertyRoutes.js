const express = require('express');
const router = express.Router();

const {
  createProperty,
  getProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  updatePropertyImages,
} = require('../controllers/propertyController');

const { protect, authorize } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload');

// @route   POST api/properties/upload
// @desc    Upload images for a property
// @access  Private (Host)
router.post('/upload', protect, authorize('Host', 'Admin'), (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.error('Image upload error:', err);
      res.status(400).json({ success: false, message: err });
    } else {
      if (req.files == undefined || req.files.length === 0) {
        res.status(400).json({ success: false, message: 'Error: No File Selected!' });
      } else {
        const files = req.files.map((file) => {
          return `/uploads/${file.filename}`;
        });
        res.status(200).json({
          success: true,
          message: 'Files Uploaded!',
          files: files,
        });
      }
    }
  });
});

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

// @route   PUT api/properties/:id/images
// @desc    Update property images
// @access  Private (Host)
router.put('/:id/images', protect, authorize('Host'), upload, updatePropertyImages);

// @route   DELETE api/properties/:id
// @desc    Delete a property
// @access  Private (Host)
router.delete('/:id', protect, authorize('Host', 'Admin'), deleteProperty);

module.exports = router;