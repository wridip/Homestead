const Message = require('../models/Message');
const Property = require('../models/Property');
const User = require('../models/User');

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
exports.sendMessage = async (req, res) => {
  const { receiverId, propertyId, subject, content } = req.body;
  const senderId = req.user.id;

  try {
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ success: false, message: 'Receiver not found' });
    }

    const newMessage = await Message.create({
      sender: senderId,
      receiver: receiverId,
      property: propertyId,
      subject,
      content
    });

    res.status(201).json({
      success: true,
      data: newMessage
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get user's inbox
// @route   GET /api/messages/inbox
// @access  Private
exports.getInbox = async (req, res) => {
  try {
    const messages = await Message.find({ receiver: req.user.id })
      .populate('sender', 'name email avatar')
      .populate('property', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get user's outbox
// @route   GET /api/messages/outbox
// @access  Private
exports.getOutbox = async (req, res) => {
  try {
    const messages = await Message.find({ sender: req.user.id })
      .populate('receiver', 'name email avatar')
      .populate('property', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get message by ID
// @route   GET /api/messages/:id
// @access  Private
exports.getMessageById = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id)
      .populate('sender', 'name email avatar')
      .populate('receiver', 'name email avatar')
      .populate('property', 'name');

    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    // Check if user is either sender or receiver
    if (message.sender._id.toString() !== req.user.id && message.receiver._id.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to view this message' });
    }

    // Mark as read if the receiver is viewing it
    if (message.receiver._id.toString() === req.user.id && !message.read) {
      message.read = true;
      await message.save();
    }

    res.status(200).json({
      success: true,
      data: message
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Delete message
// @route   DELETE /api/messages/:id
// @access  Private
exports.deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    // Check if user is either sender or receiver
    if (message.sender.toString() !== req.user.id && message.receiver.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this message' });
    }

    await message.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
