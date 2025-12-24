const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const Update = require('../models/Update');

// GET /
router.get("/pyq", async (req, res) => {
  try {
    const notesWithPyq = await Note.find({  pyqLink: { $exists: true, $ne: "" } });
    res.render("pyq", { notes: notesWithPyq });
  } catch (err) {
    res.status(500).send("Error loading PYQ notes.");
  }
});

router.get("/notes", async (req, res) => {
  try {
    const notesWithPyq = await Note.find({ notesPagePath: { $exists: true, $ne: "" } });
    res.render("notes", { notes: notesWithPyq });
  } catch (err) {
    res.status(500).send("Error loading PYQ notes.");
  }
});

router.get("/quantum", async (req, res) => {
  try {
    const notes = await Note.find({ quantumLink : { $exists: true, $ne: "" } });
    res.render("quantum", { notes});
  } catch (err) {
    res.status(500).send("Error loading Quantum notes.");
  }
});

router.get("/updates", async (req, res) => {
  try {
    const updates = await Update.find({ isActive: { $ne: false } }).sort({ date: -1 }); // Sort by date descending, only active updates
    res.render("updates", { updates });
  } catch (err) {
    res.status(500).send("Error loading updates.");
  }
});



module.exports = router;
