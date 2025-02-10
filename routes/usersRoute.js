const express = require("express");
const router = express.Router();
const usersController = require("../controllers/userController");

router.get("/", usersController.getUsers);

router.get('/:userId/conversations', usersController.getUserConversations);

module.exports = router;
