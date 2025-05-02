const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

// Routes for user operations
router.post('/', userController.createUser);
router.get('/', userController.getUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

// Login route
router.post('/login', userController.login);

module.exports = router;