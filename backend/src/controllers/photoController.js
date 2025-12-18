const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const crypto = require('crypto');
const Photo = require('../models/Photo');
const asyncHandler = require('express-async-handler');

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');


// @desc    Upload a photo
// @route   POST /api/photos
// @access  Private
exports.uploadPhoto = asyncHandler(async (req, res, next) => {
  const { caption, socialLink, property } = req.body;
  const file = req.file;

  if (!file) {
    res.status(400);
    throw new Error('Please upload a file');
  }

  const fileName = generateFileName();
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read',
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);

  const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

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

  // Check if user is photo owner or an Admin
  if (photo.user.toString() !== req.user.id && req.user.role !== 'Admin') {
    res.status(401);
    throw new Error('Not authorized to delete this photo');
  }

  // Delete file from S3
  try {
    const urlParts = photo.imageUrl.split('/');
    const key = urlParts[urlParts.length - 1];
    
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    };

    const command = new DeleteObjectCommand(params);
    await s3Client.send(command);
  } catch (error) {
    console.error('Failed to delete image from S3:', error);
    // We can choose to not throw an error here and still delete the DB record
  }


  await photo.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Photo removed',
  });
});
