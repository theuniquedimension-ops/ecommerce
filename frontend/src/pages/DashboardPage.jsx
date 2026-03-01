import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Package, MapPin, LogOut, ChevronRight, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './DashboardPage.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const formatPrice = (p) => `₹${Number(p).toLocaleString('en-IN')}`;

export default function DashboardPage() {
    const { user, token, logout } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [profileForm, setProfileForm] = useState({ name: '', email: '' });
    const [savingProfile, setSavingProfile] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        setProfileForm({ name: user.name || '', email: user.email || '' });
    }, [user]);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!token) return;
            try {
                const { data } = await axios.get(`${API}/api/orders`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (data.success) setOrders(data.orders || []);
            } catch (err) {
                console.warn('Could not fetch orders:', err.message);
            } finally {
                setLoadingOrders(false);
            }
        };
        fetchOrders();
    }, [token]);

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setSavingProfile(true);
        try {
            await axios.put(`${API}/api/users/profile`, profileForm, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success('Profile updated');
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Failed to update profile');
        } finally {
            setSavingProfile(false);
        }
    };

    const displayUser = user || { name: 'Guest User', email: 'guest@example.com' };

    return (
        <div className="dashboard-page section-pad-sm">
            <div className="container">
                <div className="dashboard-layout">
                    {/* Sidebar */}
                    <aside className="dashboard-sidebar">
                        <div className="dashboard-user-card">
                            <div className="dashboard-avatar">{displayUser.name?.[0] || 'U'}</div>
                            <div>
                                <strong>{displayUser.name}</strong>
                                <p>{displayUser.email}</p>
                            </div>
                        </div>
                        <nav className="dashboard-nav">
                            {[
                                { icon: User, label: 'Profile', href: '#profile' },
                                { icon: Package, label: 'My Orders', href: '#orders' },
                                { icon: MapPin, label: 'Addresses', href: '#addresses' },
                            ].map(item => (
                                <a key={item.label} href={item.href} className="dashboard-nav-link">
                                    <item.icon size={16} /> {item.label}
                                </a>
                            ))}
                            <button onClick={() => { logout(); navigate('/'); }} className="dashboard-logout">
                                <LogOut size={16} /> Sign Out
                            </button>
                        </nav>
                    </aside>

                    {/* Main Content */}
                    <main className="dashboard-main">
                        {/* Profile */}
                        <section id="profile" className="dashboard-section">
                            <h2>Profile Details</h2>
                            <form className="profile-form" onSubmit={handleSaveProfile}>
                                <div className="form-row">
                                    <div className="form-field">
                                        <label>Full Name</label>
                                        <input
                                            type="text"
                                            value={profileForm.name}
                                            onChange={e => setProfileForm(f => ({ ...f, name: e.target.value }))}
                                            className="checkout-input"
                                        />
                                    </div>
                                    <div className="form-field">
                                        <label>Email</label>
                                        <input
                                            type="email"
                                            value={profileForm.email}
                                            onChange={e => setProfileForm(f => ({ ...f, email: e.target.value }))}
                                            className="checkout-input"
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary" disabled={savingProfile}>
                                    {savingProfile ? 'Saving…' : 'Save Changes'}
                                </button>
                            </form>
                        </section>

                        {/* Orders */}
                        <section id="orders" className="dashboard-section">
                            <h2>Order History</h2>
                            {loadingOrders ? (
                                <div className="no-orders">
                                    <Loader2 size={28} className="spin" />
                                    <p>Loading orders...</p>
                                </div>
                            ) : orders.length === 0 ? (
                                <div className="no-orders">
                                    <Package size={40} strokeWidth={1} />
                                    <p>No orders yet</p>
                                    <Link to="/products" className="btn btn-primary">Start Shopping</Link>
                                </div>
                            ) : (
                                <div className="orders-list">
                                    {orders.map(order => (
                                        <div key={order._id} className="order-row">
                                            <div className="order-id">
                                                <strong>{order.orderNumber || order._id.slice(-6).toUpperCase()}</strong>
                                                <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <div className="order-items-count">
                                                {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}
                                            </div>
                                            <span className={`order-status status-${(order.status || 'pending').toLowerCase()}`}>
                                                {order.status || 'Pending'}
                                            </span>
                                            <strong>{formatPrice(order.total)}</strong>
                                            <Link to={`/order-confirmation/${order._id}`} className="btn btn-ghost btn-sm">
                                                <ChevronRight size={16} />
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* Addresses */}
                        <section id="addresses" className="dashboard-section">
                            <h2>Saved Addresses</h2>
                            {user?.addresses?.length > 0 ? (
                                user.addresses.map((addr, i) => (
                                    <div key={i} className="address-card">
                                        <p><strong>{addr.name}</strong></p>
                                        <p>{addr.street}, {addr.city}, {addr.state} – {addr.pincode}</p>
                                        <p>{addr.phone}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="address-card add-address">
                                    <MapPin size={20} />
                                    <p>No saved addresses yet</p>
                                    <button className="btn btn-outline btn-sm">+ Add Address</button>
                                </div>
                            )}
                        </section>
                    </main>
                </div>
            </div>
        </div>
    );
}
