import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp } from 'lucide-react';
import ProductCard from './ProductCard';
import { useScrollAnimation, useStaggeredScrollAnimation } from '../hooks/useScrollAnimation';
import './ProductSection.css';

const formatPrice = (p) => `₹${Number(p).toLocaleString('en-IN')}`;

export default function ProductSection({ featured = [], bestSellers = [] }) {
  const headerRef = useScrollAnimation({ threshold: 0.2 });
  const gridRef = useStaggeredScrollAnimation('.stagger-item', 75);
  const sidebarRef = useScrollAnimation({ threshold: 0.1 });

  return (
    <section className="product-section">
      <div className="container">
        <div className="ps-layout">
          {/* Left: Featured Products */}
          <div className="ps-featured">
            <div className="ps-header scroll-fade-up" ref={headerRef}>
              <h2 className="ps-title">Featured Products</h2>
              <Link to="/products" className="ps-view-all">
                View All <ArrowRight size={14} />
              </Link>
            </div>
            <div className="ps-grid" ref={gridRef}>
              {featured.map(p => (
                <div key={p._id} className="stagger-item">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Best Sellers */}
          <aside className="ps-sidebar scroll-fade-right" ref={sidebarRef}>
            <div className="ps-sidebar-header">
              <TrendingUp size={16} className="ps-sidebar-icon" />
              <h3 className="ps-sidebar-title">Best Sellers</h3>
            </div>
            <div className="ps-sidebar-list">
              {bestSellers.map((p, i) => (
                <Link
                  key={p._id}
                  to={`/products/${p.slug}`}
                  className="ps-bestseller-item"
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <div className="ps-bs-num">#{i + 1}</div>
                  <div className="ps-bs-img">
                    {p.images?.[0]
                      ? <img src={p.images[0]} alt={p.name || p.title} />
                      : <span>{(p.name || p.title)?.[0]}</span>
                    }
                  </div>
                  <div className="ps-bs-info">
                    <span className="ps-bs-name">{p.name || p.title}</span>
                    <span className="ps-bs-price">{formatPrice(p.price)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}