const express = require("express");
const router = express.Router();
const usersController = require("../controllers/userController");

router.get("/", usersController.getUsers);

module.exports = router;
