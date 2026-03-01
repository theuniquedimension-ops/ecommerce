import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Star, Heart, ChevronLeft, ChevronRight, Minus, Plus, Check, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import MetaHelmet from '../components/MetaHelmet';
import toast from 'react-hot-toast';
import './ProductDetailPage.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const formatPrice = (p) => `₹${Number(p).toLocaleString('en-IN')}`;

export default function ProductDetailPage() {
    const { slug } = useParams();
    const { addItem } = useCart();
    const [product, setProduct] = useState(null);
    const [related, setRelated] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImg, setSelectedImg] = useState(0);
    const [qty, setQty] = useState(1);
    const [activeTab, setActiveTab] = useState('description');
    const [wishlisted, setWishlisted] = useState(false);
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            setSelectedImg(0);
            setQty(1);
            try {
                const { data } = await axios.get(`${API}/api/products/${slug}`);
                if (data.success) {
                    setProduct(data.product);
                    // Fetch related products from same category
                    if (data.product.categories?.length > 0) {
                        const relRes = await axios.get(`${API}/api/products?category=${data.product.categories[0]}&limit=3`);
                        if (relRes.data.success) {
                            setRelated(relRes.data.products.filter(p => p.slug !== slug));
                        }
                    }
                }
            } catch (err) {
                console.error('Failed to load product:', err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [slug]);

    const handleAddToCart = () => {
        if (!product) return;
        setAdding(true);
        addItem({
            _id: product._id,
            name: product.title || product.name,
            price: product.price,
            image: product.images?.[0],
            slug: product.slug,
            qty,
        });
        toast.success(`${product.title || product.name} added to cart!`);
        setTimeout(() => setAdding(false), 1200);
    };

    if (loading) {
        return (
            <div className="product-detail-page section-pad-sm">
                <div className="container" style={{ textAlign: 'center', paddingTop: '80px' }}>
                    <Loader2 size={36} className="spin" />
                    <p style={{ color: 'var(--text-muted)', marginTop: '16px' }}>Loading product...</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="product-detail-page section-pad-sm">
                <div className="container" style={{ textAlign: 'center', paddingTop: '80px' }}>
                    <h2>Product not found</h2>
                    <p style={{ color: 'var(--text-muted)', margin: '16px 0' }}>This product may have been removed or is unavailable.</p>
                    <Link to="/products" className="btn btn-primary">Browse Products</Link>
                </div>
            </div>
        );
    }

    const name = product.title || product.name || 'Product';
    const discount = product.compareAtPrice
        ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
        : null;
    const images = product.images?.length > 0 ? product.images : ['/placeholder.png'];

    return (
        <div className="product-detail-page section-pad-sm">
            <MetaHelmet
                title={`${name} — The Unique Dimension`}
                description={product.description?.slice(0, 160)}
            />

            <div className="container">
                {/* Breadcrumb */}
                <nav className="breadcrumb" aria-label="Breadcrumb">
                    <Link to="/">Home</Link><span>/</span>
                    <Link to="/products">Products</Link><span>/</span>
                    {product.categories?.[0] && (
                        <>
                            <Link to={`/products?category=${product.categories[0]}`}>{product.categories[0]}</Link>
                            <span>/</span>
                        </>
                    )}
                    <span>{name}</span>
                </nav>

                {/* Main */}
                <div className="product-detail-grid">
                    {/* Gallery */}
                    <div className="product-gallery">
                        <div className="gallery-main">
                            <img src={images[selectedImg]} alt={name} loading="lazy" />
                            {images.length > 1 && (
                                <>
                                    <button className="gallery-nav prev" onClick={() => setSelectedImg(i => Math.max(0, i - 1))} aria-label="Previous image"><ChevronLeft size={20} /></button>
                                    <button className="gallery-nav next" onClick={() => setSelectedImg(i => Math.min(images.length - 1, i + 1))} aria-label="Next image"><ChevronRight size={20} /></button>
                                </>
                            )}
                        </div>
                        <div className="gallery-thumbs">
                            {images.map((img, i) => (
                                <button key={i} className={`gallery-thumb ${selectedImg === i ? 'active' : ''}`} onClick={() => setSelectedImg(i)}>
                                    <img src={img} alt={`${name} ${i + 1}`} loading="lazy" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Info */}
                    <div className="product-info">
                        {product.badge && <span className={`badge badge-${product.badge.toLowerCase()}`}>{product.badge}</span>}
                        <h1 className="product-detail-name">{name}</h1>

                        {/* Rating */}
                        {product.rating > 0 && (
                            <div className="product-detail-rating">
                                <div className="stars">
                                    {[1, 2, 3, 4, 5].map(s => (
                                        <Star key={s} size={16} fill={s <= Math.round(product.rating) ? 'currentColor' : 'none'} />
                                    ))}
                                </div>
                                <span>{product.rating} ({product.reviewCount || 0} reviews)</span>
                            </div>
                        )}

                        {/* Price */}
                        <div className="product-detail-prices">
                            <span className="product-detail-price">{formatPrice(product.price)}</span>
                            {product.compareAtPrice && (
                                <span className="product-detail-compare">{formatPrice(product.compareAtPrice)}</span>
                            )}
                            {discount && <span className="badge badge-sale">{discount}% OFF</span>}
                        </div>

                        <p className="product-detail-desc">{product.description}</p>

                        {/* Inventory indicator */}
                        {product.inventory !== undefined && (
                            <p className={`stock-indicator ${product.inventory <= 5 ? 'low' : ''}`}>
                                {product.inventory > 0
                                    ? product.inventory <= 5 ? `Only ${product.inventory} left!` : 'In Stock'
                                    : 'Out of Stock'
                                }
                            </p>
                        )}

                        {/* Qty + Add to Cart */}
                        <div className="product-add">
                            <div className="qty-control">
                                <button onClick={() => setQty(q => Math.max(1, q - 1))} disabled={qty <= 1} aria-label="Decrease quantity"><Minus size={14} /></button>
                                <span>{qty}</span>
                                <button onClick={() => setQty(q => q + 1)} aria-label="Increase quantity"><Plus size={14} /></button>
                            </div>
                            <button
                                className={`btn btn-primary btn-lg add-to-cart-btn ${adding ? 'adding' : ''}`}
                                onClick={handleAddToCart}
                                disabled={product.inventory === 0}
                            >
                                {adding ? <><Check size={18} /> Added!</> : <><ShoppingCart size={18} /> Add to Cart</>}
                            </button>
                            <button
                                className={`wishlist-btn ${wishlisted ? 'active' : ''}`}
                                onClick={() => setWishlisted(!wishlisted)}
                                aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                            >
                                <Heart size={20} fill={wishlisted ? 'currentColor' : 'none'} />
                            </button>
                        </div>

                        {/* Meta */}
                        <div className="product-meta">
                            {product.categories?.[0] && (
                                <div className="product-meta-row">
                                    <span>Category:</span>
                                    <Link to={`/products?category=${product.categories[0]}`}>{product.categories[0]}</Link>
                                </div>
                            )}
                            {product.sku && (
                                <div className="product-meta-row"><span>SKU:</span><span>{product.sku}</span></div>
                            )}
                            {product.tags?.length > 0 && (
                                <div className="product-meta-row"><span>Tags:</span><span>{product.tags.join(', ')}</span></div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Tabs: Description + Reviews */}
                <div className="product-tabs">
                    <div className="tab-nav">
                        {['description', 'reviews'].map(tab => (
                            <button
                                key={tab}
                                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab === 'description' ? 'Description' : `Reviews (${product.reviewCount || 0})`}
                            </button>
                        ))}
                    </div>
                    <div className="tab-content">
                        {activeTab === 'description' ? (
                            <div className="tab-desc">
                                <p>{product.description}</p>
                                {product.shortDesc && <p className="text-muted">{product.shortDesc}</p>}
                            </div>
                        ) : (
                            <div className="tab-reviews">
                                <p className="text-muted">Reviews will be displayed here when connected to the reviews API.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Related Products */}
                {related.length > 0 && (
                    <div className="related-section">
                        <h2 className="section-title">You May Also Like</h2>
                        <div className="products-grid products-grid-3">
                            {related.map(p => <ProductCard key={p._id} product={p} />)}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
