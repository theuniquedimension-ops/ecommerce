import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShoppingBag, Star, ShieldCheck, Truck, CreditCard, MessageSquare, ArrowRight, Mail } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';
import { useScrollAnimation, useStaggeredScrollAnimation } from '../hooks/useScrollAnimation';
import PromoSection from '../components/PromoSection';
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

    const testimonials = [
        { id: 1, name: "Aarav Sharma", comment: "The quality of the art prints is absolutely stunning. Truly unique!", rating: 5 },
        { id: 2, name: "Isha Kapoor", comment: "Fast shipping and the packaging was very premium. Highly recommend.", rating: 5 },
        { id: 3, name: "Rohan Das", comment: "Best ecommerce experience I've had. The curated collections are top-notch.", rating: 4.5 },
    ];

    const [email, setEmail] = useState('');
    const [subscribeStatus, setSubscribeStatus] = useState('');

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (email) {
            setSubscribeStatus('Subscribed successfully! Please check your email to confirm.');
            setEmail('');
            setTimeout(() => setSubscribeStatus(''), 4000);
        }
    };

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

            {/* ── Benefits ── */}
            <section className="hp-benefits container">
                <div className="benefit-item">
                    <Truck size={24} className="benefit-icon" />
                    <div>
                        <h3>Free Shipping</h3>
                        <p>On orders above ₹999</p>
                    </div>
                </div>
                <div className="benefit-divider" />
                <div className="benefit-item">
                    <ShieldCheck size={24} className="benefit-icon" />
                    <div>
                        <h3>Secure Payment</h3>
                        <p>100% safe transactions</p>
                    </div>
                </div>
                <div className="benefit-divider" />
                <div className="benefit-item">
                    <CreditCard size={24} className="benefit-icon" />
                    <div>
                        <h3>Instant Support</h3>
                        <p>Friendly 24/7 help</p>
                    </div>
                </div>
            </section>

            {/* ── Categories ── */}
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

            {/* ── Promo 1 ── */}
            <section className="hp-promo-wrap">
                <PromoSection image={arts} products={artsFeatured} />
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

            {/* ── Promo 2 ── */}
            <section className="hp-promo-wrap">
                <PromoSection image={study} products={bestSellers.slice(0, 3)} />
            </section>

            {/* ── Testimonials ── */}
            <section className="hp-testimonials container">
                <h2 className="hp-section-title text-center">What Our Customers Say</h2>
                <div className="testimonials-grid" ref={testimonialRef}>
                    {testimonials.map(t => (
                        <div key={t.id} className="testimonial-card stagger-item">
                            <div className="t-stars">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star key={i} size={14} fill={i < Math.floor(t.rating) ? "var(--accent)" : "none"} stroke="var(--accent)" />
                                ))}
                            </div>
                            <p className="t-comment">"{t.comment}"</p>
                            <h4 className="t-name">— {t.name}</h4>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Newsletter Subscription ── */}
            <section className="hp-newsletter container">
                <div className="newsletter-content">
                    <Mail size={40} className="newsletter-icon" />
                    <h2>Subscribe to Our Newsletter</h2>
                    <p>Get exclusive access to new arrivals, premium collections, and special offers.</p>
                    <form className="newsletter-form" onSubmit={handleSubscribe}>
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <button type="submit" className="hp-hero-btn primary">Subscribe</button>
                    </form>
                    {subscribeStatus && <p className="subscribe-status">{subscribeStatus}</p>}
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
