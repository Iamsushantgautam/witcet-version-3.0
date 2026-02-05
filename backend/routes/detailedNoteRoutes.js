const express = require('express');
const router = express.Router();
const DetailedNote = require('../models/DetailedNote');
const auth = require('../middleware/auth');

// Get all detailed notes
router.get('/', async (req, res) => {
    try {
        const notes = await DetailedNote.find().sort({ createdAt: -1 });
        res.json(notes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get detailed note by Notes Code
router.get('/code/:notesCode', async (req, res) => {
    try {
        const note = await DetailedNote.findOne({ notesCode: req.params.notesCode });
        if (!note) return res.status(404).json({ message: 'Detailed note not found' });
        res.json(note);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create detailed note (Protected)
router.post('/', auth, async (req, res) => {
    try {
        const { notesTitle, notesCode, introTitle, units } = req.body;
        const note = new DetailedNote({ notesTitle, notesCode, introTitle, units });
        const newNote = await note.save();
        res.status(201).json(newNote);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update detailed note (Protected)
router.put('/:id', auth, async (req, res) => {
    try {
        const updatedNote = await DetailedNote.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedNote);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete detailed note (Protected)
router.delete('/:id', auth, async (req, res) => {
    try {
        await DetailedNote.findByIdAndDelete(req.params.id);
        res.json({ message: 'Detailed note deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
