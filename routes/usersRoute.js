const express = require("express");
const router = express.Router();
const multer = require('multer');
const usersController = require("../controllers/userController");
const upload = multer();

router.get("/", usersController.getUsers);

router.get('/:userId', usersController.getUserById);

router.get('/:userId/conversations', usersController.getUserConversations);

router.put('/:userId', upload.single("image"), usersController.updateUserById);

module.exports = router;
