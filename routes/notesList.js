const express = require('express');
const router = express.Router();
const DetailedNote = require('../models/DetailedNote');
const Note = require('../models/Note');

// List all notes
router.get('/', async (req, res) => {
  const notes = await Note.find();
  res.render('notes', { notes });
});

// GET /notesList/:code
router.get('/:code', async (req, res) => {
  try {
    // Fetch DetailedNote by code
    const detailedNote = await DetailedNote.findOne({ notesCode: req.params.code });

    // Fetch Note by code
    const noteInfo = await Note.findOne({ notesCode: req.params.code });

    // If neither is found, return 404
    if (!detailedNote && !noteInfo) return res.status(404).send('Note not found');

    // Render the view with both data objects
    res.render('noteDetails', {
      note: detailedNote || {},     // Fallback to empty object
      noteInfo: noteInfo || {}      // Fallback to empty object
    });

  } catch (err) {
    console.error('Error fetching note:', err);
    res.status(500).send('Server Error');
  }
});

  

module.exports = router;
