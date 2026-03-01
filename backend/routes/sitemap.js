const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

router.get('/sitemap.xml', async (req, res) => {
    try {
        const products = await Product.find({}).select('slug updatedAt');

        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

        // Add static pages
        const staticPages = ['/', '/products', '/cart', '/login', '/register'];
        const baseUrl = process.env.CLIENT_URL || 'https://luxe.store';

        staticPages.forEach(page => {
            xml += `  <url>\n    <loc>${baseUrl}${page}</loc>\n    <changefreq>daily</changefreq>\n    <priority>${page === '/' ? '1.0' : '0.8'}</priority>\n  </url>\n`;
        });

        // Add product pages
        products.forEach(product => {
            const lastmod = product.updatedAt ? product.updatedAt.toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
            xml += `  <url>\n    <loc>${baseUrl}/products/${product.slug}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
        });

        xml += '</urlset>';

        res.header('Content-Type', 'application/xml');
        res.send(xml);
    } catch (error) {
        console.error('Sitemap generation error:', error);
        res.status(500).end();
    }
});

router.get('/robots.txt', (req, res) => {
    const baseUrl = process.env.CLIENT_URL || 'https://luxe.store';
    const robotsTxt = `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /dashboard\nDisallow: /checkout\n\nSitemap: ${baseUrl}/sitemap.xml`;
    res.type('text/plain');
    res.send(robotsTxt);
});

module.exports = router;
