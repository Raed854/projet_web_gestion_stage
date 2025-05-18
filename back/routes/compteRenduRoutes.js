const express = require('express');
const compteRenduController = require('../controllers/compteRenduController');
const userController = require('../controllers/userController');
const router = express.Router();

// Routes with JWT middleware
router.post('/', userController.verifyToken, compteRenduController.createCompteRendu);
router.get('/', userController.verifyToken, compteRenduController.getCompteRendus);
router.get('/:id', userController.verifyToken, compteRenduController.getCompteRenduById);
router.put('/:id', userController.verifyToken, compteRenduController.updateCompteRendu);
router.delete('/:id', userController.verifyToken, compteRenduController.deleteCompteRendu);
router.put('/:id/accept', userController.verifyToken, compteRenduController.acceptCompteRendu);
router.put('/:id/refuse', userController.verifyToken, compteRenduController.refuseCompteRendu);

module.exports = router;