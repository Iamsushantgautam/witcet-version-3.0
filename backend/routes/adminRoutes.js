const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const adminAuth = require('../middleware/adminAuth');

// --- Backup Entire Database ---
router.get('/backup', adminAuth, async (req, res) => {
    try {
        const { collection } = req.query;
        const dbName = mongoose.connection.name;
        
        let backupData = {
            metadata: {
                timestamp: new Date().toISOString(),
                database: dbName,
                system: 'Witcet Admin v3.0'
            },
            collections: {}
        };

        const models = mongoose.modelNames();

        if (collection && models.includes(collection)) {
            // Targeted Backup
            const Model = mongoose.model(collection);
            const data = await Model.find().lean();
            backupData.collections[collection] = data;
            backupData.metadata.type = 'Targeted Collection Export';
        } else {
            // Full Backup
            for (const modelName of models) {
                const Model = mongoose.model(modelName);
                const data = await Model.find().lean();
                backupData.collections[modelName] = data;
            }
            backupData.metadata.type = 'Full System Export';
        }

        const filename = `${collection ? collection.toLowerCase() : 'witcet'}_backup_${new Date().toISOString().split('T')[0]}.json`;
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
        
        res.json(backupData);
    } catch (err) {
        console.error('Backup Error:', err);
        res.status(500).json({ message: 'Backup failed during data export' });
    }
});

// --- Bulk Upload Data ---
router.post('/upload-bulk', adminAuth, async (req, res) => {
    try {
        const { collection, data } = req.body;
        
        if (!collection || !data || !Array.isArray(data)) {
            return res.status(400).json({ message: 'Invalid bulk data format. Collection name and array of data are required.' });
        }

        const models = mongoose.modelNames();
        if (!models.includes(collection)) {
            return res.status(400).json({ message: `Collection "${collection}" does not exist in the system.` });
        }

        const Model = mongoose.model(collection);
        
        // Use bulkWrite for efficient Upsert (Update if exists, Insert if new)
        const operations = data.map(item => {
            const doc = { ...item };
            const id = doc._id || new mongoose.Types.ObjectId();
            delete doc._id; // Remove _id if it's there to avoid immutable field error during update

            return {
                updateOne: {
                    filter: { _id: id },
                    update: { $set: doc },
                    upsert: true
                }
            };
        });

        const result = await Model.bulkWrite(operations);
        
        res.json({ 
            message: `Bulk upload to "${collection}" successful!`,
            insertedCount: result.upsertedCount,
            modifiedCount: result.modifiedCount
        });
    } catch (err) {
        console.error('Bulk Upload Error:', err);
        res.status(500).json({ message: 'Bulk upload failed. Please verify the JSON structure.' });
    }
});

module.exports = router;
