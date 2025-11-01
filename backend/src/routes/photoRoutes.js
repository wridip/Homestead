const express = require('express');
const router = express.Router();
const { uploadPhoto, getPhotos, deletePhoto } = require('../controllers/photoController');
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadPhoto');

router.route('/').get(getPhotos).post(protect, upload, uploadPhoto);
router.route('/:id').delete(protect, deletePhoto);

module.exports = router;
