const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');
const Order = require('../models/Order');

// POST /api/webhook/payment — Stripe webhook
router.post('/payment', async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const secret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!secret) {
        console.warn('STRIPE_WEBHOOK_SECRET not set — skipping signature verification');
        return res.json({ received: true });
    }

    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, secret);
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
        switch (event.type) {
            case 'payment_intent.succeeded': {
                const pi = event.data.object;
                await Order.findOneAndUpdate(
                    { paymentIntentId: pi.id },
                    { paymentStatus: 'paid', status: 'confirmed' }
                );
                console.log(`✅ Payment succeeded for PaymentIntent: ${pi.id}`);
                break;
            }
            case 'payment_intent.payment_failed': {
                const pi = event.data.object;
                await Order.findOneAndUpdate(
                    { paymentIntentId: pi.id },
                    { paymentStatus: 'failed' }
                );
                console.log(`❌ Payment failed for PaymentIntent: ${pi.id}`);
                break;
            }
            default:
                console.log(`Unhandled event type: ${event.type}`);
        }
        res.json({ received: true });
    } catch (err) {
        console.error('Webhook handler error:', err);
        res.status(500).json({ error: 'Webhook handler error' });
    }
});

module.exports = router;
