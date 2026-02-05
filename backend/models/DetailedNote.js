const mongoose = require('mongoose');

const unitSchema = new mongoose.Schema({
    unitTitle: String,
    ownerName: String,
    pdfLink: {
        type: String,
        set: function (link) {
            if (!link) return link;
            const match = link.match(/\/file\/d\/(.+?)\//) || link.match(/\/d\/(.+?)\//);
            if (match && match[1]) {
                return `https://drive.google.com/uc?export=download&id=${match[1]}`;
            }
            return link;
        }
    }
});

const detailedNoteSchema = new mongoose.Schema({
    notesTitle: String,
    notesCode: String,
    introTitle: String,
    units: [unitSchema],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DetailedNote', detailedNoteSchema);
