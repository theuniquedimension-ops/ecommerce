const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    sku: { type: String },
    price: { type: Number },
    inventory: { type: Number, default: 0 },
    attributes: { type: Map, of: String },
});

const productSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    shortDesc: { type: String },
    images: [{ type: String }],
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, default: null },
    categories: [{ type: String }],
    tags: [{ type: String }],
    sku: { type: String },
    inventory: { type: Number, default: 0 },
    variants: [variantSchema],
    featured: { type: Boolean, default: false },
    badge: { type: String, enum: ['NEW', 'SALE', 'TRENDING', 'BESTSELLER', null], default: null },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    metaTitle: { type: String },
    metaDesc: { type: String },
}, { timestamps: true });

// Text search index
productSchema.index({ title: 'text', description: 'text', tags: 'text' });
productSchema.index({ slug: 1 });
productSchema.index({ categories: 1 });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });
productSchema.index({ featured: 1 });

module.exports = mongoose.model('Product', productSchema);
