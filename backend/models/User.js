const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    resetOtp: { type: String },
    resetOtpExpires: { type: Date },
    createdAt: { type: Date, default: Date.now }
});

const bcrypt = require('bcrypt');
UserSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
});

module.exports = mongoose.model('User', UserSchema);
