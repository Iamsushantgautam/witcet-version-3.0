const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, unique: true, sparse: true }, // Optional for schema (legacy support), enforced in Register
    email: { type: String, required: true, unique: true },
    profilePicture: { type: String },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    resetOtp: { type: String },
    resetOtpExpires: { type: Date },
    createdAt: { type: Date, default: Date.now }
});

const bcrypt = require('bcrypt');
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (err) {
        next(err);
    }
});

module.exports = mongoose.model('User', UserSchema);
