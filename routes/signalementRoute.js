const express = require('express');
const signalementController = require('../controllers/signalementController');
const router = express.Router();

router.get('signalement/:signalementId', signalementController.getSignalementById);
router.get('/signalements', signalementController.getAllSignalements);
router.post('/signalement', signalementController.createSignalement);

module.exports = router;