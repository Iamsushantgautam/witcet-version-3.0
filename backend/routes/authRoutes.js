const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth'); // Ensure this middleware exists

// --- Registration Route ---
router.post('/register', async (req, res) => {
    try {
        const { name, username, email, password } = req.body;

        // Validation for required fields
        if (!name || !username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email: { $regex: new RegExp(`^${email.trim()}$`, 'i') } }, { username: { $regex: new RegExp(`^${username.trim()}$`, 'i') } }]
        });

        if (existingUser) {
            if (existingUser.email.toLowerCase() === email.trim().toLowerCase()) {
                return res.status(400).json({ message: 'Email already exists' });
            }
            if (existingUser.username && existingUser.username.toLowerCase() === username.trim().toLowerCase()) {
                return res.status(400).json({ message: 'Username already taken' });
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            username,
            email,
            password: hashedPassword,
            role: 'user', // Default role
            status: 'Active'
        });

        await newUser.save();

        // Generate token for auto-login
        const token = jwt.sign(
            { userId: newUser._id, role: newUser.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role
            }
        });

    } catch (err) {
        console.error('Registration Error:', err);
        res.status(500).json({ message: 'Server error during registration' });
    }
});

// --- Login Route ---
router.post('/login', async (req, res) => {
    try {
        const { identifier, email, username, password } = req.body;
        const loginId = identifier || email || username;

        if (!loginId || !password) {
            return res.status(400).json({ message: 'Email/Username and Password are required' });
        }

        // Find user by email or username
        const user = await User.findOne({
            $or: [
                { email: { $regex: new RegExp(`^${loginId.trim()}$`, 'i') } },
                { username: { $regex: new RegExp(`^${loginId.trim()}$`, 'i') } }
            ]
        });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password (using the hashed password from DB)
        // Note: The User model pre-save hook handles hashing on create/update via save()
        // Here we compare directly
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ message: 'Server error during login' });
    }
});

// --- Get Current User Profile ---
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// --- Update Profile (Name, Username) ---
// --- Update Profile (Name, Username, Profile Picture) ---
router.put('/me/profile', auth, async (req, res) => {
    try {
        const { name, username, profilePicture } = req.body;
        const userId = req.user.userId;

        // Check unique username if changing
        if (username) {
            const existingUser = await User.findOne({ username: { $regex: new RegExp(`^${username.trim()}$`, 'i') } });
            if (existingUser && existingUser._id.toString() !== userId) {
                return res.status(400).json({ message: 'Username is already taken' });
            }
        }

        const updateData = { name, username };
        if (profilePicture !== undefined) updateData.profilePicture = profilePicture;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        res.json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (err) {
        console.error('Profile update error:', err);
        res.status(500).json({ message: 'Failed to update profile' });
    }
});

// --- Change Password (Logged In) ---
router.put('/me/password', auth, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.userId;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect current password' });
        }

        // Password hashing is handled by pre-save hook in User model, so we enforce it by setting the property directly
        // However, findByIdAndUpdate bypasses pre-save hooks. So we must use user.save()
        user.password = newPassword;
        await user.save();

        res.json({ message: 'Password changed successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to change password' });
    }
});

// --- Forgot Password - Send OTP ---
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email: { $regex: new RegExp(`^${email.trim()}$`, 'i') } });

        if (!user) {
            return res.status(404).json({ message: 'User with this email does not exist' });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Save OTP to user record with 5-minute expiry
        user.resetOtp = otp;
        user.resetOtpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes
        await user.save();

        // Send OTP via Brevo
        try {
            const response = await fetch('https://api.brevo.com/v3/smtp/email', {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'api-key': process.env.BREVO_API_KEY,
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    sender: { name: 'Witcet Admin', email: 'no-reply@witcet.online' },
                    to: [{ email: email }],
                    subject: 'Witcet - Reset Your Password',
                    htmlContent: `
                        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                            <h2 style="color: #6366f1;">Password Reset Request</h2>
                            <p>You requested a password reset for your Witcet account.</p>
                            <div style="background: #f3f4f6; padding: 15px; text-align: center; border-radius: 8px; margin: 20px 0;">
                                <span style="font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #1f2937;">${otp}</span>
                            </div>
                            <p>This OTP is valid for <strong>5 minutes</strong>. If you didn't request this, please ignore this email.</p>
                            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                            <p style="font-size: 12px; color: #9ca3af;">© 2026 Witcet Platform. All rights reserved.</p>
                        </div>
                    `
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Brevo API Error:', errorData);
                throw new Error('Failed to send email');
            }

            const data = await response.json();
            console.log('Brevo Email Sent Successfully. Message ID:', data.messageId);

            res.json({ message: 'OTP sent to your email' });
        } catch (mailErr) {
            console.error('Mail Send Error:', mailErr);
            res.status(500).json({ message: 'Failed to send OTP email. Please try again later.' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- Reset Password - Verify OTP and Set New Password ---
router.post('/reset-password', async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        const user = await User.findOne({
            email: { $regex: new RegExp(`^${email.trim()}$`, 'i') },
            resetOtp: otp,
            resetOtpExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // Update password and clear OTP fields
        user.password = newPassword;
        user.resetOtp = undefined;
        user.resetOtpExpires = undefined;

        // Save triggers the pre-save hook to hash the new password
        await user.save();

        res.json({ message: 'Password reset successful. You can now login.' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
