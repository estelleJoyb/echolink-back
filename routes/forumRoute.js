const express = require('express');
const forumController = require('../controllers/forumController');
const router = express.Router();

router.get('/', forumController.getAllForums);

router.get('/:forumId', forumController.getForumById);

router.post('/', forumController.createForum);

router.delete( '/:id', forumController.deleteForum);

router.post('/:forumId/message', forumController.sendMessage);

router.get('/:forumId/message', forumController.getMessagesByForumId);

module.exports = router;