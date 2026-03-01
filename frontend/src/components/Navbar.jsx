import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Heart, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import CartSidebar from './CartSidebar';
import logo from '../assets/logo.png';
import cartImg from '../assets/cart.png';
import accountImg from '../assets/account.png';
import './Navbar.css';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [cartOpen, setCartOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { totalItems } = useCart();
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const lastScrollY = useRef(0);
    const [hidden, setHidden] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            const curr = window.scrollY;
            setIsScrolled(curr > 20);
            setHidden(curr > lastScrollY.current && curr > 120);
            lastScrollY.current = curr;
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => { setMenuOpen(false); }, [location.pathname]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
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
            <header className={`navbar-header ${isScrolled ? 'scrolled' : ''} ${hidden ? 'nav-hidden' : ''}`}>
                <nav className="navbar-inner container">

                    {/* Left: Search & Menu */}
                    <div className="nav-left">
                        <button className="nav-hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
                            {menuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                        <form className="nav-search-form" onSubmit={handleSearch}>
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                aria-label="Search products"
                                className="nav-search-input"
                            />
                            <button type="submit" className="nav-search-icon-btn" aria-label="Search">
                                🔍
                            </button>
                        </form>
                        <div className="nav-desktop-links">
                            {NAV_LINKS.map(({ label, slug }) => (
                                <Link
                                    key={slug}
                                    to={`/products?category=${slug}`}
                                    className={`nav-link ${location.search.includes(`category=${slug}`) ? 'active' : ''}`}
                                >
                                    {label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Center: Logo */}
                    <div className="nav-center">
                        <Link to="/" className="nav-logo-group">
                            <img src={logo} alt="The Unique Dimension" className="nav-logo-img" />
                        </Link>
                    </div>

                    {/* Right: Icons */}
                    <div className="nav-right">
                        {user ? (
                            <>
                                <Link to="/dashboard" className="nav-icon-btn" title="My Account">
                                    <img src={accountImg} alt="Account" className="nav-asset-icon" />
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="nav-icon-btn" title="My Account">
                                    <img src={accountImg} alt="Account" className="nav-asset-icon" />
                                </Link>
                            </>
                        )}
                        <button
                            className="nav-icon-btn cart-btn"
                            onClick={() => setCartOpen(true)}
                            aria-label="Open cart"
                        >
                            <img src={cartImg} alt="Cart" className="nav-asset-icon" />
                            {totalItems > 0 && (
                                <span className="cart-badge">{totalItems > 99 ? '99+' : totalItems}</span>
                            )}
                        </button>
                    </div>
                </nav>

                {/* Gold reflection line */}
                <div className="nav-gold-line" />

                {/* Mobile Menu */}
                {menuOpen && (
                    <div className="mobile-menu">
                        <form className="mobile-search" onSubmit={handleSearch}>
                            <Search size={16} />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                        </form>
                        <nav className="mobile-nav">
                            {NAV_LINKS.map(({ label, slug }) => (
                                <Link key={slug} to={`/products?category=${slug}`} className="mobile-nav-link">{label}</Link>
                            ))}
                            <div className="mobile-nav-divider" />
                            {user ? (
                                <>
                                    <Link to="/dashboard" className="mobile-nav-link">My Account</Link>
                                    <button onClick={logout} className="mobile-nav-link mobile-logout">Sign Out</button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="mobile-nav-link">Sign In</Link>
                                    <Link to="/register" className="mobile-nav-link">Create Account</Link>
                                </>
                            )}
                        </nav>
                    </div>
                )}
            </header>

            <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />
        </>
    );
}
