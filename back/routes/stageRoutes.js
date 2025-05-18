const express = require('express');
const stageController = require('../controllers/stageController');
const userController = require('../controllers/userController');
const router = express.Router();

// Routes with JWT middleware
router.post('/', userController.verifyToken, stageController.createStage);
router.get('/', userController.verifyToken, stageController.getStages);
router.get('/etudiant/:etudiantId', userController.verifyToken, stageController.getStagesByEtudiantId);
router.get('/:id', userController.verifyToken, stageController.getStageById);
router.get('/:id/progress', userController.verifyToken, stageController.getStageProgress);
router.put('/:id', userController.verifyToken, stageController.updateStage);
router.delete('/:id', userController.verifyToken, stageController.deleteStage);

module.exports = router;