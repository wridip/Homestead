const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getInbox,
  getOutbox,
  getMessageById,
  deleteMessage
} = require('../controllers/messageController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect); // Protect all message routes

router.post('/', sendMessage);
router.get('/inbox', getInbox);
router.get('/outbox', getOutbox);
router.get('/:id', getMessageById);
router.delete('/:id', deleteMessage);

module.exports = router;
