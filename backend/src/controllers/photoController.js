const path = require('path');
const fs = require('fs');
const Photo = require('../models/Photo');
const asyncHandler = require('express-async-handler');

// @desc    Upload a photo
// @route   POST /api/photos
// @access  Private
exports.uploadPhoto = asyncHandler(async (req, res, next) => {
  const { caption, socialLink, property } = req.body;
  const imageUrl = path.relative(path.join(__dirname, '..', '..', 'public'), req.file.path);

  const photo = await Photo.create({
    user: req.user.id,
    property,
    imageUrl,
    caption,
    socialLink,
  });

  res.status(201).json({
    success: true,
    data: photo,
  });
});

// @desc    Get all photos
// @route   GET /api/photos
// @access  Public
exports.getPhotos = asyncHandler(async (req, res, next) => {
  const photos = await Photo.find().populate('user', 'name');

  res.status(200).json({
    success: true,
    count: photos.length,
    data: photos,
  });
});

// @desc    Delete a photo
// @route   DELETE /api/photos/:id
// @access  Private
exports.deletePhoto = asyncHandler(async (req, res, next) => {
  const photo = await Photo.findById(req.params.id);

  if (!photo) {
    res.status(404);
    throw new Error('Photo not found');
  }

  // Check if user is photo owner and a Host
  if (photo.user.toString() !== req.user.id || req.user.role !== 'Host') {
    res.status(401);
    throw new Error('Not authorized to delete this photo');
  }

  // Delete file from filesystem
  const imagePath = path.join(__dirname, '..', '..', 'public', photo.imageUrl);
  fs.unlink(imagePath, (err) => {
    if (err) {
      console.error('Failed to delete image file:', err);
    }
  });

  await photo.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Photo removed',
  });
});
