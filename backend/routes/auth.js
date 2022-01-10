const express = require('express')
const router = express.Router()
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

const User = require("../models/User");
const fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = 'Manishisagoodb$oy'

// Create a user using" POST "/api/auth/createuser" -- NO login required
router.post('/createuser', [
  body('name', 'Enter a valid name').isLength({ min: 3 }),
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password must be atleast 5 characters').isLength({ min: 5 })
], async (req, res) => {

  // If error -- return bad req and errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Check whether the email already exists
    let user = await User.findOne({ email: req.body.email })

    if (user) {
      return res.status(400).json({ error: "Sorry with this email already exist" })
    }

    // Salt of 10 char
    const salt = await bcrypt.genSalt(10)
    // hashing password and adding salt
    secPass = await bcrypt.hash(req.body.password, salt)

    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: secPass,
    })

    // Signing user data using JWT or creating token
    const data = {
      user: {
        id: user.id
      }
    }

    const authToken = jwt.sign(data, JWT_SECRET)

    // res.json(user)
    res.json({ authToken: authToken })

  } catch (error) {
    // console.error(error.message);
    res.status(500).send("Internal Server Error")
  }
})


// Authenticate a User using: "/api/auth/login" -- No login required
router.post("/login", [
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password cannot be blank').exists()
], async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body

  try {
    let success = false
    let user = await User.findOne({ email: email })

    if (!user) {
      success = false
      return res.status(400).json({ success, error: "Please try to login with correct credentials" })
    }

    const passwordCompare = await bcrypt.compare(password, user.password)
    if (!passwordCompare) {
      success = false
      return res.status(400).json({ success, error: "Please try to login with correct credentials" })
    }

    const data = {
      user: {
        id: user.id
      }
    }

    const authToken = jwt.sign(data, JWT_SECRET)
    success = true
    res.json({ success, authToken })

  } catch (error) {
    console.error(error.message);
    res.status(400).send("Internal Server Error")
  }
})


// Get loggedin user details using POST "/api/auth/getuser" -- Login required
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    userId = req.user.id
    const user = await User.findById(userId).select("-password")
    res.send(user)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error")
  }
})


module.exports = router