const express = require('express');
const conversationController = require('../controllers/conversationController');
const router = express.Router();

router.get('/:userId', conversationController.getUserConversion);

module.exports = router;