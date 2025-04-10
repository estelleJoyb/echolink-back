const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const register = async (req, res) => {
  try {
    var {nom, prenom, email, tel, password } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10); // Use bcrypt to hash
    const hashedPassword = await bcrypt.hash(password, salt);

    var image = "https://www.dz-techs.com/wp-content/uploads/2019/07/Facebook-Anonymous-min-DzTechs.jpg";

    user = new User({
      image,
      nom,
      prenom,
      email,
      tel,
      password: hashedPassword,
    });

    await user.save();

    const payload = {
      user: { id: user._id },
    };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email }); // Use Mongoose findOne
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

const verifyToken = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
      return res.status(401).json({ msg: "No token, authorization denied" });
    }
  
    try {
      jwt.verify(token, process.env.JWT_SECRET);
      res.status(200).send(true);
    } catch (err) {
      console.error("Token verification failed:", err.message);
      res.status(200).send(false);
    }
}

module.exports = { register, login, verifyToken };
