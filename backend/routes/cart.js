const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const { verifyToken } = require('../middleware/auth');

// In-memory cart for unauthenticated users is handled client-side.
// This API stores/syncs cart for logged-in users.

// GET /api/cart
router.get('/', verifyToken, async (req, res, next) => {
    try {
        const user = await require('../models/User')
            .findById(req.user._id)
            .populate('cart.product');

        const frontendCart = (user.cart || [])
            .filter(i => i.product) // remove nulls if product deleted
            .map(i => ({
                _id: i.product._id,
                name: i.product.title,
                price: i.product.price,
                image: i.product.images?.[0] || '',
                slug: i.product.slug,
                qty: i.qty
            }));

        res.json({ success: true, cart: frontendCart });
    } catch (err) { next(err); }
});

// POST /api/cart — add or update
router.post('/', verifyToken, async (req, res, next) => {
    try {
        const { productId, qty = 1 } = req.body;
        if (!productId) return res.status(400).json({ success: false, message: 'productId required' });

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

        const User = require('../models/User');
        const user = await User.findById(req.user._id);
        if (!user.cart) user.cart = [];

        const idx = user.cart.findIndex(i => i.product.toString() === productId);
        if (idx >= 0) {
            user.cart[idx].qty += qty;
        } else {
            user.cart.push({ product: productId, qty });
        }

        user.markModified('cart');
        await user.save();

        const populatedUser = await user.populate('cart.product');
        const frontendCart = populatedUser.cart.filter(i => i.product).map(i => ({
            _id: i.product._id,
            name: i.product.title,
            price: i.product.price,
            image: i.product.images?.[0] || '',
            slug: i.product.slug,
            qty: i.qty
        }));

        res.json({ success: true, cart: frontendCart });
    } catch (err) { next(err); }
});

// DELETE /api/cart/:productId
router.delete('/:productId', verifyToken, async (req, res, next) => {
    try {
        const User = require('../models/User');
        const user = await User.findById(req.user._id);
        user.cart = (user.cart || []).filter(i => i.product.toString() !== req.params.productId);
        user.markModified('cart');
        await user.save();

        const populatedUser = await user.populate('cart.product');
        const frontendCart = populatedUser.cart.filter(i => i.product).map(i => ({
            _id: i.product._id,
            name: i.product.title,
            price: i.product.price,
            image: i.product.images?.[0] || '',
            slug: i.product.slug,
            qty: i.qty
        }));

        res.json({ success: true, cart: frontendCart });
    } catch (err) { next(err); }
});

// DELETE /api/cart — clear all
router.delete('/', verifyToken, async (req, res, next) => {
    try {
        const User = require('../models/User');
        await User.findByIdAndUpdate(req.user._id, { cart: [] });
        res.json({ success: true, cart: [] });
    } catch (err) { next(err); }
});

module.exports = router;
