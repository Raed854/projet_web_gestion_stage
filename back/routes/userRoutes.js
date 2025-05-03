const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

// Routes with JWT middleware
router.post('/', userController.verifyToken, userController.createUser);
router.get('/', userController.verifyToken, userController.getUsers);
router.get('/:id', userController.verifyToken, userController.getUserById);
router.put('/:id', userController.verifyToken, userController.updateUser);
router.delete('/:id', userController.verifyToken, userController.deleteUser);

// Login route
router.post('/login', userController.login);

module.exports = router;