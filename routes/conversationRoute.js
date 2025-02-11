const express = require('express');
const conversationController = require('../controllers/conversationController');
const router = express.Router();

router.get('/:conversationId', conversationController.getConversationById);

router.get('/:conversationId/messages', conversationController.getMessagesByConversationId);

router.post('/:conversationId', conversationController.sendMessage);

router.post('/', conversationController.createConversation);

module.exports = router;