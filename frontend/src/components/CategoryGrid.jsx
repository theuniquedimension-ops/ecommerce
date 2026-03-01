import React from 'react';
import { Link } from 'react-router-dom';
import { useScrollAnimation, useStaggeredScrollAnimation } from '../hooks/useScrollAnimation';
import './CategoryGrid.css';

const CATEGORIES = [
    { name: 'Arts & Crafts', icon: '🎨', slug: 'Arts', color: 'rgba(255,149,0,0.15)', glow: 'rgba(255,149,0,0.3)' },
    { name: 'Outfits & Fashion', icon: '👗', slug: 'Outfits', badge: 'New', color: 'rgba(212,175,55,0.12)', glow: 'rgba(212,175,55,0.4)' },
    { name: 'Study & Books', icon: '📚', slug: 'Study', color: 'rgba(91,155,213,0.15)', glow: 'rgba(91,155,213,0.3)' },
    { name: 'Sports & Fitness', icon: '⚡', slug: 'Sports', color: 'rgba(76,175,125,0.12)', glow: 'rgba(76,175,125,0.3)' },
    { name: 'Electronics', icon: '💻', slug: 'Electronics', color: 'rgba(150,100,255,0.12)', glow: 'rgba(150,100,255,0.3)' },
];

export default function CategoryGrid() {
    const headerRef = useScrollAnimation({ threshold: 0.2 });
    const rowRef = useStaggeredScrollAnimation('.stagger-item', 90);

    return (
        <section className="categories-section">
            <div className="container">
                <div className="categories-header scroll-fade-up" ref={headerRef}>
                    <p className="section-label">Browse</p>
                    <h2 className="section-title categories-title">Explore Categories</h2>
                </div>
                <div className="categories-row" ref={rowRef}>
                    {CATEGORIES.map((cat) => (
                        <Link
                            key={cat.slug}
                            to={`/products?category=${cat.slug}`}
                            className="category-card stagger-item"
                            style={{ '--cat-color': cat.color, '--cat-glow': cat.glow }}
                        >
                            <div className="category-card-shine" />
                            <div className="category-icon">{cat.icon}</div>
                            <span className="category-name">{cat.name}</span>
                            {cat.badge && <span className="category-badge">{cat.badge}</span>}
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
