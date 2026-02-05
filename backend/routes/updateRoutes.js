const express = require('express');
const router = express.Router();
const Update = require('../models/Update');
const auth = require('../middleware/auth');

// Get all updates (Public)
router.get('/', async (req, res) => {
    try {
        const updates = await Update.find().sort({ createdAt: -1 });
        res.json(updates);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get single update by ID (Public)
router.get('/:id', async (req, res) => {
    try {
        const update = await Update.findById(req.params.id);
        if (!update) {
            return res.status(404).json({ message: 'Update not found' });
        }
        res.json(update);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create update (Protected)
router.post('/', auth, async (req, res) => {
    try {
        const update = new Update({
            ...req.body,
            isActive: req.body.isActive !== undefined ? req.body.isActive : true
        });
        const newUpdate = await update.save();
        res.status(201).json(newUpdate);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Partial update (Protected)
router.patch('/:id', auth, async (req, res) => {
    try {
        const update = await Update.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!update) {
            return res.status(404).json({ message: 'Update not found' });
        }
        res.json(update);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update update (full update) (Protected)
router.put('/:id', auth, async (req, res) => {
    try {
        const updatedUpdate = await Update.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedUpdate);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Toggle update status (Protected)
router.patch('/toggle/:id', auth, async (req, res) => {
    try {
        const update = await Update.findById(req.params.id);
        if (!update) return res.status(404).json({ message: 'Update not found' });
        update.isActive = !update.isActive;
        await update.save();
        res.json(update);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete update (Protected)
router.delete('/:id', auth, async (req, res) => {
    try {
        await Update.findByIdAndDelete(req.params.id);
        res.json({ message: 'Update deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
