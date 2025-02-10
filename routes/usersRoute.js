const express = require("express");
const router = express.Router();
const usersController = require("../controllers/userController");

router.get("/", usersController.getUsers);

router.get('/conversations', usersController.getUserConversion);

module.exports = router;
