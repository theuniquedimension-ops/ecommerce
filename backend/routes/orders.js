const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { verifyToken } = require('../middleware/auth');
const sendEmail = require('../utils/email');

// POST /api/orders — create order + Stripe PaymentIntent
router.post('/', verifyToken, async (req, res, next) => {
    try {
        const { items, shippingAddress, shippingCost = 0, couponCode } = req.body;
        if (!items || !items.length) return res.status(400).json({ success: false, message: 'Cart is empty' });
        if (!shippingAddress) return res.status(400).json({ success: false, message: 'Shipping address required' });

        let subtotal = 0;
        const orderItems = [];
        for (const item of items) {
            const product = await Product.findById(item.productId || item._id);
            if (!product) return res.status(404).json({ success: false, message: `Product not found` });
            orderItems.push({ product: product._id, name: product.title, image: product.images[0], price: product.price, qty: item.qty });
            subtotal += product.price * item.qty;
        }

        const tax = Math.round(subtotal * 0.18);
        const total = subtotal + shippingCost + tax;

        // Create Stripe PaymentIntent (amount in paise for INR)
        let paymentIntentId = null;
        let clientSecret = null;
        if (process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes('placeholder')) {
            const intent = await stripe.paymentIntents.create({
                amount: total * 100,
                currency: 'inr',
                metadata: { userId: req.user._id.toString() },
            });
            paymentIntentId = intent.id;
            clientSecret = intent.client_secret;
        }

        const order = await Order.create({
            user: req.user._id, items: orderItems, shippingAddress,
            subtotal, shippingCost, tax, total,
            paymentIntentId, couponCode,
        });

        // Send confirmation email
        await sendEmail({
            to: req.user.email || shippingAddress.email,
            subject: 'Order Confirmation - Luxe Store',
            text: `Thank you for your order!\n\nOrder ID: ${order._id}\nTotal: ₹${total}\n\nWe will notify you when it ships.`,
        });

        res.status(201).json({ success: true, order, orderId: order._id, clientSecret });
    } catch (err) { next(err); }
});

// GET /api/orders — user's own orders
router.get('/', verifyToken, async (req, res, next) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 }).lean();
        res.json({ success: true, orders });
    } catch (err) { next(err); }
});

// GET /api/orders/:id
router.get('/:id', verifyToken, async (req, res, next) => {
    try {
        const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
        res.json({ success: true, order });
    } catch (err) { next(err); }
});

module.exports = router;
