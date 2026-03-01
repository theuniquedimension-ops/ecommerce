const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { verifyToken, requireAdmin } = require('../middleware/auth');

// Simple in-memory cache
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 mins

// GET /api/products — list with filter, sort, search, paginate
router.get('/', async (req, res, next) => {
    try {
        const cacheKey = JSON.stringify(req.query);
        const cached = cache.get(cacheKey);
        if (cached && Date.now() - cached.time < CACHE_TTL) {
            return res.json(cached.data);
        }

        const { search, category, minPrice, maxPrice, sort, badge, page = 1, limit = 12 } = req.query;

        const filter = { isActive: true };
        if (category) filter.categories = { $in: [category] };
        if (badge) filter.badge = badge;
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }
        if (search) filter.$text = { $search: search };

        const sortMap = {
            'price-asc': { price: 1 },
            'price-desc': { price: -1 },
            'rating': { rating: -1 },
            'newest': { createdAt: -1 },
            'featured': { featured: -1, createdAt: -1 },
        };
        const sortBy = sortMap[sort] || { featured: -1, createdAt: -1 };

        const skip = (Number(page) - 1) * Number(limit);
        const [products, total] = await Promise.all([
            Product.find(filter).sort(sortBy).skip(skip).limit(Number(limit)).lean(),
            Product.countDocuments(filter),
        ]);

        const responseData = { success: true, products, total, page: Number(page), pages: Math.ceil(total / Number(limit)) };

        // Save to cache
        cache.set(cacheKey, { time: Date.now(), data: responseData });

        res.json(responseData);
    } catch (err) { next(err); }
});

// GET /api/products/:slug
router.get('/:slug', async (req, res, next) => {
    try {
        const product = await Product.findOne({ slug: req.params.slug, isActive: true });
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
        res.json({ success: true, product });
    } catch (err) { next(err); }
});

// POST /api/products — admin create
router.post('/', verifyToken, requireAdmin, async (req, res, next) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json({ success: true, product });
    } catch (err) { next(err); }
});

// PUT /api/products/:id — admin update
router.put('/:id', verifyToken, requireAdmin, async (req, res, next) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
        res.json({ success: true, product });
    } catch (err) { next(err); }
});

// DELETE /api/products/:id — admin (soft delete)
router.delete('/:id', verifyToken, requireAdmin, async (req, res, next) => {
    try {
        await Product.findByIdAndUpdate(req.params.id, { isActive: false });
        res.json({ success: true, message: 'Product deactivated' });
    } catch (err) { next(err); }
});

module.exports = router;
