const express = require('express');
const commentaireController = require('../controllers/commentaireController');
const userController = require('../controllers/userController');
const router = express.Router();

// Routes with JWT middleware
router.post('/', userController.verifyToken, commentaireController.createCommentaire);
router.get('/', userController.verifyToken, commentaireController.getCommentaires);
router.get('/:id', userController.verifyToken, commentaireController.getCommentaireById);
router.put('/:id', userController.verifyToken, commentaireController.updateCommentaire);
router.delete('/:id', userController.verifyToken, commentaireController.deleteCommentaire);

module.exports = router;