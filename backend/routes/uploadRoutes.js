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

// Get images from Cloudinary folder
router.get('/gallery', async (req, res) => {
    try {
        let folder = req.query.folder || 'witcet';
        // Ensure folder prefix ends with / for exact folder matching
        if (folder && !folder.endsWith('/')) {
            folder += '/';
        }
        
        // Using v2 api resources to list files in a folder
        const { cloudinary } = require('../config/cloudinary');
        
        const result = await cloudinary.api.resources({
            type: 'upload',
            prefix: folder, // This will match 'witcet/' and its subfolders if we use the right parameters
            max_results: 100,
            resource_type: 'image'
        });

        // Filter to make sure it's exactly in that folder or subfolders
        // Cloudinary prefix match is a start-with match.
        
        res.json({ 
            images: result.resources.map(resource => ({
                url: resource.secure_url,
                public_id: resource.public_id,
                created_at: resource.created_at,
                width: resource.width,
                height: resource.height,
                format: resource.format
            }))
        });
    } catch (err) {
        console.error('Gallery fetch error:', err);
        res.status(500).json({ message: 'Failed to fetch gallery' });
    }
});

module.exports = router;
