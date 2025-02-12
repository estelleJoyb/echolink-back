const express = require("express");
const router = express.Router();
const usersController = require("../controllers/userController");
const auth = require('../middleware/authMiddleware');
router.use(auth); //apply auth to all forum routes
router.get("/", usersController.getUsers);
router.get('/:userId', usersController.getUserById);
router.get('/:userId/conversations', usersController.getUserConversations);
router.put('/:userId', usersController.updateUserById);
module.exports = router;
