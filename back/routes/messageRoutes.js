const express = require('express');
const messageController = require('../controllers/messageController');
const userController = require('../controllers/userController');
const router = express.Router();

// Routes with JWT middleware
router.post('/', userController.verifyToken, messageController.createMessage);
router.get('/', userController.verifyToken, messageController.getMessages);
router.get('/:id', userController.verifyToken, messageController.getMessageById);
router.put('/:id', userController.verifyToken, messageController.updateMessage);
router.delete('/:id', userController.verifyToken, messageController.deleteMessage);

module.exports = router;