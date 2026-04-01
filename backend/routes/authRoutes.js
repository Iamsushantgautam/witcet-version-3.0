const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Admin = require('../models/Admin');
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

        // Password will be hashed by the User model's pre-save hook
        const newUser = new User({
            name,
            username,
            email: email.trim().toLowerCase(),
            password, // Pass plain password
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

// --- Admin Login Route (Separate Collection) ---
router.post('/admin/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and Password are required' });
        }

        // Find strictly in the Admin collection
        const admin = await Admin.findOne({ email: { $regex: new RegExp(`^${email.trim()}$`, 'i') } });

        if (!admin) {
            return res.status(401).json({ message: 'Invalid admin credentials' });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid admin credentials' });
        }

        // Generate JWT
        const token = jwt.sign(
            { userId: admin._id, role: 'admin' },
            process.env.JWT_SECRET,
            { expiresIn: '12h' }
        );

        res.json({
            token,
            user: { id: admin._id, name: admin.name, email: admin.email, role: 'admin' }
        });

        // --- Server-side Login Notification (Sealed and Secure) ---
        (async () => {
            try {
                const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
                const time = new Date().toLocaleString();
                
                // Using Brevo (already in .env) to send secure alert
                await fetch('https://api.brevo.com/v3/smtp/email', {
                    method: 'POST',
                    headers: {
                        'accept': 'application/json',
                        'api-key': process.env.BREVO_API_KEY,
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        sender: { name: 'Witcet Security', email: 'security@witcet.online' },
                        to: [{ email: 'witcet@zohomail.in' }], // Original recipient
                        subject: '⚠️ Admin Login Alert',
                        htmlContent: `
                            <div style="font-family: sans-serif; padding: 20px; border: 1px solid #ff4444; border-radius: 8px;">
                                <h3 style="color: #ff4444;">Login Successful</h3>
                                <p><strong>Email:</strong> ${admin.email}</p>
                                <p><strong>Time:</strong> ${time}</p>
                                <p><strong>IP:</strong> ${ip}</p>
                                <p style="font-size: 11px; color: #666; margin-top: 20px;">Notification sent securely via backend.</p>
                            </div>
                        `
                    })
                });
            } catch (err) {
                console.error('Failed to send login alert:', err.message);
            }
        })();
    } catch (err) {
        console.error('Admin Login Error:', err);
        res.status(500).json({ message: 'Server error during admin login' });
    }
});

// --- Standard User Login Route ---
router.post('/login', async (req, res) => {
    try {
        const { identifier, email, username, password } = req.body;
        const loginId = identifier || email || username;

        if (!loginId || !password) {
            return res.status(400).json({ message: 'Email/Username and Password are required' });
        }

        const user = await User.findOne({
            $or: [
                { email: { $regex: new RegExp(`^${loginId.trim()}$`, 'i') } },
                { username: { $regex: new RegExp(`^${loginId.trim()}$`, 'i') } }
            ]
        });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role || 'user' },
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
                role: user.role || 'user'
            }
        });
    } catch (err) {
        console.error('User Login Error:', err);
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
                    sender: { name: 'Witcet Password Reset', email: 'no-reply@witcet.online' },
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
