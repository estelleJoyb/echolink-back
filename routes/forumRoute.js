const express = require('express');
const forumController = require('../controllers/forumController');
const router = express.Router();

router.get('/forum', forumController.getAllForums);
router.get('/forum/:forumId', forumController.getForumById);
router.post('/forum', forumController.createForum);
router.delete( '/forum/:id', forumController.deleteForum);
router.post('/forum/:forumId/message', forumController.postMessage);
module.exports = router;