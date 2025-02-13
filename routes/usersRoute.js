const express = require("express");
const router = express.Router();
const multer = require('multer');
const usersController = require("../controllers/userController");
const auth = require('../middleware/authMiddleware');
const upload = multer();

router.use(auth);
router.get("/", usersController.getUsers);
router.get('/:userId', usersController.getUserById);
router.get('/:userId/conversations', usersController.getUserConversations);
router.put('/:userId', upload.single("image"), usersController.updateUserById);
module.exports = router;
