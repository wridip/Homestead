const Property = require('../models/Property');

// @desc    Create a new property
// @route   POST /api/properties
// @access  Private (Host)
exports.createProperty = async (req, res, next) => {
  try {
    const {
      name,
      description,
      type,
      address,
      contact,
      location,
      amenities,
      roomTypes,
      baseRate,
      seasonalPricing,
      images,
      status,
    } = req.body;

    const property = await Property.create({
      hostId: req.user._id,
      name,
      description,
      type,
      address,
      contact,
      location,
      amenities,
      roomTypes,
      baseRate,
      seasonalPricing,
      images,
      status,
    });

    res.status(201).json({
      success: true,
      data: property,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all properties
// @route   GET /api/properties
// @access  Public
exports.getProperties = async (req, res, next) => {
  try {
    let query;

    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Finding resource
    query = Property.find(JSON.parse(queryStr)).populate('hostId');

    // Location search from homepage
    if (req.query.location) {
      query = query.where('address').regex(new RegExp(req.query.location, 'i'));
    }

    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Property.countDocuments(JSON.parse(queryStr));

    query = query.skip(startIndex);

    if (limit > 0) {
      query = query.limit(limit);
    }

    // Executing query
    const properties = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      success: true,
      count: properties.length,
      pagination,
      data: properties,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single property by ID
// @route   GET /api/properties/:id
// @access  Public
exports.getPropertyById = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ success: false, message: `Property not found with id of ${req.params.id}` });
    }

    res.status(200).json({
      success: true,
      data: property,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a property
// @route   PUT /api/properties/:id
// @access  Private (Host)
exports.updateProperty = async (req, res, next) => {
  try {
    let property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ success: false, message: `Property not found with id of ${req.params.id}` });
    }

    // Make sure user is property owner
    if (property.hostId.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(401).json({ success: false, message: 'Not authorized to update this property' });
    }

    const { name, description, type, address, contact, location, amenities, roomTypes, baseRate, seasonalPricing, images, status } = req.body;

    property.name = name || property.name;
    property.description = description || property.description;
    property.type = type || property.type;
    property.address = address || property.address;
    property.contact = contact || property.contact;
    property.location = location || property.location;
    property.amenities = amenities || property.amenities;
    property.roomTypes = roomTypes || property.roomTypes;
    property.baseRate = baseRate || property.baseRate;
    property.seasonalPricing = seasonalPricing || property.seasonalPricing;
    property.images = images || property.images;
    property.status = status || property.status;

    const updatedProperty = await property.save();

    res.status(200).json({
      success: true,
      data: updatedProperty,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a property
// @route   DELETE /api/properties/:id
// @access  Private (Host)
exports.deleteProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ success: false, message: `Property not found with id of ${req.params.id}` });
    }

    // Make sure user is property owner
    if (property.hostId.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this property' });
    }

    await property.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update property images
// @route   PUT /api/properties/:id/images
// @access  Private (Host)
exports.updatePropertyImages = async (req, res, next) => {
  try {
    let property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ success: false, message: `Property not found with id of ${req.params.id}` });
    }

    // Make sure user is property owner
    if (property.hostId.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(401).json({ success: false, message: 'Not authorized to update this property' });
    }

    if (req.files) {
      const images = req.files.map(file => `/uploads/${file.filename}`);
      property.images = images;
    }

    const updatedProperty = await property.save();

    res.status(200).json({
      success: true,
      data: updatedProperty,
    });
  } catch (error) {
    next(error);
  }
};