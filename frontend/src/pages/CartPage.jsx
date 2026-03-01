import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './CartPage.css';

const formatPrice = (p) => `₹${Number(p).toLocaleString('en-IN')}`;

export default function CartPage() {
    const { items, removeItem, updateQty, subtotal, clearCart } = useCart();

    const shipping = subtotal > 999 ? 0 : 99;
    const tax = Math.round(subtotal * 0.18);
    const total = subtotal + shipping + tax;

    if (items.length === 0) {
        return (
            <div className="cart-page-empty section-pad">
                <div className="container">
                    <div className="cart-empty-state">
                        <ShoppingBag size={64} strokeWidth={1} />
                        <h2>Your Cart is Empty</h2>
                        <p>Looks like you haven't added anything yet. Explore our premium collection.</p>
                        <Link to="/products" className="btn btn-primary btn-lg">Start Shopping</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page section-pad-sm">
            <div className="container">
                <h1 className="cart-page-title">Shopping Cart</h1>
                <div className="cart-layout">
                    {/* Items */}
                    <div className="cart-items-col">
                        <div className="cart-items-header">
                            <span>{items.length} item{items.length > 1 ? 's' : ''}</span>
                            <button onClick={clearCart} className="clear-cart-btn">Clear Cart</button>
                        </div>
                        <ul className="cart-items-list">
                            {items.map(item => (
                                <li key={item._id} className="cart-item-row">
                                    <div className="cart-item-img">
                                        {item.images?.[0]
                                            ? <img src={item.images[0]} alt={item.name} />
                                            : <div className="cart-item-placeholder" />
                                        }
                                    </div>
                                    <div className="cart-item-details">
                                        <h3>{item.name}</h3>
                                        <p className="cart-item-category">{item.categories?.[0]}</p>
                                    </div>
                                    <div className="cart-item-qty-row">
                                        <button onClick={() => updateQty(item._id, item.qty - 1)} disabled={item.qty <= 1}><Minus size={13} /></button>
                                        <span>{item.qty}</span>
                                        <button onClick={() => updateQty(item._id, item.qty + 1)}><Plus size={13} /></button>
                                    </div>
                                    <div className="cart-item-price">{formatPrice(item.price * item.qty)}</div>
                                    <button className="cart-item-del" onClick={() => removeItem(item._id)} aria-label="Remove">
                                        <Trash2 size={16} />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Order Summary */}
                    <div className="cart-summary-col">
                        <div className="cart-summary-card">
                            <h2>Order Summary</h2>
                            <div className="summary-rows">
                                <div className="summary-row"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                                <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span></div>
                                <div className="summary-row"><span>GST (18%)</span><span>{formatPrice(tax)}</span></div>
                            </div>
                            <div className="summary-total">
                                <span>Total</span>
                                <strong>{formatPrice(total)}</strong>
                            </div>
                            {shipping > 0 && (
                                <p className="free-shipping-hint">Add {formatPrice(999 - subtotal)} more for free shipping!</p>
                            )}
                            <Link to="/checkout" className="btn btn-primary btn-lg checkout-btn">
                                Proceed to Checkout <ArrowRight size={16} />
                            </Link>
                            <Link to="/products" className="btn btn-ghost continue-btn">Continue Shopping</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
