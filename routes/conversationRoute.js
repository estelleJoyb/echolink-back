const express = require('express');
const conversationController = require('../controllers/conversationController');
const router = express.Router();

router.get('/:conversationId', conversationController.getConversationById);

router.post('/create', conversationController.createConversation);


module.exports = router;