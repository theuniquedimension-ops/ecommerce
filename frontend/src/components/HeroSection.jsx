import React from 'react';
import { Link } from 'react-router-dom';
import './HeroSection.css';

export default function HeroSection() {
    return (
        <section className="hero-section">
            <div className="container hero-content">
                <div className="hero-text">
                    <h1>Discover the Future of Shopping</h1>
                    <p>Premium products. Seamless experience. Designed for you.</p>
                    <div className="hero-actions">
                        <Link to="/products" className="hero-cta">Shop Now</Link>
                    </div>
                </div>
                <div className="hero-image-area">
                    <div className="hero-premium-box">
                        <div className="hero-premium-content">
                            <span className="hero-emoji">✨</span>
                            <span className="hero-emoji">⌚</span>
                            <span className="hero-emoji">🎧</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
