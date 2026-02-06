const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
    title: String,
    notesCode: String,
    notesPagePath: String,
    imagePath: String,
    quantumTitle: String,
    quantumImagePath: String,
    quantumLink: String,
    tag: String,
    pyqLink: String,
    pyqTitle: String,
    pyqImage: String,
    quantumActive: { type: String, default: 'true' },
    pyqActive: { type: String, default: 'true' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Note", noteSchema);
