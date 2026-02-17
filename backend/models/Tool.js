const mongoose = require("mongoose");

const toolSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    link: {
        type: String,
        required: true,
        trim: true
    },
    icon: {
        type: String,
        default: '/images/default-tool-icon.png' // Default icon path
    },
    faviconUrl: {
        type: String, // Fetched favicon from the website
        default: null
    },
    tag: {
        type: String,
        default: 'Resource',
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    order: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model("Tool", toolSchema);
