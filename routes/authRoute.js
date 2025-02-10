const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { check } = require("express-validator");

router.post("/register", authController.register);

// router.post("/login", [check("email", "Please include a valid email").isEmail(), check("password", "Password is required").exists()], authController.login);
router.post("/login", authController.login);


module.exports = router;
