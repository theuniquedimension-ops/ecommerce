require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');
const webhookRoutes = require('./routes/webhook');
const uploadRoutes = require('./routes/upload');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

/* ── Middleware ── */
app.use(helmet());

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
}));

// Raw body needed for Stripe webhooks
app.use('/api/webhook', express.raw({ type: 'application/json' }));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

/* ── Rate Limiting ── */
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 min
    max: 200,
    message: { success: false, message: 'Too many requests. Please try again later.' },
});

const authLimiter = rateLimit({
    windowMs: 60 * 1000,   // 1 min
    max: 10,
    message: { success: false, message: 'Too many auth attempts.' },
});

app.use('/api', limiter);
app.use('/api/auth', authLimiter);

/* ── Routes ── */
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/checkout', orderRoutes); // alias for frontend checkout
app.use('/api/users', userRoutes);
app.use('/api/user', userRoutes); // backward compat
app.use('/api/admin', adminRoutes);
app.use('/api/webhook', webhookRoutes);
app.use('/api/upload', uploadRoutes);

/* ── Health ── */
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

/* ── 404 ── */
app.use('*', (req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

/* ── Error Handler ── */
app.use(errorHandler);

/* ── DB + Start ── */
const start = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/luxe');
        console.log('✅ MongoDB connected');
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1);
    }
};

start();
