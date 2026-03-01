const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { verifyToken } = require('../middleware/auth');

// GET /api/user/me
router.get('/me', verifyToken, async (req, res) => {
    res.json({ success: true, user: req.user });
});

// PUT /api/user/me — update profile
router.put('/me', verifyToken, async (req, res, next) => {
    try {
        const { name, newsletter } = req.body;
        const updates = {};
        if (name !== undefined) updates.name = name;
        if (newsletter !== undefined) updates.newsletter = newsletter;

        const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
        res.json({ success: true, user: user.toJSON() });
    } catch (err) { next(err); }
});

// POST /api/user/address — add address
router.post('/address', verifyToken, async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        if (req.body.isDefault) user.addresses.forEach(a => { a.isDefault = false; });
        user.addresses.push(req.body);
        await user.save();
        res.status(201).json({ success: true, addresses: user.addresses });
    } catch (err) { next(err); }
});

// DELETE /api/user/address/:id
router.delete('/address/:id', verifyToken, async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        user.addresses = user.addresses.filter(a => a._id.toString() !== req.params.id);
        await user.save();
        res.json({ success: true, addresses: user.addresses });
    } catch (err) { next(err); }
});

module.exports = router;
