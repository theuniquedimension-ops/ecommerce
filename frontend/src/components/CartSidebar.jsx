import React from 'react';
import { Link } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './CartSidebar.css';

const formatPrice = (price) => `₹${Number(price).toLocaleString('en-IN')}`;

export default function CartSidebar({ open, onClose }) {
    const { items, removeItem, updateQty, subtotal, clearCart } = useCart();

    if (!open) return null;

    return (
        <>
            <div className="cart-overlay" onClick={onClose} />
            <aside className="cart-sidebar" aria-label="Shopping cart">
                {/* Header */}
                <div className="cart-header">
                    <h2>
                        <ShoppingBag size={18} style={{ display: 'inline', marginRight: 8, verticalAlign: 'middle', color: 'var(--color-gold)' }} />
                        Your Cart
                        {items.length > 0 && <span className="cart-count-badge">{items.length}</span>}
                    </h2>
                    <button className="cart-close" onClick={onClose} aria-label="Close cart">
                        <X size={18} />
                    </button>
                </div>

                {/* Items */}
                {items.length === 0 ? (
                    <div className="cart-empty">
                        <div className="cart-empty-icon">🛍️</div>
                        <h3>Your cart is empty</h3>
                        <p>Add some premium products to get started.</p>
                        <Link to="/products" onClick={onClose} className="btn btn-primary">
                            Browse Products
                        </Link>
                    </div>
                ) : (
                    <ul className="cart-items">
                        {items.map(item => (
                            <li key={item._id} className="cart-item">
                                <div className="cart-item-img">
                                    {item.image
                                        ? <img src={item.image} alt={item.name} />
                                        : <span>{item.name?.[0]}</span>
                                    }
                                </div>
                                <div className="cart-item-info">
                                    <p className="cart-item-name">{item.name}</p>
                                    <p className="cart-item-price">{formatPrice(item.price)}</p>
                                    <div className="cart-qty-row">
                                        <button className="qty-btn" onClick={() => updateQty(item._id, item.qty - 1)} disabled={item.qty <= 1}>
                                            <Minus size={11} />
                                        </button>
                                        <span className="qty-num">{item.qty}</span>
                                        <button className="qty-btn" onClick={() => updateQty(item._id, item.qty + 1)}>
                                            <Plus size={11} />
                                        </button>
                                    </div>
                                </div>
                                <button className="cart-remove-btn" onClick={() => removeItem(item._id)} aria-label="Remove">
                                    <Trash2 size={15} />
                                </button>
                            </li>
                        ))}
                    </ul>
                )}

                {/* Footer */}
                {items.length > 0 && (
                    <div className="cart-footer">
                        <div className="cart-total-row">
                            <span className="cart-total-label">SUBTOTAL</span>
                            <span className="cart-total-amount">{formatPrice(subtotal)}</span>
                        </div>
                        <Link to="/checkout" onClick={onClose} className="btn btn-primary btn-lg cart-checkout-btn">
                            Proceed to Checkout <ArrowRight size={16} />
                        </Link>
                        <button onClick={onClose} className="cart-continue-btn">← Continue Shopping</button>
                    </div>
                )}
            </aside>
        </>
    );
}
