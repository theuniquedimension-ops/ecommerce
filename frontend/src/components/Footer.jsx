import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Youtube, ArrowRight } from 'lucide-react';
import './Footer.css';

export default function Footer() {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (email.trim() && email.includes('@')) setSubscribed(true);
    };

    return (
        <footer className="footer">
            <div className="footer-glow" />
            <div className="footer-top container">
                {/* Brand */}
                <div className="footer-brand">
                    <div className="footer-logo-group">
                        <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                            <polygon points="16,2 30,26 2,26" fill="none" stroke="#d4af37" strokeWidth="1.5" />
                            <circle cx="16" cy="16" r="4" fill="#d4af37" opacity="0.8" />
                        </svg>
                        <div>
                            <span className="footer-logo-name">The Unique Dimension</span>
                            <span className="footer-logo-sub">Premium Store</span>
                        </div>
                    </div>
                    <p className="footer-tagline">
                        Where luxury meets everyday life. Curated collections for the discerning.
                    </p>
                    <div className="footer-socials">
                        {[
                            { icon: <Instagram size={16} />, label: 'Instagram' },
                            { icon: <Twitter size={16} />, label: 'Twitter' },
                            { icon: <Facebook size={16} />, label: 'Facebook' },
                            { icon: <Youtube size={16} />, label: 'YouTube' },
                        ].map(s => (
                            <a key={s.label} href="#" aria-label={s.label} className="footer-social-link">{s.icon}</a>
                        ))}
                    </div>
                </div>

                {/* Shop */}
                <div className="footer-col">
                    <h4 className="footer-col-title">Shop</h4>
                    <ul className="footer-links">
                        {['Arts & Crafts', 'Outfits & Fashion', 'Study & Books', 'Sports & Fitness', 'Electronics'].map(c => (
                            <li key={c}><Link to={`/products?category=${c.split(' ')[0]}`}>{c}</Link></li>
                        ))}
                    </ul>
                </div>

                {/* Account */}
                <div className="footer-col">
                    <h4 className="footer-col-title">Account</h4>
                    <ul className="footer-links">
                        <li><Link to="/login">Sign In</Link></li>
                        <li><Link to="/register">Create Account</Link></li>
                        <li><Link to="/dashboard">My Orders</Link></li>
                        <li><Link to="/dashboard">Saved Addresses</Link></li>
                    </ul>
                </div>

                {/* Help */}
                <div className="footer-col">
                    <h4 className="footer-col-title">Help</h4>
                    <ul className="footer-links">
                        <li><Link to="#">Shipping Policy</Link></li>
                        <li><Link to="#">Returns & Refunds</Link></li>
                        <li><Link to="#">FAQs</Link></li>
                        <li><Link to="#">Privacy Policy</Link></li>
                        <li><Link to="#">Terms of Service</Link></li>
                    </ul>
                </div>

                {/* Newsletter */}
                <div className="footer-newsletter">
                    <h4 className="footer-col-title">Stay in the Loop</h4>
                    <p>Get exclusive offers and new arrivals.</p>
                    {subscribed ? (
                        <div className="footer-subscribed">✦ Thank you! Check your inbox.</div>
                    ) : (
                        <form className="footer-subscribe-form" onSubmit={handleSubscribe}>
                            <input
                                type="email"
                                placeholder="your@email.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                aria-label="Email for newsletter"
                            />
                            <button type="submit" aria-label="Subscribe">
                                <ArrowRight size={16} />
                            </button>
                        </form>
                    )}
                </div>
            </div>

            <div className="footer-divider" />

            <div className="footer-bottom container">
                <p className="footer-copyright">© 2024 The Unique Dimension – Premium Ecommerce Store</p>
                <div className="footer-bottom-links">
                    <Link to="#">Privacy</Link>
                    <Link to="#">Terms</Link>
                    <Link to="#">Cookies</Link>
                </div>
            </div>
        </footer>
    );
}
