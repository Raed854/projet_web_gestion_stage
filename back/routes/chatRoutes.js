const express = require('express');
const chatController = require('../controllers/chatController');
const messageController = require('../controllers/messageController');
const userController = require('../controllers/userController');
const router = express.Router();

// Chat routes
router.post('/', userController.verifyToken, chatController.createChat);
router.get('/', userController.verifyToken, chatController.getUserChats);
router.get('/:id', userController.verifyToken, chatController.getChatById);

// Message routes within chat
router.post('/:chatId/messages', userController.verifyToken, messageController.createMessage);

module.exports = router;
