const express = require('express')
const router = express.Router()
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

const User = require("../models/User")

const JWT_SECRET = 'Manishisagoodb$oy'

// Create a user using" POST "/api/auth/createuser" -- NO login required
router.post('/createuser',
  [
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
      res.status(500).send("Something went wrong")
    }
  })

module.exports = router