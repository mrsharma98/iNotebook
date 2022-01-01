const express = require('express')
const router = express.Router()
const Note = require('../models/Note')
const fetchuser = require("../middleware/fetchuser")
const { body, validationResult } = require('express-validator');

// Get all the notes using: GET "/api/notes/fetchallnotes" -- Login required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id })
    res.json(notes)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error")
  }


})


// Add a new note using: POST "/api/notes/addnote" -- Login required
router.post("/addnote", [
  body('title', 'Enter a valid title').isLength({ min: 3 }),
  body('description', 'Description must be atleast 5 characters').isLength({ min: 5 })
], fetchuser, async (req, res) => {

  // If error -- return bad req and errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, description, tag } = req.body

  try {
    let note = new Note({
      title,
      description,
      tag,
      user: req.user.id
    })
    const savedNote = await note.save()

    res.json(savedNote)

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error")
  }

})


module.exports = router