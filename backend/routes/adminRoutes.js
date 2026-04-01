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

module.exports = router;
