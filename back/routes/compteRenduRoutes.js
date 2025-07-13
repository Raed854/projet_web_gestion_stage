const express = require('express');
const compteRenduController = require('../controllers/compteRenduController');
const userController = require('../controllers/userController');
const upload = require('../middleware/uploadMiddleware');
const router = express.Router();

// Routes with JWT middleware
router.post('/', userController.verifyToken, upload.single('file'), compteRenduController.createCompteRendu);
router.get('/', userController.verifyToken, compteRenduController.getCompteRendus);
router.get('/:id', userController.verifyToken, compteRenduController.getCompteRenduById);
router.get('/:id/download', userController.verifyToken, compteRenduController.downloadFile);
router.put('/:id', userController.verifyToken, upload.single('file'), compteRenduController.updateCompteRendu);
router.delete('/:id', userController.verifyToken, compteRenduController.deleteCompteRendu);
router.put('/:id/accept', userController.verifyToken, compteRenduController.acceptCompteRendu);
router.put('/:id/refuse', userController.verifyToken, compteRenduController.refuseCompteRendu);

module.exports = router;