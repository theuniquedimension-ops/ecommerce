import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Search, LogOut } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import CartSidebar from './CartSidebar';
import logo from '../assets/logo.png';
import './Navbar.css';

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [cartOpen, setCartOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const { totalItems } = useCart();
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => { setMobileMenuOpen(false); }, [location.pathname]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
            setMobileMenuOpen(false);
        }
    };

    const NAV_LINKS = [
        { label: 'Arts', slug: 'Arts' },
        { label: 'Outfits', slug: 'Outfits' },
        { label: 'Study', slug: 'Study' },
        { label: 'Sports', slug: 'Sports' },
    ];

    return (
        <>
            <header className="navbar">
                <div className="container navbar-inner">
                    {/* Mobile Hamburger */}
                    <button
                        className="navbar-menu-btn"
                        aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X strokeWidth={1.5} /> : <Menu strokeWidth={1.5} />}
                    </button>

                    {/* Logo */}
                    <Link to="/" className="navbar-logo" aria-label="Home">
                        <img src={logo} alt="Brand Logo" height={32} />
                    </Link>

                    {/* Desktop Nav Links */}
                    <nav className="navbar-links" aria-label="Main navigation">
                        {NAV_LINKS.map(({ label, slug }) => (
                            <Link
                                key={slug}
                                to={`/products?category=${slug}`}
                                className={location.search.includes(`category=${slug}`) ? 'active' : ''}
                            >
                                {label}
                            </Link>
                        ))}
                    </nav>

                    {/* Search Box (desktop) */}
                    <form className="navbar-search" onSubmit={handleSearch}>
                        <button type="submit" className="search-icon-inside" aria-label="Search">
                            <Search size={18} strokeWidth={1.5} />
                        </button>
                        <input
                            type="search"
                            placeholder="Search products..."
                            aria-label="Search products"
                            className="search-input"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </form>

                    {/* Icons */}
                    <div className="navbar-icons">
                        {user ? (
                            <div className="user-menu-desktop">
                                <Link to="/dashboard" className="icon-btn" aria-label="Account" title="My Account">
                                    <User strokeWidth={1.5} />
                                </Link>
                                <button onClick={logout} className="icon-btn logout-btn" aria-label="Logout" title="Logout">
                                    <LogOut strokeWidth={1.5} />
                                </button>
                            </div>
                        ) : (
                            <Link to="/login" className="icon-btn" aria-label="Login" title="Login">
                                <User strokeWidth={1.5} />
                            </Link>
                        )}

                        <button className="icon-btn" aria-label="Cart" onClick={() => setCartOpen(true)}>
                            <ShoppingCart strokeWidth={1.5} />
                            {totalItems > 0 && (
                                <span className="cart-badge" aria-label={`${totalItems} items in cart`}>
                                    {totalItems > 99 ? '99+' : totalItems}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={`mobile-menu${mobileMenuOpen ? ' open' : ''}`}>
                    <form className="mobile-search" onSubmit={handleSearch}>
                        <button type="submit" className="search-icon-inside" aria-label="Search">
                            <Search size={18} strokeWidth={1.5} />
                        </button>
                        <input
                            type="search"
                            placeholder="Search products..."
                            aria-label="Search products"
                            className="search-input"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </form>

                    <nav aria-label="Mobile navigation" className="mobile-nav-links">
                        {NAV_LINKS.map(({ label, slug }) => (
                            <Link key={slug} to={`/products?category=${slug}`}>
                                {label}
                            </Link>
                        ))}
                    </nav>

                    <div className="mobile-actions">
                        {user ? (
                            <>
                                <Link to="/dashboard" className="mobile-action-link">
                                    <User size={18} strokeWidth={1.5} /> My Account
                                </Link>
                                <button onClick={logout} className="mobile-action-btn">
                                    <LogOut size={18} strokeWidth={1.5} /> Sign Out
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="mobile-action-link">
                                    <User size={18} strokeWidth={1.5} /> Sign In
                                </Link>
                                <Link to="/register" className="mobile-action-link outline">
                                    Create Account
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />
        </>
    );
}
