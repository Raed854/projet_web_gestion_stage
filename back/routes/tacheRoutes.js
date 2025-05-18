const express = require('express');
const tacheController = require('../controllers/tacheController');
const userController = require('../controllers/userController');
const router = express.Router();

// Routes with JWT middleware
router.post('/', userController.verifyToken, tacheController.createTache);
router.get('/', userController.verifyToken, tacheController.getTaches);
router.get('/:id', userController.verifyToken, tacheController.getTacheById);
router.put('/:id', userController.verifyToken, tacheController.updateTache);
router.delete('/:id', userController.verifyToken, tacheController.deleteTache);
router.get('/stage/:stageId', userController.verifyToken,tacheController.getTachesByStageId);
router.get('/etudiant/:etudiantId', userController.verifyToken, tacheController.getTachesByEtudiantId);

module.exports = router;