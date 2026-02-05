const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const auth = require('../middleware/auth');

// Get all notes (Public)
router.get('/', async (req, res) => {
    try {
        const notes = await Note.find().sort({ createdAt: -1 });
        res.json(notes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get single note by ID (Public)
router.get('/:id', async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) return res.status(404).json({ message: 'Note not found' });
        res.json(note);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create note (Protected)
router.post('/', auth, async (req, res) => {
    try {
        const note = new Note(req.body);
        const newNote = await note.save();
        res.status(201).json(newNote);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update note (Protected)
router.put('/:id', auth, async (req, res) => {
    try {
        const updatedNote = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedNote);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete note (Protected)
router.delete('/:id', auth, async (req, res) => {
    try {
        await Note.findByIdAndDelete(req.params.id);
        res.json({ message: 'Note deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
