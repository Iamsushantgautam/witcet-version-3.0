const express = require('express');
const router = express.Router();
const { upload, uploadToCloudinary } = require('../config/cloudinary');

// Upload single image with folder specification
router.post('/upload', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Get folder from request body, default to 'witcet/notes-poster'
        const folder = req.body.folder || 'witcet/notes-poster';

        const imageUrl = await uploadToCloudinary(req.file.buffer, folder);
        res.json({ url: imageUrl });
    } catch (err) {
        console.error('Upload error:', err);
        res.status(500).json({ message: 'Failed to upload image' });
    }
});

// Upload multiple images
router.post('/upload-multiple', upload.array('images', 3), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        const folder = req.body.folder || 'witcet/notes-poster';

        const uploadPromises = req.files.map(file =>
            uploadToCloudinary(file.buffer, folder)
        );

        const urls = await Promise.all(uploadPromises);
        res.json({ urls });
    } catch (err) {
        console.error('Upload error:', err);
        res.status(500).json({ message: 'Failed to upload images' });
    }
});

module.exports = router;
