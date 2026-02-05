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
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Note", noteSchema);
