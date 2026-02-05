const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a sample user
router.post('/seed', async (req, res) => {
    try {
        const sampleUsers = [
            { name: 'Alex Thompson', email: 'alex@example.com', status: 'Active' },
            { name: 'Sarah Miller', email: 'sarah@example.com', status: 'Inactive' },
        ];
        await User.insertMany(sampleUsers);
        res.status(201).json({ message: 'Sample users added' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
