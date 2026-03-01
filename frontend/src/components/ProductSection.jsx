import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp } from 'lucide-react';
import ProductCard from './ProductCard';
import './ProductSection.css';

const formatPrice = (p) => `₹${Number(p).toLocaleString('en-IN')}`;

export default function ProductSection({ featured = [], bestSellers = [] }) {
  return (
    <section className="product-section">
      <div className="container">

        {/* Section Header */}
        <div className="ps-header">
          <h2 className="ps-title">Featured Products</h2>
          <Link to="/products" className="ps-view-all">
            View All <ArrowRight size={16} strokeWidth={1.5} />
          </Link>
        </div>

        {/* CSS Grid for Mobile-First Display */}
        <div className="product-grid">
          {featured.map(p => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>

        {/* Removed SideBar for cleaner mobile layout, could add below if needed */}
      </div>
    </section>
  );
}