import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShoppingBag, Star, ShieldCheck, Truck, CreditCard, MessageSquare, ArrowRight, Mail } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';
import { useScrollAnimation, useStaggeredScrollAnimation } from '../hooks/useScrollAnimation';

import ProductCard from '../components/ProductCard';
import MetaHelmet from '../components/MetaHelmet';

/* ── Assets ── */
import arts from '../assets/arts.png';
import study from '../assets/study.png';
import wallpapet from '../assets/wallpapet .png';
import sports from '../assets/sports.png';
import hero from '../assets/hero.png';
import image from '../assets/image.png';
import outfits from '../assets/outfits.png';

import './HomePage.css';

export default function HomePage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { addItem } = useCart();

    const titleRef = useScrollAnimation({ threshold: 0.15 });
    const catRef = useStaggeredScrollAnimation('.hp-cat-card', 80);
    const testimonialRef = useStaggeredScrollAnimation('.testimonial-card', 80);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/products");
                if (response.data.success) {
                    setProducts(response.data.products);
                }
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Sections with fallbacks
    const arrivals = products.length > 0 ? products.slice(0, 4) : [
        { _id: '1', name: "Luxe Timepiece", images: [image], price: 12499, slug: 'luxe-watch', badge: 'New' },
        { _id: '2', name: "Canvas Art", images: [arts], price: 599, slug: 'canvas-art', badge: 'Limited' },
        { _id: '3', name: "Sport Elite", images: [sports], price: 1444, slug: 'sport-elite' },
        { _id: '4', name: "Journal Kit", images: [study], price: 299, slug: 'journal-kit' },
    ];

    const artsFeatured = products.filter(p => p.categories?.includes("Arts")).length > 0
        ? products.filter(p => p.categories?.includes("Arts")).slice(0, 3)
        : arrivals.slice(0, 3);

    const bestSellers = products.filter(p => p.badge === "Bestseller").length > 0
        ? products.filter(p => p.badge === "Bestseller").slice(0, 4)
        : arrivals.slice(0, 4);





    const handleBuyNow = (product) => {
        addItem({
            _id: product._id,
            name: product.name,
            price: product.price,
            image: product.images?.[0] || product.image,
            slug: product.slug,
            qty: 1
        });
        navigate('/checkout');
    };

    return (
        <div className="hp-page">
            <MetaHelmet
                title="The Unique Dimension — Premium Store"
                description="Discover curated luxury products in Arts, Outfits, Study, and Sports. Premium quality, handpicked collections."
                url="https://theuniquedimension.store"
                structuredData={{
                    "@context": "https://schema.org",
                    "@type": "WebSite",
                    "name": "The Unique Dimension",
                    "url": "https://theuniquedimension.store",
                    "potentialAction": {
                        "@type": "SearchAction",
                        "target": "https://theuniquedimension.store/products?search={search_term_string}",
                        "query-input": "required name=search_term_string"
                    }
                }}
            />

            {/* ── Hero ── */}
            <section className="hp-hero">
                <img src={hero} alt="hero" className="hp-hero-img" />
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="hp-hero-content"
                >
                    <h1 className="hero-title">Discover Unique</h1>
                    <p className="hero-subtitle">Elevate your lifestyle with our premium curated collections.</p>
                    <div className="hero-btns">
                        <Link to="/products" className="hp-hero-btn primary">Shop Now</Link>
                        <Link to="/products?category=Arts" className="hp-hero-btn secondary">View Art</Link>
                    </div>
                </motion.div>
            </section>

            <section className="hp-categories container">
                <h2 className="hp-section-title text-center" ref={titleRef}>Explore Categories</h2>
                <div className="hp-cat-row" ref={catRef}>
                    {[
                        { label: 'Art', img: arts, cat: 'Arts' },
                        { label: 'Outfit', img: outfits, cat: 'Outfits' },
                        { label: 'Study', img: study, cat: 'Study' },
                        { label: 'Sports', img: sports, cat: 'Sports' },
                    ].map(({ label, img, cat }) => (
                        <Link key={cat} to={`/products?category=${cat}`} className="hp-cat-card stagger-item">
                            <div className="hp-cat-img-wrap">
                                <img src={img} alt={label} className="hp-cat-img" />
                            </div>
                            <h3>{label}</h3>
                        </Link>
                    ))}
                </div>
            </section>

            {/* ── New Arrivals ── */}
            <section className="hp-collections container">
                <div className="hp-sec-header">
                    <h2 className="hp-section-title">New Arrivals</h2>
                    <Link to="/products?sort=newest" className="hp-view-all">View All <ArrowRight size={14} /></Link>
                </div>
                <div className="hp-grid">
                    {arrivals.map(product => (
                        <ProductCard key={product._id} product={product} onBuyNow={() => handleBuyNow(product)} />
                    ))}
                </div>
            </section>



            {/* ── Best Sellers ── */}
            <section className="hp-collections container">
                <div className="hp-sec-header">
                    <h2 className="hp-section-title">Best Sellers</h2>
                    <Link to="/products?badge=Bestseller" className="hp-view-all">View All <ArrowRight size={14} /></Link>
                </div>
                <div className="hp-grid">
                    {bestSellers.map(product => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            </section>





            {/* ── Final Call to Action ── */}
            <section className="hp-cta">
                <div className="hp-cta-content container">
                    <h2>Ready to transform your world?</h2>
                    <p>Join thousands of satisfied premium members today.</p>
                    <Link to="/register" className="hp-hero-btn primary">Join The Dimension</Link>
                </div>
            </section>
        </div>
    );
}
