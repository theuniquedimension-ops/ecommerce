import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

const formatPrice = (p) => `₹${Number(p).toLocaleString('en-IN')}`;

function StarRating({ rating }) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    return (
        <div className="pc-rating">
            {Array.from({ length: 5 }, (_, i) => (
                <Star
                    key={i}
                    size={12}
                    className={
                        i < full ? 'star-filled' :
                            (i === full && half) ? 'star-half' :
                                'star-empty'
                    }
                    fill={i < full ? '#d4af37' : (i === full && half) ? 'url(#halfGold)' : 'none'}
                    stroke={i < full ? '#d4af37' : '#555'}
                />
            ))}
            <span className="pc-rating-num">{rating.toFixed(1)}</span>
        </div>
    );
}

export default function ProductCard({ product, onBuyNow }) {
    const { addItem } = useCart();

    const handleAdd = (e) => {
        e.preventDefault();
        addItem({
            _id: product._id,
            name: product.name || product.title,
            price: product.price,
            image: product.images?.[0],
            slug: product.slug,
        });
    };

    const handleBuyNowClick = (e) => {
        e.preventDefault();
        if (onBuyNow) {
            onBuyNow(product);
        } else {
            addItem({
                _id: product._id,
                name: product.name || product.title,
                price: product.price,
                image: product.images?.[0],
                slug: product.slug,
            });
        }
    };

    const name = product.name || product.title;
    const image = product.images?.[0];
    const discount = product.compareAtPrice
        ? Math.round((1 - product.price / product.compareAtPrice) * 100)
        : null;

    return (
        <Link to={`/products/${product.slug}`} className="product-card">
            {/* Shine effect */}
            <div className="pc-shine" />

            {/* Badges */}
            <div className="pc-badges">
                {product.badge && (
                    <span className={`badge badge-${product.badge.toLowerCase()}`}>{product.badge}</span>
                )}
                {discount && <span className="badge badge-sale">-{discount}%</span>}
            </div>

            {/* Wishlist */}
            <button
                className="pc-wishlist"
                onClick={e => e.preventDefault()}
                aria-label="Add to wishlist"
            >
                <Heart size={15} />
            </button>

            {/* Image */}
            <div className="pc-image-wrap">
                {image ? (
                    <img src={image} alt={name} className="pc-image" loading="lazy" />
                ) : (
                    <div className="pc-image-placeholder">
                        <span>{name?.[0] ?? '?'}</span>
                    </div>
                )}
                <div className="pc-image-overlay" />
            </div>

            {/* Info */}
            <div className="pc-info">
                <h3 className="pc-name">{name}</h3>
                {product.rating > 0 && <StarRating rating={product.rating} />}

                <div className="pc-price-row">
                    <span className="pc-price">{formatPrice(product.price)}</span>
                    {product.compareAtPrice && (
                        <span className="pc-compare">{formatPrice(product.compareAtPrice)}</span>
                    )}
                </div>

                <button className="pc-add-btn" onClick={handleAdd}>
                    <ShoppingBag size={14} />
                    Add to Cart
                </button>
                <button className="pc-buy-btn" onClick={handleBuyNowClick}>
                    Buy Now
                </button>
            </div>
        </Link>
    );
}
