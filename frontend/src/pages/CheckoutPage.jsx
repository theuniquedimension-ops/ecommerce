import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, ChevronRight, MapPin, Truck, CreditCard, ClipboardList, Loader2 } from 'lucide-react';
import { CardElement, useStripe, useElements, Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './CheckoutPage.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_placeholder');

const STEPS = [
    { id: 'address', label: 'Address', icon: MapPin },
    { id: 'shipping', label: 'Shipping', icon: Truck },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'review', label: 'Review', icon: ClipboardList },
];

const formatPrice = (p) => `₹${Number(p).toLocaleString('en-IN')}`;

function CheckoutForm() {
    const navigate = useNavigate();
    const stripe = useStripe();
    const elements = useElements();
    const { items, subtotal, clearCart } = useCart();
    const { user, token } = useAuth();

    const [step, setStep] = useState(0);
    const [address, setAddress] = useState({ name: '', phone: '', street: '', city: '', state: '', pincode: '' });
    const [shipping, setShipping] = useState('standard');
    const [processing, setProcessing] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(0);

    const SHIPPING_OPTIONS = [
        { id: 'standard', label: 'Standard Delivery', time: '5-7 business days', price: subtotal >= 999 ? 0 : 99 },
        { id: 'express', label: 'Express Delivery', time: '2-3 business days', price: 199 },
    ];

    const selected = SHIPPING_OPTIONS.find(s => s.id === shipping);
    const tax = Math.round(subtotal * 0.18);
    const total = subtotal + selected.price + tax - discount;

    const nextStep = () => setStep(s => Math.min(s + 1, STEPS.length - 1));
    const prevStep = () => setStep(s => Math.max(s - 1, 0));
    const handleAddressChange = e => setAddress(a => ({ ...a, [e.target.name]: e.target.value }));

    const handlePlaceOrder = async () => {
        if (!stripe || !elements) {
            toast.error('Stripe is not loaded yet. Please wait.');
            return;
        }

        setProcessing(true);
        try {
            // Create order and get PaymentIntent from backend
            const orderData = {
                items: items.map(i => ({
                    product: i._id,
                    name: i.name,
                    image: i.image,
                    price: i.price,
                    qty: i.qty,
                })),
                shippingAddress: address,
                shippingMethod: shipping,
                couponCode: couponCode || undefined,
            };

            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            const { data } = await axios.post(`${API}/api/orders`, orderData, { headers });

            if (!data.success || !data.clientSecret) {
                // If there's no client secret, perhaps it's free or misconfigured. Handle gracefully
                if (data.success && data.orderId && !data.clientSecret) {
                    clearCart();
                    toast.success('Order placed successfully (Mock/Free)');
                    navigate(`/order-confirmation/${data.orderId}`);
                    return;
                }
                toast.error(data.message || 'Failed to create order');
                setProcessing(false);
                return;
            }

            // Confirm payment with Stripe
            const cardElement = elements.getElement(CardElement);
            const { error, paymentIntent } = await stripe.confirmCardPayment(data.clientSecret, {
                payment_method: {
                    card: cardElement,
                    billing_details: { name: address.name },
                },
            });

            if (error) {
                toast.error(error.message);
                setProcessing(false);
                return;
            }

            if (paymentIntent.status === 'succeeded') {
                clearCart();
                toast.success('Payment successful!');
                navigate(`/order-confirmation/${data.orderId}`);
            }
        } catch (err) {
            console.error('Checkout error:', err);
            toast.error(err.response?.data?.message || 'Checkout failed. Please try again.');
        } finally {
            setProcessing(false);
        }
    };

    const cardStyle = {
        style: {
            base: {
                fontSize: '15px',
                fontFamily: 'Inter, sans-serif',
                color: '#1a1a2e',
                '::placeholder': { color: '#a3a3a3' },
            },
            invalid: { color: '#dc2626' },
        },
    };

    if (items.length === 0) {
        return (
            <div className="checkout-empty">
                <h2>Your cart is empty</h2>
                <p>Add some products before checkout.</p>
                <Link to="/products" className="btn btn-primary">Shop Now</Link>
            </div>
        );
    }

    return (
        <div className="checkout-page section-pad-sm">
            <div className="container">
                {/* Progress Steps */}
                <div className="checkout-steps">
                    {STEPS.map((s, i) => (
                        <React.Fragment key={s.id}>
                            <div className={`checkout-step ${i <= step ? 'active' : ''} ${i < step ? 'done' : ''}`}>
                                <div className="step-circle">
                                    {i < step ? <Check size={14} /> : <s.icon size={14} />}
                                </div>
                                <span>{s.label}</span>
                            </div>
                            {i < STEPS.length - 1 && <div className={`step-line ${i < step ? 'done' : ''}`} />}
                        </React.Fragment>
                    ))}
                </div>

                <div className="checkout-layout">
                    {/* Left: Step Content */}
                    <div className="checkout-main">
                        {step === 0 && (
                            <div className="checkout-section">
                                <h2>Delivery Address</h2>
                                <form className="address-form" onSubmit={e => { e.preventDefault(); nextStep(); }}>
                                    {[
                                        { name: 'name', label: 'Full Name', type: 'text' },
                                        { name: 'phone', label: 'Phone Number', type: 'tel' },
                                        { name: 'street', label: 'Street Address', type: 'text' },
                                        { name: 'city', label: 'City', type: 'text' },
                                        { name: 'state', label: 'State', type: 'text' },
                                        { name: 'pincode', label: 'PIN Code', type: 'text' },
                                    ].map(f => (
                                        <div key={f.name} className="form-field">
                                            <label htmlFor={f.name}>{f.label}</label>
                                            <input
                                                id={f.name} name={f.name} type={f.type}
                                                value={address[f.name]}
                                                onChange={handleAddressChange}
                                                required
                                                className="checkout-input"
                                            />
                                        </div>
                                    ))}
                                    <div className="step-actions">
                                        <button type="submit" className="btn btn-primary btn-lg">
                                            Continue to Shipping <ChevronRight size={16} />
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {step === 1 && (
                            <div className="checkout-section">
                                <h2>Shipping Method</h2>
                                <div className="shipping-options">
                                    {SHIPPING_OPTIONS.map(opt => (
                                        <label key={opt.id} className={`shipping-option ${shipping === opt.id ? 'selected' : ''}`}>
                                            <input type="radio" name="shipping" value={opt.id} checked={shipping === opt.id} onChange={e => setShipping(e.target.value)} />
                                            <div className="shipping-info">
                                                <strong>{opt.label}</strong>
                                                <span>{opt.time}</span>
                                            </div>
                                            <div className="shipping-price">{opt.price === 0 ? 'FREE' : formatPrice(opt.price)}</div>
                                        </label>
                                    ))}
                                </div>
                                <div className="step-actions">
                                    <button className="btn btn-ghost btn-lg" onClick={prevStep}>Back</button>
                                    <button className="btn btn-primary btn-lg" onClick={nextStep}>Continue to Payment <ChevronRight size={16} /></button>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="checkout-section">
                                <h2>Payment</h2>
                                <div className="payment-notice">
                                    <div className="payment-stripe-badge">🔒 Secured by Stripe</div>
                                    <p>Enter your card details below to complete payment.</p>
                                </div>
                                <div className="stripe-card-element">
                                    <CardElement options={cardStyle} />
                                </div>
                                <div className="step-actions">
                                    <button className="btn btn-ghost btn-lg" onClick={prevStep}>Back</button>
                                    <button className="btn btn-primary btn-lg" onClick={nextStep}>Review Order <ChevronRight size={16} /></button>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="checkout-section">
                                <h2>Review & Place Order</h2>
                                <div className="review-address">
                                    <h4>Delivering to:</h4>
                                    <p>{address.name}</p>
                                    <p>{address.street}, {address.city}, {address.state} – {address.pincode}</p>
                                    <p>{address.phone}</p>
                                </div>
                                <div className="step-actions">
                                    <button className="btn btn-ghost btn-lg" onClick={prevStep}>Back</button>
                                    <button
                                        className="btn btn-accent btn-lg"
                                        onClick={handlePlaceOrder}
                                        disabled={processing}
                                    >
                                        {processing ? <><Loader2 size={18} className="spin" /> Processing...</> : `Place Order — ${formatPrice(total)}`}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right: Order Summary */}
                    <div className="checkout-summary">
                        <div className="cart-summary-card">
                            <h3>Order Summary</h3>
                            <ul className="checkout-items">
                                {items.map(item => (
                                    <li key={item._id} className="checkout-item">
                                        <span className="checkout-item-name">{item.name} <span>×{item.qty}</span></span>
                                        <span>{formatPrice(item.price * item.qty)}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="summary-rows">
                                <div className="summary-row"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                                <div className="summary-row"><span>Shipping</span><span>{selected.price === 0 ? 'Free' : formatPrice(selected.price)}</span></div>
                                <div className="summary-row"><span>GST (18%)</span><span>{formatPrice(tax)}</span></div>
                                {discount > 0 && <div className="summary-row discount"><span>Discount</span><span>-{formatPrice(discount)}</span></div>}
                            </div>
                            <div className="summary-total"><span>Total</span><strong>{formatPrice(total)}</strong></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm />
        </Elements>
    );
}
