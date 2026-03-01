require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Product = require('../models/Product');

const PRODUCTS = [
    // Arts
    {
        title: 'Royal Paint Set', slug: 'royal-paint-set',
        description: 'A premium collection of artist-grade oil paints with 24 vivid colours. Ideal for both beginners and professional artists.',
        shortDesc: '24-colour artist grade oil paint set',
        images: ['https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800'],
        price: 1200, compareAtPrice: 1800, categories: ['Arts'], tags: ['paint', 'art', 'oil'],
        inventory: 15, badge: 'NEW', featured: true, rating: 4.8, reviewCount: 24,
    },
    {
        title: 'Watercolor Palette Pro', slug: 'watercolor-palette-pro',
        description: 'Professional watercolor palette with 36 vivid pigments, perfect for landscape and portrait artists.',
        shortDesc: '36-colour professional watercolor palette',
        images: ['https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800'],
        price: 950, categories: ['Arts'], tags: ['watercolor', 'paint', 'art'],
        inventory: 22, badge: 'TRENDING', rating: 4.6, reviewCount: 18,
    },
    {
        title: 'Premium Sketch Set', slug: 'premium-sketch-set',
        description: 'Professional graphite pencil set with 12 grades from 9H to 9B for all sketching needs.',
        shortDesc: '12-grade graphite sketch pencil set',
        images: ['https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=800'],
        price: 650, categories: ['Arts'], tags: ['sketch', 'pencil', 'art'],
        inventory: 40, rating: 4.5, reviewCount: 31,
    },
    // Outfits
    {
        title: 'Classic Luxury Kurta', slug: 'classic-luxury-kurta',
        description: 'Handcrafted from finest Egyptian cotton with intricate thread embroidery. A timeless piece for festive occasions.',
        shortDesc: 'Premium Egyptian cotton festive kurta',
        images: ['https://images.unsplash.com/photo-1583391733956-6c78276477e1?w=800'],
        price: 2200, compareAtPrice: 3200, categories: ['Outfits'], tags: ['kurta', 'ethnic', 'cotton'],
        inventory: 12, badge: 'SALE', featured: true, rating: 4.7, reviewCount: 38,
    },
    {
        title: 'Denim Jacket Pro', slug: 'denim-jacket-pro',
        description: 'Premium stonewashed denim jacket with modern fit. Versatile wardrobe essential for every season.',
        shortDesc: 'Stonewashed premium denim jacket',
        images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800'],
        price: 3500, categories: ['Outfits'], tags: ['denim', 'jacket', 'casual'],
        inventory: 8, rating: 4.6, reviewCount: 17,
    },
    {
        title: 'Summer Linen Dress', slug: 'summer-linen-dress',
        description: 'Breathable pure linen summer dress with subtle floral pattern. Perfect for warm days and evening occasions.',
        shortDesc: 'Pure linen floral summer dress',
        images: ['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800'],
        price: 2800, compareAtPrice: 3600, categories: ['Outfits'], tags: ['dress', 'linen', 'summer'],
        inventory: 20, badge: 'SALE', rating: 4.5, reviewCount: 22,
    },
    // Study
    {
        title: 'Premium Leather Notebook', slug: 'premium-leather-notebook',
        description: 'Handstitched genuine leather cover notebook with 200 pages of acid-free cream paper. A writer\'s companion.',
        shortDesc: 'Genuine leather 200-page notebook',
        images: ['https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=800'],
        price: 450, categories: ['Study'], tags: ['notebook', 'leather', 'stationery'],
        inventory: 55, badge: 'NEW', featured: true, rating: 4.9, reviewCount: 51,
    },
    {
        title: 'Architect Pen Set', slug: 'architect-pen-set',
        description: 'Professional fineliner pen set with 8 nib sizes for technical drawing, illustration and lettering.',
        shortDesc: '8-piece professional fineliner pen set',
        images: ['https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800'],
        price: 350, categories: ['Study'], tags: ['pen', 'stationery', 'drawing'],
        inventory: 30, rating: 4.4, reviewCount: 29,
    },
    {
        title: 'LED Study Desk Lamp', slug: 'led-study-desk-lamp',
        description: 'Smart touch-dimming LED study lamp with 5 colour temperature modes. USB charging port included.',
        shortDesc: 'Smart touch-dimming LED desk lamp',
        images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800'],
        price: 1800, categories: ['Study'], tags: ['lamp', 'desk', 'LED'],
        inventory: 18, rating: 4.6, reviewCount: 33,
    },
    // Sports
    {
        title: 'Cricket Bat Professional', slug: 'cricket-bat-professional',
        description: 'English willow Grade 1 cricket bat. Perfect balance and premium finish for professional play.',
        shortDesc: 'Grade 1 English willow cricket bat',
        images: ['https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800'],
        price: 4200, compareAtPrice: 5500, categories: ['Sports'], tags: ['cricket', 'bat', 'sport'],
        inventory: 6, badge: 'SALE', featured: true, rating: 4.8, reviewCount: 63,
    },
    {
        title: 'Premium Football', slug: 'premium-football',
        description: 'FIFA-approved size 5 football with thermally bonded panels for consistent shape and durability.',
        shortDesc: 'FIFA-approved thermally bonded football',
        images: ['https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=800'],
        price: 700, categories: ['Sports'], tags: ['football', 'soccer', 'sport'],
        inventory: 25, rating: 4.3, reviewCount: 44,
    },
    {
        title: 'Gym Gloves Pro', slug: 'gym-gloves-pro',
        description: 'Anti-slip premium leather gym gloves with wrist support. Maximum grip for heavy lifts.',
        shortDesc: 'Premium leather grip gym gloves with wrist support',
        images: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800'],
        price: 650, categories: ['Sports'], tags: ['gym', 'gloves', 'fitness'],
        inventory: 35, badge: 'NEW', rating: 4.5, reviewCount: 27,
    },
];

async function seed() {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/luxe';
        await mongoose.connect(mongoUri);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Product.deleteMany({});
        console.log('🗑️  Cleared existing data');

        // Create admin user
        const admin = await User.create({
            name: 'Admin User',
            email: process.env.ADMIN_EMAIL || 'admin@luxe.store',
            password: process.env.ADMIN_PASSWORD || 'Admin@123456',
            role: 'admin',
            isVerified: true,
        });
        console.log(`👤 Admin created: ${admin.email}`);

        // Create sample user
        const user = await User.create({
            name: 'Priya Sharma',
            email: 'user@luxe.store',
            password: 'User@123456',
            role: 'user',
            isVerified: true,
        });
        console.log(`👤 Sample user created: ${user.email}`);

        // Seed products
        const products = await Product.insertMany(PRODUCTS);
        console.log(`📦 ${products.length} products seeded`);

        console.log('\n✅ Seed complete!');
        console.log('   Admin email:    admin@luxe.store');
        console.log('   Admin password: Admin@123456');
        console.log('   User email:     user@luxe.store');
        console.log('   User password:  User@123456\n');
    } catch (err) {
        console.error('❌ Seed error:', err);
    } finally {
        mongoose.disconnect();
    }
}

seed();
