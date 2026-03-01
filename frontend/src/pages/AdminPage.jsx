import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BarChart3, Package, ShoppingCart, Users, AlertTriangle, Plus, Pencil, Trash2, TrendingUp, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './AdminPage.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const formatPrice = (p) => `₹${Number(p).toLocaleString('en-IN')}`;

export default function AdminPage() {
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);

    // Product Modal State
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [productForm, setProductForm] = useState({
        title: '', description: '', price: '', compareAtPrice: '',
        inventory: '', badge: '', categories: '', imageFile: null, imageUrl: ''
    });
    const [savingProduct, setSavingProduct] = useState(false);

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/login');
            return;
        }
        fetchData();
    }, [user]);

    const headers = { Authorization: `Bearer ${token}` };

    const fetchData = async () => {
        setLoading(true);
        try {
            const [prodRes, orderRes, userRes] = await Promise.all([
                axios.get(`${API}/api/products?limit=100`, { headers }).catch(() => ({ data: { products: [] } })),
                axios.get(`${API}/api/admin/orders`, { headers }).catch(() => ({ data: { orders: [] } })),
                axios.get(`${API}/api/admin/users`, { headers }).catch(() => ({ data: { users: [] } })),
            ]);
            const prods = prodRes.data.products || [];
            const ords = orderRes.data.orders || [];
            const users = userRes.data.users || [];

            setProducts(prods);
            setOrders(ords);
            setCustomers(users);
            setStats({
                totalSales: ords.reduce((s, o) => s + (o.total || 0), 0),
                orderCount: ords.length,
                productCount: prods.length,
                customerCount: users.length,
                lowStock: prods.filter(p => (p.inventory || 0) <= 5),
            });
        } catch (err) {
            console.error('Admin fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProduct = async (id) => {
        if (!confirm('Delete this product?')) return;
        try {
            await axios.delete(`${API}/api/products/${id}`, { headers });
            toast.success('Product deleted');
            setProducts(prev => prev.filter(p => p._id !== id));
        } catch (err) {
            toast.error('Failed to delete product');
        }
    };

    const handleOrderStatus = async (orderId, status) => {
        try {
            await axios.put(`${API}/api/admin/orders/${orderId}`, { status }, { headers });
            toast.success(`Order updated to ${status}`);
            setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status } : o));
        } catch (err) {
            toast.error('Failed to update order');
        }
    };

    const openCreateProduct = () => {
        setEditingProduct(null);
        setProductForm({ title: '', description: '', price: '', compareAtPrice: '', inventory: '', badge: '', categories: '', imageFile: null, imageUrl: '' });
        setIsProductModalOpen(true);
    };

    const openEditProduct = (p) => {
        setEditingProduct(p);
        setProductForm({
            title: p.title || p.name || '',
            description: p.description || '',
            price: p.price || '',
            compareAtPrice: p.compareAtPrice || '',
            inventory: p.inventory || '',
            badge: p.badge || '',
            categories: p.categories ? p.categories.join(', ') : '',
            imageFile: null,
            imageUrl: p.images?.[0] || ''
        });
        setIsProductModalOpen(true);
    };

    const handleSaveProduct = async (e) => {
        e.preventDefault();
        setSavingProduct(true);
        try {
            let finalImageUrl = productForm.imageUrl;

            // 1. Upload new image if file is selected
            if (productForm.imageFile) {
                const formData = new FormData();
                formData.append('image', productForm.imageFile);
                const uploadRes = await axios.post(`${API}/api/upload`, formData, {
                    headers: { ...headers, 'Content-Type': 'multipart/form-data' }
                });
                if (uploadRes.data.success) {
                    finalImageUrl = uploadRes.data.url;
                } else {
                    throw new Error('Image upload failed');
                }
            }

            // 2. Format payload
            const payload = {
                title: productForm.title,
                name: productForm.title, // backward compat
                description: productForm.description,
                price: Number(productForm.price),
                compareAtPrice: productForm.compareAtPrice ? Number(productForm.compareAtPrice) : null,
                inventory: Number(productForm.inventory) || 0,
                badge: productForm.badge || null,
                categories: productForm.categories.split(',').map(c => c.trim()).filter(Boolean),
                images: finalImageUrl ? [finalImageUrl] : []
            };

            // 3. Create or Edit via API
            if (editingProduct) {
                const { data } = await axios.put(`${API}/api/products/${editingProduct._id}`, payload, { headers });
                setProducts(prev => prev.map(p => p._id === data.product._id ? data.product : p));
                toast.success('Product updated');
            } else {
                // To allow easy creation, slug auto-generation is typically handled by backend or we can pass a dummy slug
                // Wait, Product.js model requires a `slug` field! The prompt backend `Product.create()` might fail if slug is missing!
                payload.slug = productForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                const { data } = await axios.post(`${API}/api/products`, payload, { headers });
                setProducts(prev => [data.product, ...prev]);
                toast.success('Product created');
            }
            setIsProductModalOpen(false);
        } catch (err) {
            console.error('Save product error:', err);
            toast.error(err.response?.data?.message || 'Failed to save product');
        } finally {
            setSavingProduct(false);
        }
    };

    const STAT_CARDS = [
        { label: 'Total Sales', value: formatPrice(stats.totalSales || 0), icon: TrendingUp },
        { label: 'Orders', value: String(stats.orderCount || 0), icon: ShoppingCart },
        { label: 'Products', value: String(stats.productCount || 0), icon: Package },
        { label: 'Customers', value: String(stats.customerCount || 0), icon: Users },
    ];

    return (
        <div className="admin-page">
            {/* Admin Sidebar */}
            <aside className="admin-sidebar">
                <div className="admin-brand">
                    <span>✦</span> Admin Panel
                </div>
                <nav className="admin-nav">
                    {[
                        { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
                        { id: 'products', label: 'Products', icon: Package },
                        { id: 'orders', label: 'Orders', icon: ShoppingCart },
                        { id: 'customers', label: 'Customers', icon: Users },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            className={`admin-nav-btn ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <tab.icon size={16} /> {tab.label}
                        </button>
                    ))}
                </nav>
                <Link to="/" className="admin-back-link">← Back to Store</Link>
            </aside>

            {/* Admin Main */}
            <main className="admin-main">
                {loading ? (
                    <div className="admin-section" style={{ textAlign: 'center', padding: '60px' }}>
                        <Loader2 size={32} className="spin" />
                        <p style={{ color: 'var(--text-muted)', marginTop: '16px' }}>Loading admin data...</p>
                    </div>
                ) : (
                    <>
                        {activeTab === 'dashboard' && (
                            <div className="admin-section">
                                <h1>Dashboard</h1>
                                <div className="stats-grid">
                                    {STAT_CARDS.map(stat => (
                                        <div key={stat.label} className="stat-card">
                                            <div className="stat-icon"><stat.icon size={20} /></div>
                                            <div>
                                                <strong className="stat-value">{stat.value}</strong>
                                                <p className="stat-label">{stat.label}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {stats.lowStock?.length > 0 && (
                                    <div className="low-stock-alert">
                                        <AlertTriangle size={16} />
                                        <strong>Low Stock Alert:</strong>
                                        {stats.lowStock.map(p => ` ${p.title || p.name} (${p.inventory} left)`).join(',')}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'products' && (
                            <div className="admin-section">
                                <div className="admin-section-header">
                                    <h1>Products ({products.length})</h1>
                                    <button className="btn btn-primary btn-sm" onClick={openCreateProduct}>
                                        <Plus size={14} /> Add Product
                                    </button>
                                </div>
                                <div className="admin-table-wrap">
                                    <table className="admin-table">
                                        <thead>
                                            <tr>
                                                <th>Product</th>
                                                <th>Category</th>
                                                <th>Price</th>
                                                <th>Stock</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {products.map(p => (
                                                <tr key={p._id}>
                                                    <td className="product-cell">
                                                        {p.images?.[0] && <img src={p.images[0]} alt={p.title || p.name} className="admin-product-thumb" />}
                                                        <span>{p.title || p.name}</span>
                                                    </td>
                                                    <td>{p.categories?.[0] || '—'}</td>
                                                    <td>{formatPrice(p.price)}</td>
                                                    <td>
                                                        <span className={`stock-badge ${(p.inventory || 0) <= 5 ? 'low' : 'ok'}`}>
                                                            {p.inventory ?? 'N/A'}
                                                        </span>
                                                    </td>
                                                    <td className="actions-cell">
                                                        <button className="action-btn edit" title="Edit" onClick={() => openEditProduct(p)}><Pencil size={14} /></button>
                                                        <button className="action-btn delete" title="Delete" onClick={() => handleDeleteProduct(p._id)}><Trash2 size={14} /></button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeTab === 'orders' && (
                            <div className="admin-section">
                                <div className="admin-section-header">
                                    <h1>Orders ({orders.length})</h1>
                                </div>
                                <div className="admin-table-wrap">
                                    <table className="admin-table">
                                        <thead>
                                            <tr>
                                                <th>Order ID</th>
                                                <th>Customer</th>
                                                <th>Total</th>
                                                <th>Date</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orders.map(o => (
                                                <tr key={o._id}>
                                                    <td><strong>{o._id?.slice(-6).toUpperCase()}</strong></td>
                                                    <td>{o.user?.name || o.shippingAddress?.name || '—'}</td>
                                                    <td>{formatPrice(o.total)}</td>
                                                    <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                                                    <td>
                                                        <span className={`order-status status-${(o.status || 'pending').toLowerCase()}`}>
                                                            {o.status || 'Pending'}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <select
                                                            className="status-select"
                                                            value={o.status || 'pending'}
                                                            onChange={e => handleOrderStatus(o._id, e.target.value)}
                                                        >
                                                            {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                                                                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeTab === 'customers' && (
                            <div className="admin-section">
                                <h1>Customers ({customers.length})</h1>
                                <div className="admin-table-wrap">
                                    <table className="admin-table">
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>Role</th>
                                                <th>Joined</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {customers.map(c => (
                                                <tr key={c._id}>
                                                    <td>{c.name}</td>
                                                    <td>{c.email}</td>
                                                    <td><span className={`badge ${c.role === 'admin' ? 'badge-trending' : 'badge-new'}`}>{c.role}</span></td>
                                                    <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </main>

            {/* Product Form Modal */}
            {isProductModalOpen && (
                <div className="modal-overlay" onClick={() => !savingProduct && setIsProductModalOpen(false)}>
                    <div className="modal-content admin-product-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                            <button className="close-btn" onClick={() => setIsProductModalOpen(false)} disabled={savingProduct}>&times;</button>
                        </div>
                        <form className="modal-body" onSubmit={handleSaveProduct}>
                            <div className="form-row">
                                <div className="form-field">
                                    <label>Title <span className="req">*</span></label>
                                    <input type="text" required value={productForm.title} onChange={e => setProductForm(f => ({ ...f, title: e.target.value }))} className="checkout-input" />
                                </div>
                                <div className="form-field">
                                    <label>Price (₹) <span className="req">*</span></label>
                                    <input type="number" required min="0" value={productForm.price} onChange={e => setProductForm(f => ({ ...f, price: e.target.value }))} className="checkout-input" />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-field">
                                    <label>Compare at Price (₹)</label>
                                    <input type="number" min="0" value={productForm.compareAtPrice} onChange={e => setProductForm(f => ({ ...f, compareAtPrice: e.target.value }))} className="checkout-input" />
                                </div>
                                <div className="form-field">
                                    <label>Inventory (Stock) <span className="req">*</span></label>
                                    <input type="number" required min="0" value={productForm.inventory} onChange={e => setProductForm(f => ({ ...f, inventory: e.target.value }))} className="checkout-input" />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-field">
                                    <label>Categories (comma separated)</label>
                                    <input type="text" placeholder="e.g. Arts, Decors" value={productForm.categories} onChange={e => setProductForm(f => ({ ...f, categories: e.target.value }))} className="checkout-input" />
                                </div>
                                <div className="form-field">
                                    <label>Badge</label>
                                    <select value={productForm.badge} onChange={e => setProductForm(f => ({ ...f, badge: e.target.value }))} className="checkout-input">
                                        <option value="">None</option>
                                        <option value="NEW">NEW</option>
                                        <option value="SALE">SALE</option>
                                        <option value="TRENDING">TRENDING</option>
                                        <option value="BESTSELLER">BESTSELLER</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-field">
                                <label>Description <span className="req">*</span></label>
                                <textarea required rows="3" value={productForm.description} onChange={e => setProductForm(f => ({ ...f, description: e.target.value }))} className="checkout-input"></textarea>
                            </div>

                            <div className="form-field file-field">
                                <label>Product Image</label>
                                <div className="image-upload-wrap">
                                    {productForm.imageUrl && !productForm.imageFile && (
                                        <img src={productForm.imageUrl} alt="Current" className="img-preview" />
                                    )}
                                    <input type="file" accept="image/*" onChange={e => setProductForm(f => ({ ...f, imageFile: e.target.files[0] }))} />
                                </div>
                                <p className="text-muted" style={{ fontSize: '12px', marginTop: '4px' }}>Leave empty to keep existing image</p>
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn btn-ghost" onClick={() => setIsProductModalOpen(false)} disabled={savingProduct}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={savingProduct}>
                                    {savingProduct ? <Loader2 size={16} className="spin" /> : 'Save Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
