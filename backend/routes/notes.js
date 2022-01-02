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


// Update an exisiting note using: PUT "/api/notes/updatenote" -- Login required
router.put("/updatenote/:id", fetchuser, async (req, res) => {

  const { title, description, tag } = req.body

  try {
    // create a newNote object
    let newNote = {}
    if (title) { newNote.title = title }
    if (description) { newNote.description = description }
    if (tag) { newNote.tag = tag }

    //  Find the note to be updated
    let note = await Note.findById(req.params.id)
    if (!note) {
      return res.status(404).send("Not Found")
    }

    // note exist -- user changing the note and user created the note are same?
    if (note.user.toString() !== req.user.id) {
      return res.send(403).send("Forbidden")
    }

    // Note exist and user is same
    note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })

    res.json(note)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error")
  }

})


// Delete an existing note using: "/api/notes/deletenote" -- Login required
router.delete("/deletenote/:id", fetchuser, async (req, res) => {

  try {
    // Find the note to be updated
    let note = await Note.findById(req.params.id)

    // if note does not exist
    if (!note) {
      return res.status(404).send("Not Found")
    }

    // note exist -- user changing the note and user created the note are same?
    if (note.user.toString() !== req.user.id) {
      return res.status(403).send("Forbidden")
    }

    note = await Note.findByIdAndDelete(req.params.id)

    res.status(200).json({ "Success": `${note.title} note has been deleted` })
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error")
  }

})


module.exports = router