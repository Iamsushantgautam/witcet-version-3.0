const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const DetailedNote = require('../models/DetailedNote');
const Update = require('../models/Update');
const User = require('../models/User');

router.get('/', async (req, res) => {
    try {
        const [noteCount, detailedNoteCount, updateCount, userCount] = await Promise.all([
            Note.countDocuments(),
            DetailedNote.countDocuments(),
            Update.countDocuments(),
            User.countDocuments()
        ]);

        res.json({
            notes: noteCount,
            detailedNotes: detailedNoteCount,
            updates: updateCount,
            users: userCount
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
