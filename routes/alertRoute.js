const express = require('express');
const alertController = require('../controllers/alertController');
const router = express.Router();

router.get('/', alertController.getAllAlerts);

router.get('/:alertId', alertController.getAlertById);

router.post('/', alertController.createAlert);

router.post('/resolve/:alertId', alertController.resolveAlert);

// New route for nearby alerts
router.get('/nearby/:coords/:distance', alertController.getNearbyAlerts);

module.exports = router;