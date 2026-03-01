const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const { verifyToken, requireAdmin } = require('../middleware/auth');

// All admin routes require token + admin role
router.use(verifyToken, requireAdmin);

// GET /api/admin/dashboard
router.get('/dashboard', async (req, res, next) => {
    try {
        const [totalOrders, totalUsers, products] = await Promise.all([
            Order.countDocuments(),
            User.countDocuments({ role: 'user' }),
            Product.find({ isActive: true }).select('title inventory price').lean(),
        ]);

        const revenue = await Order.aggregate([
            { $match: { paymentStatus: 'paid' } },
            { $group: { _id: null, total: { $sum: '$total' } } },
        ]);

        const lowStock = products.filter(p => p.inventory <= 5);

        res.json({
            success: true,
            stats: {
                totalOrders,
                totalUsers,
                totalProducts: products.length,
                revenue: revenue[0]?.total || 0,
                lowStockCount: lowStock.length,
            },
            lowStock,
        });
    } catch (err) { next(err); }
});

// GET /api/admin/orders
router.get('/orders', async (req, res, next) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;
        const filter = status ? { status } : {};
        const skip = (Number(page) - 1) * Number(limit);
        const [orders, total] = await Promise.all([
            Order.find(filter).populate('user', 'name email').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
            Order.countDocuments(filter),
        ]);
        res.json({ success: true, orders, total });
    } catch (err) { next(err); }
});

// PUT /api/admin/orders/:id — update status
router.put('/orders/:id', async (req, res, next) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
        res.json({ success: true, order });
    } catch (err) { next(err); }
});

// GET /api/admin/users
router.get('/users', async (req, res, next) => {
    try {
        const users = await User.find().select('-password -refreshTokens').sort({ createdAt: -1 }).lean();
        res.json({ success: true, users });
    } catch (err) { next(err); }
});

// PUT /api/admin/users/:id/role
router.put('/users/:id/role', async (req, res, next) => {
    try {
        const { role } = req.body;
        if (!['user', 'admin'].includes(role)) return res.status(400).json({ success: false, message: 'Invalid role' });
        const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
        res.json({ success: true, user });
    } catch (err) { next(err); }
});

module.exports = router;
