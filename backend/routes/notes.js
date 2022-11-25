const express = require("express");
const router = express.Router();
const loginMiddleware = require("../middleware/loginMiddleware");
const Note = require("../models/Note");
const { body, validationResult } = require("express-validator");
// console.log(Note);

// ROUTE 1: Get All the Notes using: GET "/api/notes/getuser". Login required
router.get("/fetchallnotes", loginMiddleware, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE 2: Add a new Note using: POST "/api/notes/addnote". Login required
router.post(
  "/addnote",
  loginMiddleware,
  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "Description must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;

      // If there are errors, return Bad request and the errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const note = new Note({
        title,
        description,
        tag,
        user: req.user,
      });
      const savedNote = await note.save();

      res.json(savedNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// ROUTE 3: Update  Note using: put "/api/notes/updatenote". Login required
router.put("/updatenote/:id", loginMiddleware, async (req, res) => {
  const { title, description, tag } = req.body;
  const user = req.user;
  const newNote = {};
  if (title) {
    newNote.title = title;
  }
  if (description) {
    description.title = description;
  }
  if (tag) {
    newNote.tag = tag;
  }
  //find the note to be updated and updated it
  let note = await Note.findById(req.params.id);
  if (!note) {
    return res.status(404).send("Not Found");
  }
  if (note.user.toString().user) {
    return res.status(401).send("Not Allowed");
  }
  note = await Note.findByIdAndUpdate(
    req.params.id,
    { $set: newNote },
    { new: true }
  );
  res.json({ note });
});

// ROUTE 2: Update  Note using: DELETE "/api/notes/deletenote". Login required
router.delete("/deletenote/:id", loginMiddleware, async (req, res) => {
  // const { title, description, tag } = req.body;
  const user = req.user;

  //find the note to be updated and updated it
  let note = await Note.findById(req.params.id);
  if (!note) {
    return res.status(404).send("Not Found");
  }
  if (note.user.toString().user) {
    return res.status(401).send("Not Allowed");
  }
  note = await Note.findByIdAndDelete(req.params.id);
  res.json({ Success: "Note is deleted", note: note });
});

module.exports = router;
