const express = require('express');
const forumController = require('../controllers/forumController');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
router.use(auth); //apply auth to all forum routes
router.get('/forum', forumController.getAllForums);
router.get('/forum/:forumId', forumController.getForumById);
router.post('/forum', forumController.createForum);
router.delete( '/forum/:id', forumController.deleteForum);
router.post('/forum/:forumId/message', forumController.postMessage);
router.get('/forum/:forumId/message', forumController.getForumMessages);
module.exports = router;