const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signAccess = (id) => jwt.sign({ userId: id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '15m' });
const signRefresh = (id) => jwt.sign({ userId: id }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' });
const sendEmail = require('../utils/email');

// POST /api/auth/register
router.post('/register', async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) return res.status(400).json({ success: false, message: 'All fields required' });
        if (password.length < 8) return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });

        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ success: false, message: 'Email already registered' });

        const user = await User.create({ name, email, password });
        const accessToken = signAccess(user._id);
        const refreshToken = signRefresh(user._id);
        user.refreshTokens.push(refreshToken);
        await user.save();

        // Send welcome email
        await sendEmail({
            to: user.email,
            subject: 'Welcome to Luxe Store!',
            text: `Hi ${user.name},\n\nWelcome to Luxe Store! We're thrilled to have you.\n\nEnjoy premium shopping.`,
        });

        res.status(201).json({ success: true, user: user.toJSON(), accessToken, refreshToken });
    } catch (err) { next(err); }
});

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password required' });

        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const accessToken = signAccess(user._id);
        const refreshToken = signRefresh(user._id);
        user.refreshTokens = user.refreshTokens.slice(-4);
        user.refreshTokens.push(refreshToken);
        await user.save();

        res.json({ success: true, user: user.toJSON(), accessToken, refreshToken });
    } catch (err) { next(err); }
});

// POST /api/auth/refresh
router.post('/refresh', async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) return res.status(400).json({ success: false, message: 'Refresh token required' });

        let decoded;
        try {
            decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        } catch {
            return res.status(401).json({ success: false, message: 'Invalid refresh token' });
        }

        const user = await User.findById(decoded.userId);
        if (!user || !user.refreshTokens.includes(refreshToken)) {
            return res.status(401).json({ success: false, message: 'Refresh token not recognized' });
        }

        const newAccess = signAccess(user._id);
        const newRefresh = signRefresh(user._id);
        user.refreshTokens = user.refreshTokens.filter(t => t !== refreshToken);
        user.refreshTokens.push(newRefresh);
        await user.save();

        res.json({ success: true, accessToken: newAccess, refreshToken: newRefresh });
    } catch (err) { next(err); }
});

// POST /api/auth/logout
router.post('/logout', async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if (refreshToken) {
            const decoded = jwt.decode(refreshToken);
            if (decoded?.userId) {
                const user = await User.findById(decoded.userId);
                if (user) {
                    user.refreshTokens = user.refreshTokens.filter(t => t !== refreshToken);
                    await user.save();
                }
            }
        }
        res.json({ success: true, message: 'Logged out' });
    } catch (err) { next(err); }
});

module.exports = router;
