const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const loginMiddleware = require("../middleware/loginMiddleware");

const JWT_SECRET = "kapilkumar$123";

// create a new user using : POST "/api/auth/createuser". No login required

router.post(
  "/createuser",
  [
    body("name", "Enter a valid name").isLength({ min: 5 }),
    body("email", "Enter a valid email").isEmail(),

    body("password", "Please enter the minimum 5 digit code").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }

    try {
      // check whether the user with this email already exists
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ success, error: "Sorry a user this email is already exist" });
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      //   crete a user
      user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      });
      //   .then((user) => res.json(user))
      //   .catch((err) => {
      //     console.log(err), res.json({ error: "Please Enter a unique email" });
      //   });
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);

      //   res.json(user);
      success = true;
      res.json({ success, authToken });
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Some error occurred");
    }
  }
);
// Authentications user using : POST "/api/auth/createuser". No login required
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),

    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        res.status(400).json({
          success,
          errors: "Please try to login with correct details",
        });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        res.status(400).json({
          success,
          errors: "Please try to login with correct details",
        });
      }
      const data = {
        user: user.id,
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authToken });
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Internal server error");
    }
  }
);

// Get loggind user details using : POST "/api/auth/getuser".  login required
router.post(
  "/getuser",
  loginMiddleware,

  async (req, res) => {
    try {
      const userId = req.user;
      const user = await User.findById(userId);
      console.log(userId);
      res.send(user);
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Internal server error");
    }
  }
);
module.exports = router;
