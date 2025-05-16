const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

// Routes with JWT middleware
router.post('/',userController.verifyToken, userController.createUser);
router.get('/', userController.verifyToken, userController.getUsers);

// Get all etudiants (id, nom, prenom)
router.get('/etudiants', userController.verifyToken, userController.getEtudiants);
// Get all encadrants (id, nom, prenom)
router.get('/encadrants', userController.verifyToken, userController.getEncadrants);

router.get('/:id', userController.verifyToken, userController.getUserById);
router.put('/:id', userController.verifyToken, userController.updateUser);
router.delete('/:id', userController.verifyToken, userController.deleteUser);

// Login route
router.post('/login', userController.login);

module.exports = router;