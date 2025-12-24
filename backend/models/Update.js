const mongoose = require('mongoose');

const updateSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  time: {
    type: String,
    default: null
  },
  author: {
    type: String,
    default: 'Admin'
  },
  imageUrl: {
    type: String,
    default: null
  },
  pdfLink: {
    type: String,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('Update', updateSchema);