const express = require("express");
const router = express.Router();
const usersController = require("../controllers/userController");
//const { check } = require("express-validator");

router.get("/", usersController.getUsers);

module.exports = router;
